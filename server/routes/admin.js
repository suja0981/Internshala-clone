const express = require('express');
const router = express.Router();
const adminuser = process.env.ADMIN_USERNAME;
const adminpassword = process.env.ADMIN_PASSWORD;

router.post("/adminlogin", (req, res) => {
    const { username, password } = req.body;
    if (username === adminuser && password === adminpassword) {
        res.status(200).json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;