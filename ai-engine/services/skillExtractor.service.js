const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const TECH_SKILLS = {
  languages: ["javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "sql", "bash", "shell"],
  frontend: ["react", "vue", "angular", "next.js", "nuxt", "svelte", "html", "css", "tailwind", "sass", "webpack", "vite", "redux", "graphql", "apollo"],
  backend: ["node.js", "express", "django", "flask", "fastapi", "spring", "laravel", "rails", "nestjs", "fastify", "gin", "fiber"],
  databases: ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra", "sqlite", "dynamodb", "firebase", "supabase"],
  cloud: ["aws", "azure", "gcp", "google cloud", "heroku", "vercel", "netlify", "digitalocean", "cloudflare"],
  devops: ["docker", "kubernetes", "jenkins", "github actions", "gitlab ci", "terraform", "ansible", "helm", "prometheus", "grafana"],
  tools: ["git", "jira", "confluence", "figma", "postman", "linux", "nginx", "apache", "elasticsearch"],
  ai_ml: ["tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "keras", "openai", "langchain", "huggingface"],
  methodologies: ["agile", "scrum", "kanban", "tdd", "bdd", "ci/cd", "microservices", "rest", "graphql", "grpc"],
};

const SOFT_SKILLS = ["leadership", "communication", "teamwork", "problem-solving", "critical thinking", "adaptability", "time management", "collaboration", "mentoring", "presentation"];

function extractSkillsFromText(text) {
  const lowerText = text.toLowerCase();
  const found = { technical: {}, soft: [] };

  for (const [category, skills] of Object.entries(TECH_SKILLS)) {
    found.technical[category] = skills.filter(s => lowerText.includes(s));
  }
  found.soft = SOFT_SKILLS.filter(s => lowerText.includes(s));

  const allTech = Object.values(found.technical).flat();
  return { ...found, all: [...allTech, ...found.soft], count: allTech.length + found.soft.length };
}

function getSkillGaps(extractedSkills, targetRole) {
  const roleRequirements = {
    "frontend developer": ["react", "typescript", "css", "testing", "webpack"],
    "backend developer": ["node.js", "sql", "rest", "docker", "ci/cd"],
    "fullstack developer": ["react", "node.js", "sql", "docker", "typescript"],
    "devops engineer": ["docker", "kubernetes", "terraform", "ci/cd", "linux"],
    "data scientist": ["python", "pandas", "numpy", "scikit-learn", "sql"],
    "ml engineer": ["python", "tensorflow", "pytorch", "docker", "kubernetes"],
  };

  const normalizedRole = targetRole?.toLowerCase();
  const requirements = Object.entries(roleRequirements).find(([role]) => normalizedRole?.includes(role.split(" ")[0]))?.[1] || [];
  const userSkills = extractedSkills.all.map(s => s.toLowerCase());
  const gaps = requirements.filter(r => !userSkills.some(s => s.includes(r) || r.includes(s)));

  return { requirements, gaps, coverage: requirements.length ? Math.round(((requirements.length - gaps.length) / requirements.length) * 100) : 0 };
}

function rankSkillsByDemand(skills) {
  const demandMap = {
    "kubernetes": 94, "typescript": 91, "react": 90, "terraform": 82, "graphql": 78,
    "python": 88, "docker": 87, "aws": 85, "node.js": 84, "postgresql": 80,
  };
  return skills.map(s => ({ skill: s, demand: demandMap[s.toLowerCase()] || 60 + Math.floor(Math.random() * 30) })).sort((a, b) => b.demand - a.demand);
}

module.exports = { extractSkillsFromText, getSkillGaps, rankSkillsByDemand, TECH_SKILLS, SOFT_SKILLS };