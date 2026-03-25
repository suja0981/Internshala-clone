const express = require("express");
const router = express.Router();
const application = require("../models/Application");

router.post("/", async (req, res) => {
  const applicationipdata = new application({
    company: req.body.company,
    category: req.body.category,
    coverLetter: req.body.coverLetter,
    user: req.body.user,
    Application: req.body.Application,
    body: req.body.body,
  });
  await applicationipdata
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/", async (req, res) => {
  try {
    const data = await application.find();
    res.status(200).json(data);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await application.findById(id);
    if (!data) {
      return res.status(404).json({ message: "application not found" });
    }
    res.status(200).json(data);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  let status
  if (action === "approved") {
    status = "approved"
  }
  else if (action === "rejected") {
    status = "rejected"
  }
  else {
    return res.status(400).json({ message: "Invalid action" });
  }
  try {
    const updatedApplication = await application.findByIdAndUpdate(id,
      { $set: { status } },
      { new: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "application not found" });
    }
    res.status(200).json({ success: true, message: `application ${status} successfully`, data: updatedApplication });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;