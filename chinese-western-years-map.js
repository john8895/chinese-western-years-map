// ######################
// Window Onload Focus Input
// ######################
window.addEventListener('load', focusFun);

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
            }else if(target.indexOf('background') > -1){
                row.style.background = '';
            }
         })
    })
}
// onload = function() { clickRowHighlight(); }
clickRowHighlight();
