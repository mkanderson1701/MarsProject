/**
 * Global immutable datastore
 *
 * I'm not using this for more than APOD, because it's
 * not very "functional" to store all the API data here
 *
 */

let state = Immutable.fromJS({
  rovers: ['curiosity', 'opportunity', 'spirit'],
  apod: ''
})

const fetchQuery = async (path) => {
  const urlPrefix = 'http://localhost:3000'
  const rawData = await fetch(urlPrefix + path)
  if (!rawData.ok) {
    showError('Error fetching ' + path)
  }
  const jsonData = await rawData.json()
  return jsonData
}

const drawAPOD = async () => {
  const apodText = '<div class="grid-item"><table><td style="width:50%">' +
    '<a href="' + state.getIn(['apod', 'hdurl']) + '">' +
    '<img src="' + state.getIn(['apod', 'url']) + '" ' +
    'alt="' + state.getIn(['apod', 'title']) + '"></a></td>' +
    '<td style="width:50%">' + state.getIn(['apod', 'explanation']) +
    '</td></table></div>'
  document.getElementById('box0').innerHTML = apodText
}

/**
 * Load APOD and initialize display
 */

const apodCurrent = () => {
  const today = new Date()
  const photodate = new Date(state.get('apod').date)
  if (photodate.getDate() !== today.getDate()) {
    return false
  } else {
    console.debug('apodCurrent returning true')
    return true
  }
}

const initApod = async () => {
  const queryData = await fetchQuery('/apod')
  state = state.setIn(['apod'], queryData.image)
  drawAPOD()
}





const setupGrid = async (roverName) => {
  //
}

function showError (message) {
  alert(message)
}







/**
 * Load APOD and initialize display
 */

 window.addEventListener('load', () => {
  if (!apodCurrent()) {
    initApod()
  } else {
    drawAPOD()
  }
})

document.getElementById('click-c').addEventListener('click', setupGrid('curiosity'));
document.getElementById('click-o').addEventListener('click', setupGrid('opportunity'));
document.getElementById('click-s').addEventListener('click', setupGrid('spirit'));