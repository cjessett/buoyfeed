import { h } from "preact"

export default ({ id, title, data, link, isFavorite, handleClick }) => (
  <div className="mdl-card card" style={{ display: 'inherit' }}>
    <div className="mdl-card__title">
      <h2 className="mdl-card__title-text" style={{ width: '80%' }}>{title}</h2>
      <button className="mdl-button mdl-button--icon mdl-card__menu">
        <i className="material-icons" onClick={() => handleClick(id)}>
          {isFavorite ? 'star' : 'star_border'}
        </i>
      </button>
    </div>
    <p className="mdl-card__supporting-text t1"><strong>Last Update: </strong>{data.pubDate}</p>
    <p className="mdl-card__supporting-text t1"><strong>Location: </strong>{data.location}</p>
    <div className="data-wrap">
      <span className="mdl-card__supporting-text">
        <h4 className="mdl-card__title-text">Waves</h4>
        <p>Height: {data.significantWaveHeight}</p>
        <p>Dominant Period: {data.dominantWavePeriod}</p>
        <p>Average Period: {data.averagePeriod}</p>
        <p>Direction: {data.meanWaveDirection}</p>
      </span>
      <span className="mdl-card__supporting-text">
        <h4 className="mdl-card__title-text">Wind</h4>
        <p>Direction: {data.windDirection}</p>
        <p>Speed: {data.windSpeed}</p>
        <p>Gust: {data.windGust}</p>
      </span>
      <span className="mdl-card__supporting-text">
        <h4 className="mdl-card__title-text">Temperature</h4>
        <p>Air: {data.airTemperature}</p>
        <p>Water: {data.waterTemperature}</p>
      </span>
    </div>
    <p className="mdl-card__actions" style={{ textAlign: 'center' }}>
      available at <a href={link}>ndbc.noaa.gov</a>
    </p>
  </div>
)
