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
    <div>
      <div className="min-w-[350px] centered bg-darkgray p-[30px]">
        <p className="animate-logo font-tiny5 text-[30px] text-center mb-big">MERGER</p>
        <input type="text" className="block mx-auto mb-dft inp" onChange={e => setEmail(e.target.value)} value={email} placeholder='Введите email...' />
        <input type="password" className="block mx-auto mb-dft inp" onChange={e => setPassword(e.target.value)} value={password} placeholder='Введите пароль...' />
        <button className="block mx-auto mb-big btn" onClick={() => login()}>Войти</button>
        <p className="text-white text-[14px] text-center">Впервые в Merger? <Link className='text-white underline hover:text-gold' to="/signup">Зарегистрируйтесь</Link></p>
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

export default observer(Login);