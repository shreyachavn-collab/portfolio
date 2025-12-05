const mongoose = require('mongoose');

const PortfolioDataSchema = new mongoose.Schema({
  aboutData: {
    fullName: { type: String, default: 'Shreya Chavan' },
    title: { type: String, default: 'Data Science Enthusiast' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    photo: { type: String, default: '' }
  },
  educations: [{
    degree: String,
    institution: String,
    year: String,
    details: String
  }],
  experiences: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  projects: [{
    name: String,
    description: String,
    live: String,
    github: String
  }],
  socialData: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    email: String
  },
  resumeData: {
    text: String,
    pdf: String,
    filename: String
  },
  siteSettings: {
    siteTitle: { type: String, default: 'Portfolio — Shreya Chavan' },
    footerText: { type: String, default: '© Shreya Chavan — Built with Tailwind + Animate.css' }
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('PortfolioData', PortfolioDataSchema);
