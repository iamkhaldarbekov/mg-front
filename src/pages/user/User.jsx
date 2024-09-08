import {useParams, useNavigate, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {api} from '../../helpers/api';
import Store from '../../helpers/store';
import {dateParser} from '../../helpers/dateParser';

import {NotFound} from '../../pages';
import {Loader, Modal} from '../../components';

function User() {
  const navigate = useNavigate();
  const {username} = useParams();
  const [user, setUser] = useState({});
  const [invited, setInvited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    Promise.all([
      new Promise((resolve, reject) => {
        api.get(`/api/users/${username}`)
        .then(res => {
          setUser(res.data);
        })
        .catch(e => {
          setError(e.response?.data?.message);
          setErrorModal(true);
        })
        .finally(() => resolve())
      }),
      new Promise((resolve, reject) => {
        api.post('/api/teams/invited', {team_id: Store.team.team_id, username})
        .then(res => {
          if (res.data.message) {
            setInvited(true);
          }
        })
        .catch(e => {
          setError(e.response?.data?.message);
          setErrorModal(true);
        })
        .finally(() => resolve())
      })
    ])
    .then(() => setTimeout(() => setLoading(false), 200))
  }, []);

  function message() {
    if (user.chat_id) {
      return navigate(`/chats/${user.chat_id}`);
    }
  
    api.post('/api/chats/createchat', {user1: Store.user.user_id, user2: user.user_id})
    .then(res => navigate(`/chats/${res.data.chat_id}`))
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
  }

  function sendInvite() {
    api.post('/api/teams/sendinv', {user_id: user.user_id, team_id: Store.team.team_id, letter: letter.trim()})
    .then(() => {
      setInvited(true);
      setModal(false);
    })
    .catch(e => {
      setError(e.response?.data?.message);
      setErrorModal(true);
    })
  }

  if (loading) {
    return <Loader />
  }

  if (Object.keys(user).length == 0) {
    return <NotFound />
  }

  return (
    <div className="page">
        <div>
          <div>
            <p className="text-gold text-[18px] italic font-bold">Имя:</p>
            <p className='text-white mt-[10px]'>{user.username}</p>
          </div>
          {user.bio &&
            <div className='mt-[20px]'>
              <p className="text-gold text-[18px] italic font-bold">О себе:</p>
              <p className='text-white mt-[10px]'>{user.bio}</p>
            </div>
          }
          {user.team &&
            <div className='mt-[20px]'>
              <p className="text-gold text-[18px] italic font-bold">Команда:</p>
              <Link to={'/team/' + user.team.name} className='text-white inline-block mt-[10px] hover:text-gold'>{user.team.name}</Link>
            </div>
          }
          {user.specialization &&
            <div className='mt-[20px]'>
              <p className="text-gold text-[18px] italic font-bold">Специализация:</p>
              <p className='text-white mt-[10px]'>{user.specialization}</p>
            </div>
          }
          <div className='mt-[20px]'>
            <p className="text-gold text-[18px] italic font-bold">Последняя активность:</p>
            <p className='text-white mt-[10px]'>{dateParser(user.last_activity)}</p>
          </div>
        </div>
        {Store.hasTeam && Store.team.role == "creator" && !invited && !user.team &&
          <button className="mt-[20px] btn m-btn" onClick={() => setModal(true)}>Пригласить</button>
        }
        {Store.hasTeam && Store.team.role == "creator" && invited &&
          <p className='text-gold font-tiny5 m-btn inline-block'>Приглашение отправлено</p>
        }
        {user.user_id != Store.user.user_id &&
          <button className="mt-[20px] btn" onClick={() => message()}>Написать</button>
        }
        <Modal active={modal}>
          <div>
            <p className="modal__title">Пригласить {user.username}:</p>
            <div>
              <p className='text-white mb-[5px]'>Письмо:</p>
              <textarea name="inv" id="inv" className="block mx-auto mb-dft w-[400px] h-[150px] text" onChange={e => setLetter(e.target.value)} value={letter} maxLength='255' placeholder='До 255 символов...'/>
            </div>
            <div className="modal-btns">
              <button className="btn" onClick={() => sendInvite()}>Пригласить</button>
              <button className="btn-red" onClick={() => setModal(false)}>Отменить</button>
            </div>
          </div>
        </Modal>
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

export default observer(User);