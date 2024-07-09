import './nav.scss';
import {Link} from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <p className="nav__logo">MERGER</p>
        <ul className="nav-links">
          <Link to='/' className='nav-links__item'>Главная</Link>
          <Link to='/about' className='nav-links__item'>О Merger</Link>
          <Link to='/team' className='nav-links__item'>Команда</Link>
          <Link to='/chat' className='nav-links__item'>Чат</Link>
          <Link to='/profile' className='nav-links__item'>Профиль</Link>
        </ul>
      </div>
    </nav>
  )
}