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
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [name, setName] = useState(Store.team.name);
  const [desc, setDesc] = useState(Store.team.description);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('/api/teams/teammates', {team_id: Store.team.team_id})
    .then(res => {
      setUsers(res.data);
      setLoading(false);
    })
    .catch(e => {
      setError(e.response.data.message);
      setErrorModal(true);
    });
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
        <p></p>
      </div>
      <div className="hasteam-btns">
        <button className="btn" onClick={() => setModal2(true)} style={Store.team.role == "admin" ? {display: "inline-block"} : {display: "none"}}>Редактировать</button>
        <button className="btn-red" onClick={() => setModal(true)}>Покинуть</button>
      </div>
      <p className="page__section">Участники:</p>
      <table className="hasteam-list">
        <thead>
          <tr>
            <th className="hasteam-list__title">Имя</th>
            <th className="hasteam-list__title">Роль</th>
            <th className="hasteam-list__title">Вступил</th>
            <th className="hasteam-list__title" style={Store.team.role == "admin" ? {display: "table-cell"} : {display: "none"}}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(el => 
            <tr className="hasteam-list__item" key={el.user_id}>
              <td><Link to={'/' + el.username}>{el.username}</Link></td>
              <td>{el.role}</td>
              <td>{new Date(el.entered_tmp).getDate()}/{new Date(el.entered_tmp).getMonth() + 1}/{new Date(el.entered_tmp).getFullYear()}</td>
              <td style={Store.team.role == "admin" ? {display: "table-cell"} : {display: "none"}}><button className="btn-red" style={Store.user.username == el.username ? {display: "none"} : {display: "inline-block"}} onClick={() => kick(el.user_id)}>Изгнать</button></td>
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
      <Modal active={errorModal}>
          <div className="hasteam-modal">
            <p className="modal__title">Ошибки:</p>
            <p className="modal__error">{error}</p>
            <button className="btn" style={{display: "block", margin: "0 auto"}} onClick={() => setErrorModal(false)}>OK</button>
          </div>
      </Modal>
    </div>
  )
}

export default observer(HasTeam);