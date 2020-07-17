// Форма поиска ( Сразу же помечаем объект поиска, как инициализированный, чтобы случайно не инициализировать его дважды.)
function SearchFieldInit(obj) {
  // Блок в котором лежит поле поиска
  obj.f_search = obj.find('.search__form');
  // Если поля поиска не нашлось, завершаем работу, ничего страшного.
  if(0 == obj.f_search.length) {
    return false;
  }
  // Поле поиска товара
  obj.s_search = obj.f_search.find('.search__input');
  // Обнуление данных в форме поиска
  obj.s_reset  = obj.f_search.find('.search__reset');
  // Проверка на существование функции проверки поля и действий с ним
  if(typeof(obj.SearchFieldCheck) != 'function') {
    console.log('function SearchFieldCheck is not found in object for SearchFieldInit', {status: 'error'});
    return false;
  // Проверка, сколько полей поиска нам подсунули за раз на инициализацию
  } else if(1 < obj.f_search.length) {
    console.log('function SearchFieldInit must have only one search object', {status: 'error'});
    return false;
  }
  // Создаём функцию которая будет отвечать за основные действия с полем поиска
  obj.__SearchFieldCheck = function (isAfter) {
    // Если в поле текста есть вбитые данные
    if(obj.s_search.val().length) {
      obj.f_search.addClass('search__filled');
      obj.f_search.parent().addClass('search__filled');
    } else {
      obj.f_search.removeClass('search__filled');
      obj.f_search.parent().removeClass('search__filled');
    }
    // При нажатии клавиши данных внутри поля ещё нет, так что проверки вернут информацию что менять поле не нужно, хотя как только операция будет завершена данные в поле появятся. Поэтому произведём вторую проверку спустя 2 сотых секунды.
    if(typeof( isAfter ) == "undefined" || !isAfter) {
      setTimeout(function() { obj.__SearchFieldCheck(1); },20);
    }else{
      return obj.SearchFieldCheck();
    }
  }
  // Действия с инпут полем поиска
  obj.s_search.click(function(){
    obj.__SearchFieldCheck();
  }).focus(function(){
    obj.f_search.addClass('search__focused');
    obj.f_search.parent().addClass('search__focused');
    obj.__SearchFieldCheck();
  }).blur(function(){
    obj.f_search.removeClass('search__focused');
    obj.f_search.parent().removeClass('search__focused');
    obj.__SearchFieldCheck();
  }).keyup(function(I){
    switch(I.keyCode) {
      // игнорируем нажатия на эти клавишы
      case 13:  // enter
      case 27:  // escape
      case 38:  // стрелка вверх
      case 40:  // стрелка вниз
      break;
      default:
      obj.f_search.removeClass('search__focused');
      obj.__SearchFieldCheck();
      break;
    }
  }).bind('paste', function(e){
    obj.__SearchFieldCheck();
    setTimeout(function() { obj.__SearchFieldCheck(); },20);
  }).bind('cut', function(e){
    $('#search__result').hide();
    $('#search__result .inner > div').remove();
    obj.__SearchFieldCheck();
  });

  //Считываем нажатие клавиш, уже после вывода подсказки
  var suggestCount;
  var suggestSelected = 0;
  function keyActivate(n){
    var $links = $('#search__result .result__item a');
    $links.eq(suggestSelected-1).removeClass('active');	
    if(n == 1 && suggestSelected < suggestCount){
      suggestSelected++;
    }else if(n == -1 && suggestSelected > 0){
      suggestSelected--;
    }
    if( suggestSelected > 0){
      $links.eq(suggestSelected-1).addClass('active');
    }
  }
  obj.s_search.keydown(function(I){
    switch(I.keyCode) {
    // По нажатию клавиш прячем подсказку
    case 27: // escape
    $('#search__result').hide();
    return false;
    break;
    // Нажатие enter при выделенном пункте из поиска
    case 13: // enter
    if(suggestSelected){
      var $link = $('#search__result .result__item').eq(suggestSelected - 1).find('a');
      var href = $link.attr('href');
      if(href){
        document.location = href
      } else {
        $link.trigger('click')
      }
      return false;
    }
    break;
    // делаем переход по подсказке стрелочками клавиатуры
    case 38: // стрелка вверх
    case 40: // стрелка вниз
    I.preventDefault();
    suggestCount = $('#search__result .result__item').length
    if(suggestCount){
      //делаем выделение пунктов в слое, переход по стрелочкам
      keyActivate(I.keyCode-39);
    }
    break;
    default:
    suggestSelected = 0;
    break;
    }
  });
  // Кнопка обнуления данных в форме поиска
  obj.s_reset.click(function(){
    obj.s_search.val('').focus();
    $('#search__result').hide();
    $('#search__result .inner .result__item').remove();
  });
  // Проверка данных в форме после инициализации функционала. Возможно браузер вставил туда какой-либо текст, нужно обработать и такой вариант
  obj.__SearchFieldCheck();
}

// Аналог php функции.
function htmlspecialchars(text) {
  return text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
}
function substr(str,start,len){str+='';var end=str.length;if(start<0){start+=end;}end=typeof len==='undefined'?end:(len<0?len+end:len+start);return start>=str.length||start<0||start>end?!1:str.slice(start,end);}
function md5(str){var xl;var rotateLeft=function(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));};var addUnsigned=function(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}};var _F=function(x,y,z){return(x&y)|((~x)&z);};var _G=function(x,y,z){return(x&z)|(y&(~z));};var _H=function(x,y,z){return(x^y^z);};var _I=function(x,y,z){return(y^(x|(~z)));};var _FF=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_F(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _GG=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_G(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _HH=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_H(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var _II=function(a,b,c,d,x,s,ac){a=addUnsigned(a,addUnsigned(addUnsigned(_I(b,c,d),x),ac));return addUnsigned(rotateLeft(a,s),b);};var convertToWordArray=function(str){var lWordCount;var lMessageLength=str.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=new Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(str.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;};var wordToHex=function(lValue){var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;wordToHexValue_temp="0"+lByte.toString(16);wordToHexValue=wordToHexValue+wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);}
return wordToHexValue;};var x=[],k,AA,BB,CC,DD,a,b,c,d,S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20,S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;str=this.utf8_encode(str);x=convertToWordArray(str);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;xl=x.length;for(k=0;k<xl;k+=16){AA=a;BB=b;CC=c;DD=d;a=_FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=_FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=_FF(c,d,a,b,x[k+2],S13,0x242070DB);b=_FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=_FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=_FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=_FF(c,d,a,b,x[k+6],S13,0xA8304613);b=_FF(b,c,d,a,x[k+7],S14,0xFD469501);a=_FF(a,b,c,d,x[k+8],S11,0x698098D8);d=_FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);a=_GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=_GG(d,a,b,c,x[k+6],S22,0xC040B340);c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=_GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=_GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=_GG(d,a,b,c,x[k+10],S22,0x2441453);c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=_GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=_GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=_GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=_GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=_GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=_GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=_HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=_HH(d,a,b,c,x[k+8],S32,0x8771F681);c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=_HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=_HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=_HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=_HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=_HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=_HH(b,c,d,a,x[k+6],S34,0x4881D05);a=_HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=_HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=_II(a,b,c,d,x[k+0],S41,0xF4292244);d=_II(d,a,b,c,x[k+7],S42,0x432AFF97);c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=_II(b,c,d,a,x[k+5],S44,0xFC93A039);a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);d=_II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=_II(b,c,d,a,x[k+1],S44,0x85845DD1);a=_II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=_II(c,d,a,b,x[k+6],S43,0xA3014314);b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=_II(a,b,c,d,x[k+4],S41,0xF7537E82);d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=_II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=_II(b,c,d,a,x[k+9],S44,0xEB86D391);a=addUnsigned(a,AA);b=addUnsigned(b,BB);c=addUnsigned(c,CC);d=addUnsigned(d,DD);}
var temp=wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);return temp.toLowerCase();}
function utf8_encode(argString){var string=(argString+'');var utftext="";var start,end;var stringl=0;start=end=0;stringl=string.length;for(var n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++;}else if(c1>127&&c1<2048){enc=String.fromCharCode((c1>>6)|192)+String.fromCharCode((c1&63)|128);}else{enc=String.fromCharCode((c1>>12)|224)+String.fromCharCode(((c1>>6)&63)|128)+String.fromCharCode((c1&63)|128);}
if(enc!==null){if(end>start){utftext+=string.substring(start,end);}
utftext+=enc;start=end=n+1;}}
if(end>start){utftext+=string.substring(start,string.length);}
return utftext;}
function rand(min,max){var argc=arguments.length;if(argc===0){min=0;max=2147483647;}else if(argc===1){throw new Error('Warning: rand() expects exactly 2 parameters, 1 given');}return Math.floor(Math.random()*(max-min+1))+min;}
// Получить md5 хэш
function GenMd5Hash () {
return substr(md5(parseInt(new Date().getTime() / 1000, 10)),rand(0,24),8);
}

// Живой поиск
$(function() {
  // Навигационная таблица над таблицей с данными
  var searchBlock = $('.search');
  var options = {
    target: 'form.store_ajax_catalog',
    url:  '/admin/store_catalog',
    items_target: '#goods',
    last_search_query:  '',
  };
  // По этому хэшу будем обращаться к объекту извне
  var randHash = GenMd5Hash();
  // Если объекта со списком ajax функций не существует, создаём её
  if(typeof(document.SearchInCatalogAjaxQuerySender) == 'undefined') {
  document.SearchInCatalogAjaxQuerySender = {};
  }
  // Поле поиска обновилось, внутри него можно выполнять любые действия
  searchBlock.SearchFieldCheck = function () {
    // Отменяем выполнение последнего запущенного через таймаут скрипта, если таковой был.
    if(typeof(document.lastTimeoutId) != 'undefined') {
      clearTimeout(document.lastTimeoutId);
    }
    document.lastTimeoutId = setTimeout("document.SearchInCatalogAjaxQuerySender['" + randHash + "']('" + htmlspecialchars(searchBlock.s_search.val()) + "');", 300);
  }
  // Отправляет запрос к серверу с задачей поиска товаров
  document.SearchInCatalogAjaxQuerySender[randHash] = function (old_val) {
    var last_search_query_array = [];
    // sessionStorage is available
    if (typeof sessionStorage !== 'undefined') {
      try {
        if(sessionStorage.getItem('lastSearchQueryArray')){
        last_search_query_array = JSON.parse(sessionStorage.getItem('lastSearchQueryArray'));
        // Находим соответствие текущего запроса с sessionStorage
        var currentSearch = $.grep(last_search_query_array, function (item){
          return item.search_query == old_val
        })[0]
        if(currentSearch){
          showDropdownSearch(JSON.parse(currentSearch.content));
          return;
        }
        }else{
        sessionStorage.setItem('lastSearchQueryArray', '[]')
        }
      }catch(e) {
      // sessionStorage is disabled
      }
    }
    // Если текущее значение не изменилось спустя 300 сотых секунды и это значение не то по которому мы искали товары при последнем запросе
    if(htmlspecialchars(searchBlock.s_search.val()) == old_val && searchBlock.s_search.val().length > 1) {
      // Запоминаем этот запрос, который мы ищем, чтобы не произвводить повторного поиска
      options['last_search_query'] = old_val;
      // Добавляем нашей форме поиска поле загрузки
      searchBlock.f_search.addClass('search__loading');
      // Собираем параметры для Ajax запроса
      var params = {
        'ajax_q'                : 1,
        'goods_search_field_id' : 0,
        'q'                     : options['last_search_query'],
      },
      // Объект со значением которого будем в последствии проверять полученные от сервера данные
      search_field_obj = searchBlock.s_search;
      // Аяксом отправляем запрос на поиск нужных товаров и категорий
      $.ajax({
      type: "POST",
      cache: false,
      url: searchBlock.f_search.attr('action'),
      data: params,
      dataType: 'json',
      success: function(data) {
      // Если набранный запрос не соответствует полученным данным, видимо запрос пришёл не вовремя, отменяем его.
      if(search_field_obj.val() != old_val) {
        return false;
      }
      // Записываем в sessionStorage
      if (typeof sessionStorage !== 'undefined') {
        try {
          sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
          // Находим соответствие текущего запроса с sessionStorage
          var currentSearch = $.grep(last_search_query_array, function (item){
            return item.search_query == old_val
          })[0]
          //Если такого запроса ещё не было запишем его в sessionStorage
          if(typeof currentSearch == 'undefined'){
            // Добавляем в массив последних запросов данные по текущему запросу
            last_search_query_array.push({
              search_query: old_val,
              content: JSON.stringify(data)
            })
            sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array))
          }
        }catch(e){
        // sessionStorage is disabled
        }
      }
      // Показываем результаты на основе пришедших данных
      showDropdownSearch(data);
      // Убираем информацию о том что запрос грузится.
      searchBlock.f_search.removeClass("search__loading");
      }
      });
    }else{
      $("#search__result").hide();
    }
    function showDropdownSearch(data){
      // Отображение категорий в поиске
      if(data.category.length!=undefined && data.category.length>0){
        $(".result__category .result__item").remove();
        $("#search__result").hide();
        for(с=0; с < data.category.length; с++){
          // Проверка наличия изображения
          if (data.category[с].image_icon == null) {
            data.category[с].image_icon = '/design/no-photo-icon.png'
          } else {
            data.category[с].image_icon = data.category[с].image_icon;
          }
          // Отображаем результат поиска
          $("#search__result .result__category").prepend('<div class="result__item" data-id="'+ data.category[с].goods_cat_id +'"><a href="'+ data.category[с].url +'"><div class="result__image"><img src="'+ data.category[с].image_icon +'" class="goods-image-icon" /></div><div class="result__name"><span>'+ data.category[с].goods_cat_name +'</span></div></a></div>');
        }
      }else{
        $(".result__category .result__item").remove();
        $("#search__result").hide();
      }
      // Отображение товаров в поиске
      if(data.goods.length!=undefined && data.goods.length>0){
        $(".result__goods .result__item").remove();
        $("#search__result").hide();
        for(i=0; i < data.goods.length; i++){
          // Проверка наличия изображения
          if (data.goods[i].image_icon == null) {
            data.goods[i].image_icon = '/design/no-photo-icon.png'
          } else {
            data.goods[i].image_icon = data.goods[i].image_icon;
          }
          // Отображаем результат поиска
          if(i <= 4 ){
            $("#search__result .result__goods").prepend('<div class="result__item" data-id="'+ data.goods[i].goods_id +'"><a href="'+ data.goods[i].url +'"><div class="result__image"><img src="'+ data.goods[i].image_icon +'" class="goods-image-icon" /></div><div class="result__name"><span>'+ data.goods[i].goods_name +'</span></div></a></div>');
          }
          // Если последняя итерация цикла вставим кнопку "показать все"
          if(i > 4){
            $('.result__showAll').show();
          }
        }
      }else{
        $(".result__goods .result__item").remove();
        $("#search__result").hide();
      }
      // Скрываем результаты поиска если ничего не найдено
      if((data.category.length + data.goods.length) > 0){
        $("#search__result").show();
      }else{
        $("#search__result").hide();
      }
      
      if((data.category.length) > 0){
        $(".result__category").show();
      }else{
        $(".result__category").hide();
      }
      
      if((data.goods.length) > 0){
        $(".result__goods").show();
      }else{
        $(".result__goods").hide();
      }
      // Убираем информацию о том что запрос грузится.
      searchBlock.f_search.removeClass("search__loading");
    }
  }
  SearchFieldInit(searchBlock);
  $('.result__showAll').on('click', function(){
    $('.search__form').submit();
  });
});


