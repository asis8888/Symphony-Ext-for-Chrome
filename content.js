// content.js

const appId = '57319aa2f5c831a953b35e00';																			            // ID for api call
const apiKey = 'bfc85f60-265e-11e6-8d82-0bf084151177';																   // keys for api call


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
      console.log("req:",request);


    if (request.message === "Check Cand") {
        var linkSent = request.type;
        var reqPart = linkSent.split("/");
        //console.log("length:",reqPart);
        var namePart = reqPart[reqPart.length - 2];
        //console.log("Name:",namePart);
        var companyRequestUrl1 = 'https://api.knack.com/v1/objects/object_1/records';
        var companyRequestFilters1 = [
          {
          'field':'field_78',
          'operator':'contains',
          'value':namePart
          }
        ];
        var fullcompanyRequestUrl1 = companyRequestUrl1 + '?filters=' + encodeURIComponent(JSON.stringify(companyRequestFilters1));
        $.ajax({
          url: fullcompanyRequestUrl1,
          type: 'GET',
          async:false,
          headers: {'X-Knack-Application-Id': appId, 'X-Knack-REST-API-Key': apiKey},
          error: function (xhr, ajaxOptions, thrownError) {
                console.log("error message2",thrownError);
            },
            success: function () {
              console.log("ajax call success cand check");
            }    
          }).done(function(data1) {
              console.log('done:',data1.records);
            if (data1.records.length > 0) {
              var candId = data1.records[0].id;
              var lastNote = data1.records[0].field_57;
              var emailId = data1.records[0].field_42;
              var phoneNo = data1.records[0].field_79;
              var candName = data1.records[0].field_1;
              var lastUpd = data1.records[0].field_83;
              var updByRec = data1.records[0].field_153_raw[0].identifier;
              console.log(data1);
              };
            sendResponse({id:candId,note:lastNote,email:emailId,phone:phoneNo,name:candName,updated:lastUpd,updBy:updByRec});  
            });
    };   
      //console.log("MISID is:", request.misid);
    chrome.storage.local.get(function(val1){
      	console.log("misid is:",val1.misid1);
      	console.log("rec id is:",val1.recrID);
  	  	var recIDFound = val1.recrID;
  	  	var posIDFound = val1.misid1;
  	  	var techFound = val1.tech;
  	  	var techID = val1.techid1;
        if (request.message === "Rec and Tech") {
  	  	    if (techFound === undefined || techFound === '') {
  	  		     var tech1 = posApiGetCall(posIDFound);
  	  		     console.log("tech is:",tech1);
  	  	      }; 
  	  	    if (recIDFound === undefined || recIDFound === "") { 
	  		       var reccall = recApiGetCall();	  	
		        } else {
			       console.log("Recruiter ID already stored:",recIDFound);
		        };	
        sendResponse({message:"completed"});
        };      
    if (request.message === "Addition") {
		  candApiGetCall(techID,posIDFound,recIDFound);
      sendResponse({message:"completed"});
    };
	});
});      

function candSymCheck(url) {
    console.log("reached cand check",url);
    var companyRequestUrl1 = 'https://api.knack.com/v1/objects/object_1/records';
    var companyRequestFilters1 = [
        {
          'field':'field_78',
          'operator':'contains',
          'value':url
        }
      ];
      var fullcompanyRequestUrl1 = companyRequestUrl1 + '?filters=' + encodeURIComponent(JSON.stringify(companyRequestFilters1));
      $.ajax({
          url: fullcompanyRequestUrl1,
            type: 'GET',
            headers: {'X-Knack-Application-Id': appId, 'X-Knack-REST-API-Key': apiKey},
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("error message2",thrownError);
            },
            success: function () {
              //console.log("ajax call success");
            }    
          }).done(function(data1) {
              console.log('done:',data1.records);
            if (data1.records.length > 0) {
              var data1 = data1.records[0];
              console.log(data1);
              //alert("Already in symphony");
              // put call goes here
              }
            });
};

