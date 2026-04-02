'use strict';
const { solarToLunar, MONTH_NAMES, DAY_NAMES, STEMS, BRANCHES } = require('./calendar-core');

describe('solarToLunar', () => {
  test('2024-02-10 → 甲辰年正月初一 (Chinese New Year 2024)', () => {
    const r = solarToLunar(2024, 2, 10);
    expect(r.lunarYear).toBe(2024);
    expect(r.lunarMonth).toBe(1);
    expect(r.lunarDay).toBe(1);
    expect(r.isLeap).toBe(false);
    expect(r.ganZhi).toBe('甲辰');
  });

  test('2024-01-15 → in Chinese year 2023 (before CNY 2024)', () => {
    const r = solarToLunar(2024, 1, 15);
    expect(r.lunarYear).toBe(2023);
    expect(r.isLeap).toBe(false);
    expect(r.ganZhi).toBe('癸卯');
  });

  test('1912-01-01 → 辛亥年十一月十三 (before CNY 1912)', () => {
    const r = solarToLunar(1912, 1, 1);
    expect(r.lunarYear).toBe(1911);
    expect(r.lunarMonth).toBe(11);
    expect(r.lunarDay).toBe(13);
    expect(r.isLeap).toBe(false);
    expect(r.ganZhi).toBe('辛亥');
  });

  test('2023-04-05 → 癸卯年閏二月十五 (leap month)', () => {
    const r = solarToLunar(2023, 4, 5);
    expect(r.lunarYear).toBe(2023);
    expect(r.lunarMonth).toBe(2);
    expect(r.lunarDay).toBe(15);
    expect(r.isLeap).toBe(true);
    expect(r.ganZhi).toBe('癸卯');
  });

  test('2023-01-22 → 癸卯年正月初一 (Chinese New Year 2023)', () => {
    const r = solarToLunar(2023, 1, 22);
    expect(r.lunarYear).toBe(2023);
    expect(r.lunarMonth).toBe(1);
    expect(r.lunarDay).toBe(1);
    expect(r.isLeap).toBe(false);
    expect(r.ganZhi).toBe('癸卯');
  });

  test('1912-02-12 → 壬子年正月初六 (day after Republic founding)', () => {
    // CNY 1912 is Feb 18, so Feb 12 is still in 1911
    // Actually CNY 1912 is day 49 = Feb 18, Feb 12 = day 31+12=43 < 49 → still year 1911
    const r = solarToLunar(1912, 2, 12);
    expect(r.lunarYear).toBe(1911);
    expect(r.isLeap).toBe(false);
  });

  test('1912-02-18 → 壬子年正月初一 (CNY 1912)', () => {
    const r = solarToLunar(1912, 2, 18);
    expect(r.lunarYear).toBe(1912);
    expect(r.lunarMonth).toBe(1);
    expect(r.lunarDay).toBe(1);
    expect(r.ganZhi).toBe('壬子');
  });

  test('returns null for year out of range', () => {
    expect(solarToLunar(1100, 1, 1)).toBeNull();
    expect(solarToLunar(2300, 1, 1)).toBeNull();
  });
});

describe('MONTH_NAMES', () => {
  test('has 12 entries starting with 正', () => {
    expect(MONTH_NAMES).toHaveLength(12);
    expect(MONTH_NAMES[0]).toBe('正');
    expect(MONTH_NAMES[10]).toBe('十一');
    expect(MONTH_NAMES[11]).toBe('十二');
  });
});

describe('DAY_NAMES', () => {
  test('has 30 entries', () => {
    expect(DAY_NAMES).toHaveLength(30);
    expect(DAY_NAMES[0]).toBe('初一');
    expect(DAY_NAMES[9]).toBe('初十');
    expect(DAY_NAMES[10]).toBe('十一');
    expect(DAY_NAMES[19]).toBe('二十');
    expect(DAY_NAMES[20]).toBe('廿一');
    expect(DAY_NAMES[29]).toBe('三十');
  });
});
