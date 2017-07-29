import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'

import Buoy from './Buoy'
import { fetchBuoys, favorite } from './../store/actions/buoys'
import { getBuoys } from '../store/selectors/buoys'

const { connect } = PreactRedux

class Home extends Component {
  componentDidMount() {
    this.props.fetchBuoys()
  }

  render(props) {
    const buoys = props
    .buoys
    .map(b =>
      <Buoy
        id={b._id}
        title={b.title}
        data={b.data}
        link={b.link}
        isFavorite={b.isFavorite}
        handleClick={props.favorite}
      />)
    return (
      <div className="Home page">
        {buoys}
      </div>
    )
  }
}

export default connect(state => ({ buoys: getBuoys(state) }), { fetchBuoys, favorite })(Home)
