import './nav.scss';
import {Link} from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav-info">
          <p className="nav-info__logo">MERGER</p>
          <Link to='/about' className="nav-info__link">О Merger</Link>
        </div>
        <ul className="nav-links">
          <Link to='/' className="nav-links__item">Главная</Link>
          <Link to='/team' className="nav-links__item">Команда</Link>
          <Link to='/chats' className="nav-links__item">Чаты</Link>
          <Link to='/profile' className="nav-links__item">Профиль</Link>
        </ul>
      </div>
    </nav>
  )
}