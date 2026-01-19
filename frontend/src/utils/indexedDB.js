// IndexedDB utility for product storage

const DB_NAME = 'FlipkartDB';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';

// Initialize IndexedDB
export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create products store if it doesn't exist
            if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
                const objectStore = db.createObjectStore(PRODUCTS_STORE, { keyPath: '_id' });
                objectStore.createIndex('category', 'category', { unique: false });
                objectStore.createIndex('price', 'price', { unique: false });
                objectStore.createIndex('ratings', 'ratings', { unique: false });
            }
        };
    });
};

// Get all products
export const getAllProducts = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readonly');
        const objectStore = transaction.objectStore(PRODUCTS_STORE);
        const request = objectStore.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Get product by ID
export const getProductById = async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readonly');
        const objectStore = transaction.objectStore(PRODUCTS_STORE);
        const request = objectStore.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Get products by category
export const getProductsByCategory = async (category) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readonly');
        const objectStore = transaction.objectStore(PRODUCTS_STORE);
        const index = objectStore.index('category');
        const request = index.getAll(category);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Search products by keyword
export const searchProducts = async (keyword, category = null, priceRange = [0, 200000], minRating = 0) => {
    const allProducts = await getAllProducts();

    return allProducts.filter(product => {
        const matchesKeyword = !keyword ||
            product.name.toLowerCase().includes(keyword.toLowerCase()) ||
            product.description.toLowerCase().includes(keyword.toLowerCase());

        const matchesCategory = !category || product.category === category;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesRating = product.ratings >= minRating;

        return matchesKeyword && matchesCategory && matchesPrice && matchesRating;
    });
};

// Add product (for admin)
export const addProduct = async (product) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(PRODUCTS_STORE);
        const request = objectStore.add(product);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Update product (for admin)
export const updateProduct = async (product) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(PRODUCTS_STORE);
        const request = objectStore.put(product);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Delete product (for admin)
export const deleteProduct = async (id) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
        const objectStore = transaction.objectStore(PRODUCTS_STORE);
        const request = objectStore.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
};

