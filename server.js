const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Statik HTML va boshqa fayllarni uzatish
app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, 'database.json');

// Baza fayli bo'lmasa yaratish
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        v: 1,
        dest: [],
        food: [],
        stats: { views: {}, routes: {} }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// 1. Ma'lumotlarni o'qish (GET)
app.get('/api/data', (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: "Ma'lumotlarni o'qishda xatolik yuz berdi" });
    }
});

// 2. Ma'lumotlarni saqlash / yangilash (POST)
app.post('/api/data', (req, res) => {
    try {
        const newData = req.body;
        fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2));
        res.json({ success: true, message: "Ma'lumotlar saqlandi" });
    } catch (err) {
        res.status(500).json({ error: "Ma'lumotlarni saqlashda xatolik yuz berdi" });
    }
});

// Bosh sahifaga kirganda index.html ni ko'rsatish
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Portni sozlash (Render avtomatsiz port beradi)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ishlamoqda: http://localhost:${PORT}`);
});
