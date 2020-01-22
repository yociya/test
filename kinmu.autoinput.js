var retryCount = 0;
var findElemIntervalId = setInterval(findElementForWait , 1000);

function findElementForWait(){
    retryCount++;
    if(retryCount > 60){
        clearInterval(findElemIntervalId);
        findElemIntervalId = -1;
    }
    var td = document.querySelector('table[summary=contents]');
    if(td){
        clearInterval(findElemIntervalId);
        findElemIntervalId = -1;
        autoInput();
    }
    console.log('wait loading...')
}

function autoInput(){
    if(document.querySelector('font[size="+1"]').textContent == "勤務実績入力"){
        autoInputGetsuji();
    }

    if(document.querySelector('font[size="+1"]').textContent == "勤務実績入力（日次用）"){
        autoInputNichiji();
    }

}

function autoInputGetsuji(){
    var $grid = document.querySelector('#APPROVALGRD');
    $grid.querySelectorAll('tr').forEach(
        function ($row) {
            var shour = -1;
            var smin = -1;
            var ehour = -1;
            var emin = -1;
            var colidx = 0
            $row.querySelectorAll('td.mg_normal').forEach(
                function ($col) {
                    if (colidx == 7) {
                        var lst = $col.querySelectorAll('span');
                        if (lst.length >= 3) {
                            shour = lst[1].textContent;
                            smin = lst[2].textContent;
                        }
                        if (lst.length >= 6) {
                            ehour = lst[4].textContent;
                            emin = lst[5].textContent;
                        }
                    }
                    if (colidx == 8) {
                        var inputs = $col.querySelectorAll('input');
                        if (shour >= 0 && smin >= 0) {
                            inputs[2].value = shour + ':' + smin;
                        }
                        if (ehour >= 0 && emin >= 0) {
                            inputs[5].value = ehour + ':' + emin;
                        }
                    }
                    colidx += 1;
                }
            );
        }
    );
}
function autoInputNichiji(){
    var shour = -1;
    var smin = -1;
    var ehour = -1;
    var emin = -1;
    var $grid = document.querySelector('#KNM');
    var idx = 0;
    $grid.querySelectorAll('td.kinmu_normal').forEach(
        function ($col) {
            if (idx == 2) {
                var lst = $col.querySelectorAll('span');
                if (lst.length >= 3) {
                    shour = lst[1].textContent;
                    smin = lst[2].textContent;
                }
                if (lst.length >= 6) {
                    ehour = lst[4].textContent;
                    emin = lst[5].textContent;
                }
            }
            idx += 1;
        }
    );
    var update = false;
    if (shour >= 0) {
        if(document.querySelector('#KNMTMRNGSTH').value != shour) {
            update = true;
        }
        document.querySelector('#KNMTMRNGSTH').value = shour;
    }
    if (smin >= 0) {
        if(document.querySelector('#KNMTMRNGSTM').value != smin) {
            update = true;
        }
        document.querySelector('#KNMTMRNGSTM').value = smin;
    }
    if (shour >= 0 && smin >= 0) {
        if(document.querySelector('[name=KNMTMRNGSTDI]').value != shour + ':' + smin) {
            update = true;
        }
        document.querySelector('[name=KNMTMRNGSTDI]').value = shour + ':' + smin;
    }
    if (ehour >= 0) {
        if(document.querySelector('#KNMTMRNGETH').value != ehour) {
            update = true;
        }
        document.querySelector('#KNMTMRNGETH').value = ehour;
    }
    if (emin >= 0) {
        if(document.querySelector('#KNMTMRNGETM').value != emin) {
            update = true;
        }
        document.querySelector('#KNMTMRNGETM').value = emin;
    }
    if (ehour >= 0 && emin >= 0) {
        if(document.querySelector('[name=KNMTMRNGETDI]').value != ehour + ':' + emin) {
            update = true;
        }
        document.querySelector('[name=KNMTMRNGETDI]').value = ehour + ':' + emin;
    }
    if (update) {
        document.querySelector('#btnCalc0').click();
    }
}
