import {Link} from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="bg-darkgray mb-[10px]">
      <div className="p-[25px] flex justify-between">
        <div className="flex items-center">
          <p className="text-white font-tiny5 text-[20px] cursor-default">MERGER</p>
          <Link to='/about' className="text-white ml-[40px] font-tiny5 hover:text-gold">О Merger</Link>
        </div>
        <ul className="flex items-center">
          <Link to='/' className="text-white ml-[30px] font-tiny5 hover:text-gold">Главная</Link>
          <Link to='/team' className="text-white ml-[30px] font-tiny5 hover:text-gold">Команда</Link>
          <Link to='/chats' className="text-white ml-[30px] font-tiny5 hover:text-gold">Чаты</Link>
          <Link to='/profile' className="text-white ml-[30px] font-tiny5 hover:text-gold">Профиль</Link>
        </ul>
      </div>
    </nav>
  )
}