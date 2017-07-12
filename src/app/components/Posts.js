import { h } from 'preact' // eslint-disable-line no-unused-vars
import PreactRedux from 'preact-redux'
import { getPosts } from './../store/selectors/posts'
import { updateLocation } from './../store/actions/meta'
import Link from './Link'
const { connect } = PreactRedux

const Post = ({ post, _updateLocation }) => (
  <div className='mdc-card'>
    <Link href={`/blog/${post.id}`} onClick={() => _updateLocation(`/blog/${post.id}`)}>
      {post.title}
    </Link>
  </div>
)

const Posts = ({ posts, _updateLocation }) => (
  <div className='Posts page'>
    {posts.map((post, i) => (
      <Post _updateLocation={_updateLocation} post={post} key={i} />
    ))}
  </div>
)

export default connect(
  (state) => ({
    posts: getPosts(state)
  }),
  (dispatch) => ({
    _updateLocation: (url) => dispatch(updateLocation(url))
  })
)(Posts)
