import './profile.scss';
import {observer} from 'mobx-react-lite';
import {useState} from 'react';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import {Modal} from '../../components';

function Profile() {
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(Store.user.username);
  const [bio, setBio] = useState(Store.user.bio);

  async function update() {
    try {
      if (!username.trim() || !bio.trim()) {
        setError("Поле не может быть пустым!");
        setErrorModal(true);
        return;
      }

      const res = await api.post('/api/users/update', {user_id: Store.user.user_id, username: username.trim(), bio: bio.trim()});

      Store.setUser(res.data);
      setModal(false);
    } catch (e) {
      setError(e.response?.data?.message);
      setErrorModal(true);
    }
  }

  async function logout() {
    try {
      localStorage.removeItem('acstkn');
      Store.setAuth(false);
    } catch (e) {
      setError(e.response?.data?.message);
      setErrorModal(true);
    }
  }

  return (
    <div className="profile-page page">
      <h3 className="page__title">Профиль</h3>
      <ul className="profile-info">
        <img src={Store.user.img} alt="user" className="profile-info__img" />
        <div>
          <li className="profile-info__item">Имя: {Store.user.username}</li>
          <li className="profile-info__item">Почта: {Store.user.email}</li>
          <li className="profile-info__item">О себе: {Store.user.bio}</li>
        </div>
      </ul>
      <div className="profile-btns">
        <button className="btn" onClick={() => setModal(true)}>Редактировать</button>
        <button className="btn-red" onClick={() => setModal2(true)}>Выйти</button>
      </div>
      <Modal active={modal}>
        <div className="profile-modal">
          <p className="modal__title">Введите ваши новые данные:</p>
          <div className="profile-modal__info">
            <input type="text" className="inp" placeholder='Имя...' onChange={e => setUsername(e.target.value)} value={username} maxLength="30" />
            <input type="text" className="inp" placeholder='О себе...' onChange={e => setBio(e.target.value)} value={bio} maxLength="255" />
          </div>
          <div className="modal-btns">
            <button className="btn" onClick={() => update()}>Сохранить</button>
            <button className="btn-red" onClick={() => setModal(false)}>Отменить</button>
          </div>
        </div>
      </Modal>
      <Modal active={modal2}>
        <div className="profile-modal">
          <p className="modal__title">Вы точно хотите выйти?</p>
          <div className="modal-btns">
            <button className="btn" onClick={() => logout()}>Да</button>
            <button className="btn-red" onClick={() => setModal2(false)}>Нет</button>
          </div>
        </div>
      </Modal>
      <Modal active={errorModal}>
        <div className="profile-modal">
          <p className="modal__title">Ошибки:</p>
          <p className="modal__error">{error}</p>
          <button className="modal__btn btn" onClick={() => setErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(Profile);