import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import seedProducts from '../data/productsSeed.js';

const router = express.Router();

// Memory store for products when MongoDB is offline
let memoryProducts = [...seedProducts];

// @desc    Get all products with filtering, search, and sorting
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, purity, search, sort, featured } = req.query;
    let productsList = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = {};
        if (category && category !== 'All') query.category = category;
        if (purity && purity !== 'All') query.purity = purity;
        if (featured === 'true') query.featured = true;
        if (search) query.name = { $regex: search, $options: 'i' };

        let sortOptions = {};
        if (sort === 'price_asc') sortOptions = { weightGrams: 1 };
        if (sort === 'price_desc') sortOptions = { weightGrams: -1 };
        if (sort === 'rating') sortOptions = { ratings: -1 };
        if (sort === 'newest') sortOptions = { createdAt: -1 };

        productsList = await Product.find(query).sort(sortOptions);
      } catch (err) {
        console.warn('[DB Find Error]:', err.message);
      }
    }

    if (!productsList || productsList.length === 0) {
      productsList = [...memoryProducts];

      if (category && category !== 'All') {
        productsList = productsList.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (purity && purity !== 'All') {
        productsList = productsList.filter((p) => p.purity === purity);
      }

      if (featured === 'true') {
        productsList = productsList.filter((p) => p.featured === true);
      }

      if (search) {
        const q = search.toLowerCase();
        productsList = productsList.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }

      if (sort === 'price_asc') productsList.sort((a, b) => a.weightGrams - b.weightGrams);
      if (sort === 'price_desc') productsList.sort((a, b) => b.weightGrams - a.weightGrams);
      if (sort === 'rating') productsList.sort((a, b) => b.ratings - a.ratings);
    }

    return res.json(productsList);
  } catch (error) {
    console.error('[ProductRoute] Error fetching products:', error);
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
      return res.status(404).json({ message: 'Product not found' });
    } else {
      const product = memoryProducts.find((p) => p._id.toString() === req.params.id);
      if (product) return res.json(product);
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

// @desc    Upload product image to Cloudinary
// @route   POST /api/products/upload-image
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please attach an image file' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'goldmart_products');
    res.status(200).json({
      message: 'Image uploaded successfully to Cloudinary',
      imageUrl: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('[CloudinaryUpload] Error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// @desc    Create a new jewellery product (Admin/Seller)
// @route   POST /api/products
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, purity, weightGrams, makingChargePerGram, description, images, stockQuantity } = req.body;

    if (!name || !category || !purity || !weightGrams) {
      return res.status(400).json({ message: 'Missing required product fields (name, category, purity, weightGrams)' });
    }

    const newProductData = {
      name,
      category,
      purity,
      weightGrams: Number(weightGrams),
      makingChargePerGram: Number(makingChargePerGram) || 450,
      description: description || 'Handcrafted BIS Hallmarked Jewellery.',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'],
      inStock: stockQuantity > 0,
      stockQuantity: Number(stockQuantity) || 10,
      ratings: 5.0,
      numReviews: 0,
      reviews: []
    };

    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(newProductData);
      return res.status(201).json(product);
    } else {
      const mockCreated = {
        _id: `prod_${Date.now()}`,
        ...newProductData,
        createdAt: new Date().toISOString()
      };
      memoryProducts.unshift(mockCreated);
      return res.status(201).json(mockCreated);
    }
  } catch (error) {
    console.error('[ProductRoute] Create error:', error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updatedProduct) return res.json(updatedProduct);
      return res.status(404).json({ message: 'Product not found' });
    } else {
      const index = memoryProducts.findIndex((p) => p._id.toString() === req.params.id);
      if (index !== -1) {
        memoryProducts[index] = { ...memoryProducts[index], ...req.body };
        return res.json(memoryProducts[index]);
      }
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Product.findByIdAndDelete(req.params.id);
    } else {
      memoryProducts = memoryProducts.filter((p) => p._id.toString() !== req.params.id);
    }
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
