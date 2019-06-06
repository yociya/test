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
    if ($ === undefined) {
        return;
    }

    if($('font[size="+1"]').text() == "勤務実績入力"){
        autoInputGetsuji();
    }

    if($('font[size="+1"]').text() == "勤務実績入力（日次用）"){
        autoInputNichiji();
    }

}

function autoInputGetsuji(){
    $('#APPROVALGRD').find('tr').each(
        function (idx, row) {
            var $row = $(row);
            var shour = -1;
            var smin = -1;
            var ehour = -1;
            var emin = -1;
            $row.find('td.mg_normal').each(
                function (colidx, col) {
                    var $col = $(col);
                    if (colidx == 7) {
                        var lst = $col.find('span');
                        if (lst.length >= 3) {
                            shour = $(lst[1]).text();
                            smin = $(lst[2]).text();
                        }
                        if (lst.length >= 6) {
                            ehour = $(lst[4]).text();
                            emin = $(lst[5]).text();
                        }
                    }
                    if (colidx == 8) {
                        var inputs = $col.find('input');
                        if (shour >= 0) {
                            $(inputs[0]).val(shour);
                        }
                        if (smin >= 0) {
                            $(inputs[1]).val(smin);
                        }
                        if (ehour >= 0) {
                            $(inputs[2]).val(ehour);
                        }
                        if (emin >= 0) {
                            $(inputs[3]).val(emin);
                        }
                    }
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
    $('#KNM').find('td.kinmu_normal').each(
        function (idx, col) {
            var $col = $(col);
            if (idx == 2) {
                var lst = $col.find('span');
                if (lst.length >= 3) {
                    shour = $(lst[1]).text();
                    smin = $(lst[2]).text();
                }
                if (lst.length >= 6) {
                    ehour = $(lst[4]).text();
                    emin = $(lst[5]).text();
                }
            }
        }
    );
    if (shour >= 0) {
        $('#KNMTMRNGSTH').val(shour);
    }
    if (smin >= 0) {
        $('#KNMTMRNGSTM').val(smin);
    }
    if (ehour >= 0) {
        $('#KNMTMRNGETH').val(ehour);
    }
    if (emin >= 0) {
        $('#KNMTMRNGETM').val(emin);
    }
}
