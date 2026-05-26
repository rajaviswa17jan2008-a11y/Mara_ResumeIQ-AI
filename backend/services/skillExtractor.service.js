const SKILL_DB = {
  languages: ["javascript","typescript","python","java","c++","c#","go","golang","rust","ruby","php","swift","kotlin","scala","r","matlab","sql","bash","shell","perl","dart","elixir","haskell","clojure","f#","lua","groovy"],
  frontend: ["react","react.js","vue","vue.js","angular","next.js","nuxt","nuxt.js","svelte","sveltekit","html","html5","css","css3","tailwind","tailwindcss","sass","scss","less","bootstrap","material ui","chakra ui","shadcn","radix","webpack","vite","parcel","rollup","redux","zustand","mobx","recoil","jotai","graphql","apollo","relay","axios","react query","tanstack","framer motion","three.js","d3","recharts","chart.js","storybook","cypress","playwright","jest","testing library","vitest"],
  backend: ["node.js","nodejs","express","express.js","fastify","nestjs","koa","hapi","django","flask","fastapi","spring","spring boot","rails","ruby on rails","laravel","symfony","asp.net",".net","phoenix","gin","fiber","echo","actix","axum","rocket"],
  databases: ["postgresql","postgres","mysql","mariadb","mongodb","redis","elasticsearch","cassandra","sqlite","dynamodb","firestore","firebase","supabase","planetscale","cockroachdb","neo4j","influxdb","timescaledb","clickhouse","snowflake","bigquery"],
  cloud: ["aws","amazon web services","azure","gcp","google cloud","google cloud platform","heroku","vercel","netlify","digitalocean","railway","fly.io","cloudflare","linode","vultr","ibm cloud"],
  devops: ["docker","kubernetes","k8s","jenkins","github actions","gitlab ci","gitlab","circle ci","travis ci","terraform","ansible","puppet","chef","helm","istio","prometheus","grafana","datadog","new relic","splunk","elk","nginx","apache","caddy","linux","ubuntu","debian","centos"],
  ai_ml: ["tensorflow","pytorch","scikit-learn","sklearn","pandas","numpy","keras","openai","langchain","hugging face","transformers","opencv","nltk","spacy","xgboost","lightgbm","matplotlib","seaborn","jupyter","mlflow","weights & biases","vertex ai","sagemaker"],
  mobile: ["react native","flutter","swift","swiftui","kotlin","android","ios","expo","capacitor","ionic","xamarin"],
  tools: ["git","github","gitlab","bitbucket","jira","confluence","notion","slack","figma","postman","insomnia","swagger","openapi","sentry","pagerduty","linear","trello","asana","monday"],
  testing: ["jest","mocha","chai","jasmine","pytest","junit","xunit","nunit","cypress","playwright","selenium","puppeteer","storybook","vitest","supertest"],
  architecture: ["microservices","monolith","serverless","event-driven","rest","restful","graphql","grpc","websocket","message queue","rabbitmq","kafka","redis pub/sub","pub/sub","cqrs","event sourcing","ddd","domain driven design","tdd","bdd","solid","clean architecture","hexagonal"],
  methodologies: ["agile","scrum","kanban","lean","xp","extreme programming","pair programming","code review","ci/cd","devops","devsecops","sre","site reliability"],
};

const SOFT_SKILLS = [
  "leadership","communication","teamwork","collaboration","problem solving","critical thinking",
  "adaptability","time management","project management","mentoring","coaching","presentation",
  "analytical thinking","decision making","stakeholder management","cross-functional",
];

function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  const found = { technical: {}, soft: [], all: [] };

  for (const [category, skills] of Object.entries(SKILL_DB)) {
    found.technical[category] = skills.filter(skill => {
      const normalizedText =

  lower
    .replace(/nextjs/g, "next.js")
    .replace(/nodejs/g, "node.js")
    .replace(/tailwind css/g, "tailwind")
    .replace(/mern/g,
      "mongodb express react node.js"
    );
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`(?:^|[\\s,;/|\\(\\)\\[\\]])${escaped}(?:[\\s,;/|\\(\\)\\[\\]]|$)`, "i");
      return pattern.test(
  normalizedText
);
    });
  }

  found.soft = SOFT_SKILLS.filter(s => lower.includes(s));

  const allTech = Object.values(found.technical).flat();
  const normalized = [

  ...new Set(

    [...allTech, ...found.soft]

      .map(skill =>

        skill
          .replace(".js", "")
          .trim()

      )

  )

];

found.all = normalized;
  found.count = found.all.length;
  const expMatch =

  lower.match(
    /(\d+)\+?\s+years?/
  );

found.experience =

  expMatch
    ? expMatch[1]
    : null;

  return found;
}

function getSkillGaps(extractedSkills, targetRole = "") {
  const roleMap = {
    frontend: ["react","typescript","css","testing library","webpack","graphql","accessibility"],
    backend: ["node.js","sql","postgresql","rest","docker","ci/cd","caching"],
    fullstack: ["react","node.js","postgresql","docker","typescript","graphql","ci/cd"],
    devops: ["docker","kubernetes","terraform","ci/cd","linux","ansible","prometheus"],
    "data scientist": ["python","pandas","numpy","scikit-learn","sql","statistics","visualization"],
    "ml engineer": ["python","tensorflow","pytorch","docker","kubernetes","mlflow","feature engineering"],
    mobile: ["react native","typescript","rest","offline storage","push notifications"],
    "site reliability": ["kubernetes","terraform","prometheus","grafana","linux","python","incident management"],
  };

  const role = Object.keys(roleMap).find(r => targetRole.toLowerCase().includes(r)) || "fullstack";
  const requirements = roleMap[role] || roleMap.fullstack;
  const userSkills = extractedSkills.all.map(s => s.toLowerCase());
  const gaps = requirements.filter(r => !userSkills.some(s => s.includes(r) || r.includes(s)));

  return {
    requirements,
    gaps,
    coverage: requirements.length ? Math.round(((requirements.length - gaps.length) / requirements.length) * 100) : 0,
    matchedRole: role,
  };
}

function rankSkillsByDemand(skills) {
  const demandIndex = {
    "kubernetes": 95,"typescript": 93,"react": 91,"terraform": 88,"python": 90,
    "docker": 89,"aws": 87,"node.js": 85,"postgresql": 82,"graphql": 80,
    "go": 84,"rust": 78,"kafka": 81,"redis": 79,"elasticsearch": 77,
    "next.js": 83,"fastapi": 76,"pytorch": 85,"langchain": 88,"openai": 86,
  };
  return skills
    .map(s => ({ skill: s, demand: demandIndex[s.toLowerCase()] || 60 }))
    .sort((a, b) => b.demand - a.demand);
}

module.exports = {
  extractSkillsFromText,
  getSkillGaps,
  rankSkillsByDemand,
  SKILL_DB,
  SOFT_SKILLS,
};