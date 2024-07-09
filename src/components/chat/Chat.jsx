import './chat.scss';
import {observer} from 'mobx-react-lite';
import {useState, useEffect, useRef} from 'react';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import NoChat from './NoChat';

function Chat() {
  const [info, setInfo] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const ws = useRef();

  useEffect(() => {
    api.post('/api/teams/messages', {team_id: Store.team.team_id})
    .then(res => setMessages(res.data));

    ws.current = new WebSocket("ws://localhost:5000/api/teams/chat");

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({
        type: "connection",
        user_id: Store.user.user_id,
        team_id: Store.team.team_id
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
    
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  function sendMessage() {
    if (message.trim().length == 0) {
      return;
    }

    const msg = { 
      type: "message",
      msg: message.trim(),
      user_id: Store.user.user_id,
      team_id: Store.team.team_id,
      time: new Date()
    }

    ws.current.send(JSON.stringify(msg));
    
    setMessage("");
  }

  if (!Store.hasTeam) {
    return <NoChat />
  }

  return (
    <div className="chat-page page">
        <p className="page__title">Чат: {Store.team.name}</p>
        <div className="chat-chat">
          <div className="chat__info">
            <p>Сейчас онлайн: {info.online}</p>
          </div>
          <div className="chat-chat__messages">
            {messages[0] ?
              messages.map((el, index) =>
                <div className={Store.user.user_id == el.user_id ? "chat-chat__message message_owner" : "chat-chat__message"} key={index}>
                  <p className="chat-chat__message_user">{el.username}</p>
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
    </div>
  )
}

export default observer(Chat);