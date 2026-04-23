import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ArrowUpRight,
  Banknote,
  Calendar,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function SvgSlider() {
  const categories = [
    "Big Brands",
    "Work From Home",
    "Part-time",
    "MBA",
    "Engineering",
    "Media",
    "Design",
    "Data Science",
  ];
  // const internships = [
  //   {
  //     _id: "1",
  //     title: "Software Engineering Intern",
  //     company: "Google",
  //     location: "Remote",
  //     stipend: "$1,500/month",
  //     duration: "3 months",
  //     category: "Engineering",
  //   },
  //   {
  //     _id: "2",
  //     title: "Marketing Intern",
  //     company: "Meta",
  //     location: "New York",
  //     stipend: "$1,200/month",
  //     duration: "6 months",
  //     category: "Media",
  //   },
  //   {
  //     _id: "3",
  //     title: "Graphic Design Intern",
  //     company: "Adobe",
  //     location: "San Francisco",
  //     stipend: "$1,000/month",
  //     duration: "4 months",
  //     category: "Design",
  //   },
  // ];

  // const jobs = [
  //   {
  //     _id: "101",
  //     title: "Frontend Developer",
  //     company: "Amazon",
  //     location: "Seattle",
  //     CTC: "$100K/year",
  //     Experience: "2+ years",
  //     category: "Engineering",
  //   },
  //   {
  //     _id: "102",
  //     title: "Data Analyst",
  //     company: "Microsoft",
  //     location: "Remote",
  //     CTC: "$90K/year",
  //     Experience: "1+ years",
  //     category: "Data Science",
  //   },
  //   {
  //     _id: "103",
  //     title: "UX Designer",
  //     company: "Apple",
  //     location: "California",
  //     CTC: "$110K/year",
  //     Experience: "3+ years",
  //     category: "Design",
  //   },
  // ];
  const slides = [
    {
      pattern: "pattern-1",
      title: "Start Your Career Journey",
      bgColor: "bg-indigo-600",
    },
    {
      pattern: "pattern-2",
      title: "Learn From The Best",
      bgColor: "bg-blue-600",
    },
    {
      pattern: "pattern-3",
      title: "Grow Your Skills",
      bgColor: "bg-purple-600",
    },
    {
      pattern: "pattern-4",
      title: "Connect With Top Companies",
      bgColor: "bg-teal-600",
    },
  ];

  const stats = [
    { number: "300K+", label: "companies hiring" },
    { number: "10K+", label: "new openings everyday" },
    { number: "21Mn+", label: "active students" },
    { number: "600K+", label: "learners" },
  ];
  const [internships, setinternship] = useState<any>([]);
  const [jobs, setjob] = useState<any>([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const [internshipres, jobres] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/internship`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/job`),
        ]);
        setinternship(internshipres.data);
        setjob(jobres.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);
  const [selectedCategory, setSelectedCategory] = useState("");
  const filteredInternships = internships.filter(
    (item: any) => !selectedCategory || item.category === selectedCategory
  );
  const filteredJobs = jobs.filter(
    (item: any) => !selectedCategory || item.category === selectedCategory
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* hero section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Make your dream career a reality
        </h1>
        <p className="text-xl text-gray-600">Trending on InternArea 🔥</p>
      </div>
      {/* Swiper section */}
      <div className="mb-16">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="rounded-xl overflow-hidden shadow-lg"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={`relative h-[400px] ${slide.bgColor}`}>
                {/* SVG Pattern Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {slide.pattern === "pattern-1" && (
                      <pattern id="pattern-1" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <g transform="translate(18, 18)" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                        </g>
                      </pattern>
                    )}
                    {slide.pattern === "pattern-2" && (
                      <pattern id="pattern-2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <g transform="translate(18, 18)" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </g>
                      </pattern>
                    )}
                    {slide.pattern === "pattern-3" && (
                      <pattern id="pattern-3" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <g transform="translate(18, 18)" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                        </g>
                      </pattern>
                    )}
                    {slide.pattern === "pattern-4" && (
                      <pattern id="pattern-4" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <g transform="translate(18, 18)" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </g>
                      </pattern>
                    )}
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill={`url(#${slide.pattern})`}
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-4xl font-bold text-white">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Category section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Latest internships on Intern Area
        </h2>
        <div className="flex flex-wrap gap-4">
          <span className="text-gray-700 font-medium">POPULAR CATEGORIES:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {/* INternship grid   */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredInternships.map((internship: any, index: any) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105"
          >
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <ArrowUpRight size={20} />
              <span className="font-medium">Actively Hiring</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {internship.title}
            </h3>
            <p className="text-gray-500 mb-4">{internship.company}</p>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{internship.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote size={18} />
                <span>{internship.stipend}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{internship.duration}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                Internship
              </span>
              <Link
                href={`/detailinternship/${internship._id}`}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View details
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Jobs grid   */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredJobs.map((job: any, index: any) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <ArrowUpRight size={20} />
                <span className="font-medium">Actively Hiring</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {job.title}
              </h3>
              <p className="text-gray-500 mb-4">{job.company}</p>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote size={18} />
                  <span>{job.CTC}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{job.Experience}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Jobs
                </span>
                <Link
                  href={`/detailjob/${job._id}`}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View details
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Stat Section  */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}