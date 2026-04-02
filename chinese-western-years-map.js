'use strict';

let jsonData;

// ######################
// Create table data
// ######################
function getData(jData) {
    const data = JSON.parse(jData);
    const table = document.getElementById('year-table');
    const tbody = table.querySelector('tbody');

    data.forEach((item, id) => {
        const trObj = document.createElement('tr');
        trObj.innerHTML = `<td>${item.west}</td>
                        <td>${item.qing}</td>
                        <td>${item.taiwan}</td>
                        <td>${item.japan}</td>
                        <td>${item.china}</td>`;
        trObj.classList.add('table-row', `row-${id}`);
        tbody.appendChild(trObj);
    });
    clickRowHighlight();
}


// ######################
// get JSON
// ######################
(function openJson() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data.json');
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status !== 200) {
            Swal.fire({
                title: '無法載入資料庫',
                text: `HTTP ${this.status}：data.json 載入失敗`,
                icon: 'error',
            });
            return;
        }
        getData(this.responseText);
        jsonData = this.responseText;
    };
})();


// ######################
// filter table data
// ######################
function filterList() {
    const input = document.getElementById('filterText').value;
    const table = document.getElementById('year-table');
    const trObj = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const rows = document.querySelectorAll('.table-row');

    rows.forEach(row => {
        row.classList.remove('row-highlighted');
        row.style.background = '';
    });

    function toHalfWidth(str) {
        return str.replace(/[\uFF10-\uFF19]/g, ch =>
            String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
        );
    }

    const normalizedInput = toHalfWidth(input);

    for (let i = 0; i < trObj.length; i++) {
        const tdObj = trObj[i].getElementsByTagName('td');
        let found = false;
        for (let j = 0; j < tdObj.length; j++) {
            const textValue = toHalfWidth(tdObj[j].innerText || tdObj[j].textContent);
            if (textValue.indexOf(normalizedInput) > -1) {
                found = true;
                break;
            }
        }
        trObj[i].style.display = found ? 'table-row' : 'none';
    }
}


// ######################
// go to top button
// ######################
window.addEventListener('scroll', function () {
    const btn = document.getElementById('gotopBtn');
    btn.style.display =
        (document.documentElement.scrollTop > 20 || document.body.scrollTop > 20)
            ? 'block' : 'none';
});

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


// ######################
// Copy to clipboard + toast
// ######################
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyToast();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showCopyToast() {
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
}


// ######################
// Click to highlight row
// ######################
function clickRowHighlight() {
    const rows = document.querySelectorAll('.table-row');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            if (row.classList.contains('row-highlighted')) {
                row.classList.remove('row-highlighted');
            } else {
                row.classList.add('row-highlighted');
                showRowContent(row);
            }
        });
    });
}

function showRowContent(row) {
    const tds = row.querySelectorAll('td');
    const rowData = Array.from(tds)
        .map(td => td.textContent.trim())
        .filter(t => t !== '');
    copyToClipboard(rowData.join(' '));
    document.getElementById('inputYear').value = tds[0].textContent.trim();
}


// ######################
// Gregorian → Lunar conversion
// ######################
function convertToLunar() {
    const inputYear  = parseInt(document.getElementById('inputYear').value, 10);
    const inputMonth = parseInt(document.getElementById('month').value, 10);
    const inputDay   = parseInt(document.getElementById('day').value, 10);

    // Input validation
    if (!inputYear || !inputMonth || !inputDay ||
        inputMonth < 1 || inputMonth > 12 ||
        inputDay < 1   || inputDay > 31) {
        Swal.fire({ title: '請輸入正確的年、月、日', icon: 'warning', timer: 3000 });
        return;
    }

    // Convert using calendar-core.js (ytliu0 algorithm)
    const lunar = solarToLunar(inputYear, inputMonth, inputDay);

    if (!lunar) {
        Swal.fire({
            title: `${inputYear}年超出支援範圍`,
            text: '支援範圍為西元 1201–2199 年',
            icon: 'error',
            timer: 8000,
        });
        return;
    }

    // Look up era name from data.json
    const data = JSON.parse(jsonData);
    const result = data.find(item => item.west === String(lunar.lunarYear));
    let filterYear = '';
    if (result) {
        filterYear = result.qing || result.taiwan || '';
    }

    // Build month string  (正月 / 閏X月)
    const monthName = (lunar.isLeap ? '閏' : '') + MONTH_NAMES[lunar.lunarMonth - 1];

    // Build day string: remove 初 prefix, convert 廿 → 二十
    let dayName = DAY_NAMES[lunar.lunarDay - 1];
    dayName = dayName.replace(/^初/, '');
    dayName = dayName.replace(/廿/, '二十');

    const lunarResult = `${filterYear}年${monthName}月${dayName}日（歲次${lunar.ganZhi}）`;

    document.getElementById('lunar_input').textContent =
        `西元${inputYear}年${inputMonth}月${inputDay}日`;
    document.getElementById('lunar_year_result').textContent = lunarResult;
    document.querySelector('.lunar-display').style.display = 'block';
}

// Click lunar result to copy
function handleLunarClick() {
    const text = document.getElementById('lunar_year_result').textContent;
    copyToClipboard(text);
}

// Enter key: only trigger conversion when NOT in the filter input
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && event.target.id !== 'filterText') {
        event.preventDefault();
        convertToLunar();
    }
});
