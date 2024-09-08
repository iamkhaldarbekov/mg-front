import {observer} from 'mobx-react-lite';
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import {Modal, Loader} from '../../components';

function Profile() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [invites, setInvites] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(Store.user.username);
  const [bio, setBio] = useState(Store.user.bio);
  const [spec, setSpec] = useState(Store.user.specialization);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users/invites')
    .then(res => setInvites(res.data))
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
    .finally(() => setTimeout(() => setLoading(false), 200))
  }, [])

  function update() {
    if (!username.trim()) {
      setError("Имя не может быть пустым!");
      setErrorModal(true);
      return;
    }

    api.post('/api/users/update', {user_id: Store.user.user_id, username: username.trim(), bio: bio.trim(), specialization: spec})
    .then(res => {
      Store.setUser(res.data);
      setModal(false);
    })
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
  }

  function logout() {
    localStorage.removeItem('acstkn');
    Store.setAuth(false);
  }

  function acceptInvite(team_id) {
    api.post('/api/users/acceptinv', {user_id: Store.user.user_id, team_id})
    .then(res => {
      Store.setTeam(res.data);
      Store.setHasTeam(true);
      navigate('/team');
    })
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
  }

  function declineInvite(invite_id) {
    api.post('/api/users/declineinv', {invite_id})
    .then(() => setInvites(invites.filter(el => el.invite_id != invite_id)))
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="page">
      <h3 className="page__title">Профиль</h3>
      <div>
        <div>
          <p className="text-gold italic text-[18px] font-bold">Имя:</p>
          <p className='text-white mt-[5px]'>{Store.user.username}</p>
        </div>
        <div className='mt-[15px]'>
          <p className="text-gold italic text-[18px] font-bold">Почта:</p>
          <p className='text-white mt-[5px]'>{Store.user.email}</p>
        </div>
        {Store.user.bio &&
          <div className='mt-[15px]'>
            <p className="text-gold italic text-[18px] font-bold">О себе:</p>
            <p className='text-white mt-[5px] whitespace-pre-line hyphens-auto'>{Store.user.bio}</p>
          </div>
        }
        {Store.user.specialization &&
          <div className='mt-[15px]'>
            <p className="text-gold italic text-[18px] font-bold">Специализация:</p>
            <p className='text-white mt-[5px] whitespace-pre-line hyphens-auto'>{Store.user.specialization}</p>
          </div>
        }
      </div>
      <div>
        {!Store.hasTeam &&
          <button className="btn m-btn" style={invites[0] && {border: "1px solid rgba(255, 0, 0, 0.8)"}} onClick={() => setModal3(true)}>Приглашения</button>
        }
        <button className="btn m-btn" onClick={() => setModal(true)}>Редактировать</button>
        <button className="btn-red m-btn" onClick={() => setModal2(true)}>Выйти</button>
      </div>
      <Modal active={modal3}>
          <div>
            <p className="modal__title">Приглашения:</p>
            <div className="mb-dft">
              <div>
                {invites[0] ?
                  invites.map(el =>
                    <div className="flex justify-between p-[10px]" key={el.invite_id}>
                      <div className='mr-[20px]'>
                        <div>
                          <p className='text-white/[0.5] text-[15px] italic'>Название команды:</p>
                          <Link className="text-white text-[15px] hover:text-gold" to={'/team/' + el.name}>{el.name}</Link>
                        </div>
                        <div className='mt-[10px]'>
                          <p className='text-white/[0.5] text-[15px] italic'>Письмо:</p>
                          <p className="hyphens-auto text-white text-[15px] whitespace-pre-line">{el.letter}</p>
                        </div>
                      </div>
                      <div className="my-auto">
                        <button className="ml-[5px] btn" onClick={() => acceptInvite(el.team_id)}>Принять</button>
                        <button className="ml-[5px] btn-red" onClick={() => declineInvite(el.invite_id)}>Отклонить</button>
                      </div>
                    </div>
                  ) :
                  <p className="text-white text-[17px] font-tiny5 text-center">Пусто... Приглашений для вас пока нет!</p>
                }
              </div>
            </div>
            <button className="btn-red modal__btn" onClick={() => setModal3(false)}>Закрыть</button>
          </div>
      </Modal>
      <Modal active={modal}>
        <div>
          <p className="modal__title">Введите ваши новые данные:</p>
          <div>
            <div>
              <p className='text-white mb-[5px]'>Имя:</p>
              <input type="text" className="inp block mx-auto w-[100%]" placeholder='До 30 символов...' onChange={e => setUsername(e.target.value)} value={username} maxLength="30" />
            </div>
            <div className='mt-dft'>
              <p className='text-white mb-[5px]'>О себе:</p>
              <textarea type="text" className="text block mx-auto w-[100%] h-[100px]" placeholder='До 255 символов...' onChange={e => setBio(e.target.value)} value={bio} maxLength="255" />
            </div>
            <div className='mt-dft'>
              <p className='text-white mb-[5px]'>Специализация:</p>
              <select className='bg-dark text-white p-[5px]' name="spec" id="spec" onChange={e => setSpec(e.target.value)}>
                <option value="Front-End Разработчик" disabled selected>Выберите специализацию:</option>
                <option value="Front-End Разработчик">Front-End Разработчик</option>
                <option value="Back-End Разработчик">Back-End Разработчик</option>
                <option value="Full-Stack Разработчик">Full-Stack Разработчик</option>
                <option value="Project Manager">Project Manager</option>
              </select>
            </div>
          </div>
          <div className="modal-btns">
            <button className="btn" onClick={() => update()}>Сохранить</button>
            <button className="btn-red" onClick={() => setModal(false)}>Отменить</button>
          </div>
        </div>
      </Modal>
      <Modal active={modal2}>
        <div>
          <p className="modal__title">Вы точно хотите выйти?</p>
          <div className="modal-btns">
            <button className="btn" onClick={() => logout()}>Да</button>
            <button className="btn-red" onClick={() => setModal2(false)}>Нет</button>
          </div>
        </div>
      </Modal>
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

export default observer(Profile);