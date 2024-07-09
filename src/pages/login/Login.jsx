import './login.scss';
import {Link, Navigate} from 'react-router-dom';
import {useState} from 'react';
import {observer} from 'mobx-react-lite';

import Store from '../../helpers/store';

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function login() {
    
  }

  if (Store.auth) {
    return <Navigate to='/' />
  }

  return (
    <div className="login-page">
      <div className="login-page__content">
        <p className="login-page__logo">MERGER</p>
        <input type="text" className="login-page__input inp" onChange={e => setEmail(e.target.value)} value={email} placeholder='Введите email...' />
        <input type="password" className="login-page__input inp" onChange={e => setPass(e.target.value)} value={pass} placeholder='Введите пароль...' />
        <button className="login-page__btn btn" onClick={() => login()}>Войти</button>
        <p className="login-page__info">Впервые в Merger? <Link to="/signup">Зарегистрируйтесь</Link></p>
      </div>
    </div>
  )
}

export default observer(Login);