// Возвращает правильное окончание для слова
function genWordEnd(num, e, m, mm) {
  // Если забыли указать окончания
  if(typeof (e) == "undefined") { e = ''; }
  if(typeof (m) == "undefined") { e = 'а'; }
  if(typeof (mm) == "undefined"){ e = 'oв'; }
  // Если передали пустую строку, вместо цифры
  if(0 == num.length) { num = 0; }
  // Превращаем цифру в правильный INT
  num = GetSum(num).toString();
  // Получаем последний символ цифры
  ch1 = num.substring(num.length-1);
  // Получаем последний символ цифры
  ch2 = num.length == 1 ? 0 : num.substring(num.length-2, num.length-1);
  // Если последняя цифра - 1, вернем единственное число
  if(ch2!=1 && ch1==1)               {return e;}
  // Если последняя цифра - от 2 до 4х , вернем множественное чило из массива с индексом 2
  else if(ch2!=1 && ch1>1 && ch1<=4) {return m;}
  // Если последняя цифра - от 5 до 0 , вернем множественное чило из массива с индексом 3
  else if(ch2==1 || ch1>4 || ch1==0) {return mm;}
}

// Считает сумму  33 599,65 + 2000 - 1910-41,6
function GetSum(val,precision) {
  if(typeof (precision) == "undefined" || precision < 0) { precision = 0; }
  // Возводим в степень точности 10 для округления
  var p = Math.pow(10,precision);  
  try {return Math.round(parseFloat(eval(val.toString().replace(/\s/gi, "").replace(/,/gi, ".")))*p)/p;} catch (e) {return 0;}
}

// Форматирует цену
function number_format(n,e,t,r){var i=n,a=e,o=function(n,e){var t=Math.pow(10,e);return(Math.round(n*t)/t).toString()};i=isFinite(+i)?+i:0,a=isFinite(+a)?Math.abs(a):0;var u,d,f="undefined"==typeof r?",":r,h="undefined"==typeof t?".":t,l=a>0?o(i,a):o(Math.round(i),a),s=o(Math.abs(i),a);s>=1e3?(u=s.split(/\D/),d=u[0].length%3||3,u[0]=l.slice(0,d+(0>i))+u[0].slice(d).replace(/(\d{3})/g,f+"$1"),l=u.join(h)):l=l.replace(".",h);var c=l.indexOf(h);return a>=1&&-1!==c&&l.length-c-1<a?l+=new Array(a-(l.length-c-1)).join(0)+"0":a>=1&&-1===c&&(l+=h+new Array(a).join(0)+"0"),l}

// Проверка вводимых значений в количестве товара
function keyPress(oToCheckField, oKeyEvent) {
  return oKeyEvent.charCode === 0 || /\d/.test(String.fromCharCode(oKeyEvent.charCode));
}

// Функция определения ширины экрана пользователя
function getClientWidth() {return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;}

// Работа с cookie файлами. 
// Получение переменной из cookie
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Установка переменной в cookie
function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) { 
    options.expires = expires.toUTCString();
  }
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];    
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

// Удаление переменной из cookie
function deleteCookie(name, options ) {
  options = options || {};
  options.expires = -1;
  setCookie(name, "", options)
}

// Отправляет ошибку на сервер, для того чтобы служба тех поддержки могла разобраться в проблеме как можно быстрее.
function sendError (desc, page, line) {
  var img=document.createElement('img');
  img.src = 'https://storeland.ru/error/js?desc='+encodeURIComponent(desc)+'&page='+encodeURIComponent(window.location)+'&line=0';
  img.style.position = 'absolute';
  img.style.top = '-9999px';
  try { document.getElementsByTagName('head').appendChild(img) } catch (e){}
  return false;
}

// Превращает поле пароля в текстовое поле и обратно
// @LinkObject - ссылка по которой кликнули
// @InputObject - объект у которого нужно изменить тип поля
function ChangePasswordFieldType (LinkObject, InputObject) {
  var 
    // Ссылка по которой кликнули
    LObject = $(LinkObject),
    // Объект у которого изменяем тип с password на text
    IObject = $(InputObject),
    // Старый текст ссылки
    txtOld = LObject.text(),
    // Новый текст ссылки
    txtNew = LObject.attr('rel');
  // Если объекты не получены, завершим работу функции
  if( LObject.length==0 || IObject.length==0 ) {
    return false;
  }
  // Изменяем у ссылки текст со старого на новый
  LObject.html(txtNew);
  // Старый текст ссылки сохраняем в атрибуте rel 
  LObject.attr('rel', txtOld);
  // Изменяем тип input поля
  if(IObject[0].type == 'text') {
    IObject[0].type = 'password';
  } else {
    IObject[0].type = 'text';
  }
}

// Крутит изображение при обновлении картинки защиты от роботов
function RefreshImageAction(img,num,cnt) {
  if(cnt>13) { return false; }
  $(img).attr('src', $(img).attr('rel') + 'icon/refresh/' + num + '.gif');
  num = (num==6)?0:num;
  setTimeout(function(){RefreshImageAction(img, num+1, cnt+1);}, 50);
}

// Функция определения браузера
$(document).ready(function() {
  var ua = detect.parse(navigator.userAgent);
  if (ua.browser.family === 'Safari') {
    $('body').addClass('Safari');
  }
  if (ua.browser.family === 'IE') {
    $('body').addClass('IE');
  }
  if (ua.browser.family === 'Edge') {
    $('body').addClass('Edge');
  }
  if (ua.browser.family === 'Firefox') {
    $('body').addClass('Firefox');
  }
  if (ua.browser.family === 'Opera') {
    $('body').addClass('Opera');
  }
  if (ua.browser.family === 'Chrome') {
    $('body').addClass('Chrome');
  }
  if (ua.os.family === 'iOS') {
    $('body').addClass('iOS');
  }
  if (ua.os.family === 'Android') {
    $('body').addClass('Android');
  }
});

// Наверх
$(document).ready(function(){
  // hide #back-top first
  $("#back-top").hide();
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});
		// scroll body to 0px on click
		$('#back-top, .back-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});
});

// Сравнение товаров
function compare() {
$('.CompareGoodsTableTbody .owl-carousel').owlCarousel({
  items: 4,
  margin: 15,
  loop: false,
  rewind: true,
  lazyLoad: false,
  dots: false,
  nav: false,
  navContainer: '',
  navText: [ , ],
  autoplay: false,
  autoplayHoverPause: false,
  smartSpeed: 500,
  mouseDrag: false,
  touchDrag: false,
  pullDrag: false,
  responsiveClass: true,
  responsiveRefreshRate: 100,
  responsive: {
    0:{items:2},
    320:{items:2},
    480:{items:2},
    641:{items:3},
    768:{items:3},
    992:{items:3},
    1200:{items:4}
  }
});
$('.CompareGoodsTableNext').click(function() {
  $('.CompareGoodsTableTbody .owl-carousel').trigger('next.owl.carousel');
});
$('.CompareGoodsTablePrev').click(function() {
  $('.CompareGoodsTableTbody .owl-carousel').trigger('prev.owl.carousel');
});
// Сравнение товаров. Фильтр в верхней навигации. Отображение всех и различающихся характеристик товара
$('.CompareGoodsTableFilterSwitch').click(function(){
  $(this).toggleClass('switch-on');
  if ($(this).hasClass('switch-on')) {
    $(this).trigger('on.switch');
    $('.CompareGoodsTableTbodyComparisonLine:not(.same)').show();
    $('.CompareGoodsTableTbodyComparisonLine.same').hide();
  } else {
    $(this).trigger('off.switch');
    $('.CompareGoodsTableTbodyComparisonLine:hidden').show();
  }
});
}

// Показать пароль 
function showPass() {
  $('.showPass').click(function(){
    ChangePasswordFieldType(this, $('#sites_client_pass'));
    if ($(this).closest('.showPassBlock').hasClass('active')) {
			$(this).closest('.showPassBlock').removeClass('active');
		} else {
			$(this).closest('.showPassBlock').addClass('active');
    }
    return false;
  });
}

// Функция + - для товаров
function quantity() {
  if($('.qty').length) {
    //Regulator Up копки + в карточке товара при добавлении в корзину
    qty_plus.onclick = function() {
      var 
        quantity = $(this).parent().parent().find('.quantity'),
        maxVal = parseInt($(this).parent().parent().find('.quantity').attr('max')),
        currentVal = parseInt(quantity.val());
      if (!isNaN(currentVal) && !(currentVal >= maxVal)){
        quantity.val(currentVal + 1);
        quantity.trigger('keyup');
      }
      if (currentVal >= maxVal){
        quantity.val(maxVal);
      }
      return false;
    };
    //Regulator Down копки - в карточке товара при добавлении в корзину
    qty_minus.onclick = function() {
      var 
        quantity = $(this).parent().parent().find('.quantity'),
        maxVal = parseInt($(this).parent().parent().find('.quantity').attr('max')),
        currentVal = parseInt(quantity.val());
      if (!isNaN(currentVal) && !(currentVal <= 1) ){
        quantity.val(currentVal - 1);
        quantity.trigger('keyup');
      }
      if (currentVal > maxVal){
        quantity.val(maxVal);
      }
      return false;
    };
    // Если вводят 0 то заменяем на 1
    $('.qty .quantity').on('change input', function(){
      if($(this).val() < 1){
        $(this).val(1);
      }
      if (parseInt($(this).val()) > parseInt($(this).attr('max'))) {
        $(this).val($(this).attr('max'));
      }
    });
  }
}
// Счетчик + - для корзины
function quantityCart() {
$('.qty-plus').click(function(){
  var 
    quantity = $(this).parent().find('.cartqty'),
    currentVal = parseInt(quantity.val());
  if (!isNaN(currentVal)){
    quantity.val(currentVal + 1);
    quantity.trigger('keyup');
    quantity.trigger("change");
  }
  return false;
});
$('.qty-minus').click(function(){
  var 
    quantity = $(this).parent().find('.cartqty'),
    currentVal = parseInt(quantity.val());
  if (!isNaN(currentVal) && !(currentVal <= 1) ){
    quantity.val(currentVal - 1);
    quantity.trigger('keyup');
    quantity.trigger("change");
  }
  return false;
});
}

// Скрипты для карточки товара и Фильтры и Отзывы
function goodspage() {
// Фильтр отзывов
$('.goodsDataOpinionListNavigateTop .tab').click(function(){
  a = $(this).html();
  $('.goodsDataOpinionListNavigateTop .tab').removeClass('active');
  $(this).addClass('active');
  if($(this).hasClass('goodOpinions')){
    $('.good').show();
    $('.bad').hide();
  }
  else if($(this).hasClass('badOpinions')){
    $('.good').hide();
    $('.bad').show();
  }else{
    $('.bad').show();
    $('.good').show();
  }
});
// Добавление отзыва о товаре. Рейтинг
if(typeof($('.goodsDataOpinionRating').rating) == "function" ) {
  $('.goodsDataOpinionRating input').rating({
    split: 1,
    required: true
  });
}
// Список отзывов о товаре. Ссылка на отображение формы для добавление отзыва о товаре
$('.goodsDataOpinionShowAddForm').click(function(){
  $('html, body').animate({scrollTop : jQuery('.product-tabs').offset().top}, 500);
});
// Добавление отзыва о товаре. кнопка reset скрывающая форму добавления отзыва о товаре
$('.goodsDataOpinionFormReset').click(function(){
  $('html, body').animate({scrollTop : jQuery('.goodsDataOpinion').offset().top - 60}, 500);
  return false;
});
// Иконка для обновления изображение капчи
$('.goodsDataOpinionCaptchaRefresh').click(function(){
  RefreshImageAction(this,1,1);
  $('.goodsDataOpinionCaptchaImg').attr('src',$('.goodsDataOpinionCaptchaImg').attr('src')+'&rand'+Math.random(0,10000));
  return false;
});

// Удаление повтора доп. изображений
/*
$('.thumblist-box .owl-carousel').on('initialized.owl.carousel', function(event) {
  var imageID = $('.product-view .product-img-box .product-image').attr('data-id');
  $('.product-view .product-img-box .thumblist-box .thumblist .thumb').each(function() {
    var thumbID = $(this).attr('data-id');
    if (thumbID === imageID) {
      $(this).parent().remove();
      $(this).addClass('hide');
    }
  });
});
*/
// Слайдер доп. изображений
$('.thumblist-box .owl-carousel').owlCarousel({
  items: 5,
  margin: 15,
  loop: false,
  rewind: true,
  lazyLoad: false,
  dots: false,
  nav: false,
  navText: [ , ],
  autoplay: false,
  autoplayHoverPause: true,
  smartSpeed: 500,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  responsiveClass: true,
  responsiveRefreshRate: 100,
  responsive: {
    0:{items:2},
    320:{items:3},
    480:{items:4},
    641:{items:6},
    768:{items:8},
    992:{items:4},
    1200:{items:5},
    1400:{items:5}
  }
});

// С этим товаром смотрят
$('.related-views .owl-carousel').owlCarousel({
    items: 4,
    margin: 30,
    loop: false,
    rewind: true,
    lazyLoad: false,
    dots: false,
    nav: true,
    navText: [ , ],
    autoplay: true,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:1, margin: 0},
      480:{items:2, margin: 15},
      641:{items:3, margin: 15},
      768:{items:3, margin: 15},
      992:{items:4},
      1200:{items:4},
      1400:{items:4}
    }
});
// Сопутствующие товары
$('.related-goods .owl-carousel').owlCarousel({
  items: 4,
  margin: 30,
  loop: false,
  rewind: true,
  lazyLoad: false,
  nav: true,
  navText: [ , ],
  dots: false,
  autoplay: true,
  autoplayHoverPause: true,
  smartSpeed: 500,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  responsiveClass: true,
  responsiveRefreshRate: 100,
  responsive: {
    0:{items:1},
    320:{items:1, margin: 0},
    480:{items:2, margin: 15},
    641:{items:3, margin: 15},
    768:{items:3, margin: 15},
    992:{items:4},
    1200:{items:4},
    1400:{items:4}
  }
});

