/**
 * Global immutable datastore
 * 
 * I'm not using this for a lot other than APOD because it's
 * not very functional to store all the API data here
 * 
 */

let state = Immutable.fromJS({
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  apod: ''
})

// temporary, move me
const root = document.getElementById('root')

/**
 * Load APOD and initialize display
 */

window.addEventListener('load', () => {
  console.debug('init start')
  if (!apodCurrent()) {
    console.log('running init')
    initApod()
  }
})

const apodCurrent = () => {
  const today = new Date()
  const photodate = new Date(state.get('apod').date)
  console.debug('stored APOD date is ' + photodate)
  console.debug('today is ' + today)
  if (photodate.getDate() !== today.getDate()) {
    return false
  } else { return true }
}

const initApod = async () => {
  const queryData = await fetchQuery('/apod')
  state = state.setIn(['apod'], queryData.image)
  console.log('testing state: ' + state.getIn(['apod', 'explanation']))
  const apodText = '<div class="grid-item"><table><td style="width:50%">' +
    '<a href="' + state.getIn(['apod', 'hdurl']) + '">' +
    '<img src="' + state.getIn(['apod', 'url']) + '" ' +
    'alt="' + state.getIn(['apod', 'title']) + '"></a></td>' +
    '<td style="width:50%">' + state.getIn(['apod', 'explanation'])
    '</td></table></div>'
  document.getElementById('box0').innerHTML = apodText
/**   document.getElementById('box1').innerHTML = apodText
  document.getElementById('box2').innerHTML = apodText
  document.getElementById('box3').innerHTML = apodText
  document.getElementById('box4').innerHTML = apodText
  document.getElementById('box5').innerHTML = apodText
  document.getElementById('box6').innerHTML = apodText
  document.getElementById('box7').innerHTML = apodText
  document.getElementById('box8').innerHTML = apodText
*/
}

const fetchQuery = async (path) => {
  const urlPrefix = 'http://localhost:3000'
  const rawData = await fetch(urlPrefix + path)
  if (!rawData.ok) {
    showError('Error fetching ' + path)
  }
  const jsonData = await rawData.json()
  return jsonData
}

// let oRes = {}
//
// fetch(urlPrefix + path)
//   .then(qRes => qRes.json())
//   .then(jRes => {
//     oRes = jRes
//   })
//   .catch((error) => {
//     console.error('Error:', error)
//   })
// console.log('oRes date is ' + oRes.image.date)

function showError (message) {
  alert(message)
}
