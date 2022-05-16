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

const IMG_PER_PAGE = 6

function showError (message) {
  alert(message)
}

const fetchQuery = async (path, uriComp = '') => {
  const urlPrefix = 'http://localhost:3000'
  uriComp = encodeURIComponent(uriComp) // if I sent this param it includes a question mark
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

const initApod = async () => {
  const queryData = await fetchQuery('/apod')
  state = state.setIn(['apod'], queryData.image)
  drawAPOD()
}

const initManifests = async () => {
  const opportunityURL = 'https://mkanderson71.github.io/MarsProject/public/assets/data/opportunityManifest.json'
  const spiritURL = 'https://mkanderson71.github.io/MarsProject/public/assets/data/spiritManifest.json'

  // Curiosity is still going today, so pull live manifest from API
  const queryCData = await fetchQuery('/mars-photos/api/v1/manifests/Curiosity')
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

function drawPageControl (rover) {
  // These dates are in the same format as HTML requires so no conversion, just a string
  const startDate = manifest[rover].photos[0].earth_date
  const endDate = manifest[rover].photos[(manifest[rover].photos.length - 1)].earth_date
  const pageText = '<div id="datepaging" class="paging-grid-item">' +
    `<input class="pagedate" type="date" id="dateSelected" value="${startDate}" min="${startDate}" max="${endDate}">` +
    '<button class="pagebtn" id="clickdate"><u>[GO]</u></button>' +
    '</div>' +
    // '<div id="pictotpaging" class="paging-grid-item"></div>' +
    '<div id="buttonpaging" class="paging-grid-item"></div>' +
    '<div id="selectcampaging" class="paging-grid-item"></div>'
  document.getElementById('paginggrid').innerHTML = pageText
}

// HOF called by Object.entries below, returns function matchCam
const camTester = (camera) => {
  function matchCam (element) {
    if (element.camera.name === camera) {
      return true
    }
  }
  return matchCam
}

function buildCamSelect (iDataPP, rover) {
  const dateCamSelect = {}
  dateCamSelect.FHAZ = iDataPP.filter(camTester('FHAZ'))
  dateCamSelect.RHAZ = iDataPP.filter(camTester('RHAZ'))
  dateCamSelect.NAVCAM = iDataPP.filter(camTester('NAVCAM'))
  if (rover === 'spirit' || rover === 'opportunity') {
    dateCamSelect.PANCAM = iDataPP.filter(camTester('PANCAM'))
    dateCamSelect.MINITES = iDataPP.filter(camTester('MINITES'))
  } else {
    dateCamSelect.MAST = iDataPP.filter(camTester('MAST'))
    dateCamSelect.CHEMCAM = iDataPP.filter(camTester('CHEMCAM'))
    dateCamSelect.MAHLI = iDataPP.filter(camTester('MAHLI'))
    dateCamSelect.MARDI = iDataPP.filter(camTester('MARDI'))
  }
  for (const [key, value] of Object.entries(dateCamSelect)) { // delete cameras with no pics this day
    if (value.length === 0) {
      delete dateCamSelect[key]
      console.log('deleted' + key)
    }
  }
  return dateCamSelect
}

const drawCamSelect = (camSelect) => {
  let selectTxt = '<label for="camera"><select name ="camera" id="camera" class="pagebtnselect">' +
    '<option value="ALL">All Cameras</option>'
  for (const [key, value] of Object.entries(camSelect)) {
    selectTxt = selectTxt + `<option value="${key}">${key}(${value.length})</option>`
  }
  document.getElementById('selectcampaging').innerHTML = selectTxt
}

// iData is pic data from NASA API
// index is first picture to render
// iCamArray (optional) should be one array from the iCameras object,
// i.e. send iCameras.FHAZ with just photo elements
function buildPicGrid (iDataPP, index, iCamArray) {
  if (!iCamArray) {
    console.log('initializing for all cameras')
    let gridText = ''
    for (let i = index; i < Math.min(index + IMG_PER_PAGE, iDataPP.length); i++) {
      gridText = gridText + '<div class="grid-item">' +
        // `<a href="${iDataPP[i].img_src.replace('http://', 'https://')}">` +
        `<a href="${iDataPP[i].img_src}">` +
        `<img src="${iDataPP[i].img_src}" alt="${iDataPP[i].camera.full_name}"></a>` + 
        `<p>${iDataPP[i].camera.full_name} (${iDataPP[i].camera.name})` +
        '</div>'
    }
    return gridText
  } else {
    console.log('iCamArray defined')
  }
}

function pageFwd (iDataPP) {
  paging.index += IMG_PER_PAGE
  drawNextPage(iDataPP, paging.index)
}

function updatePageSelect (index, length, iDataPP) {
  if (index + IMG_PER_PAGE < length - 1) { // Enable the FORWARD button
    document.getElementById("fwdone").className = 'pagebtnconton'
    document.getElementById('fwdone')
      .addEventListener('click', pageFwd(iDataPP))
  } else { // DISABLE the FORWARD button
    document.getElementById("fwdone").className = 'pagebtncontoff'
    document.getElementById('fwdone')
      .removeEventListener('click', pageFwd)
  }
  if (index > 0) {
    document.getElementById("backone").className = 'pagebtnconton'
  }
}

function drawNextPage (iDataPP, index) {
  const gridText = buildPicGrid(iDataPP, index)
  document.getElementById('griditems').innerHTML = gridText
  updatePageSelect(index, iDataPP.length, iDataPP)
  debugger
}

//
// Once a date is selected, assemble the full page
//
async function initImageGrid (rover, date) {
  console.debug(date)
  // second param for fetchQuery calls encodeURIComponent on it because ? no bueno
  const iData = await fetchQuery(`/mars-photos/api/v1/rovers/${rover}/photos`, `?earth_date=${date}`)

  paging.rover = rover
  paging.index = 0
  if (iData.photos.photos.length === 0) {
    // if there are no photos on this mission date, return
    alert(`Sorry, ${manifest[rover].name} did not send any photos back to Earth on ${date}.`)
    return
  }

  // Draw main grid
  const gridText = buildPicGrid(iData.photos.photos, paging.index)
  document.getElementById('griditems').innerHTML = gridText

  // Photo page navigation buttons, fwd, back etc
  setupPageNav(iData.photos.photos.length + 1)

  // Dropdown for camera type
  const iCameras = buildCamSelect(iData.photos.photos, rover)
  drawCamSelect(iCameras)

  // updatePageSelect(paging.index, iData.photos.photos.length, iData.photos.photos)
  debugger
}

function setupPageNav (numPics) {
  console.log('numPics is ' + numPics)
  // document.getElementById('pictotpaging').innerHTML = `${numPics} Total Photos`
  const buttonTxt = '<button class="pagebtncontoff" id="backone"><<</button>' +
    '<button class="pagebtncontoff" id="fwdone">>></button>'
  document.getElementById('buttonpaging').innerHTML = buttonTxt
  // selectTxt = '<select '
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
