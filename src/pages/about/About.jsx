import './about.scss'

export default function About() {
  return (
    <div className="about-page page">
      <h3 className="page__title">О Merger</h3>
      <div className="about-info">
        <p className="about-info__text">Так...</p>
        <br />
        <p className="about-info__text">Этот проект про объединение единомышленников, то есть создание команды для людей со схожими целями.</p>
        <br />
        <p className="about-info__text">Это не про найм работников, каждый ищет подходящюю для себя команду.</p>
        <br />
        <p className="about-info__text">Информация дополняется...</p>
      </div>
    </div>
  )
}