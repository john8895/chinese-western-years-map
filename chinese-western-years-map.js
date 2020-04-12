window.addEventListener('load', focusFun);

function focusFun() {
    const input = document.getElementById('filterText');
    input.focus();
}

/*
* -------------------
* 篩選表格資料
* -------------------
*/
function filterList() {
    const input = document.getElementById('filterText').value;
    const table = document.getElementById('year-table');
    const trObj = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

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

        //如果全部比對不到，顯示「查不到資料」欄位
        // const prompt = document.getElementById('prompt');
        // prompt.style.display = limit > 0 ? "none" : "table-row";
    }


}

// function filterNotData(){
//     const table = document.getElementById('year-table');
//     const trObj = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
//
//     for (let i = 0; i < trObj.length; i++) {
//         console.log(trObj[i].style.display);
//         console.log(trObj.length);
//         // p_limit = trObj[i].style.display === "none" ? p_limit++ : p_limit;
//         // console.log(p_limit);
//
//
//     }
// }

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