import {Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';

import Store from '../../helpers/store';
import {api} from '../../helpers/api';
import {dateParser} from '../../helpers/dateParser';

import {Loader} from '../../components';

function Chats() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/chats/chats')
    .then(res => setChats(res.data.filter(el => el.username != Store.user.username)))
    .catch(e => console.log(e))
    .finally(() => setTimeout(() => setLoading(false), 200))
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="page">
        <h3 className="page__title">Чаты</h3>
        {chats[0] &&
          <div>
            <p className="page__section">Личные чаты:</p>
            <div className='flex'>
              {chats.map((el, index) =>
                <Link className="block bg-black w-fit rounded-mid p-[10px] min-w-[320px] border-2 border-black duration-200 hover:scale-[1.02] hover:border-gold" to={'/chats/' + el.chat_id} key={index}>
                  <p className="text-white font-bold text-[18px] mb-[10px]">{el.username}</p>
                  <div>
                    <p className='text-white/[0.5] text-[15px] italic'>Последняя активность:</p>
                    <p className="text-white text-[15px]">{dateParser(el.last_activity)}</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        }
        {Store.hasTeam &&
          <div>
              <p className="page__section">Командные чаты:</p>
              <div>
                  <Link className="block bg-black w-fit rounded-mid p-[10px] min-w-[320px] border-2 border-black duration-200 hover:scale-[1.02] hover:border-gold" to={'/chats/' + Store.team.chat_id}>
                    <p className="text-white font-bold text-[18px] mb-[10px]">{Store.team.name}</p>
                    <p className="text-white text-[15px] mb-big">{Store.team.description}</p>
                  </Link>
              </div>
          </div>
        }
        {!Store.hasTeam && !chats[0] &&
          <p className='page__section'>У вас нет чатов!</p>
        }
    </div>
  )
}

export default observer(Chats);