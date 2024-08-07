import './hasTeam.scss';
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
    <div className="hasteam-page page">
      <h3 className="page__title">Команда</h3>
      <div className="hasteam-info">
        <p className="hasteam-info__item">Название: {Store.team.name}</p>
        <p className="hasteam-info__item">Описание: {Store.team.description}</p>
        <p className="hasteam-info__item">Создан: {new Date(Store.team.created_tmp).getDate()}/{new Date(Store.team.created_tmp).getMonth() + 1}/{new Date(Store.team.created_tmp).getFullYear()}</p>
        <p className="hasteam-info__item">Участники: {users.length}</p>
        <p></p>
      </div>
      <div className="hasteam-btns">
        <Link className="link" to={'/chats/' + Store.team.chat_id}>Чат</Link>
        {Store.team.role == "creator" &&
          <button className="btn" style={requests[0] && {color: "red"}} onClick={() => setModal3(true)}>Заявки</button>
        }
        {Store.team.role == "creator" && 
          <button className="btn" onClick={() => setModal2(true)}>Редактировать</button>
        }
        <button className="btn-red" onClick={() => setModal(true)}>Покинуть</button>
      </div>
      <p className="page__section">Участники:</p>
      <table className="hasteam-list">
        <thead>
          <tr>
            <th className="hasteam-list__title">Имя</th>
            <th className="hasteam-list__title">Роль</th>
            <th className="hasteam-list__title">Вступил</th>
            {Store.team.role == "creator" &&
              <th className="hasteam-list__title">Действия</th>
            }
          </tr>
        </thead>
        <tbody>
          {users.map(el => 
            <tr className="hasteam-list__item" style={el.user_id == Store.user.user_id ? {backgroundColor: "var(--darkgold-color)"} : {backgroundColor: "#000"}} key={el.user_id}>
              <td><Link to={'/' + el.username}>{el.username}</Link></td>
              <td>{el.role == "creator" ? "Создатель" : "Участник"}</td>
              <td>{new Date(el.entered_tmp).getDate()}/{new Date(el.entered_tmp).getMonth() + 1}/{new Date(el.entered_tmp).getFullYear()}</td>
              <td style={Store.team.role == "creator" ? {display: "table-cell"} : {display: "none"}}>
              {Store.team.role == "creator" && el.user_id != Store.user.user_id &&
                <button className="btn-red" onClick={() => kick(el.user_id)}>Изгнать</button>
              }
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal active={modal}>
          <div className="hasteam-modal">
            <p className="modal__title">Вы точно хотите покинуть команду?</p>
            <div className="modal-btns">
              <button className="btn" onClick={() => leaveTeam()}>Да</button>
              <button className="btn-red" onClick={() => setModal(false)}>Нет</button>
            </div>
          </div>
      </Modal>
      <Modal active={modal2}>
          <div className="hasteam-modal">
            <p className="modal__title">Введите новые данные команды:</p>
            <div className="hasteam-modal__info">
              <input type="text" className="inp" placeholder="Название..." maxLength="30" onChange={e => setName(e.target.value)} value={name} />
              <textarea className="text" placeholder="Описание..." maxLength="255" onChange={e => setDesc(e.target.value)} value={desc} />
            </div>
            <div className="modal-btns">
              <button className="btn" onClick={() => updateTeam()}>Сохранить</button>
              <button className="btn-red" onClick={() => setModal2(false)}>Отменить</button>
            </div>
          </div>
      </Modal>
      <Modal active={modal3}>
          <div className="hasteam-modal">
            <p className="modal__title">Заявки:</p>
            <div className="hasteam-modal__info">
              <div className="requests-list">
                {requests[0] ?
                  requests.map(el =>
                    <div className="requests-list__item" key={el.request_id}>
                      <div>
                        <Link className="requests-list__name" to={'/' + el.username}>{el.username}</Link>
                        <p className="requests-list__letter">{el.letter}</p>
                      </div>
                      <div className="modal-btns">
                        <button className="btn" onClick={() => acceptRequest(el.request_id, el.user_id)}>Принять</button>
                        <button className="btn-red" onClick={() => declineRequest(el.request_id)}>Отклонить</button>
                      </div>
                    </div>
                  ) :
                  <p className="requests-list__empty">Пусто... Заявок в вашу команду пока нет!</p>
                }
              </div>
            </div>
            <button className="modal__btn btn-red" onClick={() => setModal3(false)}>Закрыть</button>
          </div>
      </Modal>
      <Modal active={errorModal}>
          <div className="hasteam-modal">
            <p className="modal__title">Ошибки:</p>
            <p className="modal__error">{error}</p>
            <button className="modal__btn btn" onClick={() => setErrorModal(false)}>OK</button>
          </div>
      </Modal>
    </div>
  )
}

export default observer(HasTeam);