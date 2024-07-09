import './team.scss';
import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {Modal} from '../../components';
import {api} from '../../helpers/api';
import Store from '../../helpers/store';
import HasTeam from './HasTeam';

function Team() {
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get('/api/teams/get-teams')
    .then(res => setTeams(...teams, res.data))
    .catch(e => console.log(e));
  }, []);

  async function createTeam() {
    try {
      if (name.length < 1) {
        setError("Название не может быть пустым!");
        setErrorModal(true);
        return;
      }

      const res = await api.post('/api/teams/create', {user_id: Store.user.user_id, name: name.trim(), description: desc.trim()});
      
      Store.setTeam(res.data.team);
      Store.setHasTeam(true);
    } catch (e) {
      setError(e.response.data.message);
      setErrorModal(true);
    }
  }

  async function joinTeam(team_id) {
    try {
      await api.post('/api/users/join', {user_id: Store.user.user_id, team_id});

      for (let team of teams) {
        if (team.team_id == team_id) {
          Store.setTeam(team);
          Store.setHasTeam(true);
        }
      }
    } catch (e) {
      setError(e.response.data.message);
      setErrorModal(true);
    }
  }

  if (Store.hasTeam) {
    return <HasTeam />
  }
  
  return (
    <div className="team-page page">
      <h3 className="page__title">Команда</h3>
      <p className="page__section">У вас ещё нет команды... Создайте её!</p>
      <div className="team-create">
        <div className="team-create__name">
          <p className="page__subtitle">Название:</p>
          <input type="text" className="inp" maxLength="30" onChange={e => setName(e.target.value)} value={name} placeholder='1-30 символов...' />
        </div>
        <div className="team-create__desc">
          <p className="page__subtitle">Описание:</p>
          <textarea className="text" maxLength="255" onChange={e => setDesc(e.target.value)} value={desc} placeholder='До 255 символов...' />
        </div>
      </div>
      <button className="team-create__btn btn" onClick={() => createTeam()}>Создать команду</button>
      <p className="page__section">Либо вступите в существующую</p>
      <div className="team-list">
        {teams.map(el =>
          <div className="team-list__item" key={el.team_id}>
            <div className="team-list__info">
              <p className="team-list__name">{el.name}</p>
              <p className="team-list__desc">{el.description}</p>
            </div>
            <button className="team-list__btn btn" onClick={() => joinTeam(el.team_id)}>Вступить</button>
          </div>
        )}
      </div>
      <Modal active={errorModal}>
        <div className="team-modal">
          <p className="modal__title">Ошибка:</p>
          <p className="modal__error">{error}</p>
          <button className="btn" style={{display: "block", margin: "0 auto"}} onClick={() => setErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(Team);