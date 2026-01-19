const Product = require('../models/productModel');
const User = require('../models/userModel');

// Split products into smaller chunks
const electronicsProducts = [
    {
        name: "Sony WH-1000XM4 Wireless Headphones",
        description: "Industry-leading noise canceling with Dual Noise Sensor technology.",
        highlights: ["30 hours battery life", "Touch Sensor controls"],
        specifications: [
            { title: "Battery Life", description: "30 hours" },
            { title: "Connectivity", description: "Bluetooth 5.0" }
        ],
        price: 24990,
        cuttedPrice: 29990,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._SL1500_.jpg" }],
        brand: { name: "Sony", logo: { public_id: "sony_logo", url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" } },
        category: "Electronics",
        stock: 50,
        warranty: 1,
        ratings: 4.5
    },
    {
        name: "Canon EOS 1500D DSLR Camera",
        description: "24.1 MP CMOS Sensor, Full HD video recording",
        highlights: ["24.1 MP sensor", "Full HD video"],
        specifications: [
            { title: "Sensor", description: "24.1 MP APS-C CMOS" },
            { title: "Video", description: "Full HD 1080p" }
        ],
        price: 31999,
        cuttedPrice: 36995,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71EWRyqzw0L._SL1500_.jpg" }],
        brand: { name: "Canon", logo: { public_id: "canon_logo", url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Canon_wordmark.svg" } },
        category: "Electronics",
        stock: 30,
        warranty: 1,
        ratings: 4.3
    },
    {
        name: "Samsung 43 inch 4K Smart TV",
        description: "Crystal Processor 4K, HDR, Smart TV",
        highlights: ["Crystal 4K processor", "HDR support"],
        specifications: [
            { title: "Screen Size", description: "43 inches" },
            { title: "Resolution", description: "3840 x 2160" }
        ],
        price: 32990,
        cuttedPrice: 47900,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/81fLJr+YXML._SL1500_.jpg" }],
        brand: { name: "Samsung", logo: { public_id: "samsung_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" } },
        category: "Electronics",
        stock: 25,
        warranty: 1,
        ratings: 4.4
    }
];

// Test connection and create admin
exports.seedAdmin = async (req, res) => {
    try {
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@flipkart.com',
            gender: 'male',
            password: 'admin123456',
            role: 'admin'
        }).catch(err => {
            if (err.code === 11000) {
                return User.findOne({ email: 'admin@flipkart.com' });
            }
            throw err;
        });

        res.status(200).json({
            success: true,
            message: 'Admin user created',
            adminId: adminUser._id,
            credentials: {
                email: 'admin@flipkart.com',
                password: 'admin123456'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create admin',
            error: error.message
        });
    }
};

// Seed small batch of products
exports.seedProducts = async (req, res) => {
    try {
        const adminUser = await User.findOne({ email: 'admin@flipkart.com' });

        if (!adminUser) {
            return res.status(400).json({
                success: false,
                message: 'Admin user not found. Call /api/v1/seed-admin first'
            });
        }

        const productsWithUser = electronicsProducts.map(product => ({
            ...product,
            user: adminUser._id
        }));

        const inserted = await Product.insertMany(productsWithUser, { ordered: false }).catch(err => {
            if (err.code === 11000) {
                return [];
            }
            throw err;
        });

        res.status(200).json({
            success: true,
            message: 'Products seeded',
            productsInserted: inserted.length || electronicsProducts.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to seed products',
            error: error.message
        });
    }
};

// Check database status
exports.checkDB = async (req, res) => {
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    res.status(200).json({
        database: states[dbState] || 'unknown',
        mongoUri: process.env.MONGO_URI ? 'configured' : 'missing',
        timestamp: new Date().toISOString()
    });
};
