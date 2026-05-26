const extractSkills = (text) => {
  const skillsDatabase = [
    // Frontend
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Angular",
    "Redux",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "SASS",
    "SCSS",
    "Framer Motion",

    // Backend
    "Node.js",
    "Express.js",
    "NestJS",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "Laravel",
    "ASP.NET",
    "PHP",

    // Database
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "SQLite",
    "Redis",
    "Firebase",
    "Supabase",
    "Oracle",
    "MariaDB",

    // Programming Languages
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Kotlin",
    "Swift",
    "R",
    "Scala",
    "Perl",

    // AI / ML
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "TensorFlow",
    "PyTorch",
    "OpenCV",
    "NLP",
    "Computer Vision",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Data Science",
    "Generative AI",
    "LLM",
    "LangChain",
    "OpenAI",
    "Gemini API",

    // DevOps
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Jenkins",
    "GitHub Actions",
    "Terraform",
    "Ansible",
    "Linux",
    "NGINX",

    // Cloud
    "AWS",
    "Azure",
    "Google Cloud",
    "Cloudinary",
    "Vercel",
    "Netlify",

    // Tools
    "Git",
    "GitHub",
    "GitLab",
    "Postman",
    "Figma",
    "VS Code",
    "Jira",

    // Mobile
    "React Native",
    "Flutter",
    "Android",
    "iOS",

    // APIs
    "REST API",
    "GraphQL",
    "WebSocket",

    // Security
    "JWT",
    "OAuth",
    "Authentication",
    "Authorization",

    // Testing
    "Jest",
    "Mocha",
    "Cypress",
    "Selenium",

    // Data Analytics
    "Power BI",
    "Tableau",
    "Excel",

    // Soft Tech Skills
    "Problem Solving",
    "Data Structures",
    "Algorithms",
    "OOP",
    "System Design",
  ];

  const foundSkills = skillsDatabase.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return [...new Set(foundSkills)];
};

module.exports = extractSkills;