var jsonData;
// ######################
// Window Onload Focus Input
// ######################
function focusFun() {
    const input = document.getElementById('filterText');
    input.focus();
}


// Custom Function : Multiple SetAttribute
// ----------------------------
function setAttributes(element, attrs) {
    Object.keys(attrs).forEach(key => element.setAttribute(key, attrs[key]));
}


// ######################
// Create table data
// ######################
function getData(jData) {
    let data = JSON.parse(jData);
    let table = document.getElementById('year-table');
    let tbody = table.querySelector('tbody');

    data.forEach((item, id) => {
        let trObj = document.createElement('tr');
        let row = `<td>${item.west}</td>
                        <td>${item.qing}</td>
                        <td>${item.taiwan}</td>
                        <td>${item.japan}</td>
                        <td>${item.china}</td>`
        trObj.innerHTML = row;
        trObj.classList.add('table-row', `row-${id}`);
        tbody.appendChild(trObj);
    })
    clickRowHighlight();
}


// ######################
// get JSON
// ######################
(function openJson() {
    let xhr = new XMLHttpRequest();
    xhr.open('get', 'data.json');
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        getData(this.responseText);
        jsonData = this.responseText;
    }
})()


// ######################
// filter table data
// ######################
function filterList() {
    const input = document.getElementById('filterText').value;
    const table = document.getElementById('year-table');
    const trObj = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const rows = document.querySelectorAll('.table-row');

    rows.forEach(row => row.style.background = '');  // Remove All Rows Background Color

    // 將全型數字轉換為半型數字的函數  
    function toHalfWidth(str) {  
        return str.replace(/[\uFF10-\uFF19]/g, function(match) {  
            return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);  
        });  
    }  

    const normalizedInput = toHalfWidth(input); 
    
    //依 tr => td 依序搜尋比對，只要每一列比對到有相同的資料，就顯示該列
    for (let i = 0; i < trObj.length; i++) {
        const tdObj = trObj[i].getElementsByTagName('td');
        let limit = 0;
        for (let j = 0; j < tdObj.length; j++) {
            const textValue = tdObj[j].innerText || tdObj[j].textContent;
            const normalizedTextValue = toHalfWidth(textValue);  
            if (normalizedTextValue.indexOf(normalizedInput) > -1) {  
                limit++;  
            } 
            // if (textValue.indexOf(input) > -1) {
            //     limit++;
            // }
        }
        //如果比對到資料，就給table-row，否則隱藏
        trObj[i].style.display = limit > 0 ? "table-row" : "none";
    }
}


// ######################
// go to top button
// ######################
window.addEventListener('scroll', scrollHandle);

function scrollHandle() {
    const btn = document.getElementById('gotopBtn');
    const showStatus = document.documentElement.scrollTop > 20 || document.body.scrollTop > 20;
    btn.style.display = showStatus ? "block" : "none";
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


// ######################
// Click to HighLight Row
// ######################
function clickRowHighlight() {
    const rows = document.querySelectorAll('.table-row');
    rows.forEach((row, key) => {
        row.addEventListener('click', () => {
            const target = row.getAttribute('style');
            if (target === null || target === '' || target == 'display: table-row;') {
                row.style.backgroundColor = '#fffa4c';
                showRowContent(row);  // 取出TD包含的內容
            } else if (target.indexOf('background') > -1) {
                row.style.background = '';
            }
        })
    })
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)  // 使用 Clipboard API 写入文本到剪贴板
        .then(() => {
            // console.log('Text copied to clipboard');
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

function showRowContent(row) {
    const tds = row.querySelectorAll('td');  // 获取当前行中的所有 <td> 元素
    const rowData = Array.from(tds).map(td => td.textContent.trim());  // 将每个 <td> 元素的文本内容去除空白，并放入数组中
    const filterRowData = rowData.filter(element => element !== "");
    const joinedData = filterRowData.join(' ');  // 将数组元素以逗号分隔连接成一行数据
    // console.log(joinedData);  // 输出拼接后的一行数据
    copyToClipboard(joinedData);  // 复制 joinedData 到剪贴板
    document.getElementById("inputYear").value = tds[0].textContent;
}


// 
function convertToLunar() {
    // 获取用户输入的年、月、日期
    var inputYear = parseInt(document.getElementById("inputYear").value);
    var inputMonth = parseInt(document.getElementById("month").value);
    var inputDay = parseInt(document.getElementById("day").value);

    // 输入日期轉農曆
    var inputDate = Solar.fromYmd(inputYear, inputMonth, inputDay);
    var lunar = inputDate.getLunar();

    // 在JSON中查詢年份
    var lunarYear = lunar.getYear();   // 获取农历年份
    const data = JSON.parse(jsonData)
    var result = data.filter(item => item.west == lunarYear);  // 查詢出年份
    let filterYear = '';

    if (result.length > 0) {  // 如果查詢結果大於0
        var filteredItem = result[0];
        if (filteredItem.qing) {
            filterYear = filteredItem.qing;  // 有清朝年號
        } else {
            filterYear = filteredItem.taiwan;  // 沒清朝年號顯示台灣年號
        }
    } else {
        Swal.fire({
            title: `資料庫查不到${lunarYear}年!`,
            icon: 'error',
            timer: 10000,
        })
    }

    // 輸出結果前整理字串
    let monthInChinese = lunar.getMonthInChinese();
    let dayInChinese = lunar.getDayInChinese();
    filterYear = filterYear.replace(/\s/g, "");
    monthInChinese = monthInChinese.replace(/正/g, "元");
    monthInChinese = monthInChinese.replace(/冬/g, "十一");
    monthInChinese = monthInChinese.replace(/腊/g, "十二");
    monthInChinese = monthInChinese.replace(/闰/g, "閏");
    dayInChinese = dayInChinese.replace(/廿/g, "二十");
    dayInChinese = dayInChinese.replace(/初/g, "");

    const lunarResult = `${filterYear}年${monthInChinese}月${dayInChinese}日(歲次${lunar.getYearInGanZhi()})`;

    // 顯示輸入的資訊
    const userInputDate = `西元${inputYear}年${inputMonth}月${inputDay}日`;
    var inputDisplay = document.getElementById('lunar_input');
    inputDisplay.textContent = userInputDate;
    // 顯示轉換農曆後的結果
    var resultElementYear = document.getElementById('lunar_year_result');
    resultElementYear.textContent = lunarResult;
}

// 點選轉農曆結果自動複製
function handleLunarClick() {
    var lunarYearResult = document.getElementById("lunar_year_result");
    var textContent = lunarYearResult.textContent;
    copyToClipboard(textContent);
}


// 监听输入框的键盘事件，如果按下 Enter 键，则执行转换为农历的功能
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // 防止默认的 Enter 键提交行为
        convertToLunar();
    }
});
