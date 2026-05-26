const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const axios = require("axios");
const extractSkills = require("../utils/extractSkills");
 
/**
 * Parse resume file to extract raw text and structured data
 */
const parseResumeFromURL = async (fileUrl, fileType) => {
  try {
    // Download file buffer from Cloudinary URL
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
 
    let rawText = "";
 
    if (fileType === "pdf") {
      const pdfData = await pdfParse(buffer);
      rawText = pdfData.text;
    } else if (fileType === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }
 
    const structuredData = extractStructuredData(rawText);
    return { rawText, parsedData: structuredData };
  } catch (error) {
    console.error("Resume parsing error:", error.message);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};
 
const extractStructuredData = (text) => {
  if (!text) return {};
 
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
 
  return {
    name: extractName(lines, text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    summary: extractSummary(text),
    skills: extractSkills(text),
    education: extractEducation(text),
    experience: extractExperience(text),
    projects: extractProjects(text),
    certifications: extractCertifications(text),
    languages: extractLanguages(text),
    links: extractLinks(text),
  };
};
 
const extractEmail = (text) => {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
  return match ? match[0] : "";
};
 
const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  return match ? match[0].trim() : "";
};
 
const extractName = (lines, text) => {
  // Usually the first non-empty line that isn't an email/phone
  for (const line of lines.slice(0, 5)) {
    if (line.length < 5 || line.length > 60) continue;
    if (extractEmail(line) || extractPhone(line)) continue;
    if (/^(resume|cv|curriculum)/i.test(line)) continue;
    if (/[A-Z][a-z]+ [A-Z][a-z]+/.test(line)) return line;
  }
  return lines[0] || "";
};
 
const extractLocation = (text) => {
  const locationPatterns = [
    /([A-Z][a-z]+(?:[\s,]+[A-Z]{2})(?:[\s,]+\d{5})?)/,
    /(?:Location|Address|City):\s*(.+)/i,
    /([A-Z][a-z]+,\s*[A-Z][a-z]+,?\s*(?:[A-Z]{2})?)/,
  ];
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
};
 
const extractSummary = (text) => {
  const summaryPatterns = [
    /(?:summary|objective|profile|about me|professional summary)[:\s]*\n?([\s\S]{50,500}?)(?:\n\n|\n[A-Z])/i,
  ];
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
};
 
const extractEducation = (text) => {
  const educationSection = extractSection(text, ["education", "academic background", "qualifications"]);
  if (!educationSection) return [];
 
  const education = [];
  const degreePatterns = [
    /(?:B\.?S\.?|B\.?E\.?|B\.?Tech|Bachelor|M\.?S\.?|M\.?E\.?|Master|Ph\.?D\.?|MBA|Associate|Diploma)/gi,
  ];
 
  const lines = educationSection.split("\n").filter(Boolean);
  let current = null;
 
  lines.forEach((line) => {
    if (degreePatterns.some((p) => p.test(line))) {
      if (current) education.push(current);
      current = { degree: line.trim(), institution: "", year: "", gpa: "" };
    } else if (current) {
      if (/university|college|institute|school/i.test(line)) {
        current.institution = line.trim();
      } else if (/\d{4}/.test(line)) {
        const yearMatch = line.match(/\d{4}/g);
        current.year = yearMatch ? yearMatch.join(" - ") : "";
      } else if (/gpa|cgpa/i.test(line)) {
        const gpaMatch = line.match(/[\d.]+/);
        current.gpa = gpaMatch ? gpaMatch[0] : "";
      }
    }
  });
 
  if (current) education.push(current);
  return education;
};
 
const extractExperience = (text) => {
  const experienceSection = extractSection(text, ["experience", "work experience", "employment", "work history", "professional experience"]);
  if (!experienceSection) return [];
 
  const experience = [];
  const lines = experienceSection.split("\n").filter(Boolean);
  let current = null;
 
  lines.forEach((line) => {
    const datePattern = /(\d{4}|present|current)/gi;
    const titlePattern = /(engineer|developer|manager|analyst|designer|lead|senior|junior|intern|director|consultant)/gi;
 
    if (titlePattern.test(line) && line.length < 100) {
      if (current) experience.push(current);
      current = {
        title: line.trim(),
        company: "",
        duration: "",
        description: "",
        technologies: [],
      };
    } else if (current) {
      if (datePattern.test(line)) {
        current.duration = line.trim();
      } else if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
        current.description += (current.description ? " " : "") + line.replace(/^[•\-*]\s*/, "");
      } else if (!current.company && line.length < 80) {
        current.company = line.trim();
      }
    }
  });
 
  if (current) experience.push(current);
 
  // Extract technologies from descriptions
  return experience.map((exp) => ({
    ...exp,
    technologies: extractSkills(exp.description).slice(0, 8),
  }));
};
 