function recApiGetCall() {
  var recname1 = document.querySelector('div#nav-settings__dropdown img');
  var recname = recname1.getAttribute('alt');		
  console.log('rec name:',recname);																			// get recruiter name
	var companyRequestUrl1 = 'https://api.knack.com/v1/objects/object_3/records';
	var companyRequestFilters1 = [
	    {
	      	'field':'field_147',
	      	'operator':'is',
	      	'value': recname
	    }
	  	];
	  	var fullcompanyRequestUrl1 = companyRequestUrl1 + '?filters=' + encodeURIComponent(JSON.stringify(companyRequestFilters1));

		$.ajax({
		url: fullcompanyRequestUrl1,
		type: 'GET',
    async:false,
		headers: {'X-Knack-Application-Id': appId, 'X-Knack-REST-API-Key': apiKey}   
		}).done(function(data) {
		if (data.records.length > 0) {
		    console.log(data.records[0]);
		    console.log(data.records[0].id);
		    var recID = data.records[0].id;
		    var recrID = 'recid';
        var recname = 'recname';
        var recname1 = data.records[0].field_12;
		    chrome.storage.local.set({recrID:recID,recname:recname1},function(){
		      	console.log("rec added in storage");
		    });
		} else {
		    alert("Recruiter not found in Symphony");
		    };
		});
	return("success");		
};

function posApiGetCall(misid1) {
	var techname = '';
	var companyRequestUrl2 = 'https://api.knack.com/v1/objects/object_9/records';
	var companyRequestFilters2 = [
	    {
	      	'field':'field_102',
	      	'operator':'is',
	      	'value': misid1
	    }
	  	];
	  	var fullcompanyRequestUrl2 = companyRequestUrl2 + '?filters=' + encodeURIComponent(JSON.stringify(companyRequestFilters2));

		$.ajax({
		url: fullcompanyRequestUrl2,
		type: 'GET',
    async:false,
		headers: {'X-Knack-Application-Id': appId, 'X-Knack-REST-API-Key': apiKey}   
		}).done(function(data) {
		if (data.records.length > 0) {
		    console.log(data.records[0]);
		    var tech = 'tech';
		    var techid1 = 'techid';
		    techname = data.records[0].field_103_raw[0].identifier;
		    techid = data.records[0].field_103_raw[0].id;
		    console.log(techname);
		    chrome.storage.local.set({tech:techname,techid1:techid},function(){
		    	console.log("tech added in storage");
		    });
		    var getcand = candApiGetCall(techname,misid1);
			} else {
		    	console.log("Position "+ misid1 +"not found in Symphony");
		    	chrome.storage.local.set({misid1:'',tech:''},function(){
		    		console.log('Values Reset');
		    	});
		   	};
		return(techname);
		});
			
};

