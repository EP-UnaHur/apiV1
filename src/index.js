const express = require('express');
const series = require('../data/series.json')
const app = express();

const PORT = 3001

app.use(express.json())

app.get('/series',(req, res)=>{
    res.status(200).json(series)
})

app.get('/series/:id',(req, res)=>{
    const id = req.params.id
    const serie = series.find( serie => serie.id == id)
    if (serie)
        res.status(200).json(serie)
    else
        res.status(404).json( {
            mensaje: `El id ${id} no se encuentra.`
    })

})

app.delete('/series/:id',(req, res)=>{
    const id = req.params.id 
    const idx = series.findIndex(serie => serie.id == id)
    if(idx>=0) {
        series.splice(idx, 1)
        res.status(200).json( {
            mensaje: `El id ${id} fue eliminado con exito` })
    } else
        res.status(404).json( { mensaje: `El id ${id} no se encuentra.`})
})

app.post('/series',(req, res)=>{ 
    const {nombre, plataforma} = req.body
    const serie ={
        id: series.reduce((acum, serie)=> acum > serie.id ? acum : serie.id , 0) + 1,
        nombre,
        plataforma,
        disponible: false
    }
    series.push(serie)
    res.status(201).json(serie)
})

app.put('/series/:id', (req, res)=>{
    const id = req.params.id
    const serieBody = req.body
    const idx = series.findIndex(serie => serie.id==id)
    if (idx >= 0) {
        const serie = { id:series[idx].id, ...serieBody}
        series[idx] = serie
        res.status(200).json(serie)
    } else 
    res.status(404).json( { mensaje: `El id ${id} no se encuentra.`})
    
})


app.listen(PORT,()=>{
    console.log(`Aplicacion lista escuchando en ${PORT}`)
})
