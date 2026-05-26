const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs").promises;
const path = require("path");

const SECTIONS = {
  contact: /(?:contact|personal information|reach me)/i,
  summary: /(?:summary|objective|profile|about me|career objective)/i,
  experience: /(?:experience|work history|employment|professional experience|work experience)/i,
  education: /(?:education|academic|qualification|degree|university)/i,
  skills: /(?:skills|technologies|technical skills|competencies|expertise)/i,
  projects: /(?:projects|portfolio|personal projects|open source)/i,
  certifications: /(?:certifications?|certificates?|licenses?|credentials)/i,
  awards: /(?:awards?|honors?|achievements?|recognition)/i,
};

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = await fs.readFile(filePath);

  if (ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (ext === ".docx" || ext === ".doc") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error("Unsupported file format");
}

function extractContactInfo(text) {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  const phoneMatch = text.match(/(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|io|dev|net|org)(?:\/[\w-]*)*/i);

  return {
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : null,
    github: githubMatch ? `https://${githubMatch[0]}` : null,
    website: websiteMatch?.[0] || null,
  };
}

function splitIntoSections(text) {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const sections = { raw: text, contact: [], summary: [], experience: [], education: [], skills: [], projects: [], certifications: [], other: [] };
  let currentSection = "other";

  for (const line of lines) {
    let matched = false;
    for (const [key, pattern] of Object.entries(SECTIONS)) {
      if (pattern.test(line) && line.length < 60) {
        currentSection = key;
        matched = true;
        break;
      }
    }
    if (!matched) sections[currentSection].push(line);
  }

  return sections;
}

function extractName(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 5)) {
    if (line.length > 3 && line.length < 50 && /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(line)) return line;
  }
  return null;
}

async function parseResume(filePath) {
  const rawText = await extractTextFromFile(filePath);
  const sections = splitIntoSections(rawText);
  const contact = extractContactInfo(rawText);
  const name = extractName(rawText);

  return {
    rawText,
    name,
    contact,
    sections,
    wordCount: rawText.split(/\s+/).length,
    charCount: rawText.length,
    lineCount: rawText.split("\n").length,
  };
}

module.exports = { parseResume, extractTextFromFile, extractContactInfo, splitIntoSections, extractName };