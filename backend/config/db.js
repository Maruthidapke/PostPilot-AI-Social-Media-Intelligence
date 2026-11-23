import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let isConnectedToMongo = false;
let memoryStore = {
  users: [],
  socialAccounts: [],
  oauthCredentials: [],
  posts: [],
  comments: [],
  postMetricSnapshots: [],
  predictions: [],
  syncJobs: [],
  auditLogs: [],
  sepmSprints: [],
  sepmStories: [],
  sepmTasks: [],
  sepmTestCases: [],
  sepmDefects: [],
  sepmSqaReviews: [],
  sepmLeanWaste: [],
  sepmSyllabus: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    memoryStore = { ...memoryStore, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading fallback db.json:', err.message);
  }
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/postpilot';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnectedToMongo = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    isConnectedToMongo = false;
    console.log('\x1b[33m⚠ Standalone MongoDB not running locally. Initializing PostPilot Unified Dual-Engine (JSON/In-Memory fallback)...\x1b[0m');
    console.log(`\x1b[32m✔ PostPilot Engine active with local persistent store: ${DB_FILE}\x1b[0m`);
  }
};

export const isMongo = () => isConnectedToMongo;

// Fallback persistence helpers
export const getStore = () => memoryStore;

export const saveStore = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to db.json:', err.message);
  }
};

export const getCollection = (colName) => {
  if (!memoryStore[colName]) {
    memoryStore[colName] = [];
  }
  return memoryStore[colName];
};

export const setCollection = (colName, data) => {
  memoryStore[colName] = data;
  saveStore();
};