// Функция показать больше для С этим товаром смотрят
var v = 0;
$('.related-views .products-grid .item').each(function(){  v++;});
if(v<=4){$('.related-views .showAll').hide();}
$('.related-views .showAll span').on('click',function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active');
    $('.related-views .products-grid .item').removeClass('showThis');
    $(this).text("Смотреть все");
    $('html, body').animate({scrollTop : jQuery('.related-views').offset().top }, 800);
  }else{ 
    $('.related-views .products-grid .item').addClass('showThis');
    $(this).addClass('active');
    $(this).text("Скрыть");
    $('html, body').animate({scrollTop : jQuery('.related-views').offset().top + $(window).height()}, 800);
  }
});
// Функция показать больше для Сопутствующие товары
var g = 0;
$('.related-goods .products-grid .item').each(function(){  g++;});
if(g<=4){$('.related-goods .showAll').hide();}
$('.related-goods .showAll span').on('click',function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active');
    $('.related-goods .products-grid .item').removeClass('showThis');
    $(this).text("Смотреть все");
    $('html, body').animate({scrollTop : jQuery('.related-goods').offset().top }, 800);
  }else{ 
    $('.related-goods .products-grid .item').addClass('showThis');
    $(this).addClass('active');
    $(this).text("Скрыть");
    $('html, body').animate({scrollTop : jQuery('.related-goods').offset().top + $(window).height()}, 800);
  }
});
}

// Добавление товара в корзину
function AddCart() {
  $('.goodsDataForm, .goodsToCartFromCompareForm, .goodsListForm').off('submit').submit(function() {
    // Выносим функции из шаблонов
    if ($(this).attr('rel') === 'quick') {
      quickOrder(this);
      return (false);
    }
    $('#header .cart .icon').addClass('have-items');
    $('#sidebar .cart').addClass('have-items');
    $('.cart .count').animate({opacity: 0,display: "none"},500);
    $('.cart .count').animate({display: "inline",opacity: 1} , 500 );
    
    // Находим форму, которую отправляем на сервер, для добавления товара в корзину
    var formBlock = $($(this).get(0));
    var adresCart = '/cart';
      // Проверка на существование формы отправки запроса на добавление товара в корзину
      if (1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
        alert('Не удалось найти форму добавления товара в корзину');
        return false;
      }
      // Получаем данные формы, которые будем отправлять на сервер
      var formData = formBlock.serializeArray();
      // Сообщаем серверу, что мы пришли через ajax запрос
      formData.push({name: 'ajax_q', value: 1});
      // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа
      //formData.push({name: 'fast_order', value: 1});
      // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
      $.ajax({
        type: "POST",
        cache: false,
        url: formBlock.attr('action'),
        data: formData,
        success: function(data) {
          $.fancybox.open(data);
        }
      });
    return false;
  });
}
// Добавление в сравнение и Сохраненное
function Addto() {
  // Добавление/удаление товара на сравнение/Сохраненное через ajax
  $('.add-compare').off('click').click(function(){
    // Объект ссылки, по которой кликнули
    var 
    a = $(this)
    addUrl = a.attr('data-action-add-url'),
    delUrl = a.attr('data-action-delete-url'),
    addTitle = a.attr('data-action-add-title'),
    delTitle = a.attr('data-action-delete-title'),
    isAdd = a.attr('data-action-is-add'),
    pName = a.attr('data-prodname'),
    pUrl = a.attr('data-produrl'),
    pImg = a.attr('data-prodimg'),
    pPrice = a.attr('data-prodprice'),
    pDataid = a.attr('data-id'),
    pDataprice = a.attr('data-mod-id'),
    pDataGoodsid = a.attr('data-goodsid'),
    aText = a.parent().find('.add-compare'),
    addTooltip = a.attr('data-add-tooltip'),
    delTooltip = a.attr('data-del-tooltip'),
    requestUrl = a.attr('href');
    
    var atl = $(this).closest('.add-to-links');
    var flag = 0;
    $('#compare-items li').each(function(){       
      if($(this).attr('data-id') == pDataid){
      flag = 1;
      }
      if(flag == 1){
        $(this).remove();
        return false;
      }
      return flag;
    });
    $('.compare').removeClass('empty');
    $('.compare #compare-items .empty').hide();
    $('.compare .buttons').css('display', 'none');
    $('.compare .buttons.hide').css('display', 'block');
    
    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsDataMainModificationId').val());
    }
    
    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if(addUrl && delUrl) {
      $.ajax({
        type : "POST",
        dataType: 'json',
        cache : false,
        url : requestUrl,
        data : {
          'ajax_q': 1
        },
        success: function(data) {
          if(flag == 0){   
            $('#compare-items').prepend('<li class="item"><div class="image"><a href="'+ pUrl +'" title="'+ pName +'" itemprop="url"><img src="'+ pImg +'" class="goods-image-icon" /></a></div><div class="product-info"><div class="product-name"><a href="'+ pUrl +'" title="'+ pName +'" itemprop="url">'+ pName +'</a></div><div class="price-box"><span class="price"><span title="'+ pPrice +' российских рублей"><span class="num">'+ pPrice +'</span> <span>р.</span></span></span></div><a data-href="'+ delUrl +'?id='+ pDataprice +'" data-goods-mod-id="'+ pDataprice +'" class="remove x" title="Убрать товар из списка сравнения" onclick="removeFromCompare($(this))"></a><a href="#" class="dataid">'+ pDataid +'</a></div></li>');
          }
          if('ok' == data.status) {
            if(isAdd == 1) {
              var 
                from = addUrl
                ,to = delUrl
                ,newIsAddStatus = 0
                ,newTitle = delTitle ? delTitle : ''
                ,newTooltip = delTooltip ? delTooltip : ''
              ;
              a.addClass('added');
              atl.addClass('added');
            } else {
              var 
                from = delUrl
                ,to = addUrl
                ,newIsAddStatus = 1
                ,newTitle = addTitle ? addTitle : ''
                ,newTooltip = addTooltip ? addTooltip : ''
              ;
              a.removeClass('added');
              atl.removeClass('added');
            }
            
            // Если указано, что изменилось число товаров на сравнении
            if(typeof(data.compare_goods_count) != 'undefined') {
              // Блок информации о том, что есть товары на сравнении
              var sidecount = $('.compare .count');
              // Если на сравнении больше нет товаров
              // Указываем информацию о новом количестве товаров на сравнении
              // Блок обновления списка сравнения в каталога
              sidecount.animate({opacity: 0,display: "none"},500,function(){
              sidecount.text(data.compare_goods_count);
              $('.compare').attr('data-count', data.compare_goods_count);
              $('.compare .count').attr('data-count', data.compare_goods_count);
                if(data.compare_goods_count > 0){
                  $('.compare').addClass('have-items');
                }else{
                  $('.compare').addClass('empty');
                  $('.compare').attr('data-count', '0');
                  $('.compare .count').attr('data-count', '0');
                  $('.compare').removeClass('have-items');
                  $('.compare .count').text("0");
                  $('.compare .buttons').hide();
                  $('.compare #compare-items .item').hide();
                  $('.compare #compare-items .empty.hide').show();
                  $('.add-compare').removeAttr("title").removeClass("added");
                }
              }).animate({display: "inline",opacity: 1} , 500 );
            }
            
            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr('href', a.attr('href').replace(new RegExp(from), to))
             .attr('title', newTitle)
             .attr('data-tooltip', newTooltip)
             .attr('data-action-is-add', newIsAddStatus);
            
            // Если рядом с ссылкой в виде круга есть текстовая надпись с описанием действия
            //if(aText.length) {
            //  aText.text(aText.attr(isAdd == 1 ? 'data-del-tooltip' : 'data-add-tooltip'));
            //}
            
            // Если есть функция, которая отображает сообщения пользователю
            if(typeof(Noty) == "function") {
              new Noty({
                text:data.message,
                layout:"top",
                type:"success",
                theme:"metroui",
                textAlign:"center",
                easing:"swing",
                animation: {
                  open: 'animated slideInDown',
                  close: 'animated slideOutUp',
                  easing: 'swing',
                  speed: 500
                },
                timeout:"3000",
                progressBar:true,
                closable:false,
                closeOnSelfClick:true,
                modal:false,
                dismissQueue:false,
                onClose:true,
                killer:false
              }).show();
            }
            } else if('error' == data.status) {
              // Если есть функция, которая отображает сообщения пользователю
              if(typeof(Noty) == "function") {
                new Noty({
                  text:data.message,
                  layout:"top",
                  type:"error",
                  theme:"metroui",
                  textAlign:"center",
                  animation: {
                    open: 'animated slideInDown',
                    close: 'animated slideOutUp',
                    easing: 'swing',
                    speed: 500
                  },
                  timeout:"3000",
                  progressBar:true,
                  closable:false,
                  closeOnSelfClick:true,
                  modal:false,
                  dismissQueue:false,
                  onClose:true,
                  killer:false
                }).show();
              }
            }
        }
      });
      return false;
    }
  });
  // Добавление/удаление товара на сравнение/Сохраненное через ajax
  $('.add-wishlist').off('click').click(function(){
    // Объект ссылки, по которой кликнули
    var 
    a = $(this)
    addUrl = a.attr('data-action-add-url'),
    delUrl = a.attr('data-action-delete-url'),
    addTitle = a.attr('data-action-add-title'),
    delTitle = a.attr('data-action-delete-title'),
    isAdd = a.attr('data-action-is-add'),
    pName = a.attr('data-prodname'),
    pUrl = a.attr('data-produrl'),
    pImg = a.attr('data-prodimg'),
    pPrice = a.attr('data-prodprice'),
    pDataid = a.attr('data-id'),
    pDataprice = a.attr('data-mod-id'),
    pDataGoodsid = a.attr('data-goodsid'),
    aText = a.parent().find('.add-wishlist'),
    addTooltip = a.attr('data-add-tooltip'),
    delTooltip = a.attr('data-del-tooltip'),
    requestUrl = a.attr('href');
    
    var atl = $(this).closest('.add-to-links');
    var flag = 0;
    $('#favorites-items li').each(function(){       
      if($(this).attr('data-id') == pDataid){
      flag = 1;
      }
      if(flag == 1){
        $(this).remove();
        return false;
      }
      return flag;
    });
    $('.favorites').removeClass('empty');
    $('.favorites #favorites-items .empty').hide();
    $('.favorites .buttons').css('display', 'none');
    $('.favorites .buttons.hide').css('display', 'block');
    
    // Если в ссылке присутствует идентификатор, который мы можем узнать только вытащив его с текущей страницы
    if( /GET_GOODS_MOD_ID_FROM_PAGE/.test(requestUrl)) {
      requestUrl = requestUrl.replace(new RegExp('GET_GOODS_MOD_ID_FROM_PAGE'), $('.goodsDataMainModificationId').val());
    }
    
    // Если есть информация о том какие URL адреса будут изменены, то можено не перегружать страницу и сделать запрос через ajax
    if(addUrl && delUrl) {
      $.ajax({
        type : "POST",
        dataType: 'json',
        cache : false,
        url : requestUrl,
        data : {
          'ajax_q': 1
        },
        success: function(data) {
          if(flag == 0){   
            $('#favorites-items').prepend('<li class="item"><div class="image"><a href="'+ pUrl +'" title="'+ pName +'" itemprop="url"><img src="'+ pImg +'" class="goods-image-icon" /></a></div><div class="product-info"><div class="product-name"><a href="'+ pUrl +'" title="'+ pName +'" itemprop="url">'+ pName +'</a></div><div class="price-box"><span class="price"><span title="'+ pPrice +' российских рублей"><span class="num">'+ pPrice +'</span> <span>р.</span></span></span></div><a data-href="'+ delUrl +'?id='+ pDataprice +'" data-goods-mod-id="'+ pDataprice +'" class="remove x" title="Убрать товар из списка сравнения" onclick="removeFromCompare($(this))"></a><a href="#" class="dataid">'+ pDataid +'</a></div></li>');
          }
          if('ok' == data.status) {
            if(isAdd == 1) {
              var 
                from = addUrl
                ,to = delUrl
                ,newIsAddStatus = 0
                ,newTitle = delTitle ? delTitle : ''
                ,newTooltip = delTooltip ? delTooltip : ''
              ;
              a.addClass('added');
              atl.addClass('added');
            } else {
              var 
                from = delUrl
                ,to = addUrl
                ,newIsAddStatus = 1
                ,newTitle = addTitle ? addTitle : ''
                ,newTooltip = addTooltip ? addTooltip : ''
              ;
              a.removeClass('added');
              atl.removeClass('added');
            }
            
            // Если указано, что изменилось число товаров на сравнении
            if(typeof(data.favorites_goods_count) != 'undefined') {
              // Блок информации о том, что есть товары на сравнении
              var sidecount = $('.favorites .count');
              // Если на сравнении больше нет товаров
              // Указываем информацию о новом количестве товаров на сравнении
              // Блок обновления списка сравнения в каталога
              sidecount.animate({opacity: 0,display: "none"},500,function(){
              sidecount.text(data.favorites_goods_count);
              $('.favorites').attr('data-count', data.favorites_goods_count);
              $('.favorites .count').attr('data-count', data.favorites_goods_count);
                if(data.favorites_goods_count > 0){
                  $('.favorites').addClass('have-items');
                }else{
                  $('.favorites').addClass('empty');
                  $('.favorites').attr('data-count', '0');
                  $('.favorites .count').attr('data-count', '0');
                  $('.favorites').removeClass('have-items');
                  $('.favorites .count').text("0");
                  $('.favorites .buttons').hide();
                  $('.favorites #favorites-items .item').hide();
                  $('.favorites #favorites-items .empty.hide').show();
                  $('.add-wishlist').removeAttr("title").removeClass("added");
                }
              }).animate({display: "inline",opacity: 1} , 500 );
            }
            
            // Обновляем ссылку, на которую будет уходить запрос и информацию о ней
            a.attr('href', a.attr('href').replace(new RegExp(from), to))
             .attr('title', newTitle)
             .attr('data-tooltip', newTooltip)
             .attr('data-action-is-add', newIsAddStatus);
              
            // Если рядом с ссылкой в виде круга есть текстовая надпись с описанием действия
            //if(aText.length) {
            //  aText.text(aText.attr(isAdd == 1 ? 'data-del-tooltip' : 'data-add-tooltip'));
            //}
            
            // Если есть функция, которая отображает сообщения пользователю
            if(typeof(Noty) == "function") {
              new Noty({
                text:data.message,
                layout:"top",
                type:"success",
                theme:"metroui",
                textAlign:"center",
                animation: {
                  open: 'animated slideInDown',
                  close: 'animated slideOutUp',
                  easing: 'swing',
                  speed: 500
                },
                timeout:"3000",
                progressBar:true,
                closable:false,
                closeOnSelfClick:true,
                modal:false,
                dismissQueue:false,
                onClose:true,
                killer:false
              }).show();
            }
            } else if('error' == data.status) {
              // Если есть функция, которая отображает сообщения пользователю
              if(typeof(Noty) == "function") {
                new Noty({
                  text:data.message,
                  layout:"top",
                  type:"error",
                  theme:"metroui",
                  textAlign:"center",
                  animation: {
                    open: 'animated slideInDown',
                    close: 'animated slideOutUp',
                    easing: 'swing',
                    speed: 500
                  },
                  timeout:"3000",
                  progressBar:true,
                  closable:false,
                  closeOnSelfClick:true,
                  modal:false,
                  dismissQueue:false,
                  onClose:true,
                  killer:false
                }).show();
              }
            }
        }
      });
      return false;
    }
  });
}

