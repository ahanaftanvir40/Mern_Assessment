import express from 'express';
import Animal from '../models/AnimalModel.js';
import { upload } from '../config/multer.js';

const router = express.Router();





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


        const newAnimal = new Animal({ name, imageUrl, category });
        await newAnimal.save();

        res.status(201).json(newAnimal);
    } catch (error) {
        res.status(500).json({ message: 'Error adding animal', error });
    }
});

export default router
