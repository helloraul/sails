
$(document).ready(function() {
  // readFileFromDB();
  readMapFile("maps.json");
  preLoad();
})

var myMap;

function preLoad(){
  document.getElementById("inverse").onchange = reloadAllPic;
  document.getElementById("swipe").onchange = swiper;
    document.getElementById("swipeOF").onchange = swiperOff;
    $("#collapseOne").on("change","input",function() {
        changeMapRadio()
    });
    $("#collapseTwo").on("change", "input", function () {
        togglePicture();
    })
    $('#newOpacity1')[0].onchange = changeOpacity1;
    $("#collapseThree").on("change", "input", function () {
        togglePicture2();
    })
    $('#newOpacity2')[0].onchange = changeOpacity2;
}

function reloadAllPic(){
  myMap.reloadAllPic();
}

function changeMapRadio() {
  var mapRadio = document.getElementsByName("base");
  for (var i = 0; i < mapRadio.length; i++){
    if (mapRadio[i].checked){
      myMap.changeMap(mapRadio[i].value);
    }
  }
}

function swiper(){
  var swipe = document.getElementById('swipe');
  myMap.picSwiper(swipe);
}

function swiperOff() {
    if (!$('#swipeOF')[0].checked){
        reloadAllPic();
    }
}

function changeOpacity1() {
  myMap.changeOpacity(0, $('#newOpacity1')[0].value/100);
}

function changeOpacity2() {
  myMap.changeOpacity(1,$('#newOpacity2')[0].value/100);
}

function togglePicture() {
  var pictures = document.getElementsByName('picGroup1')
  for (var i=0;i<pictures.length;i++) {
    if (pictures[i].checked) {
      myMap.changePicture(0, i);
      document.getElementById('newOpacity1').value=100;
      document.getElementById("picture2Form" + i).checked = false;
      document.getElementById("picture2Form" + i).disabled = true;
    }
    else{
        document.getElementById("picture2Form" + i).disabled = false;
    }
  }
}

function togglePicture2() {
  var pictures2 = document.getElementsByName('picGroup2');
  for (var i=0;i<pictures2.length;i++) {
      if (pictures2[i].checked) {
          myMap.changePicture(1, i);
          document.getElementById('newOpacity2').value=100;
          document.getElementById("pictureForm" + i).checked = false;
          document.getElementById("pictureForm" + i).disabled = true;
      }
      else{
          document.getElementById("pictureForm" + i).disabled = false;
      }
  }
}

