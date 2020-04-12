/*
* -------------------
* 篩選表格資料
* -------------------
*/
function filterList() {
    const input = document.getElementById('filterText').value;
    const table = document.getElementById('year-table');
    const trObj = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < trObj.length; i++) {
        const tdObj = trObj[i].getElementsByTagName('td');
        let limit = 0;

        for (let j = 0; j < tdObj.length; j++) {
            const textValue = tdObj[j].innerText || tdObj[j].textContent;
            if (textValue.indexOf(input) > -1) {
                // console.log(textValue);
                limit++;
            }
        }
        trObj[i].style.display = limit > 0 ? "table-row" : "none";
    }
}

/*
* -------------------
* 回到上方按鈕
* -------------------
*/
window.addEventListener('scroll', scrollHandle);

function scrollHandle() {
    const btn = document.getElementById('gotopBtn');
    const showStatus = document.documentElement.scrollTop > 20 || document.body.scrollTop > 20;
    btn.style.display = showStatus ? "block" : "none";

    // if (document.documentElement.scrollTop > 20 || document.body.scrollTop > 20) {
    //     btn.style.display = "block";
    // } else {
    //     btn.style.display = "none";
    // }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}