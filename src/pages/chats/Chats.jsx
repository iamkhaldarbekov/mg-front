import './chats.scss';
import {Link} from 'react-router-dom';

import Store from '../../helpers/store';

export default function Chats() {
  return (
    <div className="chats-page page">
        <h3 className="page__title">Чаты</h3>
        <div className="personal-chats">
          <p className="page__section">Личные чаты</p>
        </div>
        {Store.hasTeam &&
          <div className="common-chats">
              <p className="page__section">Общие чаты</p>
              <div className="common-chats__list">
                  <Link className="common-chats__item" to={'/chats/' + Store.team.chat_id}>
                    <p className="common-chats__name">{Store.team.name}</p>
                    <p className="common-chats__desc">{Store.team.description}</p>
                  </Link>
              </div>
          </div>
        }
    </div>
  )
}