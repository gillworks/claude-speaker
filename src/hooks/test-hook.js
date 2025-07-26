#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const testLog = path.join(os.homedir(), '.claude-speaker', 'test-hook.log');

fs.mkdirSync(path.dirname(testLog), { recursive: true });
fs.appendFileSync(testLog, `Hook triggered at ${new Date().toISOString()}\n`);

// Read and log stdin
let input = '';
try {
  input = fs.readFileSync(0, 'utf8');
  fs.appendFileSync(testLog, `Input length: ${input.length}\n`);
  fs.appendFileSync(testLog, `Input preview: ${input.slice(0, 200)}...\n\n`);
} catch (err) {
  fs.appendFileSync(testLog, `Error reading stdin: ${err.message}\n\n`);
}

process.exit(0);
