const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

router.post("/", async (req, res) => {
  const Internshipdata = new Internship({
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    category: req.body.category,
    aboutCompany: req.body.aboutCompany,
    aboutInternship: req.body.aboutInternship,
    whoCanApply: req.body.whoCanApply,
    perks: req.body.perks,
    numberOfOpening: req.body.numberOfOpening,
    stipend: req.body.stipend,
    startDate: req.body.startDate,
    additionalInfo: req.body.additionalInfo,
  });
  await Internshipdata.save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/", async (req, res) => {
try{
  const data = await Internship.find();
  res.json(data).status(200);
}
catch(error){
  console.log(error);
res.status(500).json({ message: "Server Error" });
}
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
try{
  const data = await Internship.findById(id);
  if(!data){
    return res.status(404).json({ message: "Internship not found" });
  }
  res.json(data).status(200);
}
catch(error){
  console.log(error);
res.status(500).json({ message: "Server Error" });
}
});
module.exports = router;