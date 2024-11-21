const express = require ('express')
const app= express()

app.get('/', function(req,res){
    res.send ('Hola mundo')
})

app.get('/loquesea', function(req,res){
    res.send ('lo que sea')
})

app.get('*', function(req,res){
    res.send ('404 not found')
})

app.listen(3000)
