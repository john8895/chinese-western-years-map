#!/usr/bin/env node
'use strict';
/**
 * cli.js — Chinese/Western calendar CLI converter
 *
 * Usage: node cli.js <西元年> <月> <日>
 * Example: node cli.js 2024 3 15
 */

const { solarToLunar, MONTH_NAMES, DAY_NAMES } = require('./calendar-core');
const data = require('./data.json');

const [, , yearArg, monthArg, dayArg] = process.argv;

if (!yearArg || !monthArg || !dayArg) {
  console.log('用法: node cli.js <西元年> <月> <日>');
  console.log('範例: node cli.js 2024 3 15');
  process.exit(0);
}

const gy = parseInt(yearArg, 10);
const gm = parseInt(monthArg, 10);
const gd = parseInt(dayArg, 10);

if (!gy || gm < 1 || gm > 12 || gd < 1 || gd > 31) {
  console.error('錯誤：日期格式不正確');
  process.exit(1);
}

const lunar = solarToLunar(gy, gm, gd);

if (!lunar) {
  console.error(`錯誤：${gy}年超出支援範圍（1201–2199 年）`);
  process.exit(1);
}

// Look up era names from data.json
const row = data.find(r => r.west === String(lunar.lunarYear)) || {};

// Format month name (add 閏 prefix for leap months)
const monthName = (lunar.isLeap ? '閏' : '') + MONTH_NAMES[lunar.lunarMonth - 1];

// Format day name using the same patch as the browser UI
let dayName = DAY_NAMES[lunar.lunarDay - 1];
dayName = dayName.replace(/^初/, '');      // 初一→一, 初二→二 …
dayName = dayName.replace(/廿/, '二十');   // 廿一→二十一 …

console.log(`西元 ${gy}年${gm}月${gd}日 → ${lunar.ganZhi}年${monthName}月${dayName}日`);
console.log(`年號：${row.qing  || '—'}  民國：${row.taiwan || '—'}  日本：${row.japan  || '—'}`);
console.log(`歲次：${lunar.ganZhi}`);
