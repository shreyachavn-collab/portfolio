// Default portfolio data used to seed localStorage on first load
window.DEFAULT_PORTFOLIO_DATA = {
  about: {
    name: "Shreya Chavan",
    title: "BSc Computer Science · MSc (ongoing) in Data Science",
    bio: "Hello — I'm Shreya, a fresher in data science with a BSc in Computer Science. I'm passionate about data, machine learning, and building useful products.",
    profilePic: "assets/profile.svg",
  },
  resumeUrl: "resume.html",
  experience: [],
  projects: [
    {
      id: Date.now(),
      title: "Sample Project 1",
      description: "A demo project showcasing skills in data analysis.",
      link: "#"
    }
  ],
  skills: ["Python","Pandas","NumPy","Machine Learning","Data Visualization","JavaScript","HTML","CSS"],
  certifications: [
    { id: 1, name: "Intro to Data Science - Example" }
  ],
  socials: {
    linkedin: "https://linkedin.com/",
    github: "https://github.com/",
    instagram: "https://instagram.com/",
    twitter: "https://twitter.com/"
  }
};
