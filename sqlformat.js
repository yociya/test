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

function format(sql){
    var result = sql;
    result = result.replace(/\n/g,' ');
    result = result.replace(/ +/g,' ');
    result = result.replace(/select /ig,'SELECT ');
    result = result.replace(/from /ig,'FROM ');
    result = result.replace(/where /ig,'WHERE ');
    result = result.replace(/order /ig,'ORDER ');
    result = result.replace(/by /ig,'BY ');
    result = result.replace(/and /ig,'AND ');
    result = result.replace(/or /ig,'OR ');
    
    result = result.replace(/AND\(/g,'AND (');
    result = result.replace(/OR\(/g,'OR (');

    result = result.replace(/SELECT DISTINCT /g,  'SELECT DISTINCT\n      ');
    result = result.replace(/FROM /g           ,'\n  FROM\n       ');
    result = result.replace(/WHERE /g          ,'\n WHERE\n       ');
    result = result.replace(/AND /g            ,'\n   AND ');
    result = result.replace(/OR /g             ,'\n    OR ');
    result = result.replace(/ORDER BY /g       ,'\n ORDER BY ');
    result = select(result,0);
    return result;
    
    function select(target,index){
        if(index < 0) {
            return target;
        }
        var selectstart = target.indexOf('SELECT ',index);
        if(selectstart < 0) {
            return target;
        }
        var fromstart = target.indexOf(' FROM\n',selectstart);
        var af = target.substring(fromstart,target.length);
        var newsql = cutReplace(target,/,/g,'\n     ,',selectstart,fromstart);
        newsql = bracketsOpen(newsql,selectstart,fromstart);
        var nextindex = newsql.indexOf(af);
        return select(newsql,nextindex);
    }
    function bracketsOpen(s,index,endindex) {
        var openindex = s.indexOf('(',index);
        if(openindex < 0 || endindex < openindex) {
            return s;
        }
        var closeindex = searchBracketsClose(s,openindex);
        var commaindex = s.indexOf('\n     ,');
        if(commaindex < 0){
            return s;
        }
        if(closeindex > commaindex) {
            var news = cutReplace(s,/\n     ,/g,',',openindex,closeindex);
            return bracketsOpen(news,closeindex+1,endindex);
        }
        return bracketsOpen(s,closeindex+1,endindex);
    }
    function cutReplace(target,search,reptext,st,en) {
        var rep = target.substring(st,en);
        rep = rep.replace(search,reptext);
        var bf = target.substring(0,st);
        var af = target.substring(en,target.length);
        var newsql = bf + rep + af;
        return newsql;
    }
    function searchBracketsClose(s,openindex) {
        var closeindex = s.indexOf(')',openindex);
        var ss = s.substring(openindex+1,closeindex);
        var ar = ss.match(/\(/g);
        if(ar == null) {
            return closeindex;
        } else {
            for (var i=0;i<ar.length;i++) {
                closeindex = s.indexOf(')',closeindex+1);
            }
            return closeindex;
        }
    }
}
