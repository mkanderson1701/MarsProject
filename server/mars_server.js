require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000
// console.log(process.env)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// Request for image of the day
app.get('/apod', async (req, res) => {
  try {
    const image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
      .then(res => res.json())
    res.send({ image })
  } catch (err) {
    console.error('error: ', err)
  }
})

// Request to API path permitted
app.get('/mars-photos*', async (req, res) => {
  try {
    let query = ''
    if (req.params[0].includes('?')) {
      query = `https://api.nasa.gov/mars-photos${req.params[0]}&api_key=${process.env.API_KEY}`
    } else {
      query = `https://api.nasa.gov/mars-photos${req.params[0]}?api_key=${process.env.API_KEY}`
    }
    const photos = await fetch(query)
      .then(res => res.json())
    res.send({ photos })
    // console.log(`fetched ${query}`)
  } catch (err) {
    console.error(`error: ${err}`)
  }
})

app.listen(port, () => console.log(`Express server listening on port ${port}...`))
