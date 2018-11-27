function showMapOptions() {
    if ($('#mapOptionsBox')[0].checked) {
        $('#mapOptions').show(500);
    }
    else {
        $('#mapOptions').hide(500);
    }
}

function showMaps() {
    var list = $('#maplist')[0];
    for (var i = 0; i < mapData.length; i++){
        $('<input type="checkbox" name="map" id = "map'+ i +'" value = '+ i +'> ' + mapData[i][0].title + '</input> </br>').appendTo(list);
    }
    var map = document.getElementsByName('map');
    for (var i = 0; i< map.length; i++){
        map[i].onchange = function () {
            var index = this.value;
            if (this.checked){
                mapsChosen[index] = mapData[index];
            }
            else{
                mapsChosen[index] = null;
            }
        }
    }
}

function saveMapOptions() {
    if ($("#mapOptionsButton")[0].value == "Save") {
        $("#mapOptionsText")[0].innerHTML = "Click Edit to change the background map.  Note that changing the background map invalidates all images on the map.";
        $("#mapOptionsSet")[0].src="checkbox_checked.png";
        $("#mapOptionsButton")[0].value="Edit";
        // $("#mapImagesText")[0].innerHTML = "Click the Add button to add an image";
        //TODO
        // $("#mapAddImagesButton")[0].disabled = false;

        center = mapOb.getView().getCenter();
        var zoomLevel=mapOb.getView().getZoom();
        // Sets the resolution to the 1/2 the max size of width and height in pixels at zoom level.
        var resolution = mapOb.getView().getResolution() * 450;
        boxExtent = new Array(4);
        boxExtent[0] = center[0] - resolution;
        boxExtent[1] = center[1] - resolution;
        boxExtent[2] = center[0] + resolution;
        boxExtent[3] = center[1] + resolution;
        var view=new ol.View({
            center: center,
            zoom: zoomLevel,
            extent: boxExtent,
            maxZoom: zoomLevel+6,
            minZoom: zoomLevel
        });
        mapOb.setView(view);
        mapOb.getView().on("change:resolution", function() {
            if (currentImageObject != null)
                currentImageObject.displayImage();
        });

        backgroundMap.change(true, view);
        readArticle();
    }
    else {
        if (confirm("all pictureLayers will be removed")){
            $('.overlayImageDiv').remove();
            mapOb.removeLayer(imagesLayer[currentPreviewImage]);
            $("#mapOptionsText")[0].innerHTML = "Set the background map you wish to use, and press the save button.";
            $("#mapOptionsSet")[0].src="checkbox_unchecked.png";
            $("#mapOptionsButton")[0].value="Save";
            $("#mapImagesText")[0].innerHTML = "You cannot add images until the map is set ";
            // $("#mapAddImagesButton")[0].disabled = true;

            center=mapOb.getView().getCenter();
            var zoomLevel=mapOb.getView().getZoom();
            var view=new ol.View({
                center: center,
                zoom: zoomLevel,
            });
            mapOb.setView(view);
            backgroundMap.change(false, view);
        }
    }
}

function showImagesOptions() {
    if ($('#mapImagesBox')[0].checked) {
        $('#mapImages_Images').show(500);
    }
    else {
        $('#mapImages_Images').hide(500);
    }
}

function saveToFile(){
    var fileData = [];
    var hasMapChosen = false;
    var hasImageChosen = false;
    fileData[0] = [];
    for (var i = 0; i < mapsChosen.length; i++){
        if (mapsChosen[i] != null){
            mapsChosen[i][0].extent = boxExtent;
            mapsChosen[i][0].center = center;
            fileData[0].push(mapsChosen[i]);
            hasMapChosen = true;
        }
    }
    fileData[1] = [];
    for (var i = 0; i < imagesToSave.length; i++){
        if (imagesToSave[i] != null){
            fileData[1].push(imagesToSave[i]);
            hasImageChosen = true;
        }
    }
    if (hasMapChosen) {
        if (hasImageChosen) {
            // writeArticle({title: "other", map: JSON.stringify(fileData[0]), picture: JSON.stringify(fileData[1])});
            writeFile([JSON.stringify(fileData[0]), JSON.stringify(fileData[1])]);
            alert("Your picture is successfully saved.");
        }
        else{
            alert("You have to at least chose a image.");
        }
    }
    else{
        alert("You have to at least chose a Base Map.");
    }
}

// function writeArticle(file){
//     var xmlhttp = new XMLHttpRequest();
//     var url = "/articles.json"
//     xmlhttp.open("POST", url, true);
//     xmlhttp.setRequestHeader("Content-Type", "application/json");
//     xmlhttp.onreadystatechange = function ()
//     {
//         if(xmlhttp.readyState === 4)
//         {
//             if(xmlhttp.status === 201)
//             {
//                 var allText = xmlhttp.responseText;
//             }
//             else
//             {
//                 var allText = xmlhttp.responseText;
//             }
//         }
//     }
//     xmlhttp.send(JSON.stringify(file));
// }

function writeFile(file) {
    var blob = new Blob(["[" + file + "]"], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "maps.json");
}


function readArticle() {
    var xmlhttp = new XMLHttpRequest();
    var url = "/images.json"
    xmlhttp.open("GET", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function ()
    {
        if(xmlhttp.readyState === 4)
        {
            if(xmlhttp.status === 200)
            {
                var allText = xmlhttp.responseText;
                var array = JSON.parse(allText);
                var mapExtent = ol.proj.transformExtent(boxExtent, 'EPSG:3857', 'EPSG:4326');
                imagesOnMap = new Array();
                for (var i = 0; i < array.length; i++){
                    var imageExtent = JSON.parse(array[i].extent);
                    if (ol.extent.containsExtent(mapExtent, imageExtent)) {
                        var currentImage = {};
                        currentImage.title = array[i].title;
                        currentImage.extent = imageExtent;
                        currentImage.url = array[i].url;
                        currentImage.description = array[i].description;
                        imagesOnMap.push(currentImage);
                        imagesLayer.push(previewImagesLayer(currentImage.url, currentImage.extent));
                    }
                }
                displayPictureList();
            }
            else
            {
                var allText = xmlhttp.responseText;
            }
        }
    }
    xmlhttp.send();
}

function previewImagesLayer(url, extent) {
    var myUrl = url;
    var myExtent = extent;
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


function displayPictureList() {
    for (var i = 0; i < imagesOnMap.length; i++) {
        var parentMapDiv = $("#mapImages_Images")[0];
        var newDiv = document.createElement('div');
        newDiv.className = 'overlayImageDiv';
        parentMapDiv.appendChild(newDiv);

        var newImageDiv = document.createElement('div');
        newImageDiv.className = "overlayImageDiv_Image";
        newImageDiv.innerHTML = '<img src=' + imagesOnMap[i].url + ' height="60px" id="filePreview' + imagesOnMap[i].title + '" />';
        newDiv.appendChild(newImageDiv);

        var newInfoDiv = document.createElement('div');
        newInfoDiv.className = "overlayImageDiv_Info";
        newInfoDiv.innerHTML = "<p id='imageTitle" + imagesOnMap[i].title + "'> </p>";
        newInfoDiv.innerHTML += '<p><input type="button" value="Preview" onclick = displayImages(' +i +') /> </p>';
        newInfoDiv.innerHTML += '<p><input type="button" value="Select"  id = "selectButton'+ i +'" onclick = selectImages('+ i +') /> </p>';
        newDiv.appendChild(newInfoDiv);
    }
}

function selectImages(index) {
    var id = "#selectButton" + index;
    var button = $(id)[0];
    if (button.value === "Select"){
        button.value = "Remove";
        imagesToSave[index] = imagesOnMap[index];
    }
    else{
        button.value = "Select";
        imagesToSave[index] = null;
    }
}

var currentPreviewImage = -1;

function displayImages(index) {
    if (currentPreviewImage === -1) {
        currentPreviewImage = index;
    }
    else{
        mapOb.removeLayer(imagesLayer[currentPreviewImage]);
        currentPreviewImage = index;
    }
    mapOb.addLayer(imagesLayer[index]);
    var extent = imagesOnMap[index].extent;
    var center = [(extent[0] + extent[2])/2, (extent[1] + extent[3])/2];
    mapOb.getView().setCenter(ol.proj.transform(center, 'EPSG:4326','EPSG:3857'));
}