// Регистрация и выбор доставки
function OrderScripts(){
$(document).ready(function(){
  // При оформлении заказа дадим возможность зарегистрироваться пользователю
  $('#contactWantRegister').click(function(){
    if($(this).prop("checked")) {
      $('.contactRegisterNeedElement').show();
      $('#contactEmail, #contactPassWord').addClass('required');
      $(this).parent().addClass('active');
    } else {
      $('.contactRegisterNeedElement').hide();
      $('#contactEmail, #contactPassWord').removeClass('required');
      $(this).parent().removeClass('active');
    }
  });
  
  // Действия при выборе варианта доставки на этапе оформления заказа
  $(function(){
    sd = $($('.deliveryRadio')[0]);
    id = sd.val(),
    fz = $($('.deliveryZoneRadio[deliveryid='+id+']')[0]);
    sd.prop('checked',true);
    fz.prop('checked',true);
    price = fz.next().attr('price');
    oldPrice = $('.deliveryOption[rel='+ id +']').find('.pricefield').find('.num');
    // Обновление итоговой суммы с учетом доставки
    WithoutZone = $('input.deliveryRadio:checked').attr('pricewithoutzones');
    WithZone =  $('input.deliveryZoneRadio:checked').attr('price');
    if(WithZone > 0){
      startprice = WithZone;
    }else{
      startprice = WithoutZone;
    }
    oldPrice.text(WithZone);
    // Обновление итоговой суммы с учетом доставки
    latestDeliveryPrice = $('.formfastbuttons .changeprice').text();
    TotalSumDelivery = $('.formfastbuttons .TotalSumDelivery .price .num').text();
    currentPriceWithoutChange = (parseInt(TotalSumDelivery.replace(/\s+/g, ''),10)) - parseInt(latestDeliveryPrice);
    NewPriceWithChange = parseInt(startprice) + currentPriceWithoutChange;
    $('.changeprice').text(startprice);
    $('.formfastbuttons .TotalSumDelivery .price .num').text(NewPriceWithChange);
  });
  
  $(function(){
    $('.deliveryRadio').each(function(){
      var 
        id = $(this).val(),
        fz = $($('.deliveryZoneRadio[deliveryid='+id+']')[0]);  
      price = fz.next().attr('price');
      oldPrice = $('.deliveryOption[rel='+ id +']').find('.pricefield').find('.num');
      if(price != ''){
        oldPrice.text(price);
      }
    });
  });

  // Действия при выборе зоны внутри варианта доставки на этапе оформления заказа
  $('.deliveryZoneRadio').click(function(){
    var id = $(this).attr('deliveryid'),
    price = $(this).next().find('.num').text(),
    oldPrice = $('.deliveryOption[rel='+ id +']').find('.pricefield').find('.num');
    if(price != ''){
      oldPrice.text(price);
    }
    $('.deliveryRadio').each(function(){
      $(this).prop('checked',false);
      if($(this).val() == id){
        $(this).prop('checked',true);
      }else{
        $(this).prop('checked',false);
      }
    });
    // Обновление итоговой суммы с учетом доставки
    latestDeliveryPrice = $('.formfastbuttons .changeprice').text();
    TotalSumDelivery = $('.formfastbuttons .TotalSumDelivery .price .num').text();
    currentPriceWithoutChange = (parseInt(TotalSumDelivery.replace(/\s+/g, ''),10)) - parseInt(latestDeliveryPrice);
    NewPriceWithChange = parseInt(price) + currentPriceWithoutChange;
    $('.formfastbuttons .TotalSumDelivery .price .num').text(NewPriceWithChange);
    $('.changeprice').text(price);
    $('.formfastbuttons .TotalSumDelivery .changeprice').text(price);
  });
  
  $(function(){
    $('.orderStageDeliveryListTable').on('change','.deliveryRadio',function(){
      $('.deliveryRadio, .deliveryZoneRadio').each(function(){
        $(this).removeAttr('checked');
      });
      var 
        id = $(this).val(),
        fz = $($('.deliveryZoneRadio[deliveryid='+id+']')[0]);          
      $(this).prop('checked',true);
      fz.prop('checked',true);   
      price = $('.deliveryOption[rel='+ id +']').find('.pricefield').find('.orderStageDeliveryDefaultPrice').find('.num').text();
      oldPrice = $('.deliveryOption[rel='+ id +']').find('.pricefield').find('.num');
      if(price != ''){
        oldPrice.text(price);
      }
      // Обновление итоговой суммы с учетом доставки
      latestDeliveryPrice = $('.formfastbuttons .changeprice').text();
      TotalSumDelivery = $('.formfastbuttons .TotalSumDelivery .price .num').text();
      currentPriceWithoutChange = (parseInt(TotalSumDelivery.replace(/\s+/g, ''),10)) - parseInt(latestDeliveryPrice);
      NewPriceWithChange = parseInt(price) + currentPriceWithoutChange;
      $('.formfastbuttons .TotalSumDelivery .price .num').text(NewPriceWithChange);
      $('.changeprice').text(price);
      $('.formfastbuttons .TotalSumDelivery .changeprice').text(price);
    });
  });
  
  // Выбор даты доставки
  // Документация к плагину //t1m0n.name/air-datepicker/docs/index-ru.html
  $("#deliveryConvenientDate").datepicker({
    // Если true, то при активации даты, календарь закроется.
    autoClose: true,
    // Можно выбрать только даты, идущие за сегодняшним днем, включая сегодня
    minDate: new Date()
  });
});
}
// Скрипты для Быстрого заказа
function quickOrderScripts(){
$(document).ready(function(){
  var ID = $('input[name="form[delivery][id]"]:checked').val();
  $('.quick_order_payment').hide();
  $('.quick_order_payment[rel="' + ID + '"]').show();
  $('.quick_order_payment[rel="' + ID + '"]').find('input:first').click();

  $('.deliveryRadio').click(function(){  
    var ID = $('input[name="form[delivery][id]"]:checked').val();
    $('.quick_order_payment').hide();
    $('.quick_order_payment[rel="' + ID + '"]').show();
    $('.quick_order_payment[rel="' + ID + '"]').find('input:first').click();
  });
  
  $(function(){
    $('.deliveryRadio').click(function(){
      $('.deliveryRadio').each(function(){
        $(this).prop('checked',false);
      });
      $('.deliveryZoneRadio').each(function(){
        $(this).prop('checked',false);
      });
      var id = $(this).val(),
      fz = $($('.deliveryZoneRadio[deliveryid='+id+']')[0]);          
      $(this).prop('checked',true);
      fz.prop('checked',true);   
      price = fz.next().find('.num').text();
      oldPrice = $('.deliveryOption[rel='+ id +']').find('.pricefield').find('.num');
      if(price != ''){
        oldPrice.text(price);
      }
    });
  });

  // Валидация формы на странице оформления заказа
  $("#quickform").submit(function(){
    // Если форма невалидна не отправляем её на сервер
    if(!$(this).valid()) {
      return false;
    }
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = $(this).serializeArray();
    // Сообщаем серверу, что мы пришли через ajax запрос
    formData.push({name: 'ajax_q', value: 1});
    // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
    $.ajax({
      type    : "POST",
      dataType: 'json',
      cache    : false,
      url  	  : $(this).attr('action'),
      data		: formData,
      success: function(data) {
        // Если заказ был успешно создан
        if( data.status == 'ok' ) {
          window.location = data.location;
        } else if( data.status == 'error' ) {
          alert(data.message);
        } else {
          alert('Во время оформления заказа возникла неизвестная ошибка. Пожалуйста, обратитесь в службу технической поддержки.');
        }
      }
    });
    return false;      
  }).validate({
    errorPlacement: function(error, element) { }
  });
});
}
// Быстрый заказ
function quickOrder(formSelector) {
  // Находим форму, которую отправляем на сервер, для добавления товара в корзину
  var formBlock = $($(formSelector).get(0));
  // Проверка на существование формы отправки запроса на добавление товара в корзину
  if(1 > formBlock.length || formBlock.get(0).tagName != 'FORM') {
    alert('Не удалось найти форму добавления товара в корзину');
    return false;
  }
  // Получаем данные формы, которые будем отправлять на сервер
  var formData = formBlock.serializeArray();
  // Сообщаем серверу, что мы пришли через ajax запрос
  formData.push({name: 'ajax_q', value: 1});
  // Так же сообщим ему, что нужно сразу отобразить форму быстрого заказа 
  formData.push({name: 'fast_order', value: 1});
  // Аяксом добавляем товар в корзину и вызываем форму быстрого заказа товара
  $.ajax({
    type    : "POST",
		cache	  : false,
		url		  : formBlock.attr('action'),
		data		: formData,
		success: function(data) {
			$.fancybox.open(data);
			preload();
			showPass();
			coupons();
		}
	});
  return false;
}
// Разделение поле адрес на Улица, Дом, Квартира
function address(){
  $('#quickform .button').click(function(){
    if($('#quickDeliveryAddressStreet').val() !='' || $('#quickDeliveryAddressHome').val() !='' || $('#quickDeliveryAddressFlat').val() !=''){
      if ( $('#quickDeliveryAddress').val().match( /(.*)(улица)+(.*)/i ) ) {
        $('#quickDeliveryAddress').val(null);
      }
      $('#quickDeliveryAddress').val('Улица: ' + $('#quickDeliveryAddressStreet').val() + ', Дом/Корпус: ' + $('#quickDeliveryAddressHome').val() + ', Квартира: ' + $('#quickDeliveryAddressFlat').val());
      $(this).submit();
      return false;
    }
  });
}
// Отправка купона при оформлении заказа
function coupons() {
  var submitBtn = $('.coupons .button');
  var cuponInput = $('#quick_form_coupon_code');
  var resetBtn = $('.coupons .reset');
  
  submitBtn.click(function(){
    var url = '/order/stage/confirm';
    var val = cuponInput.val();
    var orderSumDefaul = $('.coupons input[name="orderSumDefaul"]').val();
    // Получаем данные формы, которые будем отправлять на сервер
    var formData = $('#myform').serializeArray();
    formData.push({name: 'ajax_q', value: 1});
    formData.push({name: 'only_body', value: 1});
    formData.push({name: 'form[coupon_code]', value: val});
    $.ajax({
      type: "POST",
      cache: false,
      url: url,
      data: formData,
      success: function(data) {
        var discountBlock = $(data).closest('#myform').find('.discount');
        var discountName = discountBlock.find('.name').text();
        var discountPercent = discountBlock.find('.percent').text();
        var totalBlock = $(data).closest('#myform').find('.total');
        // Записываем название и размер скидки по купону
        $('.discounttr.coupon .title').html(discountName);
        $('.discounttr.coupon .price .value').html(discountPercent);
        // Получаем новую итоговую стоимость заказа
        var newTotalBlock = totalBlock.find('.total-sum').data('total-sum');
        // Обновляем значение
        $('.formfastbuttons .TotalSumDelivery .total-sum').data('total-sum', newTotalBlock);
        // Получаем текущую стоимость выбранной доставки
        var deliverySum = $('.formfastbuttons .TotalDelivery .changeprice').text();
        // Считаем итоговую сумму заказа вместе с доставкой
        var totalPriceWithDelivery = String(parseInt(deliverySum) + Math.floor(newTotalBlock));
        $('.formfastbuttons .TotalSumDelivery .total-sum .num').text(totalPriceWithDelivery);
        $('.discounttr').hide();
        $('.discounttr.coupon').show();
        var TotalSum = $('.formfastbuttons .TotalDelivery .total-sum .num').text();
        var newTotalSum = $('.formfastbuttons .TotalSumDelivery .total-sum .num').text();
        if (newTotalSum > TotalSum) {
          cuponInput.parent().addClass('error');
          cuponInput.parent().removeClass('active');
          cuponInput.val("").attr("placeholder", "Купон неверен");
          submitBtn.html('Применить');
        } else {
          cuponInput.parent().removeClass('error');
          cuponInput.parent().addClass('active');
          submitBtn.html('<i class="icon-check"></i>');
        }
      },
      error: function(data){
        console.log("Возникла ошибка: Невозможно отправить форму купона.");
      }
    });
  });
  // Сброс
  resetBtn.on('click', function(){
    $('#quick_form_coupon_code').val('').trigger('input');
    submitBtn.trigger('click');
    setTimeout(function(){
      cuponInput.parent().removeClass('error');
      cuponInput.val("").attr("placeholder", "Введите купон");
      submitBtn.html('Применить');
    }, 500);
  });
  // Отображение кнопки Сброс
  cuponInput.on('input',function(){
    var $input = $(this);
    if($input.val()) {
      $input.next('.reset').addClass('active')
    } else {
      $input.next('.reset').removeClass('active')
    }
  });
}

