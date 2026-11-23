#!/usr/bin/env node

/**
 * PostPilot AI Development Orchestrator
 * Spawns both Backend (port 5002) and Vite Frontend (port 5173).
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\x1b[34m=================================================================\x1b[0m');
console.log('\x1b[34m       POSTPILOT AI: MULTI-PLATFORM SOCIAL INTELLIGENCE         \x1b[0m');
console.log('\x1b[34m       Project Code: P59 | Student: Maruthi Dapke (ENG24CS0127)  \x1b[0m');
console.log('\x1b[34m=================================================================\x1b[0m\n');

// 1. Spawn Backend
const backend = spawn('node', ['--watch', 'server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5002' }
});

// 2. Spawn Frontend
const frontend = spawn('npx', ['vite', '--port', '5173', '--host'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n\x1b[33m[PostPilot] Gracefully shutting down dev servers...\x1b[0m');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
