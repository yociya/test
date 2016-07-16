var historyUrl = 'https://www.amazon.co.jp/gp/css/order-history?orderFilter=year-$year$&startIndex=$index$';

function beforeSendHook(xhr){
    xhr.setRequestHeader('X-Requested-With'
        , {
            toString:   function(){ 
                            return '';
                        }
           }
    );
}

function getPage(year,page){
    var pageIndex = page * 10;
    var $deferred = $.Deferred();
    
    $.Deferred().resolve().then(
        function(){
            return $.ajax(
                        {
                            url:historyUrl.replace('$index$',pageIndex).replace('$year$',year)
                           ,beforeSend:beforeSendHook
                        }
                   );
        }
    ).then(
        function(data){
            var dom = $.parseHTML(data);
            return $deferred.resolve(dom);
        }
    ).fail(
        function(jqXHR, msg){
            return $deferred.reject(msg);
        }
    );
    return $deferred.promise();
}

function extract(results,dom,year){
    var $page = $(dom);
    $page.find('span.value:contains(￥)').each(
        function(idx,priceTag){
            var $priceTag = $(priceTag);
            var price = Number($priceTag.text().replace(',','').replace('￥','').trim());
            results[year]['price'].push(price);
            if(price > results[year]['maxPrice']){
                results[year]['maxPrice'] = price;
            }
        }
    );
    var page = $page.find('div.pagination-full li.a-last').prev().text();
    if(page !== ''){
        results[year]['lastPage'] = Number(page);
    }
    var orderCount = $page.find('span.num-orders').text();
    results[year]['orderCount'] = orderCount;
}

function process(results,year,page){
    var $deferred = $.Deferred();
    
    $.Deferred().resolve().then(
        function(){
            return getPage(year,page);
        }
    ).then(
        function(dom){
            extract(results,dom,year);
            console.log('----' + year + ' - ' + (page + 1) + '/' + results[year]['lastPage']);
            return recursiveCall(results,year,page+1);
        }
    ).then(
        function(){
            return $deferred.resolve();
        }
    ).fail(
        function(msg){
            return $deferred.reject(msg);
        }
    );
    return $deferred.promise();
}

function recursiveCall(results,startYear,page){
    
    var $deferred = $.Deferred();
    
    $.Deferred().resolve().then(
        function(){
            var nextYear = startYear;
            var nextPage = page;
            if(page >= results[startYear]['lastPage']){
                nextYear = startYear + 1;
                nextPage = 0;
            }
            if(!!!results[nextYear]){
                return $deferred.resolve();
            }
            return process(results,nextYear,nextPage);
        }
    ).then(
        function(){
            return $deferred.resolve();
        }
    ).fail(
        function(msg){
            return $deferred.reject(msg);
        }
    );
    return $deferred.promise();
}

function sumYearItems(item){
    var sumPrice = 0;
    $.each(item,
        function(index,price){
            sumPrice += price;
        }
    );
    return sumPrice;
}

function print(results){
    var resultText = '';
    var allPrice = 0;
    
    $.each(results,
        function(index,item){
            var price = sumYearItems(item['price']);
            allPrice += price;
            resultText = resultText 
                            + index + '年 : '
                            + ('            ' + price.toLocaleString()).slice(-12) + ' 円 '
                            + ('    ' + item['orderCount']).slice(-5)
                            + ' 最高額 ： ' + ('            ' + item['maxPrice'].toLocaleString()).slice(-12) + ' 円 '
                            + '\r\n';
        }
    );
    resultText = resultText + '総合計 : ' + allPrice.toLocaleString() + ' 円';
    console.log(resultText);
}

function start(){
    var results = {};
    var startYear = 0;
    
    $('form.time-period-chooser option:contains(年)').each(
        function(idx,yearTag){
            var $yearTag = $(yearTag);
            var year = Number($yearTag.text().replace('年','').trim());
            results[year] = {lastPage:1,price:[],orderCount:'0件',maxPrice:0};
            startYear = year;
        }
    );
    
    var $deferred = $.Deferred();
    
    $.Deferred().resolve().then(
        function(){
            return recursiveCall(results,startYear,0);
        }
    ).then(
        function(){
            print(results);
            return $deferred.resolve();
        }
    ).fail(
        function(msg){
            return $deferred.reject(msg);
        }
    );
    return $deferred.promise();
}

var d=document;
var s=d.createElement('script');
s.src='https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';
s.onload=start;
d.body.appendChild(s);
