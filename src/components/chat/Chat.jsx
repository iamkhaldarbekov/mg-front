import {observer} from 'mobx-react-lite';
import {useState, useEffect, useRef} from 'react';
import {Link, useParams} from 'react-router-dom';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import NoChat from './NoChat';
import {Loader, Modal} from '../../components';

function Chat() {
  const {chat_id} = useParams();

  const [info, setInfo] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const ws = useRef();

  useEffect(() => {
    api.post('/api/teams/messages', {chat_id, point: message.length})
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
    .finally(() => setLoading(false))

    ws.current = new WebSocket("ws://localhost:5000/api/teams/chat");

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        type: "connection",
        user_id: Store.user.user_id,
        chat_id
      }));
    }

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type == "info") {
        setInfo(data);
        return;
      }
      
      setMessages(prev => [...prev, data]);
    }
  }, []);

  useEffect(() => {
    const el = document.querySelector(".chat-chat__messages");

    if (el == null) {
      return;
    }

    if (el.scrollTop == 0) {
      el.scrollTo({top: el.scrollHeight, behavior: "instant"});
    } else {
      el.scrollTo({top: el.scrollHeight, behavior: "smooth"});
    }
  }, [messages]);
  
  function loadMessages() {
    api.post('/api/teams/messages', {chat_id, point: messages.length})
    .then(res => {
      if (res.data.length < 100) {
        setMore(false);
      }
      
      setMessages(prev => [...res.data, ...prev]);
    })
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    });
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

  if (loading) {
    return <Loader />
  }

  if (!Store.hasTeam) {
    return <NoChat />
  }

  return (
    <div className="page min-h-full">
        <p className="page__title">Чат</p>
        <div className="bg-black relative w-[85%] my-0 mx-auto">
          <div className="border-b-[1px] border-gray p-[5px]">
            <p className="text-white font-tiny5">Сейчас онлайн: {info.online}</p>
          </div>
          <div className="flex flex-col overflow-y-auto h-[650px] p-[15px]">
            {more &&
              <button className="mb-dft btn" onClick={() => loadMessages()}>Загрузить еще...</button>
            }
            {messages[0] ?
              messages.map((el, index) =>
                <div className={Store.user.user_id == el.user_id ? "bg-[#026199] w-fit p-[7px] mt-[5px] rounded-mid self-end" : "bg-white w-fit p-[7px] mt-[5px] rounded-mid"} key={index}>
                  <Link to={'/' + el.username} className="text-black block font-bold text-[12px] mb-[2px] hover:text-gold">{el.username}</Link>
                  <p className="text-white">{el.msg}</p>
                </div>
            ) :
                <p className="absolute text-black bg-white rounded-mid p-[7px] font-tiny5 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">Пусто... Напишите первое сообщение!</p>
            }
          </div>
          <div>
            <input type="text" className="w-[88%] inp" onChange={(e) => setMessage(e.target.value)} value={message} onKeyUp={e => e.keyCode == 13 && sendMessage()} placeholder='Введите сообщение...' autoFocus maxLength="255" />
            <button className="w-[12%] rounded-none btn" onClick={() => sendMessage()}>Отправить</button>
          </div>
        </div>
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