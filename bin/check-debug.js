#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const debugLog = path.join(os.homedir(), '.claude-speaker', 'debug.log');

if (fs.existsSync(debugLog)) {
  console.log('Debug log contents:\n');
  console.log(fs.readFileSync(debugLog, 'utf8'));
} else {
  console.log('No debug log found at:', debugLog);
  console.log('\nThis means the hook might not be triggering at all.');
  console.log('Check your Claude Code settings to ensure the hook is properly configured.');
}
