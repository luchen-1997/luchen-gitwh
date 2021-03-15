(function($, window, document){
 
  var $keys = $('.key'); //网页键盘模拟键
  var len = $keys.length; //模拟键盘总长
  var $input = $('.textbox .input .shuru'); //隐藏输入框DOM
  var $output = $('.textbox .output'); //输出框
  var sIndex = 0; //记录HTML单词开始值
  var eIndex = 0; //练习HTML单词结束值
  var recordArray = [];
  var HTMLWordsArr = [];
  var markPoint = 0;
  var count = 0; 
  var deletedArr = [];
  var totalInputArr = [];
  var wrongLetter = [];
  var exampleArr = [];
  var lastIndex = 0; //记录上一个单词前的空格index
  var setNumber = 0;
  var timeCount = 0;
  var timer = null;
  var flag = true;
  var clearClass = 'csscode jscode htmlcode jsword htmlword cssword';

  //练习控制参数
  var upLimit         = 3;  //设置单词练习的组数，每组生成随机不重复单词
  var HTMLWordsPerSet = 12; //HTML单词练习每组个数
  var CSSWordsPerSet  = 10; //CSS单词练习每组个数
  var JSWordsPerSet   = 8; //JS单词练习每组个数
  //键码数组
  var keyCodeArr = [
    192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8, 9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13, 16, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 16, 17, 91, 18, 32, 18, 93, 91, 17, 45, 36, 33, 46, 35, 34, 38, 37, 40, 39]
  
  //键名
  var itemCode = [
    "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"
  ];

  //js单行语句
  var jsSentenceArr = [
    'document.getElementById(id)', 'document.getElementsByClassName(className)', 'document.getElementsByName(name)', 'window.location.href', 'window.getComputedStyle()',
    'document.getElementById(id).innerHTML', 'item.setAttribute(attrName)',
    'document.querySelector(selector)','document.querySelectorAll(selector)',
    'element.style.color="red"', 'document.getElementsByTagName(tagName)',
    'element.innerHTML=&lt;strong&gt;hello!world&lt;/strong&gt;',
  ]; 
  
  //css属性
  var cssWords = [
    {'height': 'randomGenerateOne'},
    {'width': 'randomGenerateOne'},
    {'color': 'randomGenerateOne'},
    {'font-size': 'randomGenerateOne'},
    {'background-color': 'randomGenerateOne'},
    {'margin': 'randomGenerateOne'},
    {'margin-top': 'randomGenerateOne'},
    {'margin-right': 'randomGenerateOne'},
    {'margin-bottom': 'randomGenerateOne'},
    {'margin-left': 'randomGenerateOne'},
    {'padding': 'randomGenerateOne'},
    {'padding-top': 'randomGenerateOne'},
    {'padding-right': 'randomGenerateOne'},
    {'padding-bottom': 'randomGenerateOne'},
    {'padding-left': 'randomGenerateOne'},
    {'line-height': 'randomGenerateOne'},
    {'text-align': ['left', 'center', 'right']},
    {'display': ['block', 'none', 'inline', 'inline-block', 'list-item','table']},
    {'text-align': ['left', 'center', 'right']},
    {'font-style': ['normal', 'italic', 'bold','bolder']},
    {'clear': ['both','left','right']},
    {'clear': ['both','left','right']},
    {'text-decoration-line': ['none','line-through','overline','underline','unset','inherit','blink']},
    {'float': ['left','right','none','inline-start','inline-end']},
    {'border': ['none', '1px solid red','2px dashed blue', '3px dotted green']},
    {'border-radius': 'randomGenerateOne'},
    {'overflow': ['hidden','visible','auto','scroll',]},
    {'color': 'randomGenerateOne'},
    {'transform': ['rotate(90deg)', 'translateX(45px)', 'scale(1.5) rotateX(45deg)']},
  ];
  
  //css常见选择器
  var cssSelectorLib = [
    '.container','.wrap','.main','.header','.nav','.footer','#id', '*', 'div', 'div,p' , 'div p', '[src]', 'input[type=text]', 'a:link', 'a:vistied', 'div:first-child', 'p:last-child', 'div::before','div::after','div:nth-child(n)','div:nth-last-child(n)','div:first-of-type','div:only-of-type','a[src^="https"]','a[src$=".pdf"]','a[src*="abc"]', 'div:hover', 'div>span','.wrap+div.item','.list','.menu','.box','.box-top','.box-bot','.newsList','ul li a',
  ]

  //HTML标签
  var HTMLWords = {
    'selfEnd':['link','meta','img','input','br','hr','base','area','source'],
    'doubleEnd':['html','head','title','style','script','template','body','section','nav','article', 'aside','h1','h2','h3','h4','h5','h6','header','footer','address','main','p','pre','blockquote','ol','li','dl','dt','dd','figure','figcaption','div','a','em','strong','small','s','cite','q','dfn','abbr','time','code','var','samp','kbd','sub','sup','i','b','u','mark','ruby','rt','rp','bdi','bdo','span','wbr','ins','del','iframe','enbed','object','param','video','audio','track','canvas','map','svg','math','table','caption','colgroup','col','tbody','thead','tfoot','tr','td','th','form','fieldset','legend','label','button','select','datalist','optgroup','option','textarea','output','progress','meter','details','summary','menuitem','menu'],
    'attr': {
      'common': ['class','id'],
      'input': ['type', 'disabled','placeholder','autofocus','autocomplete','required','name',],
      'select': ['autofocus','disabled','multiple','name','required',],
      'label':['for','form'],
      'img': ['src','alt'],
      'link':['rel','type','target'],
      'meta':['http-equiv','scheme'],
      'script':['type','defer','src','charset'],
    },
  }
  
  //js单词库
  var jsWords = [];
  var jsLib = {
    'common':['toString','length','new','for','if','while','try','catch','return','break','continue','true','false','var','const','let',],

    'function': ['prototype','arguments','call','apply','bind','name'],

    'Array': ['push','pop','splice','concat','shift','slice','sort','map','reverse','join','indexOf','includes','fill','forEach','find','every','fliter','lastIndexOf','unshift','value'],

    'String': ['fliter','search','replace','split','toLowerCase','toUpperCase','match','RegExp','substring',],

    'Number': ['parseFloat','parseInt','NaN','toExponential','toFixed','toPrecision'],

    'document': ['getElementById','getElementsByClassName','getElementsByTagName','getElementsByName','querySelector','querySelectorAll','createElement','cookie','contentType','children','childrenNodes','charset','append','appendChild','addEventListener','onblur','onchange','onclick','onclose','onmouseenter','onmouseout','onblur','onfocus','oninput','onchange','onkeydown','onkeypress','onkeyup','ondblclick','body'],

    'window': ['localStorage','location',],

    'event': ['stopPropagation','preventDefault','target',],

    'JSON': ['parse','stringify'],

    'RegExp': ['test','exec','sticky','global','ignoreCase','multiline','compile'],

    'Date': ['getDate','getDay','getFullYear','getMilliseconds','getHours','getMinutes','getMonth','getSeconds','getTime','setDate','setDay','setFullYear','setMilliseconds','setHours','setMinutes','setMonth','setSeconds','setTime','toJSON','valueOf'],
  };

  //js代码块
  var jscodeLib = [
  `$.ajax({
    type:'POST',
    url: '',
    dataType: 'json',
    success: function(data){
      document.write(data);
    }
  });`,
  `function mod(a,b){
    return a%b;
  }`,
  `function reverseString(str){
    var temp = str.split('').reverse().jion();
    return temp;
  }`,
  `function $(selector){
    return document.querySelector(selector);
  }`,
  `function loopObj(Obj) {
    for(var key in Obj){
      console.log(key+': '+Obj[key]);
    }
  }`,
  ]

  //加载js单词库
  function jsWordsAdd() {
    for(var key in jsLib){
      if(key != 'common'){
        jsWords.push(key);
        for(var i = 0; i < jsLib[key].length; i++){
          jsWords.push(jsLib[key][i]);
        }
      }else{
        for(var i = 0; i < jsLib[key].length; i++){
          jsWords.push(jsLib[key][i]);
        }
      }
    }
  }
  jsWordsAdd();

  //网页第一次打开时加载
  function start(){
    var curTrain = $('.nav .cur').text();
    if(curTrain == 'html单词'){
      $('.textbox .case').text(generateHTMLWords(HTMLWords,HTMLWordsPerSet));
      count++;
      exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
      exampleArr.pop();
      setNumber = exampleArr.length;
      init();
    }
    if(curTrain == 'css单词'){
      $('.textbox .case').text(generateCssWords(cssWords,CSSWordsPerSet));
      count++;
      exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
      exampleArr.pop();
      setNumber = exampleArr.length;
      init();
    }
    if(curTrain == 'js单词'){
      $('.textbox .case').text(generateJSWords(jsWords, JSWordsPerSet));
      count++;
      exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
      exampleArr.pop();
      setNumber = exampleArr.length;
      init();
    }
    deleteFunc($input);
  }
  start();
  //循环给每个模拟键标记键位码
  for(var i = 0; i < len; i++){
    $keys.eq(i).attr('data-keycode', keyCodeArr[i]);
  }
  HTMLwordsJoinArr(HTMLWords);

  //生成练习用单行语句
  function jsSentenceCase(Arr, number) {
    if(Arr.length == 0){
      return;
    }
    var arr = Arr;
    var str = '';
    // var end = start + length <= arr.length? start+length : arr.length; 
    var norepeatArr = norepeatRandomArr(arr.length);
    for(var i = 0; i < number; i++ ){
      str += arr[norepeatArr[i]]+' '+'\n';
      // Arr.splice(norepeatArr[i],1);
    }
    
    return str;
  }

  //生成JS代码块
  function generateJSCode(Arr, number) {
    if(Arr == null || number <= 0){
      return;
    }
    var str = '';
    var set = norepeatRandomArr(Arr.length);

    for(var i = 0; i < number; i++){
      var temp = Arr[set[i]];
      str += temp.replace('    ','&nbsp;&nbsp;') + '\n';
    }

    return str;
  }
  //设置模式切换时的样式
  function setCaseNOutput(addClassName) {
    $('.textbox .case').removeClass(clearClass);
    $('.textbox .output').removeClass(clearClass);
    $('.textbox .case').addClass(addClassName);
    $('.textbox .output').addClass(addClassName);
    
  }

  //设置练习模式
  function setcodeModel(){
    var $curModel = $('.nav .cur');
    $curModel.attr('data-codeModel','on');
    $curModel.siblings().removeAttr('data-codeModel');
  }

  //代码块练习模式
  function toTextarea(){
    $('.textbox .input input').remove();
    $('.textbox div.case').remove();
    $('.textbox pre.case').remove();
    $('.textbox .input textarea').remove();
    $('.textbox').prepend(`<pre class='case'></pre>`); 
    $('.textbox .input').append(`<textarea class='shuru' cols="0" rows="0"></textarea>`);
    $input = $('.textbox .input textarea');
    $input.focus();
    inputCheck($input);
    tabfunc($input);
  }
  //单词练习模式
  function toInputbox(){
    $('.textbox .input textarea').remove();
    $('.textbox div.case').remove();
    $('.textbox pre.case').remove();
    $('.textbox .input input').remove();
    $('.textbox').prepend(`<div class='case'></div>`); 
    $('.textbox .input').append('<input class="shuru" autofocus type="text" placeholder="输入框"/>');
    $input = $('.textbox .input input');
    $input.focus();
    inputCheck($input);
    deleteFunc($input);
  }


  //导航交互
  $('.nav a').each(function () {
    $(this).on('click',function(){
      $(this).addClass('cur');
      $(this).siblings().removeClass('cur');
      sIndex = 0;
      eIndex = 0;
      count = 0;
      recordArray = [];
      deletedArr = [];
      totalInputArr = [];
      lastIndex = 0;
      exampleArr = [];
      clearInterval(timer);
      flag = true;
      timeCount = 0;
      init();
      $('.time span').text('00:00:00');
      $('.progress span').text('0%');
      //js实战模式
      if($(this).text() == "js实战"){
        setcodeModel();
        
        $('.keybox').css({
          'opacity': 0,
        });
        setTimeout(function(){
          toTextarea();
          $('.keybox').hide();
          $('.textbox').height(490);
          setCaseNOutput('jscode');
          $('.textbox .case').html(jsSentenceCase(jsSentenceArr, 5));
          // jsSentenceCase(jsSentenceArr, 5)
        },300);
        
      }
      //css实战模式
      if($(this).text() == "css实战"){
        setcodeModel();
        init();
        $('.keybox').css({
          'opacity': 0,
        });
       
        setTimeout(function(){
          toTextarea();
          $('.keybox').hide();
          $('.textbox').height(490);
          setCaseNOutput('csscode');
          $('.textbox .case').html(generateCssCode(cssSelectorLib,cssWords,2));
          // console.log($('.textbox .case').text().split());
        },300);
        
      }
      //html实战模式
      if($(this).text() == "html实战"){
        setcodeModel();
        init();
        $('.keybox').css({
          'opacity': 0,
        });
        setTimeout(function(){
          toTextarea();
          $('.keybox').hide();
          $('.textbox').height(490);
          // switchOutputBox();
          setCaseNOutput('htmlcode');
          $('.textbox .case').html(generateHTMLElement(HTMLWords,5));
        },300); 
      }
      //js单词模式
      if($(this).text().indexOf('js单词') >= 0){
        toInputbox();
        $('.textbox').height(160);
        setCaseNOutput('jsword');
        $('.keybox').show();
        $('.keybox').css({
          'opacity': 1,
        })
        recordArray = norepeatRandomArr(jsWords.length);
        $('.textbox .case').text(generateJSWords(jsWords, JSWordsPerSet));
        count++;
        exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
        exampleArr.pop();
        setNumber = exampleArr.length;
      }
      //html单词模式
      if($(this).text().indexOf('html单词') >= 0){
        toInputbox();
        $('.textbox').height(160);
        
        setCaseNOutput('htmlword');
        $('.keybox').show();
        $('.keybox').css({
          'opacity': 1,
        })
        recordArray = norepeatRandomArr(HTMLWordsArr.length);
        $('.textbox .case').text(generateHTMLWords(HTMLWordsArr,HTMLWordsPerSet));
        count++;
        exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
        exampleArr.pop();
        setNumber = exampleArr.length;
      }
      //css单词模式
      if($(this).text().indexOf('css单词') >= 0){
        toInputbox();
        $('.textbox').height(160);
        setCaseNOutput('cssword');
        $('.keybox').show();
        $('.keybox').css({
          'opacity': 1,
        });
        recordArray = norepeatRandomArr(cssWords.length);
        $('.textbox .case').text(generateCssWords(cssWords,CSSWordsPerSet));
        count++;
        exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
        exampleArr.pop();
        setNumber = exampleArr.length;
      }
    })
  })

  //键盘互动
  $(window).on('keydown',function (event) {
    $input.eq(0).focus();
    // console.log(event);
    //禁用删除键
    // if(event.keyCode == 8){
    //   $input.attr('disabled','disabled');
    // }else{
    //   $input.removeAttr('disabled');
    // }

    //回车键
    if(event.keyCode == 13){
      // var temp = $input.val() + '\n';
      // $input.val(temp);
      var temp = $output.text();
      $output.text(temp + '\n\r');
    }  

    for(let j=0; j < len; j++){
      var dataKeyC = ($keys.eq(j).attr('data-keycode'));
      if(dataKeyC == event.keyCode){
        if(itemCode.indexOf(event.code) != -1 ){
           
        }else if(event.keyCode === 32){
          if($('.nav .cur').text().indexOf('实战') != -1){
            // if(!/^\/s+/.test($input.val())){
          }
        }else {
        }

        if($keys.eq(j).find('img').length == 0){ //不包含图片
          
          $keys.eq(j).css({
            'color':'#1c1c1c',
            'background':'#ffb802',
            'transition':'all 0.2s',
          });

          setTimeout(function(){
            $keys.eq(j).css({
              'color':'#ffb802',
              'background':'#1c1c1c'
            })
          },300);
        }
      }else{
        $keys.eq(j).css({
          'color':'#ffb802',
          'background':'#1c1c1c'
        })
      }
    }

    if(flag){
      // clearInterval(timer);
      $('.time').attr('data-time', 'on');
      
      timekeeper();
      flag = false;
      $('.pause').unbind('click').on('click',function(){
        clearInterval(timer);
      })
      $('.stop').unbind('click').on('click',function(){
        clearInterval(timer);
      })
      $('.reset').unbind('click').on('click',function(){
        clearInterval(timer);
        timer = null;
        timeCount = 0;
        $input.eq(0).val('');
        $output.text('');
        flag = true;
        $('.time span').text('00:00:00');
        $('.acurate span').text('100%');
        $('.progress span').text('0%');
        $('.speed span').text('0');
      })
    }

  });


  function timekeeper(){
    if($('.time').attr('data-time') != 'on'){
      return;
    }

    var $timeBox = $('.time span');
    var time = $timeBox.text();

    var $sec = '';
    var $min = '';
    var $hour = '';
    var res = '';

    timer = setInterval(function(){
      timeCount++;
      $sec = formatNumTwo(timeCount%60);
      $min = formatNumTwo(parseInt(timeCount / 60) % 60);
      $hour = formatNumTwo(parseInt(timeCount / 60 / 60));
      res = $hour+':'+$min+':'+$sec;
      $timeBox.text(res);
    },1000);
  }

  function formatNumTwo(num){
    if(num < 10){
      return '0' + num.toString();
    }
    return num.toString();
  }

  //重置按钮功能
  function reset(){
    $('.reset').on('click',function(){
      $input.eq(0).val('');
      $output.text('');
      flag = true;
      $('.time span').text('00:00:00');
      $('.acurate span').text('100%');
      $('.progress span').text('0%');
      $('.speed span').text('0');
    })
  }
  
  //tab键转换为两个空格
  function tabfunc(ele){
    ele.unbind('keydown').on('keydown',function(e) {
      if (e.keyCode == 9) {
        e.preventDefault();
        var indent = '  ';
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var selected = window.getSelection().toString();
        selected = indent + selected.replace(/\n/g, '\n' + indent);
        this.value = this.value.substring(0, start) + selected
                + this.value.substring(end);
        this.setSelectionRange(start + indent.length, start
                + selected.length);
      }
    })
  }

  //删除键记录
  function deleteFunc(ele){
    ele.unbind('keydown').on('keydown',function(){
      if(event.keyCode == 8){ //删除键
        var str = $('.textbox .case').text();
        var temp = $('.textbox .input .shuru').val().split('');
        var len = $('.textbox .input .shuru').val().split('').length;
        if(temp[len - 1] != undefined && $('.case').text().indexOf(temp[len - 1]) != len - 1 ){
          var word = findword( len - 1, str );
          word = word.substring(0, word.length - 1);
          wrongLetter.push([word, temp[len - 1], len - 1]);
          if(deletedArr.indexOf(word) == -1 && word != ' '){
            deletedArr.push(word);
          }
        }
        // console.log(deletedArr);
        // console.log(wrongLetter);
      }

      if(event.keyCode == 32){
        var temp = $('.textbox .input .shuru').val();
        var str = temp.substring(lastIndex).replace(' ','');
        if((str != ' ' && str != '')){
          totalInputArr.push(str);
        }
        lastIndex = $('.textbox .input .shuru').val().length;
      }

    })
  }

  //给出坐标寻找对应单词
  function findword(index, arr){
    var low = 0;
    var high = 0;
    var lowFlag = false;
    var highFlag = false;
    for(var i = 0; i < arr.length; i++){
      var l = index - i;
      var h = index + i;
      if((arr[l] == ' ' || l == 0) && !lowFlag){
        low = l;
        lowFlag = true;
      }
      if((arr[h] == ' ' || h == arr.length - 1) && !highFlag){
        high = h;
        highFlag = true;
      }
      if(lowFlag && highFlag){
        break;
      }
    }
    return arr.substring(low,high + 1);
  }
  //输入监测
  function inputCheck(ele) {
    ele.unbind('input').on('input', function(){
      var $curModel = $('.nav .cur');
      if($curModel.attr('data-codemodel') != 'on'){
        var replaceStr = ele.val().toString().replace(/\s+/, ' ');
        ele.val(replaceStr);
        var val = ele.val().toString();
        var len = val.length;
        var compareStr = $('.case').text().substring(0, len).toString();
        if(count > upLimit){
          alert('练习完成');
          return;
        }
        if(totalInputArr.length  == setNumber && count < upLimit){
          var curTrain = $('.nav .cur').text();
          if(curTrain == 'html单词'){
            $('.textbox .case').text(generateHTMLWords(HTMLWords,HTMLWordsPerSet));
            lastIndex = 0;
            count++;
            
            exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
            exampleArr.pop();
            setNumber = exampleArr.length;
            init();
            
          }
          if(curTrain == 'css单词'){
            $('.textbox .case').text(generateCssWords(cssWords,CSSWordsPerSet));
            lastIndex = 0;
            count++;
            exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
            exampleArr.pop(); 
            setNumber = exampleArr.length;
            init();
            if(count == upLimit){
              alert('练习完成');
            }
          }
          if(curTrain == 'js单词'){
            $('.textbox .case').text(generateJSWords(jsWords, JSWordsPerSet));
            lastIndex = 0;
            count++;
            exampleArr = exampleArr.concat($('.textbox .case').text().split(' '));
            exampleArr.pop();
            setNumber = exampleArr.length;
            init();
            if(count == upLimit){
              console.log(count);
            }
          }
          return;
        }
        
        if(val.length != 0){
          valArr = val.split('');
          compareStrArr = compareStr.split('');
          var outputStr = ''
          for(var k = 0; k < len; k++){
            if(valArr[k] != compareStrArr[k]){
              outputStr += "<font color = 'red'>"+ valArr[k] +"</font>"
            }else{
              if(valArr[k] == '<'){
                outputStr += '&lt;';
              }else{
                outputStr += valArr[k];
              }
            }
          }
          $output.html(outputStr);
        }else{
          $output.html('');
        }
  
      }else{
        var val = ele.val().toString();
        var len = val.length;
        var compareStr = $('.case').text().substring(0, len).toString();
        if(parseFloat($('.progress span').text())  == '100%'){
          var curTrain = $('.nav .cur').text();
          if(curTrain == 'html实战'){
            $('.textbox .case').text(generateHTMLElement(HTMLWords,5));
            init();
          }
          if(curTrain == 'css实战'){
            $('.textbox .case').text(generateCssCode(cssSelectorLib,cssWords,2));
            init();
          }
          if(curTrain == 'js实战'){
            $('.textbox .case').text(jsSentenceCase(jsSentenceArr, 5));
            init();
          }
          return;
        }

        if(val.length != 0){
          valArr = val.split('');
          compareStrArr = compareStr.split('');
          var outputStr = '';
          for(var k = 0; k < len; k++){
            if(valArr[k] != compareStrArr[k]){
              outputStr += "<font color = 'red'>"+ valArr[k] +"</font>"
            }else{
              if(valArr[k] == '<'){
                outputStr += '&lt;';
              }else{
                outputStr += valArr[k];
              }
            }
          }
          $output.html(outputStr);
        }else{
          $output.html('');
        }
      }

      

      //进度条和正确率
      if(ele.val().length != 0){
        zhengquelv();
        progress();
      }else{
        $('.acurate span').text('100%');
        $('.progress span').text('0%');
      }
    });
    
  }

  inputCheck($input);
  
  function init() {
    $input.val('');
    $output.text('');
    // $('.progress span').text('0%');
    // $('.acurate span').text('100%');
    // $('.time span').text('00:00:00');
    // $('.speed span').text('0');
  }

  //输出时间格式化函数
  function formatNum(ele,target){
    if(ele < 10){
      target = '0' + ele.toString();
    }else {
      target = ele.toString();
    }

    return target;
  }

  //计时器功能
  function timeRecord() {
    var $timeBox = $('.time span');
    var $timeArr = $timeBox.text().split(':');
    var $hour = $timeArr[0]; 
    var $mintes = $timeArr[1]; 
    var $sec = $timeArr[2];
    var timer = null;
    var sec = parseInt($sec);
    var mintes = parseInt($mintes);
    var hour = parseInt($hour);

    $('.pause').on('click',function(){

      if($('.time').attr('data-time') == 'on'){
        return;
      }

      if($('.pause').attr('data-record') == 'on'){
        clearInterval(timer);
        $timeBox = $('.time span');
        $timeArr = $timeBox.text().split(':');
        $hour = $timeArr[0]; 
        $mintes = $timeArr[1]; 
        $sec = $timeArr[2];
        sec = parseInt($sec);
        mintes = parseInt($mintes);
        hour = parseInt($hour);
        $('.pause').attr('data-record', 'pause');
        return;
      }

      if($('.pause').attr('data-record') == 'pause'){
        clearInterval(timer);
        $timeBox = $('.time span');
        $timeArr = $timeBox.text().split(':');
        $hour = $timeArr[0]; 
        $mintes = $timeArr[1]; 
        $sec = $timeArr[2];
        sec = parseInt($sec);
        mintes = parseInt($mintes);
        hour = parseInt($hour);
        timer = setInterval(function () {
          sec++;
          if(sec > 59){
            mintes += 1;
            sec = 0;
          }
          if(mintes > 59){
            hour += 1;
            mintes = 0;
          }
          $sec = formatNum(sec, $sec);
          $mintes = formatNum(mintes, $mintes);
          $hour = formatNum(hour, $hour);
          var result = $hour+':'+$mintes+':'+$sec;
          $timeBox.eq(0).text(result);
          $('.pause').attr('data-record','on');
        },1000);

        return;
      }

      timer = setInterval(function () {
        sec++;
        if(sec > 59){
          mintes += 1;
          sec = 0;
        }
        if(mintes > 59){
          hour += 1;
          mintes = 0;
        }
        $sec = formatNum(sec, $sec);
        $mintes = formatNum(mintes, $mintes);
        $hour = formatNum(hour, $hour);
        var result = $hour+':'+$mintes+':'+$sec;
        $timeBox.eq(0).text(result);
        $('.pause').attr('data-record','on');

        
      },1000);
      

      $('.stop').on('click',function(){
        clearInterval(timer);
        if($('.pause').attr('data-record') != ''){
          $('.pause').attr('data-record','pause');
        }else{
          $('.pause').attr('data-record','');
        }
      })

      $('.reset').on('click',function(){
        clearInterval(timer);
        $timeBox.text('00:00:00');
        
        $('.pause').attr('data-record','off');
      })
    })
  }
  
  // timeRecord();

  //打字速度计算
  function calSpeed() {
    var $speed = $('.speed span');
    var speed = 0;
    console.log(totalInputArr);
    if($('.nav .cur').attr('data-codemodel') != 'on'){
      var words = totalInputArr.length;
      if(timeCount != 0){
        speed = parseInt(words / parseFloat(timeCount/60));
        $speed.text(speed);
      }
    }else{
      var inputCont =  $('.textbox .input .shuru').val().split(' ');
      if(inputCont.length != 0 && timeCount != 0){
        speed = parseInt(inputCont.length / parseFloat(timeCount/60));
        $speed.text(speed);
      }
    }
    
    
  }
  setInterval(function () {
    calSpeed();
  },5000);
  
  
  //正确率计算
  function zhengquelv() {
    var $accurateBox = $('.acurate span');
    var acurate = 0;
    // console.log(deletedArr);
    // console.log(totalInputArr);
    if($('.nav .cur').attr('data-codemodel') != 'on'){
      if(deletedArr.length != 0 && totalInputArr.length != 0 ){
        acurate = parseFloat(deletedArr.length / totalInputArr.length).toFixed(2);
        acurate = parseInt(((1 - acurate) * 100).toFixed(0));
        $accurateBox.text(acurate.toString() + '%');
      }
    }else{
      var caseCont = $('.textbox .case').text().split('');
      var inputCont = $('.textbox .input .shuru').val().split('');
      var wrongLetter = 0;
      var edge = inputCont.length > caseCont.length? caseCont.length : inputCont.length;
      for(var i = 0; i < edge; i++){
        if(inputCont[i] != caseCont[i]){
          wrongLetter++;
        }
      }
      acurate = (wrongLetter / inputCont.length).toFixed(2);
      acurate = parseInt(((1 - acurate)*100));
      $accurateBox.text(acurate.toString() + '%');
    }
    
  }

  //进度计算
  function progress() {
    var $progressBox = $('.progress span');
    var caseResArr = $('.textbox .case').text();
    var outputResArr = $output.text();
    var progressRate = 0;
    if(outputResArr.length > caseResArr.length){
      return;
    }
    
    // progressRate = (((outputResArr.length / caseResArr.length)).toFixed(2)*100).toFixed(0).toString();
    progressRate = parseInt(((timeCount / 300).toFixed(2)) * 100);
    $progressBox.text(progressRate.toString() + '%');
  }
  setInterval(function () {
    progress();
  },1000);
  //随机生成练习用代码

  //生成JS单词
  function generateJSWords(arr, number){
    if(arr == null || number <= 0){
      return;
    }
    if(sIndex > arr.length){
      return;
    }
    var len = arr.length;
    var str = '';
    var randomArr = []
    var norepeatArr = norepeatRandomArr(len);
    if($('.nav .cur').attr('data-codeModel') == 'on'){
      sIndex = 0;
    }
    eIndex = sIndex + number > arr.length? arr.length: sIndex + number;
    for(var i = sIndex; i < eIndex; i++){
      str += arr[norepeatArr[i]] + ' ';
    }
    sIndex = eIndex;
    return str;
  }

  //生成随机的CSS属性短句-函数
  function generateCssSentence(arr,number = 5){
    if(arr == null){
      return
    }
    var len = arr.length;
    var str = '';
    var randomArr = []
    var norepeatArr = norepeatRandomArr(len);
    for(var i = 0; i < number; i++){
      randomArr.push(arr[norepeatArr[i]]);
      // arr.splice(norepeatArr[i],1);
    }
    randomArr.forEach(function(item){
      for(var key in item){
        if(item[key] == 'randomGenerateOne'){
          str += `&nbsp;&nbsp;`+key + ': '+ randomDataOne(key)+";" + '\r';
        }else{
          str += `&nbsp;&nbsp;`+key +": " + item[key][randomNum(item[key].length)]+';' + '\r';
        }
      }
    })
    return str;
  }
  
  //生成CSS选择器-函数
  function generateCssSeletor(arr,number = 5){
    if(arr == null){
      return;
    }
    var str = '';
    var norepeatArr = norepeatRandomArr(arr.length);
    for(var i = 0; i < number; i++){
      str += arr[norepeatArr[i]] +' {  }' + '<br>';
      arr.splice(norepeatArr[i],1);
    }
    // document.write('<hr>');
    // document.write(str);
    return str;
  }
  
  //生成CSS代码块-函数
  function generateCssCode(selectorArr, cssWordsArr, number = 2){
    if(selectorArr == null || cssWordsArr == null){
      return;
    }
  
    var str = '';
    var norepeatArr = norepeatRandomArr(selectorArr.length);
    for(var i = 0; i < number; i++){
      str += `${selectorArr[norepeatArr[i]]} {`+`\n`+
       generateCssSentence(cssWordsArr,5) + `}\n`;
      selectorArr.splice(norepeatArr[i],1);
    }
    return str;
  }
  
  
  //生成给定范围内的随机数
  function randomNum(len) {
    return Math.floor(Math.random()*len);
  }
  
  //无重复随机数字数列
  function norepeatRandomArr(len) {
    var norepeatArr = [];
    for(var i = 0; i<len; i++){
      norepeatArr[i] = i;
    }
    return norepeatArr.sort(function(){
      return 0.5 - Math.random();
    });
  }

  //根据属性名生成随机属性值
  function randomDataOne(attrName){
    var dataType = ['string', 'percentage'];
  
    if(/color/i.test(attrName)){
      return randomColor();
    }else{
      if(dataType[randomNum(2)] == 'string'){
        return randomNum(100) + 'px';
      }else{
        return randomNum(100) + '%';
      }
    }
  }
  
  //生成随机颜色HEX值
  function randomColor() {
    var colorVal = '#';
    var hexArr = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    for(var i = 0; i < 6; i++){
      colorVal += hexArr[randomNum(hexArr.length)];
    }
    return colorVal;
  }
  
  //生成随机的HTML标签句-函数
  function generateHTMLElement(obj, number = 5) {
    if(obj == null){
      return;
    }
    var str = '';
    var selfTags = [];
    var normalTags = [];
    var attr = null;
    for(var key in obj){
      if(key == 'selfEnd'){
        selfTags = obj['selfEnd'];
      }
      if(key == 'doubleEnd'){
        normalTags = obj['doubleEnd'];
      }
      if(key == 'attr'){
        attr = obj['attr'];
      }
    }
    var norepeatArrNormal = norepeatRandomArr(normalTags.length);
    var norepeatArrSelf = norepeatRandomArr(selfTags.length);
    for(var i = 0 ; i < number; i++){
      var tag = normalTags[norepeatArrNormal[i]];
      var selfTag = selfTags[norepeatArrSelf[i]];
      var tagAttr = setRandomAttr(attr, tag);
      var selfTagAttr = setRandomAttr(attr, selfTag);
      if(selfTag == 'meta'){
        selfTagAttr += 'content="some_text"';
      }
      if(selfTag == 'link'){
        selfTagAttr += 'href="some_link"';
      }
  
      str +='&lt;'+tag+' '+tagAttr+'&gt;'+' '+'&lt;/'+tag+'&gt;'+'\n';
      if(i%2 == 0){
        str +='&lt;'+ selfTag + ' ' + selfTagAttr +'&gt;'+ '\n';
      }
    }
    return str;
  }

  //生成随机三位英文名字
  function randomName() {
    var strArr = ['menu','header','footer','head','main','container','item','list','slider','box','txt','msg','info','title','subtitle','clearfix','searchbox','searchBtn','quitBtn','nav','nav-item','inputBox','outputBox'];
    var name = strArr[randomNum(strArr.length)];
    // var norepeatArr = norepeatRandomArr(strArr.length);
    // for(var i = 0; i < 3; i++){
    //   name += strArr[norepeatArr[i]];
    // }
    return name;
  }
  
  //设置随机对应属性
  function setRandomAttr(attrObj, tagName) {
    if(attrObj == null || tagName == ''){
      return;
    }
  
    var tagArr = [];
    var commonAttr = attrObj['common'][randomNum(attrObj['common'].length)];
    var attrStr = commonAttr + '=' + randomName() + ' ';

    for(var key in attrObj){
      tagArr.push(key);
    }
  
    for(var i = 0; i < tagArr.length; i++){
      if(tagName == tagArr[i]){
        attrStr += attrObj[tagName][randomNum(attrObj[tagName].length)] +' = '+ 'someVal'+' ';
      }
      if(tagName == 'hr' || tagName == 'br'){
        attrStr = '';
      }
    }
    return attrStr;
  }

  function HTMLwordsJoinArr(obj){
    if(obj == null ){
      return;
    }
    var selfTags = [];
    var normalTags = [];
    var attr = null;
    var attrArr = [];
    for(var key in obj){
      if(key == 'selfEnd'){
        selfTags = obj['selfEnd'];
      }
      if(key == 'doubleEnd'){
        normalTags = obj['doubleEnd'];
      }
      if(key == 'attr'){
        attr = obj['attr'];
        for(var attrKey in attr){
          attrArr = attrArr.concat(attr[attrKey]);
        }
      }
    }
    var joinArr = selfTags.concat(normalTags);
    markPoint = joinArr.length;
    joinArr = joinArr.concat(attrArr);
    HTMLWordsArr = joinArr;
  }
  
  //生成HTML标签单词
  function generateHTMLWords(arr,number = 10){
    if(arr == null || number == null || number < 5){
      return 's';
    }
    if(sIndex > arr.length){
      return 'f';
    }
    var str = '';
    var joinArr = HTMLWordsArr;
    if($('.nav .cur').attr('data-codeModel') == 'on'){
      sIndex = 0;
    }
    eIndex = sIndex + number > joinArr.length? joinArr.length: sIndex + number;
    // var norepeatArr = norepeatRandomArr(joinArr.length);
    for(var i = sIndex ; i < eIndex; i++){
      var word = joinArr[recordArray[i]];
      if( joinArr.indexOf(word) >= markPoint){
        str += word +' ';
      }else{
        str += '<'+word+'>'+' ';
      }
    }
    sIndex = eIndex;
    return str;
  }
 
  //生成CSS单词
  function generateCssWords(arr, number){
    if(arr == null){
      return
    }
    if(sIndex > arr.length){
      return;
    }
    var str = '';
    var randomArr = [];
    if($('.nav .cur').attr('data-codeModel') == 'on'){
      sIndex = 0;
    }
    eIndex = sIndex + number > arr.length? arr.length: sIndex + number;
    // var norepeatArr = norepeatRandomArr(len);
    for(var i = sIndex; i < eIndex; i++){
      randomArr.push(arr[recordArray[i]]);
      // arr.splice(norepeatArr[i],1);
    }
    randomArr.forEach(function(item){
      for(var key in item){
        str += key + ' ';
      }
    })
    sIndex = eIndex;
    return str;
  }
})(window.jQuery, window, document);