/*
    File:     CRUDLibrary.js
	Author:   Charles Kann
	Date:     July 8, 2017
	
	Purpose:  To define library functions needed
	          for the Map Example CRUD application
	
	Methods:   resetForm
	           writeDataToForm
			   readDataFromForm
			   setFormReadWrite
			   setFormReadOnly
			   
	Modification History:
	    7/8/2017 - Initial Release
		
 */	

/*
    Function:     resetForm
	Author:       Charles Kann
	Date;         7/8/2017
	Purpose:      Set form to default values
	Input:        None
	Output:       None
	Side Effects: Fields on form have default values
 */
function resetForm() {
  $("#title").val("");
  $("#resize").prop("checked", false);
  $("#recenter").prop("checked", true);
  $("#StamenMap").prop("checked", true);
  $("#600x480").prop("checked", true);	
  $("#latitude").val("-77");
  $("#longitude").val("39");	
}

/*
    Function:     writeDataToForm
	Author:       Charles Kann
	Date;         7/8/2017
	Purpose:      Set form to values form obj
	Input:        obj - an array containing data values.
	                    obj must have values for all fields.
	Output:       None
	Side Effects: Fields on form have values from obj
 */	  
function writeDataToForm(obj1) {
  $("#title").val(obj1.title);
  $("#resize").prop("checked", obj1.resize);
  $("#recenter").prop("checked", obj1.recenter);
  $("#"+obj1.mapType).prop("checked", true);
  $("#"+obj1.screenSize).prop("checked", true);	
  $("#latitude").val(obj1.latitude);
  $("#longitude").val(obj1.longitude);	
}

/*
    Function:     readDataFromForm
	Author:       Charles Kann
	Date;         7/8/2017
	Purpose:      create an object with data values for
	                   all fields on form
	Input:        None
	Output:       obj - an object with the data values
	Side Effects: None
 */	  
function readDataFromForm() {
   obj = new Object();
   obj.title = $("#title").val();
   obj.resize = $("#resize").is(":checked");
   obj.recenter = $("#recenter").is(":checked");
   obj.mapType = $("input[name='maptype']:checked").val();	
   obj.screenSize = $("input[name='screenSize']:checked").val();
   obj.latitude = $("#latitude").val();
   obj.longitude = $("#longitude").val();	

   return obj; 
}

/*
    Function:     setFormReadWrite
	Author:       Charles Kann
	Date;         7/8/2017
	Purpose:      Set all form fields to allow
	                   reading and writing.
	Input:        None
	Output:       None
	Side Effects: Fields on form are read/write
 */
function setFormReadWrite() {
  $("#title").attr('readonly', false);	
  $("#resize").attr('disabled', false);	
  $("#recenter").attr('disabled', false);
  $("#StamenMap").attr('disabled', false);	
  $("#XYZMap").attr('disabled', false);	
  $("#600x480").attr('disabled', false);
  $("#1024x768").attr('disabled', false);	
  $("#1280x800").attr('disabled', false); 
  $("#latitude").attr('readonly', false);  
  $("#longitude").attr('readonly', false);  
}

/*
    Function:     setFormReadOnly
	Author:       Charles Kann
	Date;         7/8/2017
	Purpose:      Set all form fields to read-only
	Input:        None
	Output:       None
	Side Effects: Fields on form are readonly
 */
function setFormReadOnly() {
  $("#title").attr('readonly', true);	
  $("#resize").attr('disabled', true);	
  $("#recenter").attr('disabled', true);
  $("#StamenMap").attr('disabled', true);	
  $("#XYZMap").attr('disabled', true);	
  $("#600x480").attr('disabled', true);
  $("#1024x768").attr('disabled', true);	
  $("#1280x800").attr('disabled', true); 
  $("#latitude").attr('readonly', true);  
  $("#longitude").attr('readonly', true);  
}