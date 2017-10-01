import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'

import Buoy from './Buoy'
import { fetchBuoys, offlineFav, getBuoys } from '../store/ducks/buoys'
import { getFavs } from '../store/ducks/user'

const { connect } = PreactRedux

class Home extends Component {
  componentDidMount() {
    this.props.fetchBuoys()
  }

  render(props) {
    const defaultText = props.favs ? 'You have no favorites.' : 'No Buoys'
    const defaultView = props.loading ? '' : <h3>{defaultText}</h3>
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
          { props.buoys.length ? visibleBuoys : defaultView }
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
  const onlyFavs = state.buoys.onlyFavs
  const loading = state.buoys.isFetching
  return { buoys, favs, onlyFavs, loading }
}

export default connect(mapStateToProps, { fetchBuoys, offlineFav })(Home)
