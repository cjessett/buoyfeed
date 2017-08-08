import { h } from 'preact' // eslint-disable-line no-unused-vars

export default ({ onChange, checked }) => (
  <ul>
    <li className="tg-list-item">
      <i className="material-icons">list</i>
      <input id='tggl' className="tgl tgl-ios" type="checkbox" checked={checked} />
      <label className="tgl-btn" htmlFor="tggl" />
      <i className="material-icons">star</i>
    </li>
  </ul>
)
