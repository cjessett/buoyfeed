import { h } from 'preact' // eslint-disable-line no-unused-vars

const Card = ({ name, description, isFavorite }) => (
  <div className='mdl-card card'>
    <div className='mdl-card__title'>
      <h2 className='mdl-card__title-text'>{name}</h2>
      <input type='checkbox' checked={isFavorite} style={{ margin: '0.5em' }}/>
    </div>
    <p className='mdl-card__supporting-text'>
      <em>{description}</em>
    </p>
    <p className='mdl-card__actions'>
      available at <a href='https://github.com'>github.com</a>
    </p>
  </div>
)

export default () => (
  <div className='Home page'>
    <Card name='buoy 1' description='swell: 5m' isFavorite />
    <Card name='buoy 2' description='swell: 5m' isFavorite />
    <Card name='boat' description='swell: 5m'/>
    <Card name='buoy 1' description='swell: 5m'/>
    <Card name='buoy 2' description='swell: 5m' isFavorite />
    <Card name='boat' description='swell: 5m'/>
  </div>
)
