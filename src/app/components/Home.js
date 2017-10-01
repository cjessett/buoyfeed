import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'

import Buoy from './Buoy'
import { fetchBuoys, offlineFav, getBuoys } from '../store/ducks/buoys'
import { getFavs } from '../store/ducks/user'

const { connect } = PreactRedux

class Home extends Component {
  componentDidMount() {
    this.props.fetchBuoys({ lat: '40N', lon: '73W' })
  }

  render(props) {
    if (props.isFetching) return null
    if (props.error) return <h5 className="content">{props.error}</h5>
    const defaultText = <h5>{props.favs ? 'You have no favorites.' : 'No Buoys.'}</h5>
    const visibleBuoys = props.buoys
      .map(b =>
        <Buoy
          id={b.guid}
          title={b.title}
          data={b.data}
          link={b.link}
          isFavorite={props.favs.includes(b.guid)}
          handleClick={props.offlineFav}
        />)
    return (
      <div className="Home">
        <section className="content">
          <h5>{ props.description }</h5>
          { props.buoys.length ? visibleBuoys : defaultText }
        </section>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const buoys = ownProps.favs ?
    getBuoys(state).filter(b => getFavs(state).includes(b.guid)) :
    getBuoys(state)
  const favs = getFavs(state)
  const { description, isFetching, error } = state.buoys
  return { buoys, favs, isFetching, description, error }
}

export default connect(mapStateToProps, { fetchBuoys, offlineFav })(Home)
