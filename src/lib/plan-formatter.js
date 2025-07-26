function formatPlanForSpeech(planText) {
  const lines = planText.split('\n').map(line => line.trim()).filter(line => line);
  const formattedParts = [];
  
  let stepCount = 0;

  for (const line of lines) {
    if (line.match(/^#+\s/)) {
      const sectionTitle = line.replace(/^#+\s/, '');
      formattedParts.push(`Now, let's talk about ${sectionTitle.toLowerCase()}.`);
    } else if (line.match(/^(\d+\.|\*|-|•)\s/)) {
      stepCount++;
      const content = line.replace(/^(\d+\.|\*|-|•)\s/, '');
      
      const transitions = [
        'First,',
        'Next,',
        'Then,',
        'After that,',
        'Following this,',
        'Subsequently,',
        'Moving on,',
        'Additionally,',
        'Furthermore,'
      ];
      
      let transition;
      if (stepCount === 1) {
        transition = 'First,';
      } else if (stepCount === lines.filter(l => l.match(/^(\d+\.|\*|-|•)\s/)).length) {
        transition = 'Finally,';
      } else {
        transition = transitions[Math.min(stepCount - 1, transitions.length - 1)];
      }
      
      const formatted = `${transition} ${reformatActionPhrase(content)}`;
      formattedParts.push(formatted);
    } else if (line.startsWith('```')) {
      continue;
    } else if (line) {
      formattedParts.push(reformatActionPhrase(line));
    }
  }

  if (formattedParts.length > 0) {
    formattedParts.unshift('I\'ve created a plan for this task.');
    formattedParts.push('That covers the main steps of the plan. Let me know if you\'d like me to proceed.');
  }

  return formattedParts.join(' ');
}

function reformatActionPhrase(text) {
  text = text.replace(/^(Create|Implement|Build|Add|Set up|Configure|Install|Update|Modify|Write)/i, (match) => {
    return `I'll ${match.toLowerCase()}`;
  });

  text = text.replace(/^(Check|Verify|Test|Ensure|Validate)/i, (match) => {
    return `I'll ${match.toLowerCase()}`;
  });

  text = text.replace(/^(Use|Include|Define|Generate)/i, (match) => {
    return `I'll ${match.toLowerCase()}`;
  });

  text = text.replace(/\b(function|method|class|module|component|file|directory|folder)\b/gi, (match) => {
    const articles = {
      'function': 'a function',
      'method': 'a method',
      'class': 'a class',
      'module': 'a module',
      'component': 'a component',
      'file': 'a file',
      'directory': 'a directory',
      'folder': 'a folder'
    };
    return articles[match.toLowerCase()] || match;
  });

  text = text.replace(/`([^`]+)`/g, '$1');
  
  text = text.replace(/\bAPI\b/g, 'A P I');
  text = text.replace(/\bURL\b/g, 'U R L');
  text = text.replace(/\bJSON\b/g, 'Jason');
  text = text.replace(/\bUI\b/g, 'U I');
  text = text.replace(/\bnpm\b/g, 'NPM');
  
  // Convert file extensions to spoken form
  text = text.replace(/\b(\w+)\.json\b/g, '$1 json');
  text = text.replace(/\b(\w+)\.js\b/g, '$1 JS');
  text = text.replace(/\b(\w+)\.ts\b/g, '$1 TS');
  text = text.replace(/\b(\w+)\.md\b/g, '$1 markdown');

  return text;
}

module.exports = { formatPlanForSpeech };
