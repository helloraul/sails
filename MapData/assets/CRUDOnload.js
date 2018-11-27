/*
    File Name:   CRUDOnload.js
    Author:      Charles Kann
    Date:        July 9, 2019
    Purpose:     To initialize the application, and set update
                 the event function call backs.
	
	Events in this file:
        create - create a new Map record
        read   - read a Map record (display only)
        update - update a Map record
        delete - delete a  Map record
        save to file - save the record array to local storage
        read from file - read the record array from local storage
        cancel - cancel editing a Map record
        save(1)  - save a map record on create
        save(2) - save a map record on update
		
    Modification History:
	    7/9/2017 - Initial release
*/
$(function() {
  // Set form to default values
    resetForm();
    $("#userMessage").hide();		
    $("#userMessage").val("");
	
	/*
	    When initialing the form, read the data
	*/
	
	function readDataFromServer() {
	  // clear out the list and array
	  $("#dataRecords").empty();
      records = new Array();
	  
      // get the records array from remote server
	    var xmlhttp = new XMLHttpRequest();
        var url = "mapData"
        xmlhttp.open("GET", url, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.onreadystatechange = function ()
		{
			if(xmlhttp.readyState === 4)
			{
				if(xmlhttp.status === 200)
				{
					 let arr = JSON.parse(xmlhttp.responseText);
	  
					// Each record was set to JSON independently.  Get
					// each record, parse it, and put it in the records
					// array and list.
					for (var i = 0; i < arr.length; i++) {
						records[i] = new MyMap(arr[i]);
						$('#dataRecords').append($("<option></option>")
							.attr("value", records[i].id)
							.text(records[i].title));
					}			
				}
				else
				{
					var allText = xmlhttp.responseText;
					$("#UserMessage").val("status =  " + xmlhttp.status + " text = "  + allText)
				}
			}
		}
        xmlhttp.send()    
    }		

	readDataFromServer();
	
    /*
        Function:  Create a new record
        Purpose:   To respond to the create
                   button 
    */  
    $("#create").click( () => {
		
      // Initialize form
      $("#userMessage").hide();		
      $("#userMessage").val("");			 
      resetForm();
      setFormReadWrite();
	
      // Set buttons	
      $("#saveNew").show();
      $("#saveUpdate").hide();
      $("#cancelEdit").show();
      $("#inputForm").show();
    });
  
    /*
        Function:  Read a Map record
        Purpose:   To respond to the read
                   button 
   */ 
    $("#read").click( () => {
      $("#userMessage").hide();		
      $("#userMessage").val("");		
      // get record to read from list
      var myID = $("#dataRecords").val();

      //Find the record to read
      var recordToUpdate = records.find( (currentObject) => {
        return (currentObject.id == myID)			  
      });

      // Record is not found, throw exception	  
      if (recordToUpdate == undefined) {
        $("#userMessage").show();		
        $("#userMessage").val("Record does not exist - Make sure  a record is selected" ); 		  
          throw "The title does not exists";
      }

      // Initialize form	  
      $("#userMessage").hide();		
      $("#userMessage").val("");			
      writeDataToForm(recordToUpdate);		  
      setFormReadOnly();
	  
      // Set buttons 
      $("#saveNew").hide();
      $("#saveUpdate").hide();		  
      $("#cancelEdit").show();
      $("#inputForm").show();		  
    });
  
    /*
        Function:  Update a Map record
        Purpose:   To respond to the update
        button 
   */ 
    $("#update").click( () => {
      $("#userMessage").hide();		
      $("#userMessage").val("");
	  
      // get record to read from list		
      var myID = $("#dataRecords").val();

      //Find the record to read	  
      var recordToUpdate = records.find( (currentObject) => {
        return (currentObject.id == myID)			  
      });
	  
      // Record is not found, throw exception		  
      if (recordToUpdate == undefined) {
        $("#userMessage").show();		
        $("#userMessage").val("Record does not exist - Make sure  a record is selected" ); 			      
          throw "The title does not exist";
      }

      // Initialize form		  
      $("#userMessage").hide();		
      $("#userMessage").val("");		  
      writeDataToForm(recordToUpdate);
      setFormReadWrite();		  
      $("#title").attr('readonly', true);
	  
      // Set buttons 		  
      $("#saveNew").hide();
      $("#saveUpdate").show();		  
      $("#cancelEdit").show();
      $("#inputForm").show();		  
    });
  
  /*
      Function:  Delete a Map record
	  Purpose:   To respond to the delete
	             button 
   */ 
    $("#delete").click( () => {
      $("#userMessage").hide();		
      $("#userMessage").val("");
	  
      // get record to read from list			
      let myID = $("#dataRecords").val();
	  let myName= $("#dataRecords option:selected").html();
	  
      // Record is not found, throw exception		  
      if (myID == null)
      {
        $("#userMessage").show();		
        $("#userMessage").val("Record does not exist - Make sure  a record is selected" ); 
          throw "The title does not exist";
      }

      // Confirm Delete	  
      let retVal = confirm("Do you want to delete " + myName + " ?");
      if( retVal == true ){
        var xmlhttp = new XMLHttpRequest();
        var url = "/mapData/" + myID;
        xmlhttp.open("delete", url, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.onreadystatechange = function ()
		{
			if(xmlhttp.readyState === 4)
			{
				if(xmlhttp.status === 200)
				{
					var allText = xmlhttp.responseText;
					console.log("status =  " + xmlhttp.status + " text = "  + allText);
					readDataFromServer();
				}
				else
				{
					var allText = xmlhttp.responseText;
					console.log("status =  " + xmlhttp.status + " text = "  + allText);
					readDataFromServer();
				}
			}
		}
        // send request
		xmlhttp.send()		
      }
         		  
	});
			
    /*
        Function:  Save record data from create
        Purpose:   To respond to the Save Button
   */				
    $("#saveNew").click( ()=> {
		
        var saveObj = readDataFromForm();	
        var xmlhttp = new XMLHttpRequest();
        var url = "/mapData"
        xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.onreadystatechange = function ()
		{
			if(xmlhttp.readyState === 4)
			{
				if((xmlhttp.status === 200) || (xmlhttp.status === 201))
				{
					var allText = xmlhttp.responseText;
					console.log("succeeded - status =  " + xmlhttp.status + " text = "  + allText)
					// hide the input form					   
					$("#inputForm").hide();
					readDataFromServer();	
				}
				else
				{
					var allText = xmlhttp.responseText;
					console.log("failed - status =  " + xmlhttp.status + " text = "  + allText)
					readDataFromServer();
				}
			}
		}

        xmlhttp.send(JSON.stringify(saveObj));	
    });
	
    /*
        Function:  Save record data from update
        Purpose:   To respond to the Save Button
   */			
    $("#saveUpdate").click( () => {
		
      // get record to read from list			
        let myID = $("#dataRecords").val();
	    let myName= $("#dataRecords option:selected").html();

        var saveObj = readDataFromForm();	
        var xmlhttp = new XMLHttpRequest();
        var url = "/mapData/" + myID;
		console.log(url);
        xmlhttp.open("put", url, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		xmlhttp.onreadystatechange = function ()
		{
			if(xmlhttp.readyState === 4)
			{
				if((xmlhttp.status === 200) || (xmlhttp.status === 201))
				{
					var allText = xmlhttp.responseText;
					console.log("succeeded - status =  " + xmlhttp.status + " text = "  + allText)
					// hide the input form					   
					$("#inputForm").hide();
					readDataFromServer();	
				}
				else
				{
					var allText = xmlhttp.responseText;
					console.log("failed - status =  " + xmlhttp.status + " text = "  + allText)
					readDataFromServer();
				}
			}
		}

        xmlhttp.send(JSON.stringify(saveObj));	
    });	 
	
    /*
        Function:  Cancel Edit
        Purpose:   To respond Cancel Button
   */			
    $("#cancelEdit").click( () => {
      $("#inputForm").hide();
    });
});