function viewerMap(tiles, mapArray, pictureTilesArray, pictureArray){
  var selectPicture = new Array(2);
  var currMap = 0;
  var currPic = new Array(2);
  currPic[0] = -1;
  currPic[1] = -1;
  var currSwipe = -1;
  selectPicture[0]  = null;
  selectPicture[1] = null;
  container = 'map';

  var baseMap = new ol.Map({
    target: 'map',
    layers: tiles[0],
    view: new ol.View({
      // center: ol.proj.transform([-77.23, 39.83], 'EPSG:4326', 'EPSG:3857'),
      // center: ol.proj.transform(mapArray[0][0].center, 'EPSG:4326', 'EPSG:3857'),
        center: mapArray[0][0].center,
      zoom: 13,
      // extent:  ol.proj.transformExtent([-77.14, 39.75, -77.26, 39.90],  'EPSG:4326', 'EPSG:3857'),
      // extent: mapArray[0][0].extent,
      maxZoom: 18.0,
      minZoom: 12.0
    })
  });

  document.getElementById("mapInfo").innerHTML = mapArray[currMap][0].title;

  this.changeMap = function (layer) {
      console.log(layer)
    var layers=baseMap.getLayers().getArray();
    var length=layers.length;
    currMap = layer;
    document.getElementById("mapInfo").innerHTML = mapArray[currMap][0].title;
    for (var i = 0; i < length; i++) {
      baseMap.removeLayer(layers[0]);
    }
    for (var a = 0; a < tiles[layer].length; a++){
      baseMap.addLayer(tiles[layer][a]);
    }
    for (var i = 0; i < selectPicture.length; i++) {
      if (selectPicture[i] !== null) {
        baseMap.addLayer(selectPicture[i]);
      }
    }
  }

  this.reloadAllPic = function(){
    pictureTilesArray = parseToArrayPic(pictureArray);
    for (var i = 0; i < selectPicture.length; i++){
      baseMap.removeLayer(selectPicture[i]);
    }
    for (var k = 0; k < selectPicture.length; k++) {
      if (currPic[k] >= 0){
        baseMap.addLayer(pictureTilesArray[currPic[k]]);
        selectPicture[k] = pictureTilesArray[currPic[k]];
      }
    }
  }

  this.picSwiper = function (swipe) {
    var inverse = document.getElementById("inverse");
    if (selectPicture[0] !== null || selectPicture[1] !== null){
      if (selectPicture[1] !== null){
        if (currSwipe === 0){
          pictureTilesArray = parseToArrayPic(pictureArray);
          for (var i = 0; i < selectPicture.length; i++){
            baseMap.removeLayer(selectPicture[i]);
          }
          for (var k = 0; k < selectPicture.length; k++) {
            if (k === 0){
              baseMap.addLayer(pictureTilesArray[currPic[0]]);
            }
            else if (selectPicture[k] != null) {
              baseMap.addLayer(selectPicture[k]);
            }
          }
        }
        currSwipe = 1;
        pictureSwipeLayer = selectPicture[1];
      }
      else{
        if (currSwipe === 1){
          pictureTilesArray = parseToArrayPic(pictureArray);
          for (var i = 0; i < selectPicture.length; i++){
            baseMap.removeLayer(selectPicture[i]);
          }
          for (var k = 0; k < selectPicture.length; k++) {
            if (k === 1){
              baseMap.addLayer(pictureTilesArray[currPic[1]]);
            }
            else if (selectPicture[k] != null) {
              baseMap.addLayer(selectPicture[k]);
            }
          }
        }
        currSwipe = 0;
        pictureSwipeLayer = selectPicture[0];
      }
      if (inverse.checked){
        pictureSwipeLayer.addEventListener('precompose', function(event) {
          var ctx = event.context;
          var width = ctx.canvas.width * (swipe.value / 100);
          ctx.save();
          ctx.beginPath();
          ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
          ctx.clip();
        });
      }
      else{
        pictureSwipeLayer.addEventListener('precompose', function(event) {
          var ctx = event.context;
          var width = ctx.canvas.width * (swipe.value / 100);
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, width, ctx.canvas.height);
          ctx.clip();
        });
      }

      pictureSwipeLayer.on('postcompose', function(event) {
        var ctx = event.context;
        ctx.restore();
      });

      swipe.addEventListener('input', function() {
        baseMap.render();
      }, false);
    }
  }


  this.getbaseMap = function() {
    return myMap;
  }

  this.changeOpacity = function(section, opacity) {
    if (selectPicture[section] != null){
      selectPicture[section].setOpacity(opacity);
    }
  }

  this.changePicture = function(section, picNum) {
    for (var j = 0; j < selectPicture.length; j++) {
      if (selectPicture[j] != null) {
        baseMap.removeLayer(selectPicture[j]);
      }
    }
    selectPicture[section] = pictureTilesArray[picNum];
    for (var k = 0; k < selectPicture.length; k++) {
      if (selectPicture[k] != null) {
        baseMap.addLayer(selectPicture[k]);
      }
    }
    selectPicture[section].setOpacity(100);
    if (section === 0){
      currPic[0] = picNum;
      document.getElementById("picInfo1").innerHTML = pictureArray[picNum].title;
    }
    else{
      currPic[1] = picNum;
      document.getElementById("picInfo2").innerHTML = pictureArray[picNum].title;
    }
  }
  return this;
}

function StamenMap (options) {
  var label = options["label"]
  var tl = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: label
    })
  })
  return tl;
}

function XYZMap(options) {
  var myUrl=options["url"]
  var tl=new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: myUrl,
      opacity: true
    })
  })
  return tl;
}

function PictureMap(options) {
  var myUrl = options["url"];
  var myExtent = options["extent"];
  var trueTrueExtent = ol.proj.transformExtent(myExtent, 'EPSG:4326','EPSG:3857');
  var t1 = new ol.layer.Image({
    source: new ol.source.ImageStatic({
      url: myUrl,
      opacity: true,
      imageExtent: trueTrueExtent
    })
  })
  return t1;
}

/*
This function reads the object parsed from JSON.  Since JSON does not
maintain the obj.constructor property, I create an instance of the
specific object type (stored in instanceType) and copy the fields
into this new object.  This "effectively" casts the object to the correct
type.
*/
function parseToArrayPic(inputArray) {
  var pictures = new Array();
  var length = inputArray.length;
  for (var i = 0; i<length; i++) {
    pictures[i] = PictureMap(inputArray[i]);
  }
  return pictures;
}

function parseToArrayMap(inputArray) {
  var maps = new Array();
  var len1 = inputArray.length;
  for (var i = 0; i < len1; i++){
    maps[i] = new Array();
    var len2 = inputArray[i].length;
    for (var j = 0; j < len2; j++){
      objType=inputArray[i][j].instanceType;
      maps[i][j] = window[objType](inputArray[i][j]);
    }
  }
  return maps;
}