// Seed initial products
export const seedProducts = async () => {
    const existing = await getAllProducts();
    if (existing.length > 0) {
        console.log('Products already seeded');
        return;
    }

    const products = [
        {
            _id: '1',
            name: "Sony WH-1000XM4 Wireless Headphones",
            description: "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI.",
            highlights: ["30 hours battery life", "Touch Sensor controls", "Speak-to-chat technology"],
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
            ratings: 4.5,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '2',
            name: "Canon EOS 1500D DSLR Camera",
            description: "24.1 MP CMOS Sensor, DIGIC 4+ Image Processor, Full HD video recording",
            highlights: ["24.1 MP sensor", "Full HD video", "Built-in WiFi"],
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
            ratings: 4.3,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '3',
            name: "Samsung 43 inch 4K Smart TV",
            description: "Crystal Processor 4K, HDR, Smart TV powered by Tizen",
            highlights: ["Crystal 4K processor", "HDR support", "Smart TV features"],
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
            ratings: 4.4,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '4',
            name: "Apple iPhone 13 (128GB)",
            description: "6.1-inch Super Retina XDR display, A15 Bionic chip, Advanced dual-camera system",
            highlights: ["A15 Bionic chip", "Dual 12MP camera", "5G capable"],
            specifications: [
                { title: "Display", description: "6.1-inch Super Retina XDR" },
                { title: "Storage", description: "128GB" }
            ],
            price: 59900,
            cuttedPrice: 79900,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61VuVU94RnL._SL1500_.jpg" }],
            brand: { name: "Apple", logo: { public_id: "apple_logo", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" } },
            category: "Mobiles",
            stock: 40,
            warranty: 1,
            ratings: 4.6,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '5',
            name: "Samsung Galaxy S21 FE 5G",
            description: "6.4-inch Dynamic AMOLED 2X display, Triple camera setup",
            highlights: ["120Hz display", "Triple camera", "5G ready"],
            specifications: [
                { title: "Display", description: "6.4-inch FHD+" },
                { title: "RAM", description: "8GB" }
            ],
            price: 39999,
            cuttedPrice: 54999,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/81M1WqJJTsL._SL1500_.jpg" }],
            brand: { name: "Samsung", logo: { public_id: "samsung_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" } },
            category: "Mobiles",
            stock: 60,
            warranty: 1,
            ratings: 4.4,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '6',
            name: "Apple MacBook Air M1",
            description: "13.3-inch Retina display, Apple M1 chip, 8GB RAM, 256GB SSD",
            highlights: ["M1 chip", "18 hours battery", "Fanless design"],
            specifications: [
                { title: "Processor", description: "Apple M1" },
                { title: "RAM", description: "8GB" }
            ],
            price: 84990,
            cuttedPrice: 92900,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg" }],
            brand: { name: "Apple", logo: { public_id: "apple_logo", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" } },
            category: "Laptops",
            stock: 25,
            warranty: 1,
            ratings: 4.8,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '7',
            name: "Dell XPS 13 (11th Gen)",
            description: "13.4-inch FHD+ display, Intel Core i5-1135G7, 8GB RAM",
            highlights: ["InfinityEdge display", "11th Gen Intel", "Premium design"],
            specifications: [
                { title: "Processor", description: "Intel Core i5-1135G7" },
                { title: "Storage", description: "512GB SSD" }
            ],
            price: 89990,
            cuttedPrice: 109990,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71WLrBbJDrL._SL1500_.jpg" }],
            brand: { name: "Dell", logo: { public_id: "dell_logo", url: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" } },
            category: "Laptops",
            stock: 20,
            warranty: 1,
            ratings: 4.6,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '8',
            name: "Levi's Men's Regular Fit Jeans",
            description: "Classic 5-pocket styling, Regular fit, 100% Cotton denim",
            highlights: ["Regular fit", "100% Cotton", "Classic design"],
            specifications: [
                { title: "Material", description: "100% Cotton" },
                { title: "Fit", description: "Regular" }
            ],
            price: 1799,
            cuttedPrice: 2999,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71h3EqOXJOL._UY741_.jpg" }],
            brand: { name: "Levi's", logo: { public_id: "levis_logo", url: "https://upload.wikimedia.org/wikipedia/commons/5/59/Levi%27s_logo.svg" } },
            category: "Fashion",
            stock: 100,
            warranty: 0,
            ratings: 4.3,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '9',
            name: "Nike Men's Running Shoes",
            description: "Breathable mesh upper, Cushioned midsole, Lightweight design",
            highlights: ["Breathable mesh", "Cushioned sole", "Lightweight"],
            specifications: [
                { title: "Upper", description: "Mesh" },
                { title: "Sole", description: "Rubber" }
            ],
            price: 3495,
            cuttedPrice: 5995,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/51MXpwXPl7L._UY625_.jpg" }],
            brand: { name: "Nike", logo: { public_id: "nike_logo", url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" } },
            category: "Fashion",
            stock: 80,
            warranty: 0,
            ratings: 4.5,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '10',
            name: "LG Washing Machine 6.5 Kg",
            description: "Fully automatic top load, Smart Inverter Technology",
            highlights: ["Smart Inverter", "6 wash programs", "Auto restart"],
            specifications: [
                { title: "Capacity", description: "6.5 kg" },
                { title: "Type", description: "Fully Automatic Top Load" }
            ],
            price: 15990,
            cuttedPrice: 21990,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71vXF1q0MqL._SL1500_.jpg" }],
            brand: { name: "LG", logo: { public_id: "lg_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg" } },
            category: "Appliances",
            stock: 20,
            warranty: 2,
            ratings: 4.3,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '11',
            name: "Samsung Refrigerator 253L",
            description: "Frost free double door, Digital Inverter Technology",
            highlights: ["Digital Inverter", "Stabilizer free", "Energy efficient"],
            specifications: [
                { title: "Capacity", description: "253 L" },
                { title: "Type", description: "Frost Free Double Door" }
            ],
            price: 22990,
            cuttedPrice: 32900,
            images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71ItELdoRiL._SL1500_.jpg" }],
            brand: { name: "Samsung", logo: { public_id: "samsung_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" } },
            category: "Appliances",
            stock: 15,
            warranty: 1,
            ratings: 4.4,
            numOfReviews: 0,
            reviews: []
        },
        {
            _id: '12',
            name: "IKEA POÄNG Armchair",
            description: "Layer-glued bent birch frame, High resilience foam cushion",
            highlights: ["Ergonomic design", "Durable frame", "Washable cover"],
            specifications: [
                { title: "Material", description: "Birch veneer, Foam" },
                { title: "Dimensions", description: "68x82x100 cm" }
            ],
            price: 6999,
            cuttedPrice: 9999,
            images: [{ public_id: "sample", url: "https://www.ikea.com/in/en/images/products/poaeng-armchair-birch-veneer-knisa-black__0239449_pe378721_s5.jpg" }],
            brand: { name: "IKEA", logo: { public_id: "ikea_logo", url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg" } },
            category: "Home",
            stock: 25,
            warranty: 1,
            ratings: 4.6,
            numOfReviews: 0,
            reviews: []
        }
    ];

    const db = await initDB();
    const transaction = db.transaction([PRODUCTS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(PRODUCTS_STORE);

    for (const product of products) {
        objectStore.add(product);
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            console.log('Products seeded successfully');
            resolve(true);
        };
        transaction.onerror = () => reject(transaction.error);
    });
};
