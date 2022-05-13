const store = Immutable.fromJS({
  user: { name: 'Student' },
  apod: {},
  rovers: ['Curiosity', 'Opportunity', 'Spirit']
})



// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
  store.merge(newState)
  render(root, store)
}

const render = async (root, state) => {
  root.innerHTML = App()
}

// create content
const App = () => {
  console.debug('Running App()')
  const apod = store.get('apod')
  //console.log('store.get(apod) is ' + store.get('apod'))
  console.debug('user.name is ' + (store.get('user').name))

  return `
            ${Greeting(store.get('user').name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay()}
            </section>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `
  }

  return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = () => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date()
  const photodate = new Date(store.get('apod').date)
  console.debug('photodate is ' + photodate)
  console.debug('today is ' + today)

  if (photodate.getDate() !== today.getDate()) {
    console.debug('getting new image')
    getImageOfTheDay()
    debugger
  } else {console.debug('skipping imageget')}

  // check if the photo of the day is actually type video!
  if (store.get('apod').media_type === 'video') {
    return (`
            <p>See today's featured video <a href="${store.get('apod').url}">here</a></p>
            <p>${store.get('apod').title}</p>
            <p>${store.get('apod').explanation}</p>
        `)
  } else {
    return (`
            <img src="${store.get('apod').url}" height="350px" width="100%" />
            <p>${store.get('apod').explanation}</p>
        `)
  }
}

// ------------------------------------------------------  API CALLS

// Get APOD
const getImageOfTheDay = () => {
  fetch('http://localhost:3000/apod')
    .then(res => res.json())
    .then(data => {
      const dataMap = new Immutable.fromJS(data.image)
      console.log(dataMap.toObject())
      store.mergeIn(['apod'], dataMap)
      console.log('apod is ' + store.get('apod').toObject())
      debugger
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
