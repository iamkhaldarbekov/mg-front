import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {api} from '../../helpers/api';
import Store from '../../helpers/store';
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
        api.post('/api/teams/requested', {user_id: Store.user.user_id, name})
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
    .then(() => setLoading(false))
  }, []);

  async function sendRequest() {
    try {
      if (!letter.trim()) {
        setError("Поле не может быть пустым!");
        setErrorModal(true);
        return;
      }

      await api.post('/api/users/sendreq', {user_id: Store.user.user_id, team_id: team.team_id, letter: letter.trim()});
      
      setRequested(true);
      setModal(false);
    } catch (e) {
      setError(e.response?.data?.message);
      setErrorModal(true);
    }
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
      <p className="text-white text-[20px] mb-[10px]">{team.name}</p>
      <p className="text-white text-[20px] mb-[10px]">{team.description}</p>
      {!Store.hasTeam && requested &&
        <p className="text-gold font-tiny5">Заявка подана</p>
      }
      {!Store.hasTeam && !requested &&
        <button className="btn" onClick={() => setModal(true)}>Подать заявку</button>
      }
      <Modal active={modal}>
        <div>
          <p className="modal__title">Введите письмо заявки:</p>
          <textarea name="req" id="req" className="block mt-0 mx-auto mb-dft text" onChange={e => setLetter(e.target.value)} value={letter} maxLength='255' placeholder='До 255 символов...'/>
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