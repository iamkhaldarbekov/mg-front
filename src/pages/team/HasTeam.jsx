import {observer} from 'mobx-react-lite';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import {Modal, Loader} from '../../components';

function HasTeam() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
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
    .then(() => setLoading(false));
  }, []);

  async function updateTeam() {
    try {
      const res = await api.post('/api/teams/update', {name: name.trim(), description: desc.trim(), team_id: Store.team.team_id});

      Store.setTeam(res.data);
      setModal2(false);
    } catch (e) {
      setError(e.response.data.message);
      setErrorModal(true);
    }
  }

  async function leaveTeam() {
    try {
      await api.post('/api/users/leave', {user_id: Store.user.user_id});

      Store.setTeam({});
      Store.setHasTeam(false);
    } catch (e) {
      setError(e.response.data.message);
      setErrorModal(true);
    }
  }

  async function kick(user_id) {
    try {
      await api.post('/api/teams/kick', {user_id, team_id: Store.team.team_id});

      setUsers(users.filter(obj => obj.user_id != user_id));
    } catch (e) {
      setError(e.response.data.message);
      setErrorModal(true);
    }
  }

  async function acceptRequest(request_id, user_id) {
    try {
      const res = await api.post('/api/teams/acceptreq', {request_id, user_id, team_id: Store.team.team_id});

      setUsers(prev => [...prev, res.data]);
      setRequests(requests.filter(el => el.request_id != request_id));
    } catch (e) {
      setError(e.response.data.message);
      setErrorModal(true);
    }
  }

  async function declineRequest(request_id) {
    try {
      await api.post('/api/teams/declinereq', {request_id});

      setRequests(requests.filter(el => el.request_id != request_id));
    } catch (e) {
      setError(e.response.data.message);
      setErrorModal(true);
    }
  }
  
  if (loading) {
    return <Loader />
  }

  return (
    <div className="page">
      <h3 className="page__title">Команда</h3>
      <div>
        <p className="text-white mt-[10px] text-[20px] hyphens-auto">Название: {Store.team.name}</p>
        <p className="text-white mt-[10px] text-[20px] hyphens-auto">Описание: {Store.team.description}</p>
        <p className="text-white mt-[10px] text-[20px] hyphens-auto">Создан: {new Date(Store.team.created_tmp).getDate()}/{new Date(Store.team.created_tmp).getMonth() + 1}/{new Date(Store.team.created_tmp).getFullYear()}</p>
        <p className="text-white mt-[10px] text-[20px] hyphens-auto">Участники: {users.length}</p>
        <p></p>
      </div>
      <div>
        <Link className="m-btn link" to={'/chats/' + Store.team.chat_id}>Чат</Link>
        {Store.team.role == "creator" &&
          <button className="m-btn btn" style={requests[0] && {color: "red"}} onClick={() => setModal3(true)}>Заявки</button>
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
            {Store.team.role == "creator" &&
              <th className="text-white font-tiny5 font-normal p-[15px]">Действия</th>
            }
          </tr>
        </thead>
        <tbody>
          {users.map(el => 
            <tr className={Store.user.user_id == el.user_id ? 'bg-darkgold' : 'bg-black'} key={el.user_id}>
              <td className='text-white text-center p-[15px]'><Link className='text-white hover:text-gold' to={'/' + el.username}>{el.username}</Link></td>
              <td className='text-white text-center p-[15px]'>{el.role == "creator" ? "Создатель" : "Участник"}</td>
              <td className='text-white text-center p-[15px]'>{new Date(el.entered_tmp).getDate()}/{new Date(el.entered_tmp).getMonth() + 1}/{new Date(el.entered_tmp).getFullYear()}</td>
              <td className='text-white text-center p-[15px]' style={Store.team.role == "creator" ? {display: "table-cell"} : {display: "none"}}>
              {Store.team.role == "creator" && el.user_id != Store.user.user_id &&
                <button className="btn-red" onClick={() => kick(el.user_id)}>Изгнать</button>
              }
              </td>
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
              <input type="text" className="block mb-dft inp" placeholder="Название..." maxLength="30" onChange={e => setName(e.target.value)} value={name} />
              <textarea className="w-[100%] text" placeholder="Описание..." maxLength="255" onChange={e => setDesc(e.target.value)} value={desc} />
            </div>
            <div className="modal-btns">
              <button className="btn" onClick={() => updateTeam()}>Сохранить</button>
              <button className="btn-red" onClick={() => setModal2(false)}>Отменить</button>
            </div>
          </div>
      </Modal>
      <Modal active={modal3}>
          <div>
            <p className="modal__title">Заявки:</p>
            <div className="mb-dft">
              <div>
                {requests[0] ?
                  requests.map(el =>
                    <div className="bg-black flex justify-between p-[10px]" key={el.request_id}>
                      <div>
                        <Link className="text-white text-[20px] hover:text-gold" to={'/' + el.username}>{el.username}</Link>
                        <p className="mt-[10px] hyphens-auto text-white">{el.letter}</p>
                      </div>
                      <div className="ml-[120px] items-center modal-btns">
                        <button className="ml-[5px] btn" onClick={() => acceptRequest(el.request_id, el.user_id)}>Принять</button>
                        <button className="ml-[5px] btn-red" onClick={() => declineRequest(el.request_id)}>Отклонить</button>
                      </div>
                    </div>
                  ) :
                  <p className="text-white text-[18px] font-tiny5 text-center">Пусто... Заявок в вашу команду пока нет!</p>
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