import {observer} from 'mobx-react-lite';
import {useState, useEffect} from 'react';
import {Link, Navigate} from 'react-router-dom';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import {dateParser} from '../../helpers/dateParser';
import {Modal, Loader} from '../../components';

function HasTeam() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [modal4, setModal4] = useState(false);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [name, setName] = useState(Store.team.name);
  const [desc, setDesc] = useState(Store.team.description);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      new Promise((resolve, reject) => {
        api.post('/api/teams/teammates', {team_id: Store.team.team_id})
        .then(res => setUsers(res.data))
        .catch(e => {
          setError(e.response.data.message);
          setErrorModal(true);
        })
        .finally(() => resolve());
      }),
      new Promise((resolve, reject) => {
        api.post('/api/teams/requests', {team_id: Store.team.team_id})
        .then(res => setRequests(res.data))
        .catch(e => console.log(e))
        .finally(() => resolve())
      })
    ])
    .then(() => setTimeout(() => setLoading(false), 200))
  }, []);

  function updateTeam() {
    api.post('/api/teams/update', {name: name.trim(), description: desc.trim(), team_id: Store.team.team_id})
    .then(res => {
      Store.setTeam(res.data);
      setModal2(false);
    })
    .catch(e => {
      setError(e.response.data.message);
      setErrorModal(true);
    })
  }

  function leaveTeam() {
    api.post('/api/users/leave', {user_id: Store.user.user_id})
    .then(() => {
      Store.setTeam({});
      Store.setHasTeam(false);
    })
    .catch(e => {
      setError(e.response.data.message);
      setErrorModal(true);
    })
  }

  function kick(user_id) {
    api.post('/api/teams/kick', {user_id, team_id: Store.team.team_id})
    .then(() => setUsers(users.filter(obj => obj.user_id != user_id)))
    .catch(e => {
      setError(e.response.data.message);
      setErrorModal(true);
    })
  }

  function acceptRequest(request_id, user_id) {
    api.post('/api/teams/acceptreq', {user_id, team_id: Store.team.team_id})
    .then(res => {
      setUsers(prev => [...prev, res.data]);
      setRequests(requests.filter(el => el.request_id != request_id));
    })
    .catch(e => {
      setError(e.response.data.message);
      setErrorModal(true);
    })
  }

  function declineRequest(request_id) {
    api.post('/api/teams/declinereq', {request_id})
    .then(() => setRequests(requests.filter(el => el.request_id != request_id)))
    .catch(e => {
      setError(e.response.data.message);
      setErrorModal(true);
    })
  }

  if (!Store.hasTeam) {
    return <Navigate to='/team' />
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="page">
      <h3 className="page__title">Команда</h3>
      <div>
        <div className='flex'>
          <div>
            <p className="text-gold text-[18px] italic font-bold">Название:</p>
            <p className='text-white mt-[10px] text-[16px]'>{Store.team.name}</p>
          </div>
          {Store.team.description &&
            <div className='ml-[50px]'>
              <p className="text-gold text-[18px] italic font-bold">Описание:</p>
              <p className='whitespace-pre-line text-white mt-[10px] text-[16px] hyphens-auto'>{Store.team.description}</p>
            </div>
          }
        </div>
        <div className='flex mt-[30px]'>
          <div>
            <p className="text-gold text-[18px] italic font-bold">Создан:</p>
            <p className='text-white mt-[10px] text-[16px]'>{dateParser(Store.team.created_tmp)}</p>
          </div>
          <div className='ml-[50px]'>
            <p className="text-gold text-[18px] italic font-bold">Участники:</p>
            <p className='text-white mt-[10px] text-[16px]'>{users.length}</p>
          </div>
        </div>
      </div>
      <div>
        <Link className="m-btn link" to={'/chats/' + Store.team.chat_id}>Чат</Link>
        {Store.team.role == "creator" &&
          <button className="m-btn btn" style={requests[0] && {border: "1px solid rgba(255, 0, 0, 0.8)"}} onClick={() => setModal3(true)}>Заявки</button>
        }
        {Store.team.role == "creator" &&
          <button className="m-btn btn" onClick={() => setModal4(true)}>Действия</button>
        }
        {Store.team.role == "creator" &&
          <button className="m-btn btn" onClick={() => setModal2(true)}>Редактировать</button>
        }
        <button className="m-btn btn-red" onClick={() => setModal(true)}>Покинуть</button>
      </div>
      <p className="page__section">Участники:</p>
      <table className="w-[100%] table-fixed border-collapse">
        <thead>
          <tr>
            <th className="text-white font-tiny5 font-normal p-[15px]">Имя</th>
            <th className="text-white font-tiny5 font-normal p-[15px]">Роль</th>
            <th className="text-white font-tiny5 font-normal p-[15px]">Вступил</th>
          </tr>
        </thead>
        <tbody>
          {users.map(el => 
            <tr className={Store.user.user_id == el.user_id ? 'bg-darkgold' : 'bg-black'} key={el.user_id}>
              <td className='text-white text-center p-[15px]'><Link className='text-white hover:text-gold' to={'/' + el.username}>{el.username}</Link></td>
              <td className='text-white text-center p-[15px]'>{el.role == "creator" ? "Создатель" : "Участник"}</td>
              <td className='text-white text-center p-[15px]'>{dateParser(el.entered_tmp)}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal active={modal}>
          <div>
            <p className="modal__title">Вы точно хотите покинуть команду?</p>
            <div className="modal-btns">
              <button className="btn" onClick={() => leaveTeam()}>Да</button>
              <button className="btn-red" onClick={() => setModal(false)}>Нет</button>
            </div>
          </div>
      </Modal>
      <Modal active={modal2}>
          <div>
            <p className="modal__title">Введите новые данные команды:</p>
            <div className="mb-dft">
              <div>
                <p className='text-white mb-[5px]'>Название:</p>
                <input type="text" className="block mb-dft w-[100%] inp" placeholder="До 30 символов..." maxLength="30" onChange={e => setName(e.target.value)} value={name} />
              </div>
              <div>
                <p className='text-white mb-[5px]'>Описание:</p>
                <textarea className="w-[100%] h-[100px] text" placeholder="До 255 символов..." maxLength="255" onChange={e => setDesc(e.target.value)} value={desc} />
              </div>
            </div>
            <div className="modal-btns">
              <button className="btn" onClick={() => updateTeam()}>Сохранить</button>
              <button className="btn-red" onClick={() => setModal2(false)}>Отменить</button>
            </div>
          </div>
      </Modal>
      <Modal active={modal4}>
          <div>
            <p className="modal__title">Действия:</p>
            <div className="mb-dft">
              {users.length != 1 ?
                users.filter(item => item.user_id != Store.user.user_id).map(el =>
                  <div className="flex justify-between p-[10px] w-[400px] items-center">
                    <div>
                      <p className='text-white/[0.5] text-[17px] italic'>Имя:</p>
                      <Link className="text-white text-[17px] hover:text-gold" to={'/' + el.username}>{el.username}</Link>
                    </div>
                    <div className="my-auto">
                      <button className="btn-red" onClick={() => kick(el.user_id)}>Изгнать</button>
                    </div>
                  </div>
                )
                :
                <p className='text-white text-[17px] font-tiny5 text-center'>Пусто... Кроме вас никого нет!</p>
              }
            </div>
            <button className="btn-red modal__btn" onClick={() => setModal4(false)}>Закрыть</button>
          </div>
      </Modal>
      <Modal active={modal3}>
          <div>
            <p className="modal__title">Заявки:</p>
            <div className="mb-dft">
              <div>
                {requests[0] ?
                  requests.map(el =>
                    <div className="flex justify-between p-[10px]" key={el.request_id}>
                      <div className='mr-[20px]'>
                        <div>
                          <p className='text-white/[0.5] text-[15px] italic'>Имя:</p>
                          <Link className="text-white text-[15px] hover:text-gold" to={'/' + el.username}>{el.username}</Link>
                        </div>
                        {el.specialization &&
                          <div className='mt-[10px]'>
                            <p className='text-white/[0.5] text-[15px] italic'>Специализация:</p>
                            <p className="text-white text-[15px]">{el.specialization}</p>
                          </div>
                        }
                        <div className='mt-[10px]'>
                          <p className='text-white/[0.5] text-[15px] italic'>Письмо:</p>
                          <p className="hyphens-auto text-white text-[15px] whitespace-pre-line">{el.letter}</p>
                        </div>
                      </div>
                      <div className="my-auto">
                        <button className="ml-[5px] btn" onClick={() => acceptRequest(el.request_id, el.user_id)}>Принять</button>
                        <button className="ml-[5px] btn-red" onClick={() => declineRequest(el.request_id)}>Отклонить</button>
                      </div>
                    </div>
                  ) :
                  <p className="text-white text-[17px] font-tiny5 text-center">Пусто... Заявок в вашу команду пока нет!</p>
                }
              </div>
            </div>
            <button className="modal__btn btn-red" onClick={() => setModal3(false)}>Закрыть</button>
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

export default observer(HasTeam);