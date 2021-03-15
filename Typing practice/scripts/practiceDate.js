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
  {'overflow': ['hidden','visible','auto','clip','scroll']},
  {'color': 'randomGenerateOne'},
  {'transform': ['rotate(90deg)', 'translateX(45px)', 'scale(1.5) rotateX(45deg)']},
];

var cssSelectorLib = [
  '.container','.wrap','.main','.header','.nav','.footer','#id', '*', 'div', 'div,p' , 'div p', '[src]', 'input[type=text]', 'a:link', 'a:vistied', 'div:first-child', 'p:last-child', 'div::before','div::after','div:nth-child(n)','div:nth-last-child(n)','div:first-of-type','div:only-of-type','a[src^="https"]','a[src$=".pdf"]','a[src*="abc"]', 'div:hover', 'div>span','.wrap+div.item','.list','.menu','.box','.box-top','.box-bot','.newsList','ul li a',
]

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


//生成随机的CSS属性短句
function generateCssSentence(arr,number = 5){
  if(arr == null){
    return
  }
  var len = arr.length;
  var str = '';
  var randomArr = []
  for(var i = 0; i < number; i++){
    randomArr.push(arr[randomNum(len)]);
  }
  randomArr.forEach(function(item){
    for(var key in item){
      if(item[key] == 'randomGenerateOne'){
        str += '&nbsp;&nbsp'+key + ': '+ randomDataOne(key)+";" + '\n';
      }else{
        str += '&nbsp;&nbsp'+key +": " + item[key][randomNum(item[key].length)]+';' + '\n';
      }
    }
  })
  return str;
}

// generateCssSentence(cssWords,5);

//生成CSS选择器
function generateCssSeletor(arr,number = 5){
  if(arr == null){
    return;
  }
  var str = '';

  for(var i = 0; i < number; i++){
    str += arr[randomNum(arr.length)] +' {  }' + '<br>';
  }
  // document.write('<hr>');
  // document.write(str);
  return str;
}

generateCssSeletor(cssSelectorLib,5);

//生成CSS代码块
function generateCssCode(selectorArr, cssWordsArr, number = 2){
  if(selectorArr == null || cssWordsArr == null){
    return;
  }

  var str = '';
  for(var i = 0; i < number; i++){
    str += `${selectorArr[randomNum(selectorArr.length)]} {`+'\n'+`${generateCssSentence(cssWordsArr,5)}`+'}'+'\n';
  }
  
  $('.example').html(str);
  return str;
}



generateCssCode(cssSelectorLib,cssWords,2);

var $input = $('#input');
var $output = $('.output');
$input.on(
  'keydown',function(e) {
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

function tapfunc(ele){
  ele.on('keydown',function(e) {
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

$input.on('input',function(){
  // var replaceStr = $input.val().toString().replace(/\s+/, ' ');
  // $input.val(replaceStr);
  // console.log(event);
  var val = $input.val().toString();
  var len = val.length;
  var compareStr = $('.example').text().substring(0, len).toString();
  
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
})

//生成给定范围内的随机数
function randomNum(len) {
  return Math.floor(Math.random()*(len));
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

//生成随机的HTML标签句
function generateHTMLElement(obj, number = 5) {
  if(obj == null){
    return;
  }
  var str = '';
  var selfTags = [];
  var normalTags = [];
  var attr = null;
  var curTagArr = [];
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
  for(var i = 0 ; i < number; i++){
    var tag = normalTags[randomNum(normalTags.length)];
    var selfTag = selfTags[randomNum(selfTags.length)];
    var tagAttr = setRandomAttr(attr, tag);
    var selfTagAttr = setRandomAttr(attr, selfTag);
    if(selfTag == 'meta'){
      selfTagAttr += 'content="some_text"';
    }
    if(selfTag == 'link'){
      selfTagAttr += 'href="some_link"';
    }

    str += '&lt;'+tag+' '+tagAttr+'&gt;'+' '+'&lt;/'+tag+'&gt;'+' '+'<br>';
    str += '&lt;'+ selfTag + ' ' + selfTagAttr +'&gt;'+ ' ' +'<br>';
  }
  // document.write(str);
  return str;
}

generateHTMLElement(HTMLWords,5);

//生成随机三位英文名字
function randomName() {
  var strArr = 'abcdefghijklmnopqrstuvwxyz$';
  var name = '';
  for(var i = 0; i < 3; i++){
    name += strArr[randomNum(strArr.length)];
  }
  return name;
}

//设置随机对应属性
function setRandomAttr(attrObj, tagName) {
  if(attrObj == null || tagName == ''){
    return;
  }

  var tagArr = [];
  var commonAttr = attrObj['common'][randomNum(attrObj['common'].length)];
  var attrStr = commonAttr + ' = ' +'name_' + randomName() + ' ';
  for(var key in attrObj){
    tagArr.push(key);
  }

  for(var i = 0; i < tagArr.length; i++){
    if(tagName == tagArr[i]){
      attrStr += attrObj[tagName][randomNum(attrObj[tagName].length)] +' = '+ 'someVal'+' ';
    }
  }
  return attrStr;
}

// var arr = ['a','b','c','d','e'];
// var usedIndex = [];
// for(var num,i = 0; i < 5; i++){

//   num = Math.floor(Math.random()*5);
//   // document.write(num + ': ')
//   if(usedIndex.indexOf(num) != -1){
    
//   }else{  
//     document.write(arr[num] + ', ');
//     arr[num] = null;
//     usedIndex.push(num);
//   }
// }



// console.log(arr);

// window.onload = function() {
//   //点击开始建 开始计数
//   var count = 0
//   var timer = null //timer变量记录定时器setInterval的返回值
//   $("start").onclick = function() {
//       timer = setInterval(function() {
//           count++;
//           // console.log(count)
//               // 需要改变页面上时分秒的值
//           // console.log($("id_S"))
//           $("id_S").innerHTML = showNum(count % 60)
//           $("id_M").innerHTML = showNum(parseInt(count / 60) % 60)
//           $("id_H").innerHTML = showNum(parseInt(count / 60 / 60))
//       }, 1000)
//   }
//   $("pause").onclick = function() {
//           //取消定时器
//           clearInterval(timer)
//       }
//       //停止记数  数据清零  页面展示数据清零
//   $("stop").onclick = function() {
//       //取消定时器
//       $("pause").onclick()
//           // clearInterval(timer)
//           //数据清零  总秒数清零
//       count = 0
//           //页面展示数据清零
//       $("id_S").innerHTML = "00"
//       $("id_M").innerHTML = "00"
//       $("id_H").innerHTML = "00"
//   }

//   //封装一个处理单位数字的函数
//   function showNum(num) {
//       if (num < 10) {
//           return '0' + num
//       }
//       return num
//   }
// }
var words = 'input output li ul ol div';
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

console.log(findword(16,words));