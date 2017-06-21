document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currtab = tabs[0];
        var currurl = currtab.url;
        //console.log(url);
        chrome.tabs.sendMessage(tabs[0].id, {message: "Check Cand",type:currurl}, function(response) {
            const symFixPart = "https://avanceservices.knack.com/symphony#all-candidates/view-candidate-details/";
            var symVarPart = response.id;                                                                // get the cand id and append to fixed part
            var symLink = symFixPart + symVarPart + "/";
            //console.log("Symphony link is:",symLink);
            var note = response.note;
            var name = response.name;
            var email = response.email;
            var phone = response.phone;
            var updated = response.updated;
            var updRec = response.updBy
            //alert(note);
            //alert(symFixPart);
            $('#symLink').attr('href',symLink).html(name);
            $('#emailId').html(email);
            $('#phoneNo').html(phone);
            $('#candNote1').html(note);
            $('#lastUpd').html(updated);
            $('#updBy').html("<b>By:</b>"+ updRec);
            //$('candInf').show();
        }); 
    });
    chrome.storage.local.get(function(res1){
      var misIdFound = res1.misid1;
      var techFound = res1.tech;
      var recname = res1.recname;
      if(misIdFound === "" || misIdFound === undefined) {
        $('#btn2').removeClass('btn btn-default').addClass('btn btn-warning').prop('disabled',true);
      } else {
        var changePlac = misIdFound + '-' + techFound;
        var recval ="Rec Name: " + recname;
        $('#recname1').html(recval);
        $('#misId1').prop('disabled',true).prop('placeholder',changePlac);
        $('#btn1').html("Unlock").removeClass('btn btn-primary').addClass('btn btn-danger');
        $('#btn2').removeClass('btn btn-default').addClass('btn btn-primary').prop('disabled',false);
      };
    });  

    $('#btn1').on('click',function() {
        var option1 = $('#btn1').html();
        if (option1 === "Unlock") {
        $('#misId1').prop('disabled',false).prop('placeholder',"Enter MIS ID");
        $('#btn1').html("Lock MIS Id");
        } else {
            var store = {};
            var misid1 = 'misid';
            var misid2 = $('#misId1').val();
            var tech = 'tech';
            var techVal = '';
            chrome.storage.local.set({misid1:misid2,tech:techVal},function(){
                if (chrome.runtime.lastError) {
                  alert("Error:" + chrome.runtime.lastError.message);
                } else {
                  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                      chrome.tabs.sendMessage(tabs[0].id, {message: "Rec and Tech"}, function(response) {
                            console.log(response.farewell);
                            $('#btn1').html("Unlock").removeClass('btn btn-primary').addClass('btn btn-danger');
                            $('#misId1').prop('disabled',true).prop('placeholder',misIdFound);
                            $('#btn2').removeClass('btn btn-default').addClass('btn btn-primary').prop('disabled',false);
                      });
                  });
                };
              //$('#btn1').html("Unlock");
              //$('#misId1').prop('disabled',true).prop('placeholder',misIdFound);
              //$('#btn2').removeClass('btn btn-default').addClass('btn btn-primary').prop('disabled',false);   
          });
        };    
    });
    

    $('#btn2').on('click',function(){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "Addition"}, function(response) {
              console.log(response.farewell);
            });
          })
      });

});