// Функция Быстрого просмотра товара
function quickView() {
// Получение центральной разметки страницы (для быстрого просмотра)
$(document).ready(function(){
  $.fn.getColumnContent = function() {
    var block = ($(this).length && $(this).hasClass('product-view') ? $(this).filter('.product-view') : $('div.product-view:eq(0)'));
    block.find('#main').each(function(){
      // Удаляем все блоки, которые не отображаются в быстром просмотре.
      if(!$(this).hasClass('product-img-box') && !$(this).hasClass('product-shop')) {
        $(this).remove();
      }
    });
    block.find('.product-view').addClass('quickView');
    return block;
  }
});
// Быстрый просмотр товара
$(document).ready(function(){
  // При наведении на блок товара загружаем контент этого товара, который будет использоваться для быстрого просмотра, чтобы загрузка происходила быстрее.
  $('.products-container .item').mouseover(function() {
    // Если в блоке нет ссылки на быстрый просмотр, то не подгружаем никаких данных
    var link = $(this).find('a.quickview');
    if(link.length < 1) {
      return true;
    }
    // Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
    if(typeof(document.quickviewPreload) == 'undefined') {
      document.quickviewPreload = [];
    }
    var href = link.attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    // Если контент по данной ссылке ещё не загружен
    if(typeof(document.quickviewPreload[href]) == 'undefined') {
      // Ставим отметку о том, что мы начали загрузку страницы товара
      document.quickviewPreload[href] = 1;
      // Делаем запрос на загрузку страницы товара
      $.get(href, function(content) {
        // Сохраняем контент, необходимый для быстрого просмотра в специально созданный для этого массив
        document.quickviewPreload[href] = $(content).getColumnContent();
      })
      // Если загрузить страницу не удалось, удаляем отметку о том, что мы подгрузили эту страницу
      .fail(function() {
        delete document.quickviewPreload[href];
      });
    }
  });
});
// Действие при нажатии на кнопку быстрого просмотра.  
$(document).ready(function(){
  $(document).on('click', 'a.quickview', function() {
    var href = $(this).attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    quickViewShow(href);
    $('.product-view').removeClass('quickViewMod');
    return false;
  });
});
}
// Быстрый просмотр товара
function quickViewShow(href, atempt) {
  // Если данные по быстрому просмотру уже подгружены
  if(typeof(document.quickviewPreload[href]) != 'undefined') {
    // Если мы в режиме загрузки страницы и ждём результата от другой функции, то тоже подождём, когда тот контент загрузится и будет доступен в этом массиве.
    if(1 == document.quickviewPreload[href]) {
      // Если попытки ещё не указывались, ставим 0 - первая попытка
      if(typeof(atempt) == 'undefined') {
        atempt = 0;
      // Иначе прибавляем счётчик попыток
      } else {
        atempt += 1;
        // Если больше 500 попыток, то уже прошло 25 секунд и похоже, что быстрый просмотр не подгрузится, отменяем информацию о том, что контент загружен
        if(atempt > 500) {
          delete document.quickviewPreload[href];
          // TODO сделать вывод красивой таблички
          alert('Не удалось загрузить страницу товара. Пожалуйста, повторите попытку позже.');
          return true;
        }
      }
      // Запустим функцию быстрого просмотра через 5 сотых секунды, вероятно запрошендная страница товара уже подгрузится. 
      setTimeout('quickViewShow("' + href + '", '+ atempt +')', 50);
      return true;
    } else {
      $.fancybox.close();
      $.fancybox.open(document.quickviewPreload[href]);
      MainFunctions();
      AddCart();
      Addto();
      quantity();
      openMod();
    }
  } else {
    $.get(href, function(content) {
      $.fancybox.close();
      $.fancybox.open($(content).getColumnContent());
      MainFunctions();
      AddCart();
      Addto();
      quantity();
      openMod();
    });
  }
}




// Функция Быстрого просмотра товара
function quickViewMod() {
// Получение центральной разметки страницы (для быстрого просмотра)
$(document).ready(function(){
  $.fn.getColumnContent = function() {
    console.log("1")
    var block = ($(this).length && $(this).hasClass('product-view') ? $(this).filter('.product-view') : $('div.product-view:eq(0)'));
    block.find('#main').each(function(){
      console.log("2")
      // Удаляем все блоки, которые не отображаются в быстром просмотре.
      if(!$(this).hasClass('product-shop')) {
        $(this).remove();
        console.log("3")
      }
    });
    $('.product-view').addClass('quickViewMod');
    return block;
  }
});
// Быстрый просмотр товара
$(document).ready(function(){
  // При наведении на блок товара загружаем контент этого товара, который будет использоваться для быстрого просмотра, чтобы загрузка происходила быстрее.
  $('.products-container .item').mouseover(function() {
    // Если в блоке нет ссылки на быстрый просмотр, то не подгружаем никаких данных
    var link = $(this).find('a.quickViewMod');
    if(link.length < 1) {
      return true;
    }
    // Если массив с подгруженными заранее карточками товара для быстрого просмотра ещё не создан - создадим его.
    if(typeof(document.quickviewPreload) == 'undefined') {
      document.quickviewPreload = [];
    }
    var href = link.attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    // Если контент по данной ссылке ещё не загружен
    if(typeof(document.quickviewPreload[href]) == 'undefined') {
      // Ставим отметку о том, что мы начали загрузку страницы товара
      document.quickviewPreload[href] = 1;
      // Делаем запрос на загрузку страницы товара
      $.get(href, function(content) {
        // Сохраняем контент, необходимый для быстрого просмотра в специально созданный для этого массив
        document.quickviewPreload[href] = $(content).getColumnContent();
      })
      // Если загрузить страницу не удалось, удаляем отметку о том, что мы подгрузили эту страницу
      .fail(function() {
        delete document.quickviewPreload[href];
      });
    }
  });
});
// Действие при нажатии на кнопку быстрого просмотра.  
$(document).ready(function(){
  $(document).on('click', 'a.quickViewMod', function() {
    var href = $(this).attr('href');
    href += (false !== href.indexOf('?') ? '&' : '?') + 'only_body=1';
    quickViewShowMod(href);
    $('.product-view').addClass('quickViewMod');
    return false;
  });
});
}
// Быстрый просмотр товара
function quickViewShowMod(href, atempt) {
  // Если данные по быстрому просмотру уже подгружены
  if(typeof(document.quickviewPreload[href]) != 'undefined') {
    // Если мы в режиме загрузки страницы и ждём результата от другой функции, то тоже подождём, когда тот контент загрузится и будет доступен в этом массиве.
    if(1 == document.quickviewPreload[href]) {
      // Если попытки ещё не указывались, ставим 0 - первая попытка
      if(typeof(atempt) == 'undefined') {
        atempt = 0;
      // Иначе прибавляем счётчик попыток
      } else {
        atempt += 1;
        // Если больше 500 попыток, то уже прошло 25 секунд и похоже, что быстрый просмотр не подгрузится, отменяем информацию о том, что контент загружен
        if(atempt > 500) {
          delete document.quickviewPreload[href];
          // TODO сделать вывод красивой таблички
          alert('Не удалось загрузить страницу товара. Пожалуйста, повторите попытку позже.');
          return true;
        }
      }
      // Запустим функцию быстрого просмотра через 5 сотых секунды, вероятно запрошендная страница товара уже подгрузится. 
      setTimeout('quickViewShowMod("' + href + '", '+ atempt +')', 50);
      return true;
    } else {
      $.fancybox.close();
      $.fancybox.open(document.quickviewPreload[href]);
      MainFunctions();
      AddCart();
      Addto();
      quantity();
      openMod();
    }
  } else {
    $.get(href, function(content) {
      $.fancybox.close();
      $.fancybox.open($(content).getColumnContent());
      MainFunctions();
      AddCart();
      Addto();
      quantity();
      openMod();
    });
  }
}




// Функция быстрого оформления заказа в корзине
function startOrder(){  
  var globalOrder = $('#globalOrder');
  var closeOrder = $('#closeOrder'); // объект кнопки отмены заказа
  var textCloseOrder = '#closeOrder';
  // Если форма уже открыта то ничего не делаем.
  if (globalOrder.css('display') != 'none') {
    // Если блок с формой заказа не скрыт то выходим из функции
    return false;
  }
  //объект блока куда будет выводиться форма быстрого заказа
  var OrderAjaxBlock = $('#OrderAjaxBlock');
  // объект кнопки "Заказать"
  var buttonStartOrder = $('#startOrder');
  //объект блока с ajax анимацией
  var ajaxLoaderQuickOrder = $('.preloader');
  var urlQuickForm = '/cart/add'; // адрес страницы с формой
  // данные которые отарвятся на сервер чтобы получить только форму быстрого заказа без нижней части и верхней части сайта
  var quickFormData = [
    {name: 'ajax_q', value: 1},
    {name: 'fast_order', value: 1}
  ];
  // Скрываем кнопку "Заказать"
  buttonStartOrder.hide();
  // Скрываем элементы в корзине
  // Отключаем возможность редактирования формы
  var cartTable = $('.cartTable');
  // открываем общий, глобальный блок
  globalOrder.show();
  $('html, body').delay(400).animate({scrollTop : jQuery('#globalOrder').offset().top - 100}, 800);
  // включаем gif анимацию загрузки
  ajaxLoaderQuickOrder.show('slow');
  $.ajax({
    type: "POST",
    cache: false,
    url: urlQuickForm,
    data: quickFormData,
    success: function(data) {     
      OrderAjaxBlock.html($(data).find('.quickformfast').wrap('<div></div>').html());
      // скрываем блок с анимацией
      ajaxLoaderQuickOrder.hide();
      // раскрываем блок с формаой
      OrderAjaxBlock.show('slow');
      // удалим обработчик события на кнопке отмена
      $('.formfast-cart').css('display','block');
      closeOrder.css('display','block');
      cartTable.addClass('disable');
      q = cartTable.find('.cartqty');
      q.prop('disabled',true);
      quickOrderScripts();
      OrderScripts();
      coupons();
      address();
      showPass();
      $(".callback_phone").mask("+7 (999) 999-9999");
      $("#sites_client_phone").mask("+7 (999) 999-9999");
      $('.cart_items').on('click', textCloseOrder, function() {
        //Скрываем блок оформления заказа
        ajaxLoaderQuickOrder.hide('fast');
        OrderAjaxBlock.hide('fast');
        globalOrder.hide('fast');
        closeOrder.css('display','none'); // Скрываем кнопку "Отменить"
        buttonStartOrder.css('display','block'); // Возврощаем кнопку "Заказать"
        // Включаем возможность редактирования формы
        cartTable.removeClass('disable');
        q.prop('disabled',false);
        return false;
      });
    }
  });
  return false;
}

