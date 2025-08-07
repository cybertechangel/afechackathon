import express from "express";
import cors from 'cors'
import bodyParser from "body-parser";
import path from 'path'


import votesRoutes from './modules/votes/routes.js'
import commentsRoutes from './modules/comments/routes.js'
import ideasRoutes from './modules/ideas/routes.js';
import usersRoutes from './modules/users/routes.js';
import categoriesRoutes from './modules/categories/routes.js';


const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())




app.use('/api/comments', commentsRoutes)
app.use('/api/votes', votesRoutes)
app.use('/api/ideas', ideasRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);


app.use (bodyParser.urlencoded({ extended : true}))
app.use('/api/users', usersRoutes);




app.get('/', (req, res) => {
    res.send(path.join(path.resolve(), '../frontend/index.html'))
})

app.listen(PORT, () =>{
    console.log (`Server lancé sur http://localhost:${PORT}`)
})