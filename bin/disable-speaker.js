#!/usr/bin/env node

const { setEnabled } = require('../src/lib/config');

setEnabled(false);
console.log('Claude Speaker is now DISABLED');
