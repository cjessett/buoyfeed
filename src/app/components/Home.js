import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'

import Buoy from './Buoy'
import Toggle from './Toggle'
import { fetchBuoys, offlineFav, fetchFavorites, toggleFilter } from './../store/actions/buoys'
import { setToken } from '../store/actions/meta'
import { getBuoys } from '../store/selectors/buoys'
import { getFavs } from '../store/selectors/user'

const { connect } = PreactRedux

class Home extends Component {
  componentDidMount() {
    this.props.setToken(localStorage.getItem('id_token'))
    this.props.fetchBuoys()
  }

  render(props) {
    const display = props.toggleDisplay
    const buoys = props
    .buoys
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
        <aside id="toggle" style={{ display }} className="Toggle fixed">
          <Toggle handleToggle={props.toggleFilter} checked={props.onlyFavs} />
        </aside>
        <section className="content">{buoys}</section>
      </div>
    )
  }
}

export default connect(
  state => ({
    buoys: state.buoys.onlyFavs ?
      getBuoys(state).filter(b => getFavs(state).includes(b.guid)) :
      getBuoys(state),
    favs: getFavs(state),
    isAuthenticated: state.auth.isAuthenticated,
    toggleDisplay: state.meta.toggleDisplay,
    onlyFavs: state.buoys.onlyFavs,
  }),
  { fetchBuoys, offlineFav, fetchFavorites, setToken, toggleFilter }
)(Home)
