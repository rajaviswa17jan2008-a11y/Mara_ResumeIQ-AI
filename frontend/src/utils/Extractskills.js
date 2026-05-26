const TECH_SKILLS = [
  // Programming Languages
  "javascript","typescript","python","java","c++","c#","go","rust","ruby","php","swift","kotlin","scala","r","matlab","perl","shell","bash","powershell",
  // Frontend
  "react","vue","angular","svelte","nextjs","nuxtjs","html","css","sass","less","tailwind","bootstrap","jquery","redux","mobx","zustand","graphql","apollo",
  // Backend
  "nodejs","express","django","flask","fastapi","spring","laravel","rails","asp.net","nestjs","hapi","koa","gin","fiber","actix",
  // Databases
  "mongodb","postgresql","mysql","sqlite","redis","elasticsearch","cassandra","dynamodb","firebase","supabase","prisma","mongoose","sequelize","typeorm",
  // Cloud & DevOps
  "aws","azure","gcp","docker","kubernetes","terraform","ansible","jenkins","github actions","ci/cd","nginx","apache","linux","ubuntu","debian",
  // AI / ML
  "machine learning","deep learning","tensorflow","pytorch","keras","scikit-learn","nlp","computer vision","openai","langchain","hugging face","pandas","numpy","matplotlib","spark","hadoop",
  // Mobile
  "react native","flutter","ios","android","xcode","kotlin","swift","expo",
  // Tools
  "git","github","gitlab","bitbucket","jira","confluence","figma","postman","swagger","sonarqube","datadog","grafana","prometheus",
  // Concepts
  "rest api","microservices","agile","scrum","tdd","bdd","oop","design patterns","system design","data structures","algorithms",
];
 
const SOFT_SKILLS = [
  "leadership","communication","teamwork","problem solving","critical thinking","time management","project management","agile","scrum","mentoring","collaboration","adaptability","creativity",
];
 
const extractSkills = (text) => {
  if (!text) return [];
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set();
 
  TECH_SKILLS.forEach((skill) => {
    const regex = new RegExp(`\\b${skill.replace(/[+#.]/g, "\\$&")}\\b`, "gi");
    if (regex.test(normalizedText)) {
      foundSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
 
  SOFT_SKILLS.forEach((skill) => {
    if (normalizedText.includes(skill)) {
      foundSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });
 
  return [...foundSkills];
};
 
const categorizeSkills = (skills) => {
  const categories = {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    cloud: [],
    ai_ml: [],
    mobile: [],
    tools: [],
    soft: [],
    other: [],
  };
 
  const languageList = ["javascript","typescript","python","java","c++","c#","go","rust","ruby","php","swift","kotlin","scala","r","matlab"];
  const frontendList = ["react","vue","angular","svelte","nextjs","html","css","sass","tailwind","bootstrap","redux"];
  const backendList = ["nodejs","express","django","flask","spring","laravel","nestjs","fastapi"];
  const dbList = ["mongodb","postgresql","mysql","redis","elasticsearch","firebase","dynamodb","sqlite"];
  const cloudList = ["aws","azure","gcp","docker","kubernetes","terraform","jenkins","linux"];
  const aiList = ["machine learning","deep learning","tensorflow","pytorch","nlp","openai","pandas","numpy"];
  const mobileList = ["react native","flutter","ios","android","expo"];
  const toolList = ["git","github","figma","jira","postman","swagger"];
  const softList = ["leadership","communication","teamwork","problem solving","agile","scrum"];
 
  skills.forEach((skill) => {
    const s = skill.toLowerCase();
    if (languageList.some((l) => s.includes(l))) categories.languages.push(skill);
    else if (frontendList.some((l) => s.includes(l))) categories.frontend.push(skill);
    else if (backendList.some((l) => s.includes(l))) categories.backend.push(skill);
    else if (dbList.some((l) => s.includes(l))) categories.database.push(skill);
    else if (cloudList.some((l) => s.includes(l))) categories.cloud.push(skill);
    else if (aiList.some((l) => s.includes(l))) categories.ai_ml.push(skill);
    else if (mobileList.some((l) => s.includes(l))) categories.mobile.push(skill);
    else if (toolList.some((l) => s.includes(l))) categories.tools.push(skill);
    else if (softList.some((l) => s.includes(l))) categories.soft.push(skill);
    else categories.other.push(skill);
  });
 
  return categories;
};
 
const getTrendingSkills = (targetRole = "") => {
  const trending = {
    default: ["AI/ML","LLM Integration","TypeScript","Rust","Kubernetes","Terraform","React","Next.js","Python","Golang"],
    frontend: ["React","Next.js","TypeScript","Tailwind CSS","Framer Motion","Three.js","WebAssembly","Micro-frontends"],
    backend: ["Golang","Rust","Kafka","gRPC","GraphQL","Redis","Kubernetes","Terraform"],
    fullstack: ["Next.js","TypeScript","tRPC","Prisma","Docker","Kubernetes","AWS","Vercel"],
    data: ["Python","PyTorch","LangChain","MLflow","dbt","Spark","Snowflake","Airflow"],
    devops: ["Kubernetes","Terraform","ArgoCD","Helm","Prometheus","Grafana","AWS","GitHub Actions"],
    mobile: ["React Native","Flutter","SwiftUI","Jetpack Compose","Expo","Firebase"],
  };
 
  const role = targetRole.toLowerCase();
  if (role.includes("front")) return trending.frontend;
  if (role.includes("back") || role.includes("api")) return trending.backend;
  if (role.includes("full")) return trending.fullstack;
  if (role.includes("data") || role.includes("ml") || role.includes("ai")) return trending.data;
  if (role.includes("devops") || role.includes("cloud") || role.includes("infra")) return trending.devops;
  if (role.includes("mobile") || role.includes("ios") || role.includes("android")) return trending.mobile;
  return trending.default;
};
 
module.exports = { extractSkills, categorizeSkills, getTrendingSkills };