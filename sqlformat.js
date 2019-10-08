document.querySelector('#format').addEventListener('click', buttonAction);
document.querySelector('#bfsql').focus();
document.execCommand('paste');

function buttonAction(event) {
    var $bfsql = document.querySelector('#bfsql');
    var bfsqltext = $bfsql.value;
    var result = format(bfsqltext);
    var $afsql = document.querySelector('#afsql');
    $afsql.value = result;
    $afsql.select();
    document.execCommand('copy');
}

function format(sql) {
    var result = sql;
    result = result.replace(/\n/g, ' ');
    result = result.replace(/ +/g, ' ');
    result = result.replace(/ ?, ?/g, ',');
    result = result.replace(/ ?= ?/g, '=');
    result = result.replace(/ ?!= ?/g, '!=');
    result = result.replace(/ ?<> ?/g, '<>');
    result = result.replace(/ ?<= ?/g, '<=');
    result = result.replace(/ ?>= ?/g, '>=');
    result = result.replace(/ ?< ?/g, '<');
    result = result.replace(/ ?> ?/g, '>');

    result = result.replace(/select /ig, 'SELECT ');
    result = result.replace(/distinct /ig, 'DISTINCT ');
    result = result.replace(/from /ig, 'FROM ');
    result = result.replace(/where /ig, 'WHERE ');
    result = result.replace(/order /ig, 'ORDER ');
    result = result.replace(/ by /ig, ' BY ');
    result = result.replace(/ and /ig, ' AND ');
    result = result.replace(/ or /ig, ' OR ');
    result = result.replace(/ not /ig, ' NOT ');
    result = result.replace(/ in /ig, ' IN ');

    result = result.replace(/to_char\(/ig, 'TO_CHAR(');
    result = result.replace(/to_number\(/ig, 'TO_NUMBER(');
    result = result.replace(/to_date\(/ig, 'TO_DATE(');

    result = result.replace(/get_val\(/ig, 'GET_VAL(');
    result = result.replace(/count\(/ig, 'COUNT(');

    result = result.replace(/and\(/ig, 'AND (');
    result = result.replace(/or\(/ig, 'OR (');

    result = result.replace(/companycom\./ig, 'COMPANYCOM.');

    result = result.replace(/=/g, ' = ');
    result = result.replace(/!=/g, ' != ');
    result = result.replace(/<>/g, ' <> ');
    result = result.replace(/</g, ' < ');
    result = result.replace(/>/g, ' > ');
    result = result.replace(/ <  = /g, ' <= ');
    result = result.replace(/ >  = /g, ' >= ');

    result = result.replace(/SELECT /g, 'SELECT \n      ');
    result = result.replace(/SELECT \n      DISTINCT /g, 'SELECT DISTINCT\n      ');
    result = result.replace(/FROM /g, '\n  FROM\n      ');
    result = result.replace(/WHERE /g, '\n WHERE\n       ');
    result = result.replace(/AND /g, '\n   AND ');
    result = result.replace(/OR /g, '\n    OR ');
    result = result.replace(/ORDER BY /g, '\n ORDER BY ');
    result = select(result, 0);
    result = from(result, 0);
    return result;

    function select(target, index) {
        if (index < 0) {
            return target;
        }
        var selectstart = target.indexOf('SELECT ', index);
        if (selectstart < 0) {
            console.log('selectstart < 0');
            return target;
        }
        var fromstart = searchOpenClose(target, selectstart, /SELECT /g, ' FROM\n');
        var af = target.substring(fromstart, target.length);
        var newsql = cutReplace(target, /,/g, '\n     ,', selectstart, fromstart);
        console.log('replaces:' + newsql);
        newsql = bracketsOpen(newsql, selectstart, fromstart);
        console.log('brackets:' + newsql);
        var nextindex = newsql.indexOf(af);
        return select(newsql, nextindex);
    }

    function from(target, index) {
        if (index < 0) {
            return target;
        }
        var fromstart = target.indexOf(' FROM\n', index);
        if (fromstart < 0) {
            return target;
        }
        var wherestart = searchOpenClose(target, fromstart, / FROM\n/g, ' WHERE\n');
        if (wherestart < 0) {
            wherestart = searchOpenClose(target, fromstart, / FROM\n/g, ' ORDER BY ');
            if (wherestart < 0) {
                wherestart = target.length;
            }
        }
        var af = target.substring(wherestart, target.length);
        var newsql = cutReplace(target, /,/g, '\n     ,', fromstart, wherestart);
        newsql = bracketsOpen(newsql, fromstart, wherestart);
        var nextindex = newsql.indexOf(af);
        if (wherestart == target.length || target.length == newsql.length) {
            return newsql;
        }
        return from(newsql, nextindex);
    }

    function bracketsOpen(s, index, endindex) {
        var openindex = s.indexOf('(', index);
        if (openindex < 0 || endindex < openindex) {
            return s;
        }
        var closeindex = searchOpenClose(s, openindex, /\(/g, ')');
        var commaindex = s.indexOf('\n     ,');
        if (commaindex < 0) {
            return s;
        }
        if (closeindex > commaindex) {
            var news = cutReplace(s, /\n     ,/g, ',', openindex, closeindex);
            return bracketsOpen(news, closeindex + 1, endindex);
        }
        return bracketsOpen(s, closeindex + 1, endindex);
    }

    function cutReplace(target, search, reptext, st, en) {
        var rep = target.substring(st, en);
        var bfrep = rep;
        rep = rep.replace(search, reptext);
        if (rep == bfrep) {
            return target;
        }
        var bf = target.substring(0, st);
        var af = target.substring(en, target.length);
        var newsql = bf + rep + af;
        return newsql;
    }

    function searchOpenClose(s, openindex, opentag, closetag) {
        var closeindex = s.indexOf(closetag, openindex);
        var ss = s.substring(openindex + 1, closeindex);
        var ar = ss.match(opentag);
        if (ar == null) {
            return closeindex;
        } else {
            for (var i = 0; i < ar.length; i++) {
                closeindex = s.indexOf(closetag, closeindex + 1);
            }
            return closeindex;
        }
    }
}