// Удаление товара из Сравнения без обновлении страницы
function removeFromCompare(e){
  if(confirm('Вы точно хотите удалить товар из сравнения?')){
  var del = e;
  var num = $('.compare .count').attr('data-count');
  e.parent().fadeOut().remove();
  url = del.data('href');
  goodsModId = $(del).attr('data-goods-mod-id');
  $.ajax({ 
    cache : false,
    url		: url,
    success: function(d){
      var oldCount = num;
      var newCount = oldCount - 1;
      $('.compare .count').attr('data-count', newCount);
      var flag = 0;
      if(newCount != 0){
        $('#compare-items li.item').each(function(){
          if(flag == 0){
            if($(this).css('display') == 'none'){
              $(this).show();
            flag++;
            }
          }
        })}else{
          $('.compare #compare-items .empty.hide').show();
          $('.compare .buttons').hide();
        }
      var obj = $('.add-compare[data-mod-id="' + goodsModId + '"]');
      if(obj.length) {
        obj.attr("data-action-is-add", "1")
        .removeAttr("title")
        .removeClass("added")
        .attr("href", obj.attr("href").replace(obj.attr('data-action-delete-url'), obj.attr('data-action-add-url')));
      }
		}
  })
  }
}
// Удаление ВСЕХ товаров из Сравнения без обновлении страницы
function removeFromCompareAll(e){
  if(confirm('Вы точно хотите очистить сравнение?')){
  var del = e;  
  e.fadeOut().remove();
  url = del.data('href');
  $.ajax({ 
    cache   : false,
    url		  : url,
    success: function(d){
      $('.compare .count').text("0");
      $('.compare .button').hide();
      $('.compare .removeAll').hide();
      $('.compare #compare-items .item').hide();
      $('.compare #compare-items .empty.hide').show();
      $('.add-compare').removeAttr("title").removeClass("added");
		}
  })
  }
}
// Удаление товара из Сохраненного без обновлении страницы
function removeFromFavorites(e){
  if(confirm('Вы точно хотите удалить товар из Сохраненного?')){
  var del = e;
  var num = $('.favorites .count').attr('data-count');
  e.parent().fadeOut().remove();
  url = del.data('href');
  goodsModId = $(del).attr('data-goods-mod-id');
  $.ajax({ 
    cache : false,
    url   : url,
    success: function(d){
      var oldCount = num;
      var newCount = oldCount - 1;
      $('.favorites .count').attr('data-count', newCount);
      var flag = 0;
      if(newCount != 0){
        $('#favorites-items li.item').each(function(){
          if(flag == 0){
            if($(this).css('display') == 'none'){
              $(this).show();
            flag++;
            }
          }
        })}else{
          $('.favorites #favorites-items .empty.hide').show();
          $('.favorites .button').hide();
          $('.favorites .removeAll').hide();
        }
      var obj = $('.add-wishlist[data-mod-id="' + goodsModId + '"]');
      if(obj.length) {
        obj.attr("data-action-is-add", "1")
        .removeAttr("title")
        .removeClass("added")
        .attr("href", obj.attr("href").replace(obj.attr('data-action-delete-url'), obj.attr('data-action-add-url')));
      }
		}
  })
  }
}
// Удаление ВСЕХ товаров из Сохраненное без обновлении страницы
function removeFromFavoritesAll(e){
  if(confirm('Вы точно хотите очистить Сохраненное?')){
  var del = e;
  e.fadeOut().remove();
  url = del.data('href');
  $.ajax({ 
    cache   : false,
    url		  : url,
    success: function(d){
      $('.favorites .count').text("0");
      $('.favorites .button').hide();
      $('.favorites .removeAll').hide();
      $('.favorites #favorites-items .item').hide();
      $('.favorites #favorites-items .empty.hide').show();
      $('.add-wishlist').removeAttr("title").removeClass("added");
		}
  })
  }
}
// Удаление товара из корзины без обновлении страницы
function removeFromCart(e){
  if(confirm('Вы точно хотите удалить товар из корзины?')){
  var del = e;  
  e.parent().fadeOut().remove();
  url = del.data('href');
  quantity = del.data('count');
  $('.total-sum').animate({opacity: 0},500);
  $.ajax({
    cache  : false,
		url		 : url,
    success: function(d){
      var oldCount = $('.cart .count').attr('data-count');
      var oldQuantity = quantity;
      var newCount = oldCount - oldQuantity;
      $('.cart .count').text(newCount);
      $('.cart .count').attr('data-count', newCount);
      $('.total-sum').animate({opacity: 1},500);
      $('.total-sum').html($(d).find('.total-sum').html());
      var flag = 0; 
      if(newCount != 0){
      $('.cart-products-list li.item').each(function(){
        if(flag == 0){
          if($(this).css('display') == 'none'){
            $(this).show();
          flag++;
          }
        }
      })}else{
        $('#header .cart .have-items').removeClass('have-items');
        $('#header .cart .cart-content .cart-products-list').hide();
        $('#header .cart .cart-content .subtotal').hide();
        $('#header .cart .cart-content .actions').hide();
        $('#header .cart .icon .total-sum').hide();
        $('#header .cart .cart-content .empty').show();
        $('#sidebar .cart').removeClass('have-items');
      }
    }
  });
  }
}
// Удаление ВСЕХ товаров из Корзины без обновлении страницы
function removeFromCartAll(e){
  event.preventDefault();
  if(confirm('Вы точно хотите очистить корзину?')){
  var del = e;  
  e.parent().fadeOut().remove();
  url = del.data('href');
  $.ajax({ 
    cache  : false,
    url		 : url,
    success: function(d){
      $('.cart .count').text("0");
      $('#header .cart .have-items').removeClass('have-items');
      $('#header .cart .cart-content .cart-products-list').hide();
      $('#header .cart .cart-content .subtotal').hide();
      $('#header .cart .cart-content .actions').hide();
      $('#header .cart .icon .total-sum').hide();
      $('#header .cart .cart-content .empty').show();
      $('#sidebar .cart').removeClass('have-items');
		}
  });
  }
}
// Удаление товара из корзины
function ajaxdelete(s){
  var yep = confirm('Вы точно хотите удалить товар из корзины?');
  if(yep == true){
    var closeimg = s;
    s.closest('.items').fadeOut();
    url = closeimg.data('href');
    console.log(url);
    $.ajax({
      url:url,
      cache:false,
      success:function(d){
        $('.cart_items').html($(d).find('.cart_items').html());
        ajaxnewqty();
        quantityCart();
        $('#startOrder').on('click', function() {
          startOrder();
          return false;
        });
       }      
    })}else{
      return false;
    }
}
// Корзина
function ajaxnewqty(){
  $('.cartqty').change(function(){
    s = $(this);
    id = $(this).closest('.items').data('id');
    qty = $(this).val();
    data = $('.cartForm').serializeArray();
    data.push({name: 'only_body', value: 1});
    $('div[data-id="' + id + '"] .ajaxtotal').css('opacity','0');
    $('div[data-id="' + id + '"] .ajaxcount').css('opacity','0');
    $('.TotalSum').css('opacity','0');
    $.ajax({
      data: data,
      cache:false,
      success:function(d){        
        s.val($(d).find('div[data-id="' + id + '"] .cartqty').val())
        $('div[data-id="' + id + '"] .ajaxtotal').css('opacity','1');
        $('div[data-id="' + id + '"] .ajaxcount').css('opacity','1');
        $('.TotalSum').css('opacity','1');
        div = $('div[data-id="' + id + '"]');
        div.find('.ajaxtotal').html($(d).find('div[data-id="' + id + '"] .ajaxtotal').html());
        div.find('.ajaxcount').html($(d).find('div[data-id="' + id + '"] .ajaxcount').html());
        $('.TotalSum').html($(d).find('.TotalSum').html());
        $('.discounttr').each(function(){
          $(this).remove();
        });
        $(d).find('.discounttr').each(function(){
          $('.cartTable .cartFoot .discount-list .discount').before($(this));
        });
        c = $(d).find('div[data-id="' + id + '"] .cartqty').val();
        if(qty > c){
          $('.cartErr').remove();
          $('.cartTable').before('<div class="cartErr warning">Вы пытаетесь положить в корзину товара больше, чем есть в наличии</div>');
          $('.cartErr').fadeIn(500).delay(2500).fadeOut(500, function(){$('.cartErr').remove();});
          $('.cartqty').removeAttr('readonly');
        }
      }
    })
  })
}

// Новые input поля с анимацией
function newInput() {
	// trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	if (!String.prototype.trim) {
		(function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}
	[].slice.call( document.querySelectorAll( '.input-field' ) ).forEach( function( inputEl ) {
		// in case the input is already filled..
		if( inputEl.value.trim() !== '' ) {
			classie.add( inputEl.parentNode, 'input-filled' );
		}
		// events:
		inputEl.addEventListener( 'focus', onInputFocus );
		inputEl.addEventListener( 'blur', onInputBlur );
	});
	function onInputFocus( ev ) {
		classie.add( ev.target.parentNode, 'input-filled' );
	}
	function onInputBlur( ev ) {
		if( ev.target.value.trim() === '' ) {
			classie.remove( ev.target.parentNode, 'input-filled' );
		}
	}
}
// Радио кнопки для модификаций
function newModification() {
  $('.goodsDataMainModificationsBlockProperty').each(function(){
    a = $(this).find('select option:selected').attr('value');
    $(this).find('.goodsDataMainModificationsValue[data-value="'+ a +'"]').addClass('active');
  });
  $('.goodsDataMainModificationsValue').click(function(){
    $(this).parent().find('.goodsDataMainModificationsValue').removeClass('active');
    $(this).addClass('active');
    a = $(this).data('value');
    $(this).parent().parent().find('select option[value="' + a + '"]').prop('selected',true);
    $(this).parent().parent().find('select').trigger('change');
    $('.goodsDataMainModificationsBlockProperty').each(function(){
      dis = $(this).find('select option:disabled').attr('value');
      $(this).find('.goodsDataMainModificationsValue[data-value="'+ dis +'"]').removeClass('active');
      $(this).find('.goodsDataMainModificationsValue[data-value="'+ dis +'"]').addClass('disabled');
    });
  });
}

// Разница в цене в процентах %
function priceDiff() {
  $('.products-grid .item').each(function(){
    a = parseFloat($(this).find('.old-price .num').text().replace(' ',''));
    b = parseFloat($(this).find('.special-price .num').text().replace(' ',''));
    if(a > 0){
    z = a - b;
    z = ((parseInt(a - b)/a)*100);
    $(this).find('.ico-sales .percent').text(z.toFixed() + "%");
    }
  });
  $('.product-view').each(function(){
    old = parseFloat($(this).find('.old-price .num').text().replace(' ',''));
    special = parseFloat($(this).find('.special-price .num').text().replace(' ',''));
    if(old > 0){
    x = old - special;
    x = ((parseInt(old - special)/old)*100);
    $(this).find('.ico-sale .percent').text(x.toFixed() + "%");
    console.log(old);
    console.log(special);
    }
  });
}

// Предзагрузчик
function preload() {
  var $preloader = $('.preloader'),
  $spinner = $preloader.find('.content-loading');
  $spinner.fadeOut();
  $preloader.delay(500).fadeOut('slow');
}

// Инициализация табов на странице товара
function initTabs() {
  // Блок в котором находятся табы
  var tabBlock = $('.product-tabs');
  if(!tabBlock.length) {
    return false;
  }
  // По умолчанию делаем отметку о том что активного таба не найдено
  var isFind = 0;
  tabBlock.find('.tabs .tab').each(function(i){
    // Если нашёлся активный там
    if($(this).hasClass('active')) {
      // Инициализируем найденный таб
      $(this).click();
      // Ставим отметку, о том что не нужно инициализировать первый таб на странице
      isFind = 1;
    }
  });
  // Если не найдено ни одного таба с отметкой о том что он активен
  if(!isFind) {
    // Ставим активным первый таб на странице.
    var tab = $('.tabs .tab').attr('id').slice(-1);
    tabSwitch(tab);
  }
  // Проверяет хэш и если по нему была открыта вкладка, то эта функция автоматически откроет её.
  checkTabHash();
  // Если текущий адрес страницы предполагает добавление отзыва
  if('#goodsDataOpinionAdd' == document.location.hash) {
    $('#goodsDataOpinionAdd').show();
    $('html, body').animate({scrollTop : jQuery('.goodsDataOpinion').offset().top - 160}, 400);
  }
  // Биндим изменение хэша - проверка какой таб нужно открыть.
  $(window).bind('hashchange', function() { checkTabHash(); });
}
// Проверяет хэш, переданый пользователем и открывает соответствующий раздел
function checkTabHash() {
  // Определяем текущий хэш страницы
  var hash = window.location.hash.substr(1);
  if(hash == 'goodsDataOpinionAdd') {
    hash = 'show_tab_4';
  }
  if(!hash.length || hash.indexOf('show_tab_') == -1) {
    return false;
  }
  // Открываем тот таб, который был указан в hash-е
  tabSwitch(hash.replace("show_tab_", ''))
}
// Выбор вкладки на странице товара
function tabSwitch(nb) {
  var tabBlock = $('.product-tabs');
  tabBlock.find('.tabs .tab').removeClass('active');
  tabBlock.find('.tab-content').hide();
  $('#tab_' + nb).addClass('active');
  $('#content_' + nb).show();
  if('#goodsDataOpinionAdd' != document.location.hash) {
    // Записываем в хэш информацию о том какой таб сейчас открыт, для возможности скопировать и передать ссылку с открытым нужным табом
    document.location.hash = "#show_tab_" + nb;  
  }
}