function candApiGetCall(techid,misid1,recIDFound) {
  	
    try {
    var link_url_selec = document.querySelector('div.pv-contact-info__ci-container');
  	if (link_url_selec === null) {
  		alert("Click on Show More in Contact secion first.");
  	} else {
  		link_url = link_url_selec.innerText; 																				//candidate linkedin url	
  		console.log('linkedIn:'+link_url);	

  		var name1 = document.querySelector('div.pv-top-card-section__body h1').innerHTML; 									// candidate name
												

  		/*var curr_comproot = document.querySelectorAll('span .pv-entity__secondary-title');
      
      console.log("comp root:"+curr_comproot[0]);
      var curr_comp = '';
      if (curr_comproot !== null) {
  		    var curr_comp = curr_comproot[0].innerText;																			// current company
        }; */

      var curr_comproot = document.querySelector('.pv-top-card-section__company');
      var curr_comp = curr_comproot.innerText;
      //console.log('company:',curr_comp);    
  		var curr_desig = document.querySelector('span.background-details div.pv-entity__summary-info h3').innerText;                                                        // current designation
  		//console.log('designation:',curr_desig);
      var curr_loc = document.querySelector('h3.pv-top-card-section__location').innerText;   								// current location

  		var email_selec = document.querySelector('section.pv-contact-info__contact-type.ci-email span.pv-contact-info__contact-item');
		var email_id = ' ';
		if (email_selec !== null) {
	    	email_id = email_selec.innerText; 																				// candidate email id
	    	//console.log("Email:", email_id);
		}
    
		var phonesele = document.querySelector('section.ci-phone div');
  		var phone_No = ' ';
 		if (phonesele !== null) {
    		var phone_No = phonesele.innerText;									
    		//console.log('Phone:',phone_No);  
  		};

  		var im_idselec = document.querySelector('section.ci-ims ul span');
  		if (im_idselec !== null) {
    		var im_id = im_idselec.innerText;																				// candidate IM id
    		//console.log('IM:',im_id);
  		};

  		var twitter_selec = document.querySelector('section.ci-twitter ul');
  		if (twitter_selec !== null) {
    		var twitter_id = twitter_selec.innerText;																		// candidate twitter id
    		//console.log('Twitter:',twitter_id);
  		}; 

  		var lang_selec = document.querySelector('div#languages-accomplishment-list');
  		if (lang_selec !== null) {
    		var lang_list = lang_selec.innerText;																			// candidate language list
    		//console.log("Languages:",lang_list)
  		};

  		var edu_selec = document.querySelector('div.pv-entity__degree-info');
  		if (edu_selec !== null) {
   			var edu_Degree = edu_selec.innerText;																			// candidate education list
   			//console.log("Education:",edu_Degree);
  		};

  		var short_selec = document.querySelector('div.pv-top-card-section__rich-content');
  		var short_desc = '';
  		if (short_selec !== null) {
    		short_desc = short_selec.innerText;																				// candidate short note/desc
    		//console.log('desc:',short_desc);
  		};


  	 	var dataload = {
        	"field_1": name1,
        	"field_18": recIDFound,
        	"field_41": techid,
        	"field_42": email_id,
        	"field_43": curr_comp,
        	"field_50": curr_loc,
        	"field_70": lang_list,
        	"field_74": misid1,
        	"field_78": link_url,
        	"field_79": phone_No,
        	"field_80": curr_desig,
        	"field_87": "LinkedIn",
        	"field_88": im_id,
        	"field_89": twitter_id,
        	"field_132": edu_Degree,
        	"field_145": short_desc,
          "field_153": recIDFound
        	};

		var companyRequestUrl3 = 'https://api.knack.com/v1/objects/object_1/records';
  		var companyRequestFilters3 = [
    		{
      		'field':'field_78',
      		'operator':'contains',
      		'value':link_url
    		}
  		];
  		var fullcompanyRequestUrl3 = companyRequestUrl3 + '?filters=' + encodeURIComponent(JSON.stringify(companyRequestFilters3));
  		$.ajax({
        	url: fullcompanyRequestUrl3,
          	type: 'GET',
          	headers: {'X-Knack-Application-Id': appId, 'X-Knack-REST-API-Key': apiKey},
          	error: function (xhr, ajaxOptions, thrownError) {
            	  console.log("error message2",thrownError);
          	},
          	success: function () {
            	//console.log("ajax call success");
          	}    
        	}).done(function(data3) {
          		console.log('done:',data3.records);
          	if (data3.records.length > 0) {
            	var data3 = data3.records[0];
            	//console.log(data3);
            	alert("Already in symphony");
            	// put call goes here
              /*
              $.ajax({
                  url: companyRequestUrl3,
                  type:'PUT',
                  headers: {'X-Knack-Application-Id': appId, 'X-Knack-REST-API-Key': apiKey},
                  error: function (xhr, ajaxOptions, thrownError) {
                          console.log("error message2",thrownError);
                  },
                  success: function () {
                      //console.log("update call success");
                  }    
              }).done(function(data3){
                    console.log('update call done');
              }); 
              */ 
            	} else {
            		//console.log('to be inserted in Symphony');	
				        $.ajax({
              	   url: companyRequestUrl3,
              	   type: 'POST',
              	   headers: {'X-Knack-Application-Id': appId, 'X-Knack-REST-API-Key': apiKey},
              	   data: dataload,
              	   error: function (xhr, ajaxOptions, thrownError) {
                      alert("Error in insert. Please add data manually.");
                      console.log("second error",thrownError,xhr);
              	   },
              	   success: function () {
                	   alert("Inserted in Symphony");
              	   }    
            	   }).done(function(data4){	
					           console.log('call done');
				        });	
            };
        }); 
    };   
  } 
  catch(err) {
    alert("Something went wrong. Please contact admin");
    console.log(err);
  } 	
};
