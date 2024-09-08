import {observer} from 'mobx-react-lite';
import {useState, useEffect, useRef, createRef} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';

import {Loader, Modal} from '../../components';
import {NotFound} from '../../pages';

function Chat() {
  const {chat_id} = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [more, setMore] = useState(true);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const ws = useRef();
  const chat = createRef();

  useEffect(() => {
    Promise.all([
      new Promise((resolve, reject) => {
        api.post('/api/chats/checkchat', {user_id: Store.user.user_id, chat_id})
        .then(res => {
          if (res.data.status) {
            setAuth(true);
          } else if (chat_id == Store.team.chat_id) {
            setAuth(true);
          }
        })
        .catch(e => {
          setError(e.response?.data?.message);
          setErrorModal(true);
        })
        .finally(() => resolve())
      }),
      new Promise((resolve, reject) => {
        api.post('/api/chats/messages', {chat_id, point: message.length})
        .then(res => {
          if (res.data.length < 100) {
            setMore(false);
          }
    
          setMessages(res.data);
        })
        .catch(e => {
          setError(e.response?.data?.message);
          setErrorModal(true);
        })
        .finally(() => resolve())
      })
    ])
    .then(() => setLoading(false))

    ws.current = new WebSocket("ws://localhost:5000/api/chat");

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        type: "connection",
        user_id: Store.user.user_id,
        chat_id
      }));
    }

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      setMessages(prev => [...prev, data]);
    }
  }, []);

  useEffect(() => {
    if (chat.current == null) {
      return;
    }

    if (chat.current.scrollTop == 0) {
      chat.current.scrollTo({top: chat.current.scrollHeight, behavior: "instant"});
    } else {
      chat.current.scrollTo({top: chat.current.scrollHeight, behavior: "smooth"});
    }
  }, [messages]);
  
  async function loadMessages() {
    try {
      const res = await api.post('/api/chats/messages', {chat_id, point: messages.length});

      if (res.data.length < 100) {
        setMore(false);
      }
      
      setMessages(prev => [...res.data, ...prev]);
    } catch (e) {
      setError(e.response?.data?.message);
      setErrorModal(true);
    }
  }

  function sendMessage() {
    if (message.trim().length == 0) {
      return;
    }

    const msg = { 
      type: "message",
      msg: message.trim(),
      user_id: Store.user.user_id,
      chat_id,
      time: new Date()
    }

    ws.current.send(JSON.stringify(msg));
    
    setMessage("");
  }

  function deleteChat() {
    api.post('/api/chats/deletechat', {chat_id})
    .then(() => navigate('/chats'))
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
  }

  function setBg(color) {
    localStorage.setItem("chatbg", color);
    setModal2(false);
  }

  if (loading) {
    return <Loader />
  }

  if (!auth) {
    return <NotFound />
  }

  return (
    <div className="page min-h-full">
        <div className='flex justify-between items-center mb-[30px]'>
          <p className="page__title mb-0">Чат</p>
          <div>
            <button className="btn mr-[10px]" onClick={() => setModal2(true)}>Редактировать</button>
            {Store.team.chat_id != chat_id &&
              <button className="btn-red" onClick={() => setModal(true)}>Удалить чат</button>
            }
          </div>
        </div>
        <div className="bg-black w-[85%] mx-auto">
          <div id='chat' ref={chat} className='flex flex-col relative overflow-y-auto h-[665px] p-[10px]' style={{background: localStorage.getItem("chatbg") || "black"}}>
            {more &&
              <button className="mb-dft btn" onClick={() => loadMessages()}>Загрузить еще...</button>
            }
            {messages[0] ?
              messages.map((el) =>
                <div className="w-fit p-[7px] mt-[4px] rounded-mid animate-message" style={Store.user.user_id == el.user_id ? {backgroundColor: "#026199", alignSelf: "self-end"} : {backgroundColor: "white"}} key={el.message_id}>
                  {Store.user.user_id != el.user_id &&
                    <Link to={'/' + el.username} className="text-black block font-bold text-[12px] mb-[2px] hover:text-gold">{el.username}</Link>
                  }
                  <p className='text-[14px]' style={Store.user.user_id == el.user_id ? {color: "white"} : {color: "black"}}>{el.msg}</p>
                </div>
            ) :
                <p className="text-black bg-white rounded-mid p-[7px] font-tiny5 centered">Пусто... Напишите первое сообщение!</p>
            }
          </div>
          <div>
            <input type="text" className="w-[88%] rounded-none inp" onChange={(e) => setMessage(e.target.value)} value={message} onKeyUp={e => e.keyCode == 13 && sendMessage()} placeholder='Введите сообщение...' autoFocus maxLength="1000" />
            <button className="w-[12%] rounded-none btn" onClick={() => sendMessage()}>Отправить</button>
          </div>
        </div>
        <Modal active={modal}>
            <div>
              <p className="modal__title">Вы точно хотите удалить чат?</p>
              <div className="modal-btns">
                <button className="btn" onClick={() => deleteChat()}>Да</button>
                <button className="btn-red" onClick={() => setModal(false)}>Нет</button>
              </div>
            </div>
        </Modal>
        <Modal active={modal2}>
            <div className='w-[500px]'>
              <p className="modal__title">Отредактируйте свой чат!</p>
              <div className='mb-dft'>
                <p className='text-white mb-[10px]'>Задний фон (сплошные):</p>
                <div className='flex justify-around bg-dark rounded-dft py-[10px]'>
                  <div className='w-[100px] h-[100px] rounded-big bg-black cursor-pointer duration-100 hover:scale-[1.05] active:scale-[0.95]' onClick={() => setBg("black")}></div>
                  <div className='w-[100px] h-[100px] rounded-big bg-white cursor-pointer duration-100 hover:scale-[1.05] active:scale-[0.95]' onClick={() => setBg("white")}></div>
                  <div className='w-[100px] h-[100px] rounded-big bg-[#eba715] cursor-pointer duration-100 hover:scale-[1.05] active:scale-[0.95]' onClick={() => setBg("#eba715")}></div>
                </div>
              </div>
              <div>
                <p className='text-white mb-[10px]'>Задний фон (градиентные):</p>
                <div className='flex justify-around bg-dark rounded-dft py-[10px]'>
                  <div className='w-[100px] h-[100px] rounded-big bg-gradient-to-r from-indigo-500 to-pink-500 cursor-pointer duration-100 hover:scale-[1.05] active:scale-[0.95]' onClick={() => setBg("linear-gradient(135deg, #6366f1 0%, #ec4899 100%)")}></div>
                  <div className='w-[100px] h-[100px] rounded-big bg-gradient-to-r from-[#8adb23] from-0% via-[#fbce00] via-56% to-[#e88e27] to-100% cursor-pointer duration-100 hover:scale-[1.05] active:scale-[0.95]' onClick={() => setBg("linear-gradient(135deg, #8adb23 0%, #fbce00 56%, #e88e27 100%)")}></div>
                  <div className='w-[100px] h-[100px] rounded-big bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-100% cursor-pointer duration-100 hover:scale-[1.05] active:scale-[0.95]' onClick={() => setBg("linear-gradient(135deg, #6366f1 0%, #0ea5e9 30%, #10b981 100%)")}></div>
                </div>
              </div>
              <button className="btn-red block mx-auto mt-[10px]" onClick={() => setModal2(false)}>Закрыть</button>
            </div>
        </Modal>
        <Modal active={errorModal}>
            <div>
              <p className="modal__title">Ошибки:</p>
              <p className="modal__error">{error}</p>
              <button className="modal__btn btn" onClick={() => setErrorModal(false)}>ОК</button>
            </div>
        </Modal>
    </div>
  )
}

export default observer(Chat);