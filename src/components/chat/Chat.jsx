import './chat.scss';
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
    <div className="chat-page page">
        <p className="page__title">Чат</p>
        <div className="chat-chat">
          <div className="chat__info">
            <p>Сейчас онлайн: {info.online}</p>
          </div>
          <div className="chat-chat__messages">
            {more &&
              <button className="chat-chat__message_btn btn" onClick={() => loadMessages()}>Загрузить еще...</button>
            }
            {messages[0] ?
              messages.map((el, index) =>
                <div className={Store.user.user_id == el.user_id ? "chat-chat__message message_owner" : "chat-chat__message"} key={index}>
                  <Link to={'/' + el.username} className="chat-chat__message_user">{el.username}</Link>
                  <p className="chat-chat__message_text">{el.msg}</p>
                </div>
            ) :
              <p className="chat-chat__message_empty">Пусто... Напишите первое сообщение!</p>
            }
          </div>
          <div className="chat-chat__items">
            <input type="text" className="chat-chat__input inp" onChange={(e) => setMessage(e.target.value)} value={message} onKeyUp={e => e.keyCode == 13 && sendMessage()} placeholder='Введите сообщение...' autoFocus maxLength="255" />
            <button className="chat-chat__btn btn" onClick={() => sendMessage()}>Отправить</button>
          </div>
        </div>
        <Modal active={errorModal}>
            <div className="chat-modal">
              <p className="modal__title">Ошибки:</p>
              <p className="modal__error">{error}</p>
              <button className="modal__btn btn" onClick={() => setErrorModal(false)}>ОК</button>
            </div>
        </Modal>
    </div>
  )
}

export default observer(Chat);