const extractProjects = (text) => {
  const projectSection = extractSection(text, ["projects", "personal projects", "key projects", "side projects"]);
  if (!projectSection) return [];
 
  const projects = [];
  const lines = projectSection.split("\n").filter(Boolean);
  let current = null;
 
  lines.forEach((line) => {
    if (line.length < 60 && !line.startsWith("•") && !line.startsWith("-")) {
      if (current) projects.push(current);
      current = { name: line.trim(), description: "", technologies: [], url: "" };
    } else if (current) {
      if (/https?:\/\//.test(line)) {
        const urlMatch = line.match(/https?:\/\/[^\s]+/);
        current.url = urlMatch ? urlMatch[0] : "";
      } else {
        current.description += (current.description ? " " : "") + line.replace(/^[•\-*]\s*/, "");
      }
    }
  });
 
  if (current) projects.push(current);
 
  return projects.slice(0, 6).map((p) => ({
    ...p,
    technologies: extractSkills(p.description).slice(0, 6),
  }));
};
 
const extractCertifications = (text) => {
  const certSection = extractSection(text, ["certifications", "certificates", "licenses", "credentials"]);
  if (!certSection) return [];
 
  return certSection
    .split("\n")
    .filter((l) => l.trim().length > 5)
    .map((line) => {
      const yearMatch = line.match(/\d{4}/);
      return {
        name: line.replace(/\d{4}/, "").trim(),
        issuer: "",
        year: yearMatch ? yearMatch[0] : "",
      };
    })
    .slice(0, 10);
};
 
const extractLanguages = (text) => {
  const langSection = extractSection(text, ["languages", "spoken languages"]);
  if (!langSection) return [];
  return langSection.split(/[,\n]/).map((l) => l.trim()).filter((l) => l.length > 2).slice(0, 6);
};
 
const extractLinks = (text) => {
  const links = { linkedin: "", github: "", portfolio: "" };
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  const portfolioMatch = text.match(/https?:\/\/(?!linkedin|github)[\w.-]+\.\w{2,}/i);
 
  if (linkedinMatch) links.linkedin = "https://" + linkedinMatch[0];
  if (githubMatch) links.github = "https://" + githubMatch[0];
  if (portfolioMatch) links.portfolio = portfolioMatch[0];
 
  return links;
};
 
const extractSection = (text, sectionNames) => {
  for (const name of sectionNames) {
    const pattern = new RegExp(
      `${name}[:\\s]*\\n([\\s\\S]+?)(?=\\n(?:education|experience|skills|projects|certifications|references|awards|publications|\\n[A-Z][A-Z]+)|$)`,
      "gi"
    );
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
};
 
const splitSections = (text) => {
  const sections = {};

  const sectionNames = [
    "summary",
    "skills",
    "education",
    "experience",
    "projects",
    "certifications",
    "languages",
  ];

  sectionNames.forEach((section) => {
    const data = extractSection(text, [section]);
    if (data) {
      sections[section] = data;
    }
  });

  return sections;
};

const extractContactInfo = (text) => {
  return {
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    links: extractLinks(text),
  };
};

module.exports = {
  parseResumeFromURL,
  extractStructuredData,

  // ADD THESE
  splitSections,
  extractContactInfo,
  extractName,
};