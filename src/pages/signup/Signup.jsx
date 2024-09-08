import './signup.scss';
import {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import {Modal} from '../../components';

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  
  async function signup() {
    try {
      if (!email.trim() || !username.trim() || !password.trim()) {
        setError("Заполните все поля!");
        setErrorModal(true);
        return;
      }

      const res = await api.post('/api/users/signup', {email: email.trim(), username: username.trim(), password: password.trim()});

      console.log(res);
    } catch (e) {
      setError(e.response?.data?.message);
      setErrorModal(true);
    }
  }
  
  if (Store.auth) {
    return <Navigate to='/' />
  }
  
  return (
    <div>
      <div className="min-w-[350px] centered bg-darkgray p-[30px]">
        <p className="animate-logo font-tiny5 text-[30px] text-center mb-big">MERGER</p>
        <input type="text" className="block mx-auto mb-dft inp" onChange={e => setEmail(e.target.value)} value={email} placeholder='Введите email...' />
        <input type="text" className="block mx-auto mb-dft inp" onChange={e => setUsername(e.target.value)} value={username} placeholder='Введите имя пользователя...' maxLength='30' />
        <input type="password" className="block mx-auto mb-dft inp" onChange={e => setPassword(e.target.value)} value={password} placeholder='Введите пароль...' />
        <button className="block mx-auto mb-big btn" onClick={() => signup()}>Регистрация</button>
        <p className="text-white text-[14px] text-center">Уже есть аккаунт? <Link to="/login">Войдите</Link></p>
      </div>
      <Modal active={errorModal}>
        <div>
          <p className="modal__title">Ошибки:</p>
          <p className="modal__error">{error}</p>
          <button className="modal__btn btn" onClick={() => setErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(Signup);