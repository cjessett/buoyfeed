import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'

const { connect } = PreactRedux

const Card = ({ title, description, link, isFavorite }) => (
  <div className='mdl-card card'>
    <div className='mdl-card__title'>
      <h2 className='mdl-card__title-text'>{title}</h2>
      <input type='checkbox' checked={isFavorite} style={{ margin: '0.5em' }}/>
    </div>
    <p
      className='mdl-card__supporting-text'
      dangerouslySetInnerHTML={{ __html: description }}
      style={{ textAlign: 'center' }}
    />
    <p className='mdl-card__actions' style={{ textAlign: 'center' }}>
      available at <a href={link}>ndbc.noaa.gov</a>
    </p>
  </div>
)

const Home = ({ buoys }) => (
  <div className='Home page'>
    {buoys.map(b => <Card id={b.id} title={b.title} description={b.description} link={b.link} />)}
  </div>
)

export default connect((state) => ({ buoys: state.buoys.collection }))(Home)
