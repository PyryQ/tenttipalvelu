const express = require('express')
const app = express()
const port = 4000

// notice here I'm requiring my database adapter file
// and not requiring node-postgres directly
const db = require('./db')


////// TENTTIEN MUOKKAUS
app.get('/:id', (req, res, next) => {
  db.query('SELECT * FROM tentti WHERE tentti_id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
})
// ... many other routes in this file

app.post('/tentit/:id/kysymys', (req, res, next) => {
  db.query('SELECT * FROM tentti WHERE tentti_id = $1', [req.params.id], (err, result) => {
    if (err) {
      return next(err)
    }
    res.send(result.rows[0])
  })
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


////// KYSYMYSTEN MUOKKAUS



////// VASTAUSTEN MUOKKAUS



////// KÄYTTÄJÄN MUOKKAUS




////// KÄYTTÄJÄN TENTTIEN MUOKKAUS



////// KÄYTTÄJÄN VASTAUSTEN MUOKKAUS




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
