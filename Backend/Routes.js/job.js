const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.post('/', async (req, res) => {
    const jobdata = new Job({
      title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    Experience: req.body.Experience,
    category: req.body.category,
    aboutCompany: req.body.aboutCompany,
    aboutJob: req.body.aboutJob,
    whoCanApply: req.body.whoCanApply,
    perks: req.body.perks,
    AdditionalInfo: req.body.AdditionalInfo,
    CTC: req.body.CTC,
    StartDate: req.body.StartDate,
  });
  await jobdata.save().then((data)=>{
    res.send(data)
  }).catch((error)=>{
    console.log(error)
  })
});

router.get("/", async (req, res) => {
try{
  const data = await Job.find();
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
  const data = await Job.findById(id);
  if(!data){
    return res.status(404).json({ message: "Job not found" });
  }
  res.json(data).status(200);
}
catch(error){
  console.log(error);
res.status(500).json({ message: "Server Error" });
}
});

module.exports = router;