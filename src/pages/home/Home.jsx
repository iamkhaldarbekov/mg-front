import './home.scss';
import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Link} from 'react-router-dom';

import {api} from '../../helpers/api';
import Store from '../../helpers/store';
import {Loader} from '../../components';

function Home() {
  const [newTeams, setNewTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/teams/new-teams')
    .then(res => {
      setNewTeams(res.data);
    })
    .catch(e => console.log(e))
    .finally(() => setLoading(false))
  }, []);

  if (loading) {
    return <Loader />
  }

  return (
    <div className="home-page page">
      <h3 className="page__title">Главная</h3>
      {!Store.hasTeam &&
        <div className="new-teams">
          <p className="page__subtitle">Новые команды:</p>
          <div className="new-teams__list">
            {newTeams.map(el => 
              <Link className="new-teams__item" to={'/team/' + el.name} key={el.team_id}>
                <p className="new-teams__name">{el.name}</p>
                <p className="new-teams__desc">{el.description}</p>
              </Link>
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default observer(Home);