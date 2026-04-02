'use strict';
const { execSync } = require('child_process');

function runCli(args) {
  try {
    return execSync(`node cli.js ${args}`, {
      cwd: __dirname,
      encoding: 'utf8'
    }).trim();
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}

describe('CLI', () => {
  test('correct output for 2024-02-10 (CNY)', () => {
    const out = runCli('2024 2 10');
    expect(out).toContain('甲辰');
    expect(out).toContain('正月');
    expect(out).toContain('一日');
  });

  test('shows 歲次 line', () => {
    const out = runCli('2024 2 10');
    expect(out).toContain('歲次');
  });

  test('correct output for leap month 2023-04-05', () => {
    const out = runCli('2023 4 5');
    expect(out).toContain('閏二月');
    expect(out).toContain('十五日');
    expect(out).toContain('癸卯');
  });

  test('shows usage when arguments missing', () => {
    const out = runCli('2024');
    expect(out.toLowerCase()).toMatch(/用法|usage/i);
  });

  test('shows error for out-of-range year', () => {
    const out = runCli('1100 1 1');
    expect(out).toMatch(/範圍|range/i);
  });
});
