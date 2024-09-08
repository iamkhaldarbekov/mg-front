import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import {api} from '../../helpers/api';
import {dateParser} from '../../helpers/dateParser';
import {Loader} from '../../components';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/users/users')
    .then(res => {
      setUsers(res.data);
      setFilteredUsers(res.data);
    })
    .catch(e => console.log(e))
    .finally(() => setTimeout(() => setLoading(false), 200))
  }, [])

  function search(value) {
    let res = users.filter(item => {
      return item.username.toLowerCase().includes(value.toLowerCase());
    })

    setFilteredUsers(res);
  }

  if (loading) {
    return <Loader />
  }
  
  return (
    <div className='page'>
        <h3 className="page__title">Пользователи</h3>
        <input type="text" className="inp" onChange={e => search(e.target.value)} placeholder="Поиск по имени..." />
        <div className='flex flex-wrap'>
          {filteredUsers[0] ?
            filteredUsers.map((el, index) =>
              <Link to={'/' + el.username} className='block bg-black mt-dft mr-dft rounded-mid p-[15px] h-max border-2 border-black cursor-pointer duration-200 hover:border-gold hover:scale-[1.02]' key={index}>
                <div>
                  <p className='text-[14px] text-white/[0.5] italic'>Имя:</p>
                  <p className='text-white'>{el.username}</p>
                </div>
                {el.specialization &&
                  <div className='mt-[10px]'>
                    <p className='text-[14px] text-white/[0.5] italic'>Специализация:</p>
                    <p className='text-white'>{el.specialization}</p>
                  </div>
                }
                <div className='mt-[10px]'>
                  <p className='text-[14px] text-white/[0.5] italic'>Последняя активность:</p>
                  <p className='text-white'>{dateParser(el.last_activity)}</p>
                </div>
              </Link>
            )
            :
            <p className='text-white mt-dft'>Пусто...</p>
          }
        </div>
    </div>
  )
}