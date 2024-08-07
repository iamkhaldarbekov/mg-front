import './team.scss';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {Modal, Loader} from '../../components';
import {api} from '../../helpers/api';
import Store from '../../helpers/store';
import HasTeam from './HasTeam';

function Team() {
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/teams/get-teams')
    .then(res => {
      setTeams(res.data);
      setFilteredTeams(res.data);
    })
    .catch(e => {
      setError(e.response.data.message);
      setErrorModal(true);
    })
    .finally(() => setLoading(false))
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

  function search(value) {
    let res = teams.filter(item => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    })

    setFilteredTeams(res);
  }

  if (loading) {
    return <Loader />
  }

  if (Store.hasTeam) {
    return <HasTeam />
  }
  
  return (
    <div className="team-page page">
      <h3 className="page__title">Команда</h3>
      <div className="team-info">
        <p className="page__section">У вас ещё нет команды... Создайте её!</p>
        <div className="team-create">
          <div className="team-create__name">
            <p className="page__subtitle">Название:</p>
            <input type="text" className="inp" maxLength="30" onChange={e => setName(e.target.value)} value={name} placeholder='1-30 символов...' />
          </div>
          <div className="team-create__desc">
            <p className="page__subtitle">Описание:</p>
            <textarea className="text" maxLength="500" onChange={e => setDesc(e.target.value)} value={desc} placeholder='До 500 символов...' />
          </div>
        </div>
        <button className="team-create__btn btn" onClick={() => createTeam()}>Создать команду</button>
      </div>
      {teams[0] &&
        <div className="team-list">
          <p className="page__section">Либо вступите в одну из существующих:</p>
          <input type="text" className="inp" onChange={e => search(e.target.value)} placeholder='Поиск по названию...' />
          {filteredTeams[0] ?
            filteredTeams.map(el =>
              <Link className="team-list__item" to={'/team/' + el.name} key={el.team_id}>
                <div className="team-list__info">
                  <p className="team-list__name">{el.name}</p>
                  <p className="team-list__desc">{el.description}</p>
                </div>
              </Link>
            )
            :
            <p className="team-list__empty">Пусто...</p>
          }
        </div>
      }
      <Modal active={errorModal}>
        <div className="team-modal">
          <p className="modal__title">Ошибка:</p>
          <p className="modal__error">{error}</p>
          <button className="modal__btn btn" onClick={() => setErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(Team);