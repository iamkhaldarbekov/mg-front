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
    <div className="page">
      <h3 className="page__title">Главная</h3>
      {!Store.hasTeam &&
        <div>
          <p className="text-white font-bold text-[20px] mb-[10px]">Новые команды:</p>
          <div className="flex overflow-x-auto pt-[3px] px-[3px] pb-[10px]">
            {newTeams.map(el => 
              <Link className="block min-w-[320px] bg-black mr-big p-[10px] border-2 border-black duration-200 hover:scale-[1.02] hover:border-gold" to={'/team/' + el.name} key={el.team_id}>
                <p className="text-white font-bold text-[18px] mb-[10px]">{el.name}</p>
                <p className="text-white text-[15px] mb-big">{el.description}</p>
              </Link>
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default observer(Home);