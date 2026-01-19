const mongoose = require('mongoose');
const Product = require('./models/productModel');
const User = require('./models/userModel');
require('dotenv').config({ path: 'backend/config/config.env' });

const MONGO_URI = process.env.MONGO_URI;

// Sample products data
const products = [
    // Electronics
    {
        name: "Sony WH-1000XM4 Wireless Headphones",
        description: "Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with Edge-AI, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charging (10 min charge for 5 hours of playback).",
        highlights: ["30 hours battery life", "Touch Sensor controls", "Speak-to-chat technology", "Superior call quality"],
        specifications: [
            { title: "Battery Life", description: "30 hours" },
            { title: "Connectivity", description: "Bluetooth 5.0" },
            { title: "Weight", description: "254g" }
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
        description: "24.1 MP CMOS Sensor, DIGIC 4+ Image Processor, Full HD video recording, Built-in Wi-Fi and NFC",
        highlights: ["24.1 MP sensor", "Full HD video", "Built-in WiFi", "18-55mm lens included"],
        specifications: [
            { title: "Sensor", description: "24.1 MP APS-C CMOS" },
            { title: "ISO Range", description: "100-6400" },
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
        name: "Samsung 43 inch Crystal 4K UHD Smart TV",
        description: "Crystal Processor 4K, HDR, Smart TV powered by Tizen, Screen mirroring, 3 HDMI ports",
        highlights: ["Crystal 4K processor", "HDR support", "Smart TV features", "Screen mirroring"],
        specifications: [
            { title: "Screen Size", description: "43 inches" },
            { title: "Resolution", description: "3840 x 2160" },
            { title: "Refresh Rate", description: "60 Hz" }
        ],
        price: 32990,
        cuttedPrice: 47900,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/81fLJr+YXML._SL1500_.jpg" }],
        brand: { name: "Samsung", logo: { public_id: "samsung_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" } },
        category: "Electronics",
        stock: 25,
        warranty: 1,
        ratings: 4.4
    },
    {
        name: "JBL Flip 5 Portable Bluetooth Speaker",
        description: "Wireless Bluetooth streaming, 12 hours of playtime, IPX7 waterproof, PartyBoost feature",
        highlights: ["12 hours playtime", "IPX7 waterproof", "Wireless Bluetooth", "Bold JBL sound"],
        specifications: [
            { title: "Battery", description: "4800mAh" },
            { title: "Bluetooth", description: "Version 4.2" },
            { title: "Weight", description: "540g" }
        ],
        price: 8999,
        cuttedPrice: 11999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71eWNxbEubL._SL1500_.jpg" }],
        brand: { name: "JBL", logo: { public_id: "jbl_logo", url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/JBL_logo.svg" } },
        category: "Electronics",
        stock: 100,
        warranty: 1,
        ratings: 4.6
    },
    {
        name: "Logitech MX Master 3 Wireless Mouse",
        description: "Advanced ergonomic design, MagSpeed electromagnetic scrolling, Easy-Switch up to 3 devices, Rechargeable battery",
        highlights: ["Ergonomic design", "MagSpeed scroll wheel", "Multi-device connectivity", "70-day battery"],
        specifications: [
            { title: "Connectivity", description: "Bluetooth, USB receiver" },
            { title: "Battery", description: "Up to 70 days" },
            { title: "DPI", description: "4000 DPI" }
        ],
        price: 8995,
        cuttedPrice: 10995,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61ni3t1ryQL._SL1500_.jpg" }],
        brand: { name: "Logitech", logo: { public_id: "logitech_logo", url: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Logitech_logo.svg" } },
        category: "Electronics",
        stock: 75,
        warranty: 1,
        ratings: 4.7
    },

    // Mobiles
    {
        name: "Apple iPhone 13 (128GB) - Midnight",
        description: "6.1-inch Super Retina XDR display, A15 Bionic chip, Advanced dual-camera system, Cinematic mode, Up to 19 hours video playback",
        highlights: ["A15 Bionic chip", "Dual 12MP camera", "Ceramic Shield", "5G capable"],
        specifications: [
            { title: "Display", description: "6.1-inch Super Retina XDR" },
            { title: "Chip", description: "A15 Bionic" },
            { title: "Storage", description: "128GB" }
        ],
        price: 59900,
        cuttedPrice: 79900,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61VuVU94RnL._SL1500_.jpg" }],
        brand: { name: "Apple", logo: { public_id: "apple_logo", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" } },
        category: "Mobiles",
        stock: 40,
        warranty: 1,
        ratings: 4.6
    },
    {
        name: "Samsung Galaxy S21 FE 5G (128GB)",
        description: "6.4-inch Dynamic AMOLED 2X display, Exynos 2100, Triple camera setup, 4500mAh battery, 25W fast charging",
        highlights: ["120Hz display", "Triple camera", "5G ready", "All-day battery"],
        specifications: [
            { title: "Display", description: "6.4-inch FHD+" },
            { title: "Processor", description: "Exynos 2100" },
            { title: "RAM", description: "8GB" }
        ],
        price: 39999,
        cuttedPrice: 54999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/81M1WqJJTsL._SL1500_.jpg" }],
        brand: { name: "Samsung", logo: { public_id: "samsung_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" } },
        category: "Mobiles",
        stock: 60,
        warranty: 1,
        ratings: 4.4
    },
    {
        name: "OnePlus 9 Pro 5G (256GB)",
        description: "6.7-inch Fluid AMOLED display, Snapdragon 888, Hasselblad Camera, 65W Warp Charge, 4500mAh battery",
        highlights: ["Hasselblad camera", "120Hz display", "65W fast charging", "5G enabled"],
        specifications: [
            { title: "Display", description: "6.7-inch QHD+" },
            { title: "Processor", description: "Snapdragon 888" },
            { title: "RAM", description: "12GB" }
        ],
        price: 49999,
        cuttedPrice: 64999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71VQOTVh0BL._SL1500_.jpg" }],
        brand: { name: "OnePlus", logo: { public_id: "oneplus_logo", url: "https://upload.wikimedia.org/wikipedia/commons/0/0c/OnePlus_logo.svg" } },
        category: "Mobiles",
        stock: 35,
        warranty: 1,
        ratings: 4.5
    },
    {
        name: "Xiaomi 11T Pro 5G (256GB)",
        description: "6.67-inch AMOLED display, Snapdragon 888, 108MP triple camera, 120W HyperCharge, 5000mAh battery",
        highlights: ["108MP camera", "120W charging", "Dolby Atmos", "5G ready"],
        specifications: [
            { title: "Display", description: "6.67-inch FHD+" },
            { title: "Processor", description: "Snapdragon 888" },
            { title: "Battery", description: "5000mAh" }
        ],
        price: 35999,
        cuttedPrice: 45999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71AvQd3VzqL._SL1500_.jpg" }],
        brand: { name: "Xiaomi", logo: { public_id: "xiaomi_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" } },
        category: "Mobiles",
        stock: 50,
        warranty: 1,
        ratings: 4.3
    },
    {
        name: "Google Pixel 6 (128GB)",
        description: "6.4-inch OLED display, Google Tensor chip, 50MP dual camera, Magic Eraser, 5 years of security updates",
        highlights: ["Google Tensor chip", "Magic Eraser", "Live Translate", "Material You design"],
        specifications: [
            { title: "Display", description: "6.4-inch FHD+" },
            { title: "Processor", description: "Google Tensor" },
            { title: "Camera", description: "50MP + 12MP" }
        ],
        price: 43999,
        cuttedPrice: 59999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71FuI8YvCNL._SL1500_.jpg" }],
        brand: { name: "Google", logo: { public_id: "google_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" } },
        category: "Mobiles",
        stock: 30,
        warranty: 1,
        ratings: 4.5
    },

    // Laptops
    {
        name: "Apple MacBook Air M1 (256GB)",
        description: "13.3-inch Retina display, Apple M1 chip, 8GB RAM, 256GB SSD, Up to 18 hours battery life, macOS",
        highlights: ["M1 chip", "18 hours battery", "Fanless design", "Touch ID"],
        specifications: [
            { title: "Processor", description: "Apple M1" },
            { title: "RAM", description: "8GB" },
            { title: "Storage", description: "256GB SSD" }
        ],
        price: 84990,
        cuttedPrice: 92900,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg" }],
        brand: { name: "Apple", logo: { public_id: "apple_logo", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" } },
        category: "Laptops",
        stock: 25,
        warranty: 1,
        ratings: 4.8
    },
    {
        name: "Dell XPS 13 (11th Gen Intel)",
        description: "13.4-inch FHD+ display, Intel Core i5-1135G7, 8GB RAM, 512GB SSD, Windows 11, Premium build",
        highlights: ["InfinityEdge display", "11th Gen Intel", "Premium design", "Long battery life"],
        specifications: [
            { title: "Processor", description: "Intel Core i5-1135G7" },
            { title: "RAM", description: "8GB" },
            { title: "Storage", description: "512GB SSD" }
        ],
        price: 89990,
        cuttedPrice: 109990,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71WLrBbJDrL._SL1500_.jpg" }],
        brand: { name: "Dell", logo: { public_id: "dell_logo", url: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" } },
        category: "Laptops",
        stock: 20,
        warranty: 1,
        ratings: 4.6
    },
    {
        name: "HP Pavilion Gaming Laptop",
        description: "15.6-inch FHD display, AMD Ryzen 5 5600H, NVIDIA GTX 1650, 8GB RAM, 512GB SSD, Windows 11",
        highlights: ["GTX 1650 graphics", "144Hz display", "Dual fan cooling", "Backlit keyboard"],
        specifications: [
            { title: "Processor", description: "AMD Ryzen 5 5600H" },
            { title: "Graphics", description: "NVIDIA GTX 1650" },
            { title: "RAM", description: "8GB DDR4" }
        ],
        price: 59990,
        cuttedPrice: 74990,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71RxUmKhcwL._SL1500_.jpg" }],
        brand: { name: "HP", logo: { public_id: "hp_logo", url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg" } },
        category: "Laptops",
        stock: 35,
        warranty: 1,
        ratings: 4.4
    },
    {
        name: "Lenovo IdeaPad Slim 3",
        description: "15.6-inch FHD display, Intel Core i3-1115G4, 8GB RAM, 256GB SSD, Windows 11, Lightweight design",
        highlights: ["Slim design", "FHD display", "Fast SSD", "Dolby Audio"],
        specifications: [
            { title: "Processor", description: "Intel Core i3-1115G4" },
            { title: "RAM", description: "8GB" },
            { title: "Weight", description: "1.65 kg" }
        ],
        price: 34990,
        cuttedPrice: 49990,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61+r3+yJBQL._SL1000_.jpg" }],
        brand: { name: "Lenovo", logo: { public_id: "lenovo_logo", url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg" } },
        category: "Laptops",
        stock: 45,
        warranty: 1,
        ratings: 4.2
    },
    {
        name: "ASUS VivoBook 15",
        description: "15.6-inch FHD display, AMD Ryzen 7 5700U, 8GB RAM, 512GB SSD, Windows 11, Fingerprint sensor",
        highlights: ["Ryzen 7 processor", "Fingerprint sensor", "Backlit keyboard", "Thin and light"],
        specifications: [
            { title: "Processor", description: "AMD Ryzen 7 5700U" },
            { title: "RAM", description: "8GB" },
            { title: "Storage", description: "512GB SSD" }
        ],
        price: 52990,
        cuttedPrice: 69990,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71vvXGmdKWL._SL1500_.jpg" }],
        brand: { name: "ASUS", logo: { public_id: "asus_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg" } },
        category: "Laptops",
        stock: 30,
        warranty: 1,
        ratings: 4.3
    },

    // Fashion
    {
        name: "Levi's Men's Regular Fit Jeans",
        description: "Classic 5-pocket styling, Regular fit, Button fly, 100% Cotton denim",
        highlights: ["Regular fit", "100% Cotton", "Classic design", "Durable denim"],
        specifications: [
            { title: "Material", description: "100% Cotton" },
            { title: "Fit", description: "Regular" },
            { title: "Care", description: "Machine wash" }
        ],
        price: 1799,
        cuttedPrice: 2999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71h3EqOXJOL._UY741_.jpg" }],
        brand: { name: "Levi's", logo: { public_id: "levis_logo", url: "https://upload.wikimedia.org/wikipedia/commons/5/59/Levi%27s_logo.svg" } },
        category: "Fashion",
        stock: 100,
        warranty: 0,
        ratings: 4.3
    },
    {
        name: "Nike Men's Running Shoes",
        description: "Breathable mesh upper, Cushioned midsole, Rubber outsole for traction, Lightweight design",
        highlights: ["Breathable mesh", "Cushioned sole", "Lightweight", "Durable rubber outsole"],
        specifications: [
            { title: "Upper", description: "Mesh" },
            { title: "Sole", description: "Rubber" },
            { title: "Closure", description: "Lace-up" }
        ],
        price: 3495,
        cuttedPrice: 5995,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/51MXpwXPl7L._UY625_.jpg" }],
        brand: { name: "Nike", logo: { public_id: "nike_logo", url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" } },
        category: "Fashion",
        stock: 80,
        warranty: 0,
        ratings: 4.5
    },
    {
        name: "Adidas Men's T-Shirt",
        description: "Regular fit, Soft cotton fabric, Ribbed crew neck, Iconic 3-Stripes on sleeves",
        highlights: ["100% Cotton", "Regular fit", "3-Stripes design", "Comfortable"],
        specifications: [
            { title: "Material", description: "100% Cotton" },
            { title: "Fit", description: "Regular" },
            { title: "Neck", description: "Crew neck" }
        ],
        price: 999,
        cuttedPrice: 1599,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61V3p+LQVQL._UY741_.jpg" }],
        brand: { name: "Adidas", logo: { public_id: "adidas_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" } },
        category: "Fashion",
        stock: 120,
        warranty: 0,
        ratings: 4.4
    },
    {
        name: "Puma Women's Sneakers",
        description: "Stylish design, Comfortable fit, Durable rubber sole, Lace-up closure",
        highlights: ["Stylish design", "Comfortable", "Durable sole", "Versatile"],
        specifications: [
            { title: "Upper", description: "Synthetic" },
            { title: "Sole", description: "Rubber" },
            { title: "Closure", description: "Lace-up" }
        ],
        price: 2799,
        cuttedPrice: 4999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61utX8kBDiL._UY695_.jpg" }],
        brand: { name: "Puma", logo: { public_id: "puma_logo", url: "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg" } },
        category: "Fashion",
        stock: 60,
        warranty: 0,
        ratings: 4.2
    },
    {
        name: "H&M Women's Casual Dress",
        description: "Flowy design, Soft fabric, V-neck, Short sleeves, Perfect for casual outings",
        highlights: ["Flowy design", "Soft fabric", "V-neck", "Casual wear"],
        specifications: [
            { title: "Material", description: "Polyester blend" },
            { title: "Fit", description: "Regular" },
            { title: "Length", description: "Knee-length" }
        ],
        price: 1499,
        cuttedPrice: 2499,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61+r3+yJBQL._UY741_.jpg" }],
        brand: { name: "H&M", logo: { public_id: "hm_logo", url: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" } },
        category: "Fashion",
        stock: 70,
        warranty: 0,
        ratings: 4.1
    },

    // Appliances
    {
        name: "LG 6.5 Kg Fully Automatic Washing Machine",
        description: "Fully automatic top load, Smart Inverter Technology, 6 wash programs, Stainless steel drum",
        highlights: ["Smart Inverter", "6 wash programs", "Auto restart", "Rat protection"],
        specifications: [
            { title: "Capacity", description: "6.5 kg" },
            { title: "Type", description: "Fully Automatic Top Load" },
            { title: "Warranty", description: "2 years" }
        ],
        price: 15990,
        cuttedPrice: 21990,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71vXF1q0MqL._SL1500_.jpg" }],
        brand: { name: "LG", logo: { public_id: "lg_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg" } },
        category: "Appliances",
        stock: 20,
        warranty: 2,
        ratings: 4.3
    },
    {
        name: "Samsung 253L Frost Free Refrigerator",
        description: "Frost free double door, Digital Inverter Technology, Stabilizer free operation, Convertible freezer",
        highlights: ["Digital Inverter", "Stabilizer free", "Convertible", "Energy efficient"],
        specifications: [
            { title: "Capacity", description: "253 L" },
            { title: "Type", description: "Frost Free Double Door" },
            { title: "Star Rating", description: "3 Star" }
        ],
        price: 22990,
        cuttedPrice: 32900,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/71ItELdoRiL._SL1500_.jpg" }],
        brand: { name: "Samsung", logo: { public_id: "samsung_logo", url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" } },
        category: "Appliances",
        stock: 15,
        warranty: 1,
        ratings: 4.4
    },
    {
        name: "Philips Air Fryer HD9252/90",
        description: "Rapid Air Technology, 4.1L capacity, Digital touch panel, 7 pre-set menus, Dishwasher safe parts",
        highlights: ["Rapid Air Technology", "4.1L capacity", "7 pre-sets", "Easy to clean"],
        specifications: [
            { title: "Capacity", description: "4.1 L" },
            { title: "Power", description: "1400 W" },
            { title: "Temperature", description: "Up to 200°C" }
        ],
        price: 9995,
        cuttedPrice: 14995,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61RRr4K7PHL._SL1500_.jpg" }],
        brand: { name: "Philips", logo: { public_id: "philips_logo", url: "https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg" } },
        category: "Appliances",
        stock: 40,
        warranty: 2,
        ratings: 4.5
    },
    {
        name: "Bajaj Majesty 1603 TSS Kettle",
        description: "1.5L capacity, 1500W power, Stainless steel body, Auto shut-off, Boil dry protection",
        highlights: ["1.5L capacity", "Auto shut-off", "Stainless steel", "Fast boiling"],
        specifications: [
            { title: "Capacity", description: "1.5 L" },
            { title: "Power", description: "1500 W" },
            { title: "Material", description: "Stainless Steel" }
        ],
        price: 899,
        cuttedPrice: 1495,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/61wkP6s+AFL._SL1500_.jpg" }],
        brand: { name: "Bajaj", logo: { public_id: "bajaj_logo", url: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Bajaj_Electricals_Logo.svg" } },
        category: "Appliances",
        stock: 80,
        warranty: 2,
        ratings: 4.2
    },

    // Home
    {
        name: "IKEA POÄNG Armchair",
        description: "Layer-glued bent birch frame, High resilience foam cushion, Removable and washable cover",
        highlights: ["Ergonomic design", "Durable frame", "Washable cover", "Comfortable"],
        specifications: [
            { title: "Material", description: "Birch veneer, Foam" },
            { title: "Dimensions", description: "68x82x100 cm" },
            { title: "Weight", description: "10 kg" }
        ],
        price: 6999,
        cuttedPrice: 9999,
        images: [{ public_id: "sample", url: "https://www.ikea.com/in/en/images/products/poaeng-armchair-birch-veneer-knisa-black__0239449_pe378721_s5.jpg" }],
        brand: { name: "IKEA", logo: { public_id: "ikea_logo", url: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg" } },
        category: "Home",
        stock: 25,
        warranty: 1,
        ratings: 4.6
    },
    {
        name: "Solimo 4-Seater Dining Table Set",
        description: "Engineered wood construction, Scratch resistant, Easy to assemble, Modern design",
        highlights: ["4-seater", "Scratch resistant", "Easy assembly", "Modern design"],
        specifications: [
            { title: "Material", description: "Engineered Wood" },
            { title: "Seating Capacity", description: "4 persons" },
            { title: "Finish", description: "Matte" }
        ],
        price: 12999,
        cuttedPrice: 18999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/81kR3DP0JyL._SL1500_.jpg" }],
        brand: { name: "Solimo", logo: { public_id: "solimo_logo", url: "https://m.media-amazon.com/images/S/sash/McBZv0ZvnbehkIx.png" } },
        category: "Home",
        stock: 15,
        warranty: 1,
        ratings: 4.1
    },
    {
        name: "Urban Ladder Study Table",
        description: "Solid wood construction, Spacious desktop, Built-in storage, Cable management",
        highlights: ["Solid wood", "Built-in storage", "Cable management", "Sturdy build"],
        specifications: [
            { title: "Material", description: "Sheesham Wood" },
            { title: "Dimensions", description: "120x60x75 cm" },
            { title: "Finish", description: "Honey" }
        ],
        price: 14999,
        cuttedPrice: 24999,
        images: [{ public_id: "sample", url: "https://ii1.pepperfry.com/media/catalog/product/m/i/1100x1210/mintwud-study---laptop-table-in-provincial-teak-finish-by-woodsworth-mintwud-study---laptop-table-in-ew6ggj.jpg" }],
        brand: { name: "Urban Ladder", logo: { public_id: "ul_logo", url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Urban_Ladder_logo.png" } },
        category: "Home",
        stock: 20,
        warranty: 1,
        ratings: 4.4
    },
    {
        name: "Amazon Basics Microfiber Bedsheet Set",
        description: "Queen size, Microfiber fabric, Wrinkle and fade resistant, Includes 2 pillow covers",
        highlights: ["Microfiber", "Wrinkle resistant", "Soft and comfortable", "Easy care"],
        specifications: [
            { title: "Size", description: "Queen (228x254 cm)" },
            { title: "Material", description: "Microfiber" },
            { title: "Thread Count", description: "90 GSM" }
        ],
        price: 999,
        cuttedPrice: 1999,
        images: [{ public_id: "sample", url: "https://m.media-amazon.com/images/I/91Y0ZV7HFVL._SL1500_.jpg" }],
        brand: { name: "Amazon Basics", logo: { public_id: "ab_logo", url: "https://m.media-amazon.com/images/S/sash/McBZv0ZvnbehkIx.png" } },
        category: "Home",
        stock: 100,
        warranty: 0,
        ratings: 4.3
    }
];

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
    seedDatabase();
}).catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
});

async function seedDatabase() {
    try {
        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@flipkart.com',
            gender: 'male',
            password: 'admin123456',
            role: 'admin'
        });
        console.log('Admin user created');

        // Add user reference to all products
        const productsWithUser = products.map(product => ({
            ...product,
            user: adminUser._id
        }));

        // Insert products
        await Product.insertMany(productsWithUser);
        console.log(`${products.length} products seeded successfully`);

        console.log('\n✅ Database seeding completed!');
        console.log('\nAdmin Credentials:');
        console.log('Email: admin@flipkart.com');
        console.log('Password: admin123456');

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}