// Основные функции
function MainFunctions() {
$(document).ready(function(){
  // Кнопки на сайте если подгружен модуль Jquery.UI
  if(typeof($('button.submit, button:submit, input:submit, input.button').button) == "function" ) {
    $('button.submit, button:submit, input:submit, input.button').button();
  }
  // Валидация формы на странице оформления заказа, а так же формы на страницы связи с администрацией
  $("#myform, #quickform, .goodsDataOpinionAddForm, .callback-info .callbackForm, #news .feedback .callbackFrom, .feedbackForm").validate({
    errorPlacement: function(error, element) { }
  });
  // Скрытие сообщения об ошибки через 3 секунды
  $("#myform, #quickform, .goodsDataOpinionAddForm, .callback-info .callbackForm, #news .feedback .callbackFrom").submit(function() {
    $('label.error').delay(3000).fadeOut();
  });
  // Отправка формы по Ctrl+Enter
  $('form').bind('keypress', function(e){
    if((e.ctrlKey) && ((e.which==10)||(e.which==13))) {$(this).submit();}
  // Отправка данных формы по нажатию на Enter в случае если курсор находится в input полях (В некоторых браузерах при нажатии по enter срабатывает клик по первому submit полю, которое является кнопкой назад. Для этого написан этот фикс)
  }).find('input').bind('keypress', function(e){
    if(((e.which==10)||(e.which==13))) { try{$(this.form).submit();} catch(e){} return false; }
  });
  
  // Функция собирает свойства в строку, для определения модификации товара
  function getSlugFromGoodsDataFormModificationsProperties(obj) {
    var properties = new Array();
    $(obj).each(function(i){
      properties[i] = parseInt($(this).val());
    });
    return properties.sort(function(a,b){return a - b}).join('_');
  }
   
  var 
    goodsDataProperties = $('.goodsDataForm select[name="form[properties][]"]'),  // Запоминаем поля выбора свойств, для ускорения работы со значениями свойств
    goodsDataModifications = $('.goodsDataMainModificationsList'); // Запоминаем блоки с информацией по модификациям, для ускорения работы
  // Обновляет возможность выбора свойств модификации, для отключения возможности выбора по характеристикам модификации которой не существует.
  function updateVisibility (y) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    goodsDataProperties.each(function(j){
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if( j != y ) {
        // Проходим по всем значениям текущего свойства модификации товара
        $(this).find('option').each(function(){
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          var checkProperties = new Array();
          $(goodsDataProperties).each(function(i){
            checkProperties[i] = parseInt($(this).val());
          });
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[j] = parseInt($(this).attr('value'));
          // Собираем хэш определяющий модификацию по свойствам
          slug = checkProperties.sort(function(a,b){return a - b}).join('_');
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          if(!goodsDataModifications.filter('[rel="'+slug+'"]').length) {
           $(this).attr('disabled', true);
          // Если выбрав данное значение свойства товара можно подобрать модификацию, то выделяем вариант выбора как доступный.
          } else {
            $(this).attr('disabled', false);
          }
        });
      }
    });
  }
  // Обновляем возможность выбора модификации товара по свойствам. Для тех свойств, выбор по которым не возможен, отключаем такую возможность.
  // Проверяем возможность выбора на всех полях кроме первого, чтобы отключить во всех остальных варианты, которые не возможно выбрать
  updateVisibility (0);
  // Проверяем возможность выбора на всех полях кроме второго, чтобы в первом поле так же отключилась возможность выбора не существующих модификаций
  updateVisibility (1);

  // Изменение цены товара при изменении у товара свойства для модификации
  goodsDataProperties.each(function(){
    $(this).change(function(){
      var slug = getSlugFromGoodsDataFormModificationsProperties(goodsDataProperties),
        modificationBlock             = $('.goodsDataMainModificationsList[rel="'+slug+'"]'),
        modificationId                = parseInt(modificationBlock.find('[name="id"]').val()),
        modificationArtNumber         = modificationBlock.find('[name="art_number"]').val(),
        modificationPriceNow          = parseInt(modificationBlock.find('[name="price_now"]').val()),
        modificationPriceNowFormated  = modificationBlock.find('.price_now_formated').html(),
        modificationPriceOld          = parseInt(modificationBlock.find('[name="price_old"]').val()),
        modificationPriceOldFormated  = modificationBlock.find('.price_old_formated').html(),
        modificationRestValue         = parseFloat(modificationBlock.find('[name="rest_value"]').val()),
        modificationDescription       = modificationBlock.find('.description').html(),
        modificationMeasureId         = parseInt(modificationBlock.find('[name="measure_id"]').val()),
        modificationMeasureName       = modificationBlock.find('[name="measure_name"]').val(),
        modificationMeasureDesc       = modificationBlock.find('[name="measure_desc"]').val(),
        modificationMeasurePrecision  = modificationBlock.find('[name="measure_precision"]').val(),
        modificationIsHasInCompareList= modificationBlock.find('[name="is_has_in_compare_list"]').val(),
        modificationGoodsModImageId   = modificationBlock.find('[name="goods_mod_image_id"]').val(),
        goodsModificationId           = $('.goodsDataMainModificationId'),
        goodsPriceNow                 = $('.goodsDataMainModificationPriceNow'),
        goodsPriceOld                 = $('.goodsDataMainModificationPriceOld'),
        goodsAvailable                = $('.goodsDataMainModificationAvailable'),
        goodsAvailableTrue            = goodsAvailable.find('.available-true'),
        goodsAvailableFalse           = goodsAvailable.find('.available-false'),
        goodsAvailableAddCart         = $('.add-to-form .add-cart'),
        goodsAvailableAddCartQuick    = $('.add-to-form .add-cart.quick'),
        goodsAvailableQty             = $('.add-to-form .qty-wrap > div:not(.mod)'),
        goodsArtNumberBlock           = $('.goodsDataMainModificationArtNumber'),
        goodsArtNumber                = goodsArtNumberBlock.find('span');
        goodsCompareAddButton         = $('.goodsDataCompareButton.add');
        goodsCompareDeleteButton      = $('.goodsDataCompareButton.delete');
        goodsModDescriptionBlock      = $('.goodsDataMainModificationsDescriptionBlock');
        goodsModRestValueBlock        = $('.goodsDataMainModificationRestValue');
        goodsModRestValue             = $('.goodsDataMainModificationRestValue .count');
       
      // Изменяем данные товара для выбранных параметров. Если нашлась выбранная модификация
      if(modificationBlock.length) {
        // Цена товара
        goodsPriceNow.html('<span class="price">' + modificationPriceNowFormated + '</span>');
        // Старая цена товара
        if(modificationPriceOld>modificationPriceNow) {
          goodsPriceOld.html('<span class="price">' + modificationPriceOldFormated + '</span>');
        } else {
          goodsPriceOld.html('');
        }
        // Есть ли товар есть в наличии
        if(modificationRestValue>0) {
          goodsAvailableTrue.show();
          goodsAvailableFalse.hide();
          goodsAvailableAddCart.show();
          goodsAvailableAddCartQuick.show();
          goodsAvailableQty.show();
          goodsModRestValue.html(modificationRestValue);
          $('.product-view .qty-wrap .quantity').attr('max', modificationRestValue);
          $('.product-view .qty-wrap .quantity').val("1");
          $('.product-view .add-to-box').removeClass('empty');
          $('.product-view .available .count').text(modificationRestValue);
        // Если товара нет в наличии
        } else {
          goodsAvailableTrue.hide();
          goodsAvailableFalse.show();
          goodsAvailableAddCart.hide();
          goodsAvailableAddCartQuick.hide();
          goodsAvailableQty.hide();
          goodsModRestValue.html(modificationRestValue);
          $('.product-view .qty-wrap .quantity').attr('max', modificationRestValue);
          $('.product-view .qty-wrap .quantity').val("1");
          $('.product-view .add-to-box').addClass('empty');
          $('.product-view .available .count').text(modificationRestValue);
        }
        // Если товар есть в списке сравнения
        if(modificationIsHasInCompareList>0) {
          goodsCompareAddButton.hide();
          goodsCompareDeleteButton.show();
        // Если товара нет в списке сравнения
        } else {
          goodsCompareAddButton.show();
          goodsCompareDeleteButton.hide();
        }
        // Покажем артикул модификации товара, если он указан
        if(modificationArtNumber.length>0) {
          goodsArtNumberBlock.show();
          goodsArtNumber.html(modificationArtNumber);
        // Скроем артикул модификации товара, если он не указан
        } else {
          goodsArtNumberBlock.hide();
          goodsArtNumber.html('');
        }
        // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
        if(modificationDescription.length > 0) {
          goodsModDescriptionBlock.show().html('<div>' + modificationDescription + '</div>');
        } else {
          goodsModDescriptionBlock.hide().html();
        }
        // Идентификатор товарной модификации
        goodsModificationId.val(modificationId);
        
        // Меняет главное изображение товара на изображение с идентификатором goods_mod_image_id
        function changePrimaryGoodsImage(goods_mod_image_id) {
          // Если не указан идентификатор модификации товара, значит ничего менять не нужно.
          if(1 > goods_mod_image_id) {
            return true;
          }
          var 
            // Блок с изображением выбранной модификации товара
            goodsModImageBlock = $('.thumblist [data-id="' + parseInt(goods_mod_image_id) + '"'),
            // Блок, в котором находится главное изображение товара
            MainImageBlock = $('.product-image'),
            // Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
            MediumImageUrl = goodsModImageBlock.find('a').attr('href'),
            // Главное изображение, в которое будем вставлять новое изображение
            MainImage = MainImageBlock.find('img'),
            // В этом объекте хранится идентификатор картинки главного изображения для коректной работы галереи изображений
            MainImageIdObject = MainImageBlock.attr('data-id')
          ;
          
          // Если изображение модификации товара найдено - изменяем главное изображение
          MainImage.attr('src', MediumImageUrl);
          MainImageBlock.find('a').attr('href', MediumImageUrl);
          // Изменяем идентификатор главного изображения
          MainImageBlock.attr("data-id", parseInt(goods_mod_image_id));
          return true;
        }
        // Обновляем изображние модификации товара, если оно указано
        changePrimaryGoodsImage(modificationGoodsModImageId);
      } else {
        // Отправим запись об ошибке на сервер
        sendError('no modification by slug '+slug);
        alert('К сожалению сейчас не получается подобрать модификацию соответствующую выбранным параметрам.');
      }
    });
  });
  
  // Фильтр по ценам
  var
    priceFilterMinAvailable = parseInt($('.goodsFilterPriceRangePointers .min').text()),  // Минимальное значение цены для фильтра
    priceFilterMaxAvailable = parseInt($('.goodsFilterPriceRangePointers .max').text()),  // Максимальное значение цены для фильтра
    priceSliderBlock = $('#goods-filter-price-slider'), // Максимальное значение цены для фильтра
    priceInputMin = $("#goods-filter-min-price"), // Поле ввода текущего значения цены "От"
    priceInputMax = $("#goods-filter-max-price"), // Поле ввода текущего значения цены "До"
    priceSubmitButtonBlock = $(".goodsFilterPriceSubmit");  // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.
    
  // Изменяет размер ячеек с ценой, т.к. у них нет рамок, есть смысл менять размеры полей ввода, чтобы они выглядили как текст
  function priceInputsChangeWidthByChars() {
    // Если есть блок указания минимальной цены
    if(priceInputMin.length) {
      priceInputMin.css('width', (priceInputMin.val().length*7 + 20) + 'px');
      priceInputMax.css('width', (priceInputMax.val().length*7 + 20) + 'px');
    }
  }
  
  // Слайдер, который используется для удобства выбора цены
  priceSliderBlock.slider({
    range: true,
    min: priceFilterMinAvailable,
    max: priceFilterMaxAvailable,
    values: [
      parseInt($('#goods-filter-min-price').val())
      ,parseInt($('#goods-filter-max-price').val())
    ],
    slide: function( event, ui ) {
      priceInputMin.val( ui.values[ 0 ] );
      priceInputMax.val( ui.values[ 1 ] );
      priceSubmitButtonBlock.show();
      priceInputsChangeWidthByChars();
    }
  });
  // При изменении минимального значения цены
  priceInputMin.keyup(function(){
    var newVal = parseInt($(this).val());
    if(newVal < priceFilterMinAvailable) {
      newVal = priceFilterMinAvailable;
    }
    priceSliderBlock.slider("values", 0, newVal);
    priceSubmitButtonBlock.show();
    priceInputsChangeWidthByChars();
  });
  // При изменении максимального значения цены
  priceInputMax.keyup(function(){
    var newVal = parseInt($(this).val());
    if(newVal > priceFilterMaxAvailable) {
      newVal = priceFilterMaxAvailable;
    }
    priceSliderBlock.slider("values", 1, newVal);
    priceSubmitButtonBlock.show();
    priceInputsChangeWidthByChars();
  });
  // Обновить размеры полей ввода диапазона цен
  priceInputsChangeWidthByChars();
  
  // В форме оформления заказа при клике на кнопку назад просто переходим на предыдущую страницу
  $('.order form input:submit[name="toprev"]').click(function(){
    var act = this.form.action;
    this.form.action = act + ( act.indexOf( '\?' ) > -1 ? '&' : '?' ) + 'toprev=1';
    this.form.submit();
    return false;
  });
  // Фильтры по товарам. При нажании на какую либо характеристику или свойство товара происходит фильтрация товаров
  $('.filters .filter input').click(function(){
    $(this)[0].form.submit();
  });
  // ajax вывод товаров списком/таблицей без обновления страницы
  $('.OrderFilterForm').on('click', '.view-mode > a', function(){
    href = document.location.href;  
    if (href.indexOf('?') + 1) { separator = '&'; }
    else { separator = '?'; }
    browser = null;
    qwe = navigator.userAgent;
    if (qwe.search(/MSIE/) != -1) {browser = 'IE'}
    if(browser === 'IE'){
      var url = encodeURI(document.location.href+separator+$(this).data('href').slice(1));
    }else{
      var url = document.location.href+separator+$(this).data('href').slice(1);
    }
    $('.products-ajax').addClass('fadeout');
    $('.products-container').prepend('<div class="preloader"><span class="content-loading"></span></div>');
    $.ajax({
      url: url,
      cache: false,
      success: function(d){
        $('.products-ajax').parent().html($(d).find('.products-ajax').parent().html());
        $('.view-mode').html($(d).find('.view-mode').html());
        AddCart();
        Addto();
        quickView();
        quickViewMod();
        priceDiff();
      }
    });
  });
  // Открытие сортировки и показать по
  $('.selectBox .select .label').on('click',function(){
    if($(this).parent().parent().hasClass('active')){
      $(this).parent().parent().removeClass('active');
    }else{
      $(this).parent().parent().addClass('active');
    }
  });
  
  // Обновление названия сортировки
  $('.toolbar .sort-by.selectBox .select .label span').text($('.toolbar .sort-by.selectBox .dropdown a[selected]').text());
  
});
}
// Выносим функции из шаблонов
function outFunctions() {
$(document).ready(function(){
  // Вызов функции быстрого заказа в корзине
  $('#startOrder').on('click', function() {
    startOrder();
    return false;
  });
  // Вызов функции редиректа при обратном звонке
  // Маска ввода телефона
  $(".callback_phone").mask("+7 (999) 999-9999");
  $("#sites_client_phone").mask("+7 (999) 999-9999");
  $('#callback .callbackForm').submit(validCallBackC);
  $('#fancybox-callback .callbackForm').submit(validCallBackFC);
  // Возврашаем пользователя на страницу с которой был сделан обратный звонок
  $('.callbackredirect').val(document.location.href);
  // Добавление товара в корзину
  $('.wrapper').on('click', '.add-cart', function() {
    var form = $(this).closest('form');
    if ($(this).hasClass('quick')) {
      form.attr('rel', 'quick');
    } else {
      var rel = form.attr('rel');
      if (rel) {
        form.attr('rel', rel.replace('quick', ''));
      }
    }
    form.trigger('submit');
    return (false);
  });
  // Распродажа
  $(".viewed .owl-carousel").owlCarousel({
    items: 2,
    loop: false,
    rewind: false,
    lazyLoad: false,
    margin: 0,
    nav: false,
    dots: false,
    navText: [ , ],
    autoWidth: false,
    autoHeight: false,
    autoplay: true,
    autoplayHoverPause: true,
    smartSpeed: 500,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsiveClass: true,
    responsiveRefreshRate: 100,
    responsive: {
      0:{items:1},
      320:{items:2},
      480:{items:3},
      641:{items:4},
      768:{items:5},
      992:{items:2},
      1200:{items:2}
    }
  });
});
}

// Валидаторы для Имени и телефона в "Служба поддержки" на главной
function validNameC(){ 
  var name = $('#callback .callbackForm .callback_person');
  if(name.val() != ''){
    name.removeClass('error');
    name.attr('placeholder','Введите Имя');
    c2 = true;
  }else{
    name.addClass('error');
    name.attr('placeholder','Вы не ввели Имя');
  } 
}
function validPhoneC(){ 
  var tel = $('#callback .callbackForm .callback_phone');
  var check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel.val());
  if(check == true && check != ''){
    tel.removeClass('error');
    tel.attr('placeholder','Введите номер');
    c1 = true;
  }
  else{
    tel.addClass('error');
    tel.attr('placeholder','Вы ввели неверный номер');
  }
}
function validCallBackC(){c1 = false;c2 = false;validNameC();validPhoneC();return c1 && c2;}



