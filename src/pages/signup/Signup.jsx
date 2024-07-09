import './signup.scss';
import {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import Store from '../../helpers/store';

function Signup() {
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [pass, setPass] = useState("");
  
  function signup() {
    
  }
  
  if (Store.auth) {
    return <Navigate to='/' />
  }
  
  return (
    <div className="signup-page">
      <div className="signup-page__content">
        <p className="signup-page__logo">MERGER</p>
        <input type="text" className="signup-page__input inp" onChange={e => setEmail(e.target.value)} value={email} placeholder='Введите email...' />
        <input type="text" className="signup-page__input inp" onChange={e => setNick(e.target.value)} value={nick} placeholder='Введите имя пользователя...' />
        <input type="password" className="signup-page__input inp" onChange={e => setPass(e.target.value)} value={pass} placeholder='Введите пароль...' />
        <button className="signup-page__btn btn" onClick={() => signup()}>Регистрация</button>
        <p className="signup-page__info">Уже есть аккаунт? <Link to="/login">Войдите</Link></p>
      </div>
    </div>
  )
}

export default observer(Signup);