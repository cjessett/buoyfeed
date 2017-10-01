import { h } from 'preact'

export default ({ id, title, data, link, isFavorite, handleClick }) => {
  const onClick = () => handleClick(id)
  const {
    pubDate,
    location,
    significantWaveHeight,
    dominantWavePeriod,
    averagePeriod,
    meanWaveDirection,
    windDirection,
    windSpeed,
    windGust,
    airTemperature,
    waterTemperature,
  } = data
  return (
    <div className="mdl-card card" style={{ display: 'inherit' }}>
      <div className="mdl-card__title">
        <h2 className="mdl-card__title-text" style={{ width: '80%' }}>{title}</h2>
        <button className="mdl-button mdl-button--icon mdl-card__menu" onClick={onClick}>
          <i className="material-icons">
            {isFavorite ? 'star' : 'star_border'}
          </i>
        </button>
      </div>
      <p className="mdl-card__supporting-text t1"><strong>Last Update: </strong>{pubDate}</p>
      <p className="mdl-card__supporting-text t1"><strong>Location: </strong>{location}</p>
      <div className="data-wrap">
        <span className="mdl-card__supporting-text">
          <h4 className="mdl-card__title-text">Waves</h4>
          <p>Height: {significantWaveHeight}</p>
          <p>Dominant Period: {dominantWavePeriod}</p>
          <p>Average Period: {averagePeriod}</p>
          <p>Direction: {meanWaveDirection}</p>
        </span>
        <span className="mdl-card__supporting-text">
          <h4 className="mdl-card__title-text">Wind</h4>
          <p>Direction: {windDirection}</p>
          <p>Speed: {windSpeed}</p>
          <p>Gust: {windGust}</p>
        </span>
        <span className="mdl-card__supporting-text">
          <h4 className="mdl-card__title-text">Temperature</h4>
          <p>Air: {airTemperature}</p>
          <p>Water: {waterTemperature}</p>
        </span>
      </div>
      <p className="mdl-card__actions" style={{ textAlign: 'center' }}>
        available at <a href={link}>ndbc.noaa.gov</a>
      </p>
    </div>
  )
}
