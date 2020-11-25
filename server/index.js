const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World! GET')
})

app.post('/', (req, res) => {
  res.send('Hello World! POST')
})

app.delete('/', (req, res) => {
  res.send('Hello World! DELETE')
})

app.put('/', (req, res) => {
  res.send('Hello World! PUT')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
