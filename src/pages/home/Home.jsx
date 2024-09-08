import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Link} from 'react-router-dom';

import {api} from '../../helpers/api';
import Store from '../../helpers/store';
import {Loader, Modal} from '../../components';

function Home() {
  const [newTeams, setNewTeams] = useState([]);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/teams/new-teams')
    .then(res => {
      setNewTeams(res.data);
    })
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
    .finally(() => setTimeout(() => setLoading(false), 200))
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className="page">
      <h3 className="page__title">Главная</h3>
      {!Store.hasTeam &&
        <div>
          <p className="page__section">Новые команды:</p>
          <div className="flex overflow-x-auto pt-[3px] px-[3px] pb-[10px]">
            {newTeams.map((el, index) => 
              <Link className="rounded-mid block min-w-[320px] bg-black mr-big p-[10px] border-2 border-black duration-200 hover:scale-[1.02] hover:border-gold" to={'/team/' + el.name} key={index}>
                <div>
                  <p className='text-white/[0.5] text-[17px] italic'>Название:</p>
                  <p className="text-white text-[17px] mb-[10px]">{el.name}</p>
                </div>
                <div>
                  <p className='text-white/[0.5] text-[17px] italic'>Кол-во участников:</p>
                  <p className="text-white text-[17px] mb-[10px]">{el.members}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      }
      <Modal active={errorModal}>
        <div>
          <p className="modal__title">Ошибки:</p>
          <p className="modal__error">{error}</p>
          <button className="modal__btn btn" onClick={() => setErrorModal(false)}>ОК</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(Home);