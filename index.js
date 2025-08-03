// Robust Backend for FurnitureX

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Helper: Read products from JSON file
function readProducts() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper: Write products to JSON file
function writeProducts(products) {
    fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products, null, 2));
}

// GET all products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// GET single product by ID
app.get('/api/products/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Produk tidak ditemukan.' });
    }
});

// CREATE new product
app.post('/api/products', (req, res) => {
    const products = readProducts();
    const { name, description, price, imageUrl } = req.body;
    if (!name || !description || !price || !imageUrl) {
        return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        name, description, price, imageUrl
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// UPDATE product
app.put('/api/products/:id', (req, res) => {
    const products = readProducts();
    const idx = products.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    const { name, description, price, imageUrl } = req.body;
    if (!name || !description || !price || !imageUrl) {
        return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }
    products[idx] = { id: products[idx].id, name, description, price, imageUrl };
    writeProducts(products);
    res.json(products[idx]);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
    let products = readProducts();
    const idx = products.findIndex(p => p.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Produk tidak ditemukan.' });
    const deleted = products.splice(idx, 1)[0];
    writeProducts(products);
    res.json(deleted);
});

// Start server
app.listen(port, () => {
    console.log(`Server FurnitureX berjalan di http://localhost:${port}`);
});