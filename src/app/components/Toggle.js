import { h } from 'preact' // eslint-disable-line no-unused-vars

export default ({ handleToggle, checked }) => (
  <ul>
    <li className="tg-list-item">
      <i className="material-icons">list</i>
      <input
        id="tggl"
        className="tgl tgl-ios"
        type="checkbox"
        checked={checked}
        onChange={() => handleToggle()}
      />
      <label className="tgl-btn" htmlFor="tggl" />
      <i className="material-icons">star</i>
      <h4>Favorites</h4>
    </li>
  </ul>
)
