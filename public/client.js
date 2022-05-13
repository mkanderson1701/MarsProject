const dataStore = Immutable.fromJS({
  rovers: ['Curiosity', 'Opportunity', 'Spirit']
})

// temporary workspace under grid
const root = document.getElementById('root') //

const getAPOD = () => {
  const today = new Date();
  const photodate = new Date(store.get('apod').date)
  console.debug('photodate is ' + photodate)
  console.debug('today is ' + today)
}

const fetchQuery = (path) => {
  const urlPrefix = 'http://localhost:3000'
  fetch(urlPrefix + path)
    .then(res => res.json())
    .then(data => {
      console.log('2')
      debugger
      return data.image
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

console.log('1')
const apod = fetchQuery('/apod')
console.log('3')
debugger