// function readFileFromDB() {
//     var xmlhttp = new XMLHttpRequest();
//     var url = "/articles.json"
//     xmlhttp.open("GET", url, true);
//     xmlhttp.setRequestHeader("Content-Type", "application/json");
//     xmlhttp.onreadystatechange = function (){
//         if(xmlhttp.readyState === 4){
//             if(xmlhttp.status === 200){
//                 var allText = xmlhttp.responseText;
//                 var parsedAllText = JSON.parse(allText);
//                 selectArticles(parsedAllText);
//             }
//             else{
//                 var allText = xmlhttp.responseText;
//                 console.log("status =  " + xmlhttp.status + " text = "  + allText)
//             }
//         }
//     }
//     xmlhttp.send();
// }

function readMapFile(file){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file, true);
    xmlhttp.onreadystatechange = function (){
        if(xmlhttp.readyState === 4){
            if(xmlhttp.status === 200 || xmlhttp.status == 0){
                var allText = xmlhttp.responseText;
                var parsedAllText = JSON.parse(allText);
                var tiles = parseToArrayMap(parsedAllText[0]);
                var pictureTilesArray = parseToArrayPic(parsedAllText[1]);
                preLoadRadio(parsedAllText[1], parsedAllText[0]);
                myMap = viewerMap(tiles, parsedAllText[0], pictureTilesArray, parsedAllText[1]);
            }
        }
    }
    xmlhttp.send();
}

//
// function selectArticles(array) {
//     var container = $('#dialog')[0];
//     for (var i = 0; i < array.length; i ++){
//         var radio = document.createElement("div");
//         radio.setAttribute("id", "pictureSelect1");
//         radio.innerHTML = '<input type="radio" name="radio" value = '+ array[i].id +' id = ' + i + '> '+ array[i].id + " : " + array[i].title +' </br>';
//         container.appendChild(radio);
//     }
//     var button = document.createElement("button");
//     button.setAttribute("id", "confirm");
//     button.innerHTML = "Confirm";
//     container.appendChild(button);
//     $( function() {
//         $( "#dialog" ).dialog();
//     } );
//     var selectValue;
//     $("#confirm").on("click", function(){
//         var radio = document.getElementsByName("radio");
//         for (var i = 0; i < radio.length; i++){
//             if (radio[i].checked){
//                 selectValue = i;
//             }
//         }
//         $( "#dialog" ).dialog( "close" );
//         var current = array[parseInt(selectValue)];
//         var tiles = parseToArrayMap(JSON.parse(current["map"]));
//         var pictureTilesArray = parseToArrayPic(JSON.parse(current["picture"]));
//         preLoadRadio(JSON.parse(current["picture"]), JSON.parse(current["map"]));
//         myMap = viewerMap(tiles, JSON.parse(current["map"]), pictureTilesArray, JSON.parse(current["picture"]));
//     });
//     return selectValue;
// }

function preLoadRadio(pictures, maps) {
    var radioContainerMap = $('#collapseOne')[0];
    var buttonForm = document.createElement("FORM");
    buttonForm.setAttribute("id", "form")
    for (var i = 0; i < maps.length; i++) {
        var index = "mapForm" + i;
        if (i === 0){
            var mapRadio = '<input type="radio" name = "base"  value = '+ i +' id = '+ index +' checked> '+ maps[i][0].title +' </br>';
            mapRadio.name = "base";
            buttonForm.innerHTML += mapRadio ;
        }
        else {
            var mapRadio = '<input type="radio"  name = "base"  value = '+ i +' id = '+ index +'> '+ maps[i][0].title +' </br>';
            buttonForm.innerHTML += mapRadio ;
        }
    }
    radioContainerMap.appendChild(buttonForm);
    for (var i = 0; i < pictures.length; i++) {
        var picture = "pictureForm" + i;
        var radio = document.createElement("div");
        radio.setAttribute("id", "pictureSelect1");
        radio.innerHTML = '<input type="radio" name="picGroup1" value = '+ i +' id = ' + picture + '> '+ pictures[i].title +' </br>';
        var container = $('#collapseTwo')[0];
        container.appendChild(radio);
    }

    for (var i = 0; i < pictures.length; i++) {
        var picture = "picture2Form" + i;
        var radio = document.createElement("div");
        radio.setAttribute("id", "pictureSelect2");
        radio.innerHTML = '<input type="radio" name="picGroup2"  value = '+ i +' id = ' + picture + '> '+ pictures[i].title +' </br>';
        var container = $('#collapseThree')[0];
        container.appendChild(radio);
    }
}