// Валидаторы для Имени и телефона в "Служба поддержки" на главной
function validNameFC(){ 
  var name = $('#fancybox-callback .callbackForm .callback_person');
  if(name.val() != ''){
    name.removeClass('error');
    name.attr('placeholder','Введите Имя');
    fc2 = true;
  }else{
    name.addClass('error');
    name.attr('placeholder','Вы не ввели Имя');
  } 
}
function validPhoneFC(){ 
  var tel = $('#fancybox-callback .callbackForm .callback_phone');
  check = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{5,10}$/.test(tel.val());
  if(check == true && check != ''){
    tel.removeClass('error');
    tel.attr('placeholder','Введите номер');
    fc1 = true;
  }
  else{
    tel.addClass('error');
    tel.attr('placeholder','Вы ввели неверный номер');
  }
}
function validCallBackFC(){fc1 = false;fc2 = false;validNameFC();validPhoneFC();return fc1 && fc2;}



// Функции для главной страницы
function indexPage() {
// Слайдер на главной
var owlS = $('#slideshow .owl-carousel');
owlS.owlCarousel({
  items: 1,
  loop: true,
  rewind: true,
  lazyLoad: false,
  nav: true,
  navText: [ , ],
  navContainer: '#slideshow .bg .owl-nav',
  dots: true,
  dotsContainer: '#slideshow .bg .owl-dots',
  URLhashListener: true,
  autoplay: true,
  autoplayHoverPause: true,
  smartSpeed: 500,
  dotsSpeed: 400,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true
});
// add animate.css class(es) to the elements to be animated
function setAnimation ( _elem, _InOut ) {
  // Store all animationend event name in a string.
  // cf animate.css documentation
  var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  _elem.each ( function () {
    var $elem = $(this);
    var $animationType = 'animated ' + $elem.data( 'animation-' + _InOut );
    $elem.addClass($animationType).one(animationEndEvent, function () {
      $elem.removeClass($animationType); // remove animate.css Class at the end of the animations
    });
  });
}
// Fired before current slide change
owlS.on('change.owl.carousel', function(event) {
  var $currentItem = $('.owl-item', owlS).eq(event.item.index);
  var $elemsToanim = $currentItem.find("[data-animation-out]");
  setAnimation ($elemsToanim, 'out');
});
// Fired after current slide has been changed
owlS.on('changed.owl.carousel', function(event) {
  var $currentItem = $('.owl-item', owlS).eq(event.item.index);
  var $elemsToanim = $currentItem.find("[data-animation-in]");
  setAnimation ($elemsToanim, 'in');
});

// Бренды
$("#brands .owl-carousel").owlCarousel({
  items: 5,
  loop: false,
  rewind: true,
  lazyLoad: false,
  margin: 30,
  nav: false,
  dots: false,
  navText: [ , ],
  autoWidth: false,
  autoHeight: false,
  autoplay: true,
  autoplayHoverPause: true,
  smartSpeed: 500,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  responsiveClass: true,
  responsiveRefreshRate: 100,
  responsive: {
    0:{items:1},
    320:{items:2, margin: 10},
    480:{items:3},
    641:{items:4},
    768:{items:4},
    992:{items:3},
    1200:{items:5}
  }
});
// Категории
$("#categories .owl-carousel").owlCarousel({
  items: 6,
  loop: false,
  rewind: true,
  lazyLoad: false,
  margin: 30,
  nav: true,
  dots: false,
  navText: [ , ],
  autoWidth: false,
  autoHeight: false,
  autoplay: false,
  autoplayHoverPause: true,
  smartSpeed: 500,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  responsiveClass: true,
  responsiveRefreshRate: 100,
  responsive: {
    0:{items:1},
    320:{items:2, margin: 10},
    480:{items:3},
    641:{items:4},
    768:{items:5},
    992:{items:5},
    1200:{items:6}
  }
});
// Распродажа
$("#sales .owl-carousel").owlCarousel({
  items: 1,
  loop: true,
  rewind: true,
  lazyLoad: false,
  margin: 0,
  nav: false,
  dots: false,
  navText: [ , ],
  autoWidth: false,
  autoHeight: false,
  autoplay: true,
  autoplayHoverPause: true,
  smartSpeed: 500,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true
});
// Отзывы
$("#opinion .owl-carousel").owlCarousel({
  items: 1,
  loop: false,
  rewind: true,
  lazyLoad: false,
  margin: 0,
  nav: true,
  dots: false,
  navText: [ , ],
  autoWidth: false,
  autoHeight: false,
  autoplay: true,
  autoplayHoverPause: true,
  smartSpeed: 500,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true
});
// Новости
$("#news .owl-carousel").owlCarousel({
  items: 2,
  loop: false,
  rewind: true,
  lazyLoad: false,
  margin: 60,
  nav: false,
  dots: true,
  navText: [ , ],
  autoHeight: false,
  autoplay: false,
  autoplayHoverPause: true,
  smartSpeed: 500,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  responsiveClass: true,
  responsiveRefreshRate: 100,
  responsive: {
    0:{items:1},
    320:{items:1},
    480:{items:1},
    641:{items:2},
    768:{items:2},
    992:{items:2},
    1200:{items:2},
    1400:{items:2}
  }
});

// Функция показать больше для Товары на главной
var s = $('.pdt-sale .products-grid .item').length;
if(s<=8){$('.pdt-sale .showAll').hide();}
$('.pdt-sale .showAll span').on('click',function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active');
    $('.pdt-sale .products-grid .item').removeClass('showThis');
    $(this).text("Смотреть все");
    $('html, body').animate({scrollTop : jQuery('.pdt-sale').offset().top }, 800);
  }else{ 
    $('.pdt-sale .products-grid .item').addClass('showThis');
    $(this).addClass('active');
    $(this).text("Скрыть");
    $('html, body').animate({scrollTop : jQuery('.pdt-sale').offset().top + $(window).height()}, 800);
  }
});
// Функция показать больше для Хиты продаж
var b = $('.pdt-best .products-grid .item').length;
if(b<=8){$('.pdt-best .showAll').hide();}
$('.pdt-best .showAll').on('click',function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active');
    $('.pdt-best .products-grid .item').removeClass('showThis');
    $(this).find('span').text("Смотреть все");
    $('html, body').animate({scrollTop : jQuery('.pdt-best').offset().top }, 800);
  }else{ 
    $('.pdt-best .products-grid .item').addClass('showThis');
    $(this).addClass('active');
    $(this).find('span').text("Скрыть");
    $('html, body').animate({scrollTop : jQuery('.pdt-best').offset().top + $(window).height()}, 800);
  }
});
// Функция показать больше для Новинок
var n = $('.pdt-new .products-grid .item').length;
if(n<=8){$('.pdt-new .showAll').hide();}
$('.pdt-new .showAll span').on('click',function(){
  if($(this).hasClass('active')){
    $(this).removeClass('active');
    $('.pdt-new .products-grid .item').removeClass('showThis');
    $(this).text("Смотреть все");
    $('html, body').animate({scrollTop : jQuery('.pdt-new').offset().top }, 800);
  }else{ 
    $('.pdt-new .products-grid .item').addClass('showThis');
    $(this).addClass('active');
    $(this).text("Скрыть");
    $('html, body').animate({scrollTop : jQuery('.pdt-new').offset().top + $(window).height()}, 800);
  }
});
// Открытие Видео
$('#video .content .play').click(function(event){
event.preventDefault();
  if ($(this).closest('.content').hasClass('active')) {
    $(this).closest('.content').removeClass('active');
    $(this).removeClass('active');
  } else {
    $(this).closest('.content').addClass('active');
    $(this).addClass('active');
    $('#video .content').append('<iframe class="video" data-type="chrome" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" width="600" height="338" src="https://www.youtube.com/embed/hLpy-DRuiz0?iv_load_policy=3&amp;modestbranding=1&amp;autoplay=0&amp;controls=1&amp;showinfo=0&amp;wmode=opaque&amp;branding=0&amp;autohide=0&amp;rel=0&amp;enablejsapi=1&amp;" tabindex="-1"></iframe>');
  }
});
// Закрытие Видео
$('#video .content .close').click(function(event){
event.preventDefault();
  if ($(this).closest('.content').hasClass('active')) {
    $(this).closest('.content').removeClass('active');
    $(this).removeClass('active');
    $('#video .content .play').removeClass('active');
    $('#video .content iframe').remove();
  } else {
    $(this).closest('.content').addClass('active');
    $(this).addClass('active');
  }
  // Пауза при Закрытии Видео
  jQuery("iframe").each(function() {
    jQuery(this)[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
  });
});

}

// Открытие Подвал, Меню, Каталог, Фильтры
function OpenMenu() {
  // Закрытие
  $('.overlay').on('click', function (event) {
    event.preventDefault();
    $('.overlay').removeClass('active');
    $('#header .menus > div').removeClass('active');
    $('#sidebar .catalog').removeClass('active');
  });
	// Открытие меню пользователя и корзины
  $('#header .menus .label').on('click', function (event) {
    event.preventDefault();
    if ($(this).closest('.menus > div').hasClass('active')) {
			$(this).closest('.menus > div').removeClass('active');
			$('.overlay').removeClass('active');
		} else {
		  $('#header .menus > div').removeClass('active');
		  $('#sidebar .catalog').removeClass('active');
		  $('.overlay').addClass('active');
			$(this).closest('.menus > div').addClass('active');
		}
	});
	// Открытие каталога в сайдбаре
  $('#sidebar .catalog > a').on('click', function (event) {
    event.preventDefault();
    if ($(this).closest('.catalog').hasClass('active')) {
			$(this).closest('.catalog').removeClass('active');
			$('.overlay').removeClass('active');
		} else {
		  $('#header .menus > div').removeClass('active');
		  $('.overlay').addClass('active');
			$(this).closest('.catalog').addClass('active');
		}
	});
	// Подвал
	$('#footer .block .title').click(function(event){
  event.preventDefault();
    if ($(this).closest('.block').hasClass('active')) {
      $(this).next('.content').slideUp(600);
      $(this).closest('.block').removeClass('active');
    } else {
      $(this).next('.content').slideDown(600);
      $(this).closest('.block').addClass('active');
    }
  });
  // Боковое меню сохранение открытой вложенности
  $('.collapsible:not(".active")').find('.content').css('display', 'none');
  $('.collapsible .title').click(function(event){
  event.preventDefault();
    if ($(this).closest('.collapsible').hasClass('active')) {
      $(this).parent().find('.content').slideUp(600);
      $(this).closest('.collapsible').removeClass('active');
    } else {
      $(this).parent().find('.content').slideDown(600);
      $(this).closest('.collapsible').addClass('active');
    }
  });
  // Открытие фильтров
  $('.filters .block-title .title').click(function(event){
  event.preventDefault();
    if ($(this).parents().find('.filters').hasClass('active')) {
      $(this).parents().find('.contents').slideDown(600);
      $(this).parents().find('.filters').removeClass('active');
    } else {
      $(this).parents().find('.contents').slideUp(600);
      $(this).parents().find('.filters').addClass('active');
    }
  });
}

// Отсчет даты до окончания акции
function counterDate() {
// Устанавливаем дату обратного отсчета ММ-ДД-ГГ
var end = $('.counter').attr('end');
var countDownDate = new Date(end).getTime();
// Обновление счетчика каждую секунду
var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  // Вывод
  $('.counter .days span').text(days);
  $('.counter .hours span').text(hours);
  $('.counter .minutes span').text(minutes);
  $('.counter .seconds span').text(seconds);
  // Счетчик завершен
  if (distance < 0) {
    clearInterval(x);
    $('.counter').hide();
  }
}, 1000);
}

// Отсчет даты до окончания акции
function openMod() {
$('.product-view .qty-wrap .label.mod').on('click', function(){
  if($('.product-view .goodsDataMainModificationsBlock').hasClass('active')){
    $(this).removeClass('active');
    $('.product-view .goodsDataMainModificationsBlock').removeClass('active');
    $('.product-view .goodsDataMainModificationsBlock').slideUp(600);
  }else{
    $(this).addClass('active');
    $('.product-view .goodsDataMainModificationsBlock').addClass('active');
    $('.product-view .goodsDataMainModificationsBlock').slideDown(600);
  }
});
}

// Основные функции шаблона
$(document).ready(function(){
  var wS = ($('#slideshow').outerWidth() - $('#slideshow .container').outerWidth() + 30)/2;
  $('#slideshow .bg .outerBG').css({'width': wS, 'right': -wS});
});

// Загрузка основных функций шаблона
$(document).ready(function(){
  MainFunctions();
  outFunctions();
  ajaxnewqty();
  AddCart();
  Addto();
  coupons();
  address();
  OpenMenu();
  newInput();
  priceDiff();
  showPass();
  quickViewMod();
});
// Загрузка основных функций шаблона после полной загрузки страницы
$(window).on("load", function () {
  if(getClientWidth() > 991){
  }
});

// Запуск основных функций для разных разрешений экрана
$(document).ready(function(){
  if(getClientWidth() > 991){
    quickView();
    var wS = ($('#header').outerWidth() - $('#header .container').outerWidth() + 30)/2;
    $('.bg .outerBG').css({'width': wS, 'right': -wS});
    $('.block-left .filters').removeClass('active');
  }
  if(getClientWidth() < 991){
    $('.block-left .filters').addClass('active');
  }
  if(getClientWidth() > 480 && window.outerHeight < 630){
    $('body').addClass('landscape');
  }else{
    $('body').removeClass('landscape');
  }
});
// Запуск функций при изменении экрана
$(window).resize(function(){
  if(getClientWidth() > 991){
    quickView();
    var wS = ($('#header').outerWidth() - $('#header .container').outerWidth() + 30)/2;
    $('.bg .outerBG').css({'width': wS, 'right': -wS});
  }
  if(getClientWidth() < 991){
  }
  if(getClientWidth() > 480 && window.outerHeight < 630){
    $('body').addClass('landscape');
  }else{
    $('body').removeClass('landscape');
  }
});



$(document).ready(function(){

});



