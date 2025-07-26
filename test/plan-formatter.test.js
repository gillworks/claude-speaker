const { formatPlanForSpeech } = require('../src/lib/plan-formatter');

describe('formatPlanForSpeech', () => {
  test('should format basic plan text', () => {
    const input = 'Step 1: Do something\nStep 2: Do something else';
    const result = formatPlanForSpeech(input);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  test('should handle empty input', () => {
    const result = formatPlanForSpeech('');
    expect(result).toBe('');
  });

  test('should format technical terms', () => {
    const input = 'Update package.json and run npm install';
    const result = formatPlanForSpeech(input);
    expect(result).toContain('package json');
    expect(result).toContain('NPM install');
  });

  test('should handle bullet points', () => {
    const input = '• First item\n• Second item\n• Third item';
    const result = formatPlanForSpeech(input);
    expect(result).not.toContain('•');
  });
});