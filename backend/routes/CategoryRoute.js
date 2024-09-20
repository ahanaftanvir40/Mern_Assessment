import express from 'express';
import Category from '../models/CategoryModel.js';


const router = express.Router();

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});


router.post('/addCategory', async (req, res) => {
    try {
        const { name } = req.body;

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error });
    }
});

export default router;