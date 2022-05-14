require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
  try {
    const image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
      .then(res => res.json())
      Object.entries(image).forEach(image => {
        console.log(image)
      })
    res.send({ image })
  } catch (err) {
    console.log('error:', err)
  }
})

app.get('/mars-photos*', async (req, res) => {
  try {
    const photos = await fetch(`https://api.nasa.gov/mars-photos${req.params[0]}?api_key=${process.env.API_KEY}`)
      .then(res => res.json())
    res.send({ photos })
    console.log('fetched https://api.nasa.gov/mars-photos' + req.params[0] + '?api_key=${process.env.API_KEY}')
  } catch (err) {
    console.log('error:', err)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))