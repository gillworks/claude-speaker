#!/usr/bin/env node

const fs = require('fs');
const { speakPlan } = require('../lib/speaker');
const { getConfig } = require('../lib/config');

async function main() {
  try {
    const config = getConfig();
    
    if (!config.enabled) {
      process.exit(0);
    }

    const input = fs.readFileSync(0, 'utf8');
    const data = JSON.parse(input);

    if (data.output && typeof data.output === 'string') {
      const planMatch = data.output.match(/Here is Claude's plan:([\s\S]*?)(?=\n\n(?:Let me|I'll|Now|Starting)|$)/);
      
      if (planMatch && planMatch[1]) {
        const planText = planMatch[1].trim();
        
        if (planText) {
          await speakPlan(planText, config);
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Plan detector error:', error);
    process.exit(0);
  }
}

main();
