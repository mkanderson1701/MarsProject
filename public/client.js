/**
 * Global immutable datastore
 *
 * I'm not using this for more than APOD, because it's
 * not very "functional" to store all the API data here
 *
 * note to self
 * https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?&api_key=DEMO_KEY
 * sample manifest query
 *
 */

let state = Immutable.fromJS({
  rovers: ['curiosity', 'opportunity', 'spirit'],
  apod: ''
})

let manifest = {
  curiosity: {},
  opportunity: {},
  spirit: {}
}

function showError (message) {
  alert(message)
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

const drawAPOD = async () => {
  const apodText = '<div class="grid-item"><table><td style="width:50%" class="welcomeTable">' +
    `<a href="${state.getIn(['apod', 'hdurl'])}">` +
    `<img src="${state.getIn(['apod', 'url'])}" ` +
    `alt="${state.getIn(['apod', 'title'])}"></a></td>` +
    `<td class="welcomeTable" style="width:50%">${state.getIn(['apod', 'explanation'])}` +
    '</td></table></div>'
  document.getElementById('griditems').innerHTML = apodText
}

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

const roverFactTxt = (roverName) => {
  let roverFacts = ''
  switch (roverName) {
    case 'spirit':
      console.debug('building spirit facts')
      roverFacts = '<h2><i>Opportunity</i> Rover</h2>' +
      '<table class="roverTextTable">' +
      '<tr><td class="ltblue" style="width:35%">Launch Date</td><td class="ltgrey">June 10, 2003 UTC</td></tr>' +
      '<tr><td>Launch Vehicle</td><td class="ltgrey">Delta II 7925H (Delta II Heavy)</td></tr>' +
      '<tr><td>Landing</td><td class="ltgrey">January 25, 2004</td></tr>' +
      '<tr><td>Landing Site</td><td class="ltgrey">Meridiani Planum</td></tr>' +
      '<tr><td>Mission End</td><td class="ltgrey">February 13, 2019</td></tr>' +
      '</table>'
      break
    case 'opportunity':
      console.debug('building opportunity facts')
      roverFacts = '<h2><i>Opportunity</i> Rover</h2>' +
      '<table class="roverTextTable">' +
      '<tr><td class="ltblue" style="width:35%">Launch Date</td><td class="ltgrey">June 10, 2003 UTC</td></tr>' +
      '<tr><td>Launch Vehicle</td><td class="ltgrey">Delta II 7925H (Delta II Heavy)</td></tr>' +
      '<tr><td>Landing</td><td class="ltgrey">January 25, 2004</td></tr>' +
      '<tr><td>Landing Site</td><td class="ltgrey">Meridiani Planum</td></tr>' +
      '<tr><td>Mission End</td><td class="ltgrey">February 13, 2019</td></tr>' +
      '</table>'
      break
    case 'curiosity':
      console.debug('building curiosity facts')
      roverFacts = '<h2><i>Opportunity</i> Rover</h2>' +
      '<table class="roverTextTable">' +
      '<tr><td class="ltblue" style="width:35%">Launch Date</td><td class="ltgrey">June 10, 2003 UTC</td></tr>' +
      '<tr><td>Launch Vehicle</td><td class="ltgrey">Delta II 7925H (Delta II Heavy)</td></tr>' +
      '<tr><td>Landing</td><td class="ltgrey">January 25, 2004</td></tr>' +
      '<tr><td>Landing Site</td><td class="ltgrey">Meridiani Planum</td></tr>' +
      '<tr><td>Mission End</td><td class="ltgrey">February 13, 2019</td></tr>' +
      '</table>'
  }
  return roverFacts
}

const initApod = async () => {
  const queryData = await fetchQuery('/apod')
  state = state.setIn(['apod'], queryData.image)
  drawAPOD()
}

const initManifests = async () => {
  // Curiosity is still going so pull manifest from API
  const queryData = await fetchQuery(`/mars-photos/api/v1/manifests/Curiosity`)
  manifest.curiosity = queryData.photos.photo_manifest
  // 
  debugger
}

const pullNasaData = async (rover) => {
  const queryData = await fetchQuery(`/mars-photos/api/v1/rovers/${rover}/latest_photos`)
  let roverData = queryData
  debugger
}

const makeOppGrid = () => {
  const gridText = '<div class="grid-item"><table><tr>' +
    '<a href="https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/">' +
    '<img src="assets/img/spirit_opp_marsbg.jpg" ' +
    'alt="Opportunity Rover"></a></tr>' +
    '<tr>' + roverFactTxt('opportunity') +
    '</tr></table></div>'
  return gridText
}

const drawGrid = (grid) => {


  // TODO: Update this to dump entire grid at once instead of div by div
  grid.forEach((value, index) => {
    document.getElementById('griditems').innerHTML = value
    console.log(index + ' ' + value)
  })
}

const setupGrid = (roverName) => {
  console.debug('setupgrid running for ' + roverName)
  const grid = []
  switch (roverName) {
    case 'opportunity':
      grid[0] = makeOppGrid()
  }
  const nasaData = pullNasaData(roverName)
  drawGrid(grid)
}


window.addEventListener('load', () => {
  if (!apodCurrent()) {
    initApod()
  } else {
    drawAPOD()
  }
  initManifests()
  document.getElementById('clickcur')
    .addEventListener('click', function () { setupGrid('curiosity') })
  document.getElementById('clickopp')
    .addEventListener('click', function () { setupGrid('opportunity') })
  document.getElementById('clickspi')
    .addEventListener('click', function () { setupGrid('spirit') })
})
