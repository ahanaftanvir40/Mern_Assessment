import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto'
import Animal from '../models/AnimalModel.js';


const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(10, (err, bytes) => {
            const fn = bytes.toString('hex') + path.extname(file.originalname)
            cb(null, fn)
        })
    }
});

const upload = multer({ storage });


router.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.find().populate('category');
        res.json(animals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching animals', error });
    }
});


router.post('/addAnimal', upload.single('image'), async (req, res) => {
    try {
        const { name, category } = req.body;
        const imageUrl = req.file.filename;

        console.log('ADD ANIMAL LOG: ', name, category, imageUrl);

        const newAnimal = new Animal({ name, imageUrl, category });
        await newAnimal.save();

        res.status(201).json(newAnimal);
    } catch (error) {
        res.status(500).json({ message: 'Error adding animal', error });
    }
});

export default router
