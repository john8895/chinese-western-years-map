'use strict';
/**
 * calendar-core.js
 * Chinese lunar calendar conversion based on ytliu0/ChineseCalendar data.
 * Algorithm reference: https://github.com/ytliu0/ChineseCalendar (GPL-3.0)
 *
 * Supports years 1200–2200 CE.
 * Works in both browser (<script> tag) and Node.js (require/module.exports).
 */

// ---------------------------------------------------------------------------
// Name arrays
// ---------------------------------------------------------------------------

const MONTH_NAMES = ['正','二','三','四','五','六','七','八','九','十','十一','十二'];

// Build DAY_NAMES the same way ytliu0 does.
const DAY_NAMES = (function () {
  const nums = MONTH_NAMES;
  const days = ['初一'];
  for (let i = 2; i < 11; i++) days.push('初' + nums[i - 1]);
  days.push('十一');
  for (let i = 12; i < 20; i++) days.push('十' + nums[i - 11]);
  days.push('二十');
  days.push('廿一');
  for (let i = 22; i < 30; i++) days.push('廿' + nums[i - 21]);
  days.push('三十');
  return days;
})();

const STEMS   = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Is the given Gregorian year a leap year?
 * Uses proleptic Gregorian rules (acceptable for 1200–2200 CE).
 */
function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/**
 * Number of days from Dec 31 of (gy-1) to the given date (Jan 1 = 1).
 */
function dayOfYear(gy, gm, gd) {
  const dpm = [0, 31, isLeapYear(gy) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let d = gd;
  for (let i = 1; i < gm; i++) d += dpm[i];
  return d;
}

/**
 * Sort a raw ChineseToGregorian row into chronological month arrays.
 * Adapted from ytliu0's sortMonths().
 *
 * @param {number[]} row - one entry from ChineseToGregorian()
 * @returns {{ cmonthDate: number[], cmonthNum: number[] }}
 *   cmonthNum: positive = regular month, negative = leap month
 */
function sortMonths(row) {
  const leapM = row[14];
  const cmonthDate = [];
  const cmonthNum = [];

  if (leapM === 0) {
    for (let i = 0; i < 12; i++) {
      cmonthDate.push(row[i + 1]);
      cmonthNum.push(i + 1);
    }
  } else {
    for (let i = 0; i < leapM; i++) {
      cmonthDate.push(row[i + 1]);
      cmonthNum.push(i + 1);
    }
    cmonthDate.push(row[13]);   // leap month start
    cmonthNum.push(-leapM);     // negative = leap
    for (let i = leapM + 1; i < 13; i++) {
      cmonthDate.push(row[i]);
      cmonthNum.push(i);
    }
  }
  return { cmonthDate, cmonthNum };
}

/**
 * Locate which month and day a date falls in within a sorted month list.
 *
 * @param {{ cmonthDate: number[], cmonthNum: number[] }} months
 * @param {number} dd - day offset from Dec 31 of some reference year
 * @param {number} lunarYear - the Chinese year these months belong to
 * @returns {object} result
 */
function findInMonths(months, dd, lunarYear) {
  const { cmonthDate, cmonthNum } = months;
  const n = cmonthDate.length;

  // Find index of the month containing dd
  let monthIdx = n - 1;
  for (let i = 0; i < n - 1; i++) {
    if (dd < cmonthDate[i + 1]) {
      monthIdx = i;
      break;
    }
  }

  const rawMonth = cmonthNum[monthIdx];
  const isLeap = rawMonth < 0;
  const lunarMonth = Math.abs(rawMonth);
  const lunarDay = dd - cmonthDate[monthIdx] + 1;
  const ganZhi = STEMS[(lunarYear + 6) % 10] + BRANCHES[(lunarYear + 8) % 12];

  return { lunarYear, lunarMonth, lunarDay, isLeap, ganZhi };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Convert a Gregorian (solar) date to the Chinese lunar calendar.
 *
 * @param {number} gy  Gregorian year
 * @param {number} gm  Gregorian month (1-12)
 * @param {number} gd  Gregorian day (1-31)
 * @returns {{
 *   lunarYear:  number,   // Chinese year (approx = Western year)
 *   lunarMonth: number,   // Lunar month (1-12)
 *   lunarDay:   number,   // Day of lunar month (1-30)
 *   isLeap:     boolean,  // true if this month is a leap month
 *   ganZhi:     string    // e.g. '甲辰'
 * } | null}  null if out of supported range
 */
function solarToLunar(gy, gm, gd) {
  // Lazy-load the data table (avoids double-parsing in browser when called
  // multiple times; in Node.js require() is already cached).
  const data = (typeof ChineseToGregorian !== 'undefined')
    ? ChineseToGregorian()
    : require('./calendarData').ChineseToGregorian();

  const BASE = data[0][0];       // -105 (or 1200 in compact file — checked below)
  const LAST = data[data.length - 1][0];

  // Need data for gy and gy-1
  if (gy - 1 < BASE || gy > LAST) return null;

  const idx = gy - BASE;         // index of the row for Gregorian year gy

  const dd = dayOfYear(gy, gm, gd);
  const currRow = data[idx];
  const currMonths = sortMonths(currRow);

  if (dd >= currMonths.cmonthDate[0]) {
    // Date is at or after Chinese New Year of gy → belongs to Chinese year gy
    return findInMonths(currMonths, dd, currRow[0]);
  }

  // Date is before Chinese New Year → belongs to Chinese year gy-1
  const prevRow = data[idx - 1];
  const prevMonths = sortMonths(prevRow);
  const ndaysPrev = isLeapYear(gy - 1) ? 366 : 365;
  // prevRow day offsets are relative to Dec 31 of gy-2;
  // dd is relative to Dec 31 of gy-1; adjust dd to same reference.
  const ddAdj = dd + ndaysPrev;
  return findInMonths(prevMonths, ddAdj, prevRow[0]);
}

// ---------------------------------------------------------------------------
// Node.js / browser dual export
// ---------------------------------------------------------------------------
if (typeof module !== 'undefined') {
  module.exports = { solarToLunar, MONTH_NAMES, DAY_NAMES, STEMS, BRANCHES };
}
