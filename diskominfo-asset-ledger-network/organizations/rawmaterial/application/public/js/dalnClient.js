/**
** Diskominfo Jabar Asset network Hyperledger Fabric
** diskominfo asset ledger blockhain network
**  Author: PJ
** JS for rawmaterial web appication
**/
$(document).ready(function(){
    //make sure change to your own machine ip or dmain url
    //var urlBase = "http://localhost:30000";
    var urlBase = "http://185.230.64.110:30000";
     var tabs =["addToWallet", "createMaterial", "query", "queryHistory"];
     $("#queryResult").hide();
     $("#addToWalletLink").click(function(){
       showTab("addToWallet");
     });
   $("#createMaterialLink").click(function(){
     showTab("createMaterial");
   });
   $("#queryLink").click(function(){
       showTab("query");
   });
   $("#queryHistoryLink").click(function(){
       showTab("queryHistory");
   });
 $("#addUser").click(function(){
   var addUserUrl = urlBase+"/addUser";
   var userName = $('#user').val();
   $.ajax({
     type: 'POST',
     url: addUserUrl,
     data: { userName: userName },
     success: function(data, status, jqXHR){
       console.log(data);
       if(status==='success'){
         alert("User - "+ userName+ " was successfully added to wallet and is ready to intreact with the fabric network");
       }
       showTab("createMaterial");
     },
     error: function(xhr, textStatus, error){
         console.log(xhr.statusText);
         console.log(textStatus);
         console.log(error);
         alert("Error: "+ xhr.responseText);
     }
   });
 });
 $("#createMaterial").click(function(){
   var createMaterialUrl = urlBase+"/createMaterial";
   var formData = {
     rawmaterial: $('#rawmaterial').val(),
     materialNumber: $('#materialNumber').val(),
     materialName: $('#materialName').val(),
     ownerName: $('#ownerName').val()
   }
   $.ajax({
     type: 'POST',
     url: createMaterialUrl,
     data: formData,
     success: function(data, status, jqXHR){
       if(status==='success'){
         alert("successfully record rawmaterial material  in blockchain");
      }
       showTab("query");
     },
     error: function(xhr, textStatus, error){
         console.log(xhr.statusText);
         console.log(textStatus);
         console.log(error);
         alert("Error: "+ xhr.responseText);
     }
   });
 });
$("#query").click(function(){
  reset();
  var queryUrl = urlBase+"/queryByKey";
  var searchKey = $('#queryKey').val();

  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { key: searchKey },
    success: function(data, status, jqXHR){
      if(!data || !data.Record || !data.Record.materialNumber) {
        $("#queryResultEmpty").show();
        $("#queryResult").hide();
      } else {
        $("#queryResult").show();
        $("#queryResultEmpty").hide();
        let record = data.Record;
        $("#materialNumberOutPut").text(record.materialNumber);
        $("#materialNameOutPut").text(record.materialName);
        $("#rawmaterialOutPut").text(record.rawmaterial);
        $("#ownerNameOutPut").text(record.ownerName);
        $("#createDateTime").text(record.createDateTime);
        $("#lastUpdated").text(record.lastUpdated);
        $("#queryKeyRequest").text(data.Key);
        $("#previousOwnerType").text(record.previousOwnerType);
        $("#currentOwnerType").text(record.currentOwnerType);
      }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});
$("#queryHistory").click(function(){
  reset();
  var queryUrl = urlBase+"/queryHistoryByKey";
  var searchKey = $('#queryHistoryKey').val();

  $.ajax({
    type: 'GET',
    url: queryUrl,
    data: { key: searchKey },
    success: function(data, status, jqXHR){
      if(!data || data.length==0) {
        $("#qqueryHistoryResultEmpty").show();
        $("#queryHistoryResult").hide();
      } else {
        $("#queryHistoryResult").show();
        $("#queryHistoryResultEmpty").hide();
        console.log(data);
        $("#historyTableTboday").empty();
        var tbody = $("#historyTableTboday");
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var tr = '<tr>';
            tr = tr+'<th scope="col">'+ row.materialNumber + '</th>';
            tr = tr+ '<td>'+ row.rawmaterial + '</td>';
            tr = tr+ '<td>'+ row.materialNumber + '</td>';
            tr = tr+ '<td>'+ row.materialName + '</td>';
            tr = tr+ '<td>'+ row.ownerName + '</td>';
            tr = tr+ '<td>'+ row.previousOwnerType + '</td>';
            tr = tr+ '<td>'+ row.currentOwnerType + '</td>';
            tr = tr+ '<td>'+ row.createDateTime + '</td>';
            tr = tr+ '<td>'+ row.lastUpdated + '</td>';
            tr = tr+ '</tr>';
            tbody.append(tr);
        }
      }
    },
    error: function(xhr, textStatus, error){
        console.log(xhr.statusText);
        console.log(textStatus);
        console.log(error);
        alert("Error: "+ xhr.responseText);
    }
  });
});
function showTab(which) {
   for(let i in tabs) {
     if(tabs[i]===which) {
       $("#"+tabs[i] + "Tab").show();
     } else {
       $("#"+tabs[i] + "Tab").hide();
     }
   }
   reset();
}
function reset() {
   $("#queryResultEmpty").hide();
   $("#queryResult").hide();
   $("#queryHistoryResultEmpty").hide();
   $("#queryHistoryResult").hide();
}
});
$(document).ajaxStart(function(){
  $("#wait").css("display", "block");
});
$(document).ajaxComplete(function(){
  $("#wait").css("display", "none");
});
