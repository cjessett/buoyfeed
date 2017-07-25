import { h, Component } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'

import Card from './Card'
import { loadBuoys, favorite } from './../store/actions/buoys'

const { connect } = PreactRedux

class Home extends Component {
  componentDidMount() {
    this.props.loadBuoys();
  }

  render(props) {
    const buoys = props
    .buoys
    .map(b =>
      <Card
        id={b._id}
        title={b.title}
        data={b.data}
        link={b.link}
        isFavorite={b.isFavorite}
        handleClick={props.favorite}
      />)
    return (
      <div className='Home page'>
        {buoys}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loadBuoys: () => dispatch(loadBuoys()),
  favorite: id => dispatch(favorite(id)),
})

export default connect(state => ({ buoys: state.buoys.collection }), { loadBuoys, favorite })(Home)
