import './login.scss';
import {Link, Navigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import {Modal, Loader} from '../../components';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('acstkn')) {
      setLoading(false);
      return;
    }
    
    api.get('/api/users/check')
    .then(res => {
      if (res.data.authorized) {
        console.log(res.data);
        Store.setAuth(true);
      }
    })
    .catch(e => console.log(e))
    .finally(() => setLoading(false))
  }, [])

  async function login() {
    try {
      if (!email.trim() || !password.trim()) {
        setError("Заполните все поля!");
        setErrorModal(true);
        return;
      }

      const res = await api.post('/api/users/login', {email: email.trim(), password: password.trim()});

      localStorage.setItem('acstkn', res.data.accessToken);
      Store.setAuth(true);
    } catch (e) {
      setError(e.response?.data?.message);
      setErrorModal(true);
    }
  }

  if (loading) {
    return <Loader />
  }

  if (Store.auth) {
    return <Navigate to='/' />
  }

  return (
    <div className="login-page">
      <div className="login-page__content">
        <p className="login-page__logo">MERGER</p>
        <input type="text" className="login-page__input inp" onChange={e => setEmail(e.target.value)} value={email} placeholder='Введите email...' />
        <input type="password" className="login-page__input inp" onChange={e => setPassword(e.target.value)} value={password} placeholder='Введите пароль...' />
        <button className="login-page__btn btn" onClick={() => login()}>Войти</button>
        <p className="login-page__info">Впервые в Merger? <Link to="/signup">Зарегистрируйтесь</Link></p>
      </div>
      <Modal active={errorModal}>
        <div className="login-modal">
          <p className="modal__title">Ошибки:</p>
          <p className="modal__error">{error}</p>
          <button className="modal__btn btn" onClick={() => setErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(Login);