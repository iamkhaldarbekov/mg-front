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
    <div className="page">
      <h3 className="page__title">Команда</h3>
      <div>
        <p className="page__section">У вас ещё нет команды... Создайте её!</p>
        <div className="flex">
          <div className="mr-dft">
            <p className="text-white font-bold mb-dft text-[20px]">Название:</p>
            <input type="text" className="inp" maxLength="30" onChange={e => setName(e.target.value)} value={name} placeholder='1-30 символов...' />
          </div>
          <div>
            <p className="text-white font-bold mb-dft text-[20px]">Описание:</p>
            <textarea className="w-[400px] h-[140px] text" maxLength="500" onChange={e => setDesc(e.target.value)} value={desc} placeholder='До 500 символов...' />
          </div>
        </div>
        <button className="block mt-dft mx-auto mb-0 btn" onClick={() => createTeam()}>Создать команду</button>
      </div>
      {teams[0] &&
        <div>
          <p className="page__section">Либо вступите в одну из существующих:</p>
          <input type="text" className="inp" onChange={e => search(e.target.value)} placeholder='Поиск по названию...' />
          {filteredTeams[0] ?
            filteredTeams.map(el =>
              <Link className="bg-black mt-dft block border-2 border-black p-[20px] duration-200 hover:border-gold hover:scale-[1.02]" to={'/team/' + el.name} key={el.team_id}>
                <div>
                  <p className="text-white font-bold text-[24px] mb-[15px]">{el.name}</p>
                  <p className="text-white text-[17px] hyphens-auto">{el.description}</p>
                </div>
              </Link>
            )
            :
            <p className="text-white text-[20px] font-tiny5 mt-[20px]">Пусто...</p>
          }
        </div>
      }
      <Modal active={errorModal}>
        <div>
          <p className="modal__title">Ошибка:</p>
          <p className="modal__error">{error}</p>
          <button className="modal__btn btn" onClick={() => setErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(Team);