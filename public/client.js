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
  apod: {}
})

const manifest = {
  curiosity: {},
  opportunity: {},
  spirit: {}
}

const paging = {
  rover: '',
  index: 0
}

function showError (message) {
  alert(message)
}

const fetchQuery = async (path, uriComp = '') => {
  const urlPrefix = 'http://localhost:3000'
  uriComp = encodeURIComponent(uriComp)
  const rawData = await fetch(urlPrefix + path + uriComp)
  if (!rawData.ok) {
    showError('Error fetching ' + urlPrefix + path + uriComp)
  }
  const jsonData = await rawData.json()
  return jsonData
}

const drawAPOD = async () => {
  const apodText = '<div class="apod-grid-item"></div>' +
    '<div class="apod-grid-item">' +
    `<a href="${state.getIn(['apod', 'hdurl'])}">` +
    `<img src="${state.getIn(['apod', 'url'])}" ` +
    `alt="${state.getIn(['apod', 'title'])}"></a>` +
    `<p>${state.getIn(['apod', 'explanation'])}` +
    '</div><div class="apod-grid-item"></div>'
  document.getElementById('apodgriditems').innerHTML = apodText
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
  const opportunityURL = 'https://mkanderson71.github.io/MarsProject/public/assets/data/opportunityManifest.json'
  const spiritURL = 'https://mkanderson71.github.io/MarsProject/public/assets/data/spiritManifest.json'

  // Curiosity is still going today, so pull live manifest from API
  const queryCData = await fetchQuery(`/mars-photos/api/v1/manifests/Curiosity`)
  manifest.curiosity = queryCData.photos.photo_manifest

  // Grab Opportunity from githubpages
  const oResponse = await fetch(opportunityURL)
  const oJSON = await oResponse.json()
  manifest.opportunity = oJSON.photo_manifest

  // Grab Spirit from githubpages
  const sResponse = await fetch(spiritURL)
  const sJSON = await sResponse.json()
  manifest.spirit = sJSON.photo_manifest

  manifest.curiosity.factHTML = '<h2><i>Curiosity</i> Rover</h2>' +
  '<table class="roverTextTable">' +
  '<tr><td class="ltblue" style="width:35%">Launch Date</td><td class="ltgrey">November 26, 2011 UTC</td></tr>' +
  '<tr><td>Launch Vehicle</td><td class="ltgrey">Atlas V 541</td></tr>' +
  '<tr><td>Landing</td><td class="ltgrey">August 6, 2012</td></tr>' +
  '<tr><td>Landing Site</td><td class="ltgrey">Gale Crater</td></tr>' +
  '<tr><td>Mission End</td><td class="brtgreen" class="ltgrey">Mission In Progress</td></tr>' +
  '</table>'
  manifest.curiosity.linkHTML = 'https://mars.nasa.gov/mars-exploration/missions/mars-science-laboratory/'
  manifest.curiosity.picHTML = 'assets/img/curiosity_marsbg.jpg'
  manifest.curiosity.altHTML = 'Curiosity Rover'

  manifest.opportunity.factHTML = '<h2><i>Opportunity</i> Rover</h2>' +
  '<table class="roverTextTable">' +
  '<tr><td class="ltblue" style="width:35%">Launch Date</td><td class="ltgrey">June 10, 2003 UTC</td></tr>' +
  '<tr><td>Launch Vehicle</td><td class="ltgrey">Delta II 7925H (Delta II Heavy)</td></tr>' +
  '<tr><td>Landing</td><td class="ltgrey">January 25, 2004</td></tr>' +
  '<tr><td>Landing Site</td><td class="ltgrey">Meridiani Planum</td></tr>' +
  '<tr><td>Mission End</td><td class="ltgrey">February 13, 2019</td></tr>' +
  '</table>'
  manifest.opportunity.linkHTML = 'https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/'
  manifest.opportunity.picHTML = 'assets/img/spirit_opp_marsbg.jpg'
  manifest.opportunity.altHTML = 'Opportunity Rover'

  manifest.spirit.factHTML = '<h2><i>Spirit</i> Rover</h2>' +
  '<table class="roverTextTable">' +
  '<tr><td class="ltblue" style="width:35%">Launch Date</td><td class="ltgrey">June 10, 2003 UTC</td></tr>' +
  '<tr><td>Launch Vehicle</td><td class="ltgrey">Delta II 7925</td></tr>' +
  '<tr><td>Landing</td><td class="ltgrey">January 4, 2004</td></tr>' +
  '<tr><td>Landing Site</td><td class="ltgrey">Gusev Crater</td></tr>' +
  '<tr><td>Mission End</td><td class="ltgrey">March 22, 2010</td></tr>' +
  '</table>'
  manifest.spirit.linkHTML = 'https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/'
  manifest.spirit.picHTML = 'assets/img/spirit_opp_marsbg.jpg'
  manifest.spirit.altHTML = 'Spirit Rover'
}

const fGetNasaData = async (query) => {
  const queryData = await fetchQuery(`/mars-photos/api/v1/rovers/${rover}/latest_photos`)
  let roverData = queryData
}

const makePrime = (rover) => {
  const gridText = '<div class="grid-item">' +
    `<a href="${manifest[rover].linkHTML}">` +
    `<img src="${manifest[rover].picHTML}" ` +
    `alt="${manifest[rover].altHTML}"></a>` +
    `${manifest[rover].factHTML}` +
    '</div>'
  return gridText
}

function drawGrid (grid) {
  let gridText = ''
  grid.forEach((value) => {
    gridText = gridText + value
  })
  document.getElementById('apodgriditems').innerHTML = ''
  document.getElementById('griditems').innerHTML = gridText
}

function drawPageControl(rover) {
  // These dates are in the same format as HTML requires so no conversion, just a string
  const startDate = manifest[rover].photos[0].earth_date
  const endDate = manifest[rover].photos[(manifest[rover].photos.length - 1)].earth_date
  const pageText = '<div id="datepaging" class="paging-grid-item">' +
    '<label>Date' +
    `<input class="pagedate" type="date" id="dateSelected" value="${startDate}" min="${startDate}" max="${endDate}">` +
    '<button class="pagebtn" id="clickdate"><u>[GO]</u></button>' +
    '</label></div>' +
    '<div id="pictotpaging" class="paging-grid-item"></div>' +
    '<div id="buttonpaging" class="paging-grid-item"></div>' +
    '<div id="selectcampaging" class="paging-grid-item"></div>'
  document.getElementById('paginggrid').innerHTML = pageText
}

// HOF called by filter, returns function matchCam
const camTester = (camera) => {
  function matchCam (element) {
    if (element.camera.name === camera) {
      return true
    }
  }
  return matchCam
}

function buildCamSelect (iData, rover) {
  const dateCamSelect = {}
  dateCamSelect.FHAZ = iData.photos.photos.filter(camTester('FHAZ'))
  dateCamSelect.RHAZ = iData.photos.photos.filter(camTester('RHAZ'))
  dateCamSelect.NAVCAM = iData.photos.photos.filter(camTester('NAVCAM'))
  if (rover === 'spirit' || rover === 'opportunity') {
    dateCamSelect.PANCAM = iData.photos.photos.filter(camTester('PANCAM'))
    dateCamSelect.MINITES = iData.photos.photos.filter(camTester('MINITES'))
  } else {
    dateCamSelect.MAST = iData.photos.photos.filter(camTester('MAST'))
    dateCamSelect.CHEMCAM = iData.photos.photos.filter(camTester('CHEMCAM'))
    dateCamSelect.MAHLI = iData.photos.photos.filter(camTester('MAHLI'))
    dateCamSelect.MARDI = iData.photos.photos.filter(camTester('MARDI'))
  }
  for (const [key, value] of Object.entries(dateCamSelect)) { // delete cameras with no pics this day
    if (value.length === 0) {
      delete dateCamSelect[key]
      console.log('deleted' + key)
    }
  }
  return dateCamSelect
}

// pull first images for date

async function initImageGrid (rover, date) {
  console.debug(date)
  // second param for fetchQuery calls encodeURIComponent on it
  const iData = await fetchQuery(`/mars-photos/api/v1/rovers/${rover}/photos`, `?earth_date=${date}`)
  // TODO: Draw grid of pics 0-24
  paging.rover = rover
  paging.index = 0
  const dateCamSelect = buildCamSelect(iData, rover)
  debugger
  // setupPageNav(iData.photos.photos.length, manifest[rover].)
}

function setupPageNav (numPhotos) {
  console.log('numPhotos is ' + numPhotos)
  document.getElementById('pictotpaging').innerHTML = `${numPhotos} Total Photos`
  buttonTxt = '<button class="pagebtn" id="backall">|<</button>' +
    '<button class="pagebtn" id="backone"><</button>' +
    '<button class="pagebtn" id="fwdone">></button>' +
    '<button class="pagebtn" id="fwdall">>|</button>'
  document.getElementById('buttonpaging').innerHTML = buttonTxt
  selectTxt = '<select '
}

const setupRoverMain = (roverName) => {
  console.debug('setupgrid running for ' + roverName)
  const grid = []
  grid[0] = makePrime(roverName)
  grid[1] = makePrime(roverName)
  grid[2] = makePrime(roverName)
  drawGrid(grid)
  drawPageControl(roverName)
  document.getElementById('clickdate')
    .addEventListener('click', function () { initImageGrid(roverName, document.getElementById('dateSelected').value) })
}

window.addEventListener('load', () => {
  if (!apodCurrent()) {
    initApod()
  } else {
    drawAPOD()
  }
  initManifests()
  document.getElementById('clickcur')
    .addEventListener('click', function () { setupRoverMain('curiosity') })
  document.getElementById('clickopp')
    .addEventListener('click', function () { setupRoverMain('opportunity') })
  document.getElementById('clickspi')
    .addEventListener('click', function () { setupRoverMain('spirit') })
})
