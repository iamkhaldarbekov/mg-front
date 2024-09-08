import {useParams, Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {api} from '../../helpers/api';
import Store from '../../helpers/store';
import {dateParser} from '../../helpers/dateParser';
import {Loader, Modal} from '../../components';
import {NotFound} from '../../pages';

function SomeTeam() {
  const {name} = useParams();
  const [team, setTeam] = useState({});
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [letter, setLetter] = useState("");
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      new Promise((resolve, reject) => {
        api.get(`/api/teams/${name}`)
        .then(res => {
          if (!res.data) {
              return;
          }
  
          setTeam(res.data);
        })
        .catch(e => {
          setError(e.response?.data?.message);
          setErrorModal(true);
        })
        .finally(() => resolve())
      }),
      new Promise((resolve, reject) => {
        api.post('/api/users/requested', {user_id: Store.user.user_id, name})
        .then(res => {
          if (res.data.message) {
            setRequested(true);
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

  function sendRequest() {
    if (!letter.trim()) {
      setError("Поле не может быть пустым!");
      setErrorModal(true);
      return;
    }

    api.post('/api/users/sendreq', {user_id: Store.user.user_id, team_id: team.team_id, letter: letter.trim()})
    .then(() => {
      setRequested(true);
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

  if (Object.keys(team).length == 0) {
    return <NotFound />
  }
  
  return (
    <div className="page">
      <h3 className="page__title">Команда</h3>
      <div>
        <div className='flex'>
          <div>
            <p className="text-gold text-[18px] italic font-bold">Название:</p>
            <p className='text-white mt-[10px] text-[16px]'>{team.name}</p>
          </div>
          <div className='ml-[50px]'>
            <p className="text-gold text-[18px] italic font-bold">Описание:</p>
            <p className='whitespace-pre-line text-white mt-[10px] text-[16px] hyphens-auto'>{team.description}</p>
          </div>
        </div>
        <div className='flex mt-[30px]'>
          <div>
            <p className="text-gold text-[18px] italic font-bold">Создан:</p>
            <p className='text-white mt-[10px] text-[16px]'>{dateParser(team.created_tmp)}</p>
          </div>
        </div>
      </div>
      {!Store.hasTeam && requested &&
        <p className="text-gold font-tiny5 mt-[20px]">Заявка подана</p>
      }
      {!Store.hasTeam && !requested &&
        <button className="btn mt-[20px]" onClick={() => setModal(true)}>Подать заявку</button>
      }
      <table className="w-[100%] table-fixed border-collapse">
        <thead>
          <tr>
            <th className="text-white font-tiny5 font-normal p-[15px]">Имя</th>
            <th className="text-white font-tiny5 font-normal p-[15px]">Роль</th>
            <th className="text-white font-tiny5 font-normal p-[15px]">Вступил</th>
          </tr>
        </thead>
        <tbody>
          {team.teammates.map(el => 
            <tr className='bg-black' key={el.user_id}>
              <td className='text-white text-center p-[15px]'><Link className='text-white hover:text-gold' to={'/' + el.username}>{el.username}</Link></td>
              <td className='text-white text-center p-[15px]'>{el.role == "creator" ? "Создатель" : "Участник"}</td>
              <td className='text-white text-center p-[15px]'>{dateParser(el.entered_tmp)}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal active={modal}>
        <div>
          <p className="modal__title">Введите письмо заявки:</p>
          <div>
            <p className='text-white mb-[5px]'>Письмо:</p>
            <textarea name="req" id="req" className="block mx-auto mb-dft w-[400px] h-[150px] text" onChange={e => setLetter(e.target.value)} value={letter} maxLength='255' placeholder='До 255 символов...'/>
          </div>
          <div className="modal-btns">
            <button className="btn" onClick={() => sendRequest()}>Отправить</button>
            <button className="btn-red" onClick={() => setModal(false)}>Отменить</button>
          </div>
        </div>
      </Modal>
      <Modal active={errorModal}>
        <div>
          <p className="modal__title">Ошибки:</p>
          <p className="modal__error">{error}</p>
          <button className="modal__btn btn" onClick={() => setErrorModal(false)}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default observer(SomeTeam);