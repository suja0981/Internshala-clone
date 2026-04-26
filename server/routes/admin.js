const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminuser = process.env.ADMIN_USERNAME;
const adminpassword = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'intern_admin_secret_key_2024';

router.post("/adminlogin", (req, res) => {
    const { username, password } = req.body;
    if (username === adminuser && password === adminpassword) {
        const token = jwt.sign({ isAdmin: true, username }, JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ message: "Login successful", token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;