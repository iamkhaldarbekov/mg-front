import './user.scss';
import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';

import {api} from '../../helpers/api';
import {NotFound} from '../../pages';

export default function User() {
  const {username} = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    api.post('/api/users/get-user', {username})
    .then(res => setUser(res.data.user))
    .catch(e => console.log(e));
  }, []);

  if (Object.keys(user).length == 0) {
    return <NotFound />
  }

  return (
    <div className="user-page page">
        <div className="user-info">
          <p className="user-info__item">Имя: {user.username}</p>
          <p className="user-info__item">Команда: {user.name}</p>
        </div>
    </div>
  )
}