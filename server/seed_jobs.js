const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');

const jobs = [
    {
        title: "Senior Full Stack Engineer",
        company: "TechNova Solutions",
        location: "Bangalore, India",
        category: "Software Development",
        aboutCompany: "TechNova is a leading cloud-native application provider, transforming how enterprises operate on the web.",
        aboutJob: "We are looking for an experienced full-stack engineer to lead our core product team. You will be responsible for architecting scalable solutions using Next.js and Node.js.",
        whoCanApply: "Candidates with at least 4 years of experience in MERN stack. Must have strong understanding of system design.",
        perks: "Health Insurance, Remote Work Options, Flexible Hours, Stock Options.",
        numberOfOpening: 3,
        CTC: "₹24,00,000 - ₹30,00,000 LPA",
        startDate: "2024-06-01",
        AdditionalInfo: "Looking for immediate joiners."
    },
    {
        title: "Frontend Developer (React)",
        company: "PixelPerfect UI",
        location: "Pune, India (Hybrid)",
        category: "Software Development",
        aboutCompany: "We are a boutique design agency building beautiful, high-performance web applications for startups.",
        aboutJob: "Join our frontend team to bring stunning UI designs to life using React, TailwindCSS, and Framer Motion. You will work closely with the UX team.",
        whoCanApply: "Graduates with 1-2 years of experience. Must have a strong portfolio of React projects.",
        perks: "MacBook Pro, Learning Budget, 5-day work week.",
        numberOfOpening: 5,
        CTC: "₹8,00,000 - ₹12,00,000 LPA",
        startDate: "2024-05-15",
        AdditionalInfo: "Interviews will include a small take-home assignment."
    },
    {
        title: "Backend Engineer (Node.js)",
        company: "DataFlow Systems",
        location: "Hyderabad, India",
        category: "Backend Development",
        aboutCompany: "DataFlow Systems specializes in high-throughput data processing and analytics pipelines.",
        aboutJob: "You will build and maintain RESTful APIs, manage MongoDB clusters, and optimize queries for high performance. Experience with Redis caching is a plus.",
        whoCanApply: "B.Tech/MCA graduates with strong fundamentals in algorithms, data structures, and databases.",
        perks: "Free meals, Relocation Assistance, Annual Retreats.",
        numberOfOpening: 2,
        CTC: "₹15,00,000 - ₹20,00,000 LPA",
        startDate: "2024-07-01",
        AdditionalInfo: ""
    }
];

mongoose.connect(process.env.DATABASE_URL)
    .then(async () => {
        console.log("Connected to MongoDB. Seeding jobs...");
        await Job.insertMany(jobs);
        console.log("Successfully seeded demo software jobs!");
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });
