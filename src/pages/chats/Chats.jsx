import {Link} from 'react-router-dom';

import Store from '../../helpers/store';

export default function Chats() {
  return (
    <div className="page">
        <h3 className="page__title">Чаты</h3>
        <div>
          <p className="page__section">Личные чаты</p>
        </div>
        {Store.hasTeam &&
          <div>
              <p className="page__section">Общие чаты</p>
              <div>
                  <Link className="block bg-black w-fit p-[10px] min-w-[320px] border-2 border-black duration-200 hover:scale-[1.02] hover:border-gold" to={'/chats/' + Store.team.chat_id}>
                    <p className="text-white font-bold text-[18px] mb-[10px]">{Store.team.name}</p>
                    <p className="text-white text-[15px] mb-big">{Store.team.description}</p>
                  </Link>
              </div>
          </div>
        }
    </div>
  )
}