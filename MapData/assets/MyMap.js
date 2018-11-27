 
 /*
    File name:    MyMap.js
    Type:         Object definitoin
    Purpose:      To create and manipulate Map objects
    Author:       Charles Kann
    Date:         July 7, 2017

    Modification History:
        7/7/2017 - Initial Release	
 */
function MyMap(options) {
  // Set the Constructor Function Type
  this.__cfName = "MyMap";
  
  // All object must be created with a title...
  if (options.title == null || options.title == undefined)
   throw "Title must be specified";

  // Set default properties for a map
  // Note that title is set in case a user
  // creates this object using Object.create;
  this.id = null;
  this.title = "Please change the title" 
  this.recenter = true;
  this.resize = false;
  this.mapType = "Stamen";
  this.screenSize = "640x480";
  this.latitude = -77;
  this.longitude = 39; 
	 
  // Get properties from parameter  
  // Note that this acts like operator overloading.  If
  // a property is not set in the parameter, the default
  // will be used.  Also this allows for other data fields
  // that might have been added.
 outerloop:
 for (i in options) {
	for (j in this)	{
      if (i == j) {
	    this[i]= options[j];
	    continue outerloop;	
      }
    }
	if ((i == "createdAt") || (i == "updatedAt"))
		continue outerloop;  // do not store properties createdAt or updatedAt
    console.log("Property " + i + " is not a default Map property");
	this[i] = options[i];
  }

  // Return the current object.  This is not needed, but
  // but doesn't hurt and makes the intent clear.  
  return this;		 
}

  // Function:  update
  // Purpose:   to update all of the properties in the object.
  //            Note that this function allows unstructured 
  //            properties
  // Input:     objectbject with property values to update
  // Output:    none
  // Side Effects: object properties are updated.
MyMap.prototype.update = function(options) {
	  
     // Title property cannot change on update.  It can be
	 // thought of as the immutable key for the object.
     var t1 = options.title;
     var t2 = this.title;
     if (t1 != t2)
       throw "Title changed not allowed in update";
		 
    // Get properties from parameter  
    // Note that this acts like operator overloading.  If
    // a property is not set in the parameter, the default
    // will be used.  Also this allows for other data fields
    // that might have been added.
  outerloop_1:
  for (i in options) {
	for (j in this)	{
      if (i == j) {
	    this[j]= options[i];
	    continue outerloop_1;	
      }
    }
    console.log("Property " + i + " is not a default MyMap property");
    this[i] = options[i];
  }
}	
  
// Function:  toString
// Purpose:   to create a string representation of the object
// Input:     none
// Output:    string representation of the object
// Side Effects: none  
MyMap.prototype.toString = function() {
  return (JSON.stringify(this));
}			 
	
