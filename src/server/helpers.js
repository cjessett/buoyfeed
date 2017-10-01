import { LAT_RE, LON_RE } from './constants'

const validType = coord => coord && typeof coord === 'string'
const validDir = (validDirs, dir) => validDirs.includes(dir)
const inRange = (digit, max, min) => Number(digit) <= max && Number(digit) >= min

export default function validCoords(coords) {
  const { lat, lon } = coords
  if (!validType(lat) || !validType(lon)) return false

  const latMatch = lat.match(LAT_RE)
  const lonMatch = lon.match(LON_RE)
  if (!latMatch || !lonMatch) return false

  const [latDigit, latDir] = latMatch.slice(1, 3)
  const [lonDigit, lonDir] = lonMatch.slice(1, 3)

  if (!validDir(['N', 'S'], latDir) || !validDir(['E', 'W'], lonDir)) return false

  return inRange(latDigit, 90, 0) && inRange(lonDigit, 180, 0)
}
