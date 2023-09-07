// ######################
// Window Onload Focus Input
// ######################
// window.addEventListener('load', focusFun);
window.addEventListener('load', () => {
    focusFun();
    clickRowHighlight();
});

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
        trObj.classList.add('table-row',`row-${id}`);
        tbody.appendChild(trObj);
    })
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

    //依 tr => td 依序搜尋比對，只要每一列比對到有相同的資料，就顯示該列
    for (let i = 0; i < trObj.length; i++) {
        const tdObj = trObj[i].getElementsByTagName('td');
        let limit = 0;
        for (let j = 0; j < tdObj.length; j++) {
            const textValue = tdObj[j].innerText || tdObj[j].textContent;
            if (textValue.indexOf(input) > -1) {
                limit++;
            }
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
function clickRowHighlight(){
    const rows = document.querySelectorAll('.table-row');
    rows.forEach((row, key) => {
        row.addEventListener('click', ()=>{
            const target = row.getAttribute('style');
            if(target === null || target === '' || target == 'display: table-row;'){
                row.style.backgroundColor = '#fffa4c';
                
                showRowContent(row);  // 取出TD包含的內容
            }else if(target.indexOf('background') > -1){
                row.style.background = '';
            }
         })
    })
}
// onload = function() { clickRowHighlight(); }


function copyToClipboard(text) {
    navigator.clipboard.writeText(text)  // 使用 Clipboard API 写入文本到剪贴板
        .then(() => {
            console.log('Text copied to clipboard');
            Swal.fire({
                title: '已複製到剪貼簿!',
                icon: 'success',
                timer: 1000,
            })
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}

function showRowContent(row) {
    const tds = row.querySelectorAll('td');  // 获取当前行中的所有 <td> 元素
    const rowData = Array.from(tds).map(td => td.textContent.trim());  // 将每个 <td> 元素的文本内容去除空白，并放入数组中
    // console.log(rowData);
    const filterRowData = rowData.filter(element => element !== "");
    const joinedData = filterRowData.join(' ');  // 将数组元素以逗号分隔连接成一行数据
    console.log(joinedData);  // 输出拼接后的一行数据

    copyToClipboard(joinedData);  // 复制 joinedData 到剪贴板
}
