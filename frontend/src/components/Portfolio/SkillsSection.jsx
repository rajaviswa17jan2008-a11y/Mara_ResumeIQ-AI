// frontend/components/Portfolio/SkillsSection.jsx
import React from "react";
import { motion } from "framer-motion";

export default function SkillsSection({ data = {}, accentColor = "#00f0ff" }) {
 console.log("SKILLS DATA =", data.skills);
const technicalSkills =
  Array.isArray(data.skills?.technical)
    ? data.skills.technical.map(skill =>
        typeof skill === "object"
          ? skill.name
          : skill
      )
    : Array.isArray(data.skills)
    ? data.skills.map(skill =>
        typeof skill === "object"
          ? skill.name
          : skill
      )
    : typeof data.skills === "string"
    ? data.skills.split(",").map(s => s.trim())
    : []
    .flatMap((s) => {

      const value =
        typeof s === "object"
          ? s.name
          : s;

      return String(value)
        .split("•")
        .map((item) => item.trim())
        .filter(Boolean);
    });
console.log("FULL SKILLS =", data.skills);
console.log("TECHNICAL =", data.skills?.technical);
console.log("SOFT =", data.skills?.soft);
const skillCategories = {
  Frontend: [
    "HTML",
    "HTML5",
    "CSS",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "React.js",
    "Next.js",
    "Vue.js",
    "Angular",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Redux",
  ],

  Backend: [
    "Node.js",
    "Express.js",
    "NestJS",
    "PHP",
    "Laravel",
    "Python",
    "Django",
    "Flask",
    "Java",
    "Spring Boot",
    "C#",
    ".NET",
    "Ruby on Rails",
  ],

  Database: [
    "MongoDB",
    "MySQL",
    "SQL",
    "PostgreSQL",
    "Oracle",
    "SQLite",
    "Firebase",
    "Redis",
  ],

  DevOps: [
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "CI/CD",
    "Linux",
    "Nginx",
  ],

  Cloud: [
    "AWS",
    "Azure",
    "Google Cloud",
    "GCP",
    "Vercel",
    "Netlify",
    "Heroku",
  ],

  Mobile: [
    "React Native",
    "Flutter",
    "Android",
    "Kotlin",
    "Swift",
    "iOS",
  ],

  AI_ML: [
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "TensorFlow",
    "PyTorch",
    "OpenAI",
    "LangChain",
    "NLP",
    "Computer Vision",
    "Generative AI",
    "AI Integration",
  ],

  Tools: [
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "VS Code",
    "Postman",
    "Figma",
    "Jira",
    "Canva",
    "Powerpoint",
    "MS Word",
    "MS Excel"
  ],

  Languages: [
    "C",
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "Go",
    "Rust",
    "PHP",
  ],
};

const categories = {};

Object.entries(skillCategories).forEach(
  ([category, categorySkills]) => {
    categories[category] =
      technicalSkills.filter((skill) => {

        const skillName =
          typeof skill === "object"
            ? skill.name || skill.skill || ""
            : skill;

        return categorySkills.some(
          (s) =>
            String(skillName)
              .toLowerCase()
              .includes(
                s.toLowerCase()
              )
        );
      });
  }
);
categories["Soft Skills"] = [
  "Communication Skills",
  "Team Collaboration",
  "Time Management",
  "Adaptability",
  "Critical Thinking",
  "Leadership",
  "Quick Learning Ability",
  "Creativity",
  "Problem Solving",
  "Project Management",
].filter((softSkill) =>
  technicalSkills.some((skill) => {

    const skillName =
      typeof skill === "object"
        ? skill.name
        : skill;

    return String(skillName)
      .toLowerCase()
      .trim() ===
      softSkill.toLowerCase().trim();

  })
);

categories.Other =
  technicalSkills.filter((skill) => {

    const skillName =
      typeof skill === "object"
        ? skill.name || skill.skill || ""
        : skill;

    const found =
      Object.values(skillCategories)
        .flat()
        .some(
          (s) =>
            String(skillName)
              .toLowerCase()
              .includes(
                s.toLowerCase()
              )
        );

    return !found;
  });
console.log("ALL SKILLS =", technicalSkills);
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>02</span>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
            <h2 className="text-3xl font-extrabold text-white">Skills</h2>
            <div className="h-px flex-1 opacity-20" style={{ background: accentColor }} />
          </div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

  {Object.entries(categories).map(
    ([category, skills], categoryIndex) => {

      if (!skills.length) return null;

      return (
        <motion.div
          key={category}
          whileHover={{
  y: -8,
  scale: 1.03,
}}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: categoryIndex * 0.15,
          }}
          className="p-5 rounded-2xl border"
          style={{
  borderColor: `${accentColor}40`,
  background: `${accentColor}08`,
  boxShadow: `0 0 20px ${accentColor}20`,
}}
        >
          <h3
            className="font-bold text-lg mb-4"
            style={{ color: accentColor }}
          >
            {
  {
    Frontend: "🌐",
    Backend: "⚙️",
    Database: "🗄️",
    DevOps: "🚀",
    Cloud: "☁️",
    Mobile: "📱",
    AI_ML: "🤖",
    Tools: "🛠️",
    Languages: "💻",
    "Soft Skills" :"🤝",
    Other: "📦",
  }[category]
} {category}
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => {
  const skillName =
    typeof skill === "object"
      ? skill.name || skill.skill || ""
      : skill;

  return (
    <motion.div
      key={i}
      initial={{
        opacity: 0,
        scale: 0,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        delay: i * 0.05,
      }}
      className="px-3 py-1 rounded-lg border"
      style={{
        borderColor: accentColor,
        color: accentColor,
      }}
    >
      {skillName}
    </motion.div>
  );
})}
          </div>

        </motion.div>
      );
    }
  )}

</div> {/* grid close */}

        </motion.div> {/* top motion.div close */}
      </div> {/* container close */}
    </section>
  );
}