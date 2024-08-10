import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';

import {api} from '../../helpers/api';
import {NotFound} from '../../pages';
import {Loader, Modal} from '../../components';

export default function User() {
  const {username} = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    api.get(`/api/users/${username}`)
    .then(res => {
      setUser(res.data.user);
    })
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
    .finally(() => setLoading(false))
  }, []);

  if (loading) {
    return <Loader />
  }

  if (Object.keys(user).length == 0) {
    return <NotFound />
  }

  return (
    <div className="page">
        <div className="leading-[42px]">
          <img src={user.img} alt="user" className="text-white text-[25px] font-bold" />
          <p className="text-white text-[25px] font-bold">Имя: {user.username}</p>
          <p className="text-white text-[25px] font-bold">Команда: {user.name}</p>
          <p className="text-white text-[25px] font-bold">О себе: {user.bio}</p>
        </div>
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