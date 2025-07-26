const { speakPlan } = require('./lib/speaker');
const { loadConfig, saveConfig } = require('./lib/config');
const { formatPlanForSpeech } = require('./lib/plan-formatter');

module.exports = {
  speakPlan,
  loadConfig,
  saveConfig,
  formatPlanForSpeech
};
