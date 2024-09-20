import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path';
import { db } from './config/db.js'

import animalRoutes from './routes/AnimalRotue.js'
import categoryRoutes from './routes/CategoryRoute.js'

db()
dotenv.config()


const app = express()
const __dirname = path.resolve()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin: '*'
}))

const port = process.env.PORT || 5173

//Routes
app.use('/api', animalRoutes);
app.use('/api', categoryRoutes);


app.get('/', (req, res) => {
    res.send('Hello ji server')
})


app.listen(port, () => {
    console.log(`server is running on port ${port ? port : '5173'}`);
})