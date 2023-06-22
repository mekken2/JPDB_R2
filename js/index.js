var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var shipDBName = 'DELIVERY-DB';
var shipRelationName = 'SHIPMENT-TABLE';
var connToken = 'YOUR_TOKEN_HERE';

$('#shipid').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getshipidAsJsonObj(){
    var shipid = $('#shipid').val();
    var jsonStr = {
        id: shipid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    
    var record = JSON.parse(jsonObj.data).record;
    $('#shipdesc').val(record.desc);
    $('#shipsrc').val(record.src);
    $('#shipdtn').val(record.dtn);
    $('#shipsd').val(record.sd);
    $('#shipdd').val(record.dd);
}

function resetForm(){
    $('#shipid').val("");
    $('#shipdesc').val("");
    $('#shipsrc').val("");
    $('#shipdtn').val("");
    $('#shipsd').val("");
    $('#shipdd').val("");
    
    $('#shipid').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    
    $('shipid').focus();
}

function validateData(){
    var shipid, shipdesc, shipsrc, shipdtn, shipsd, shipdd;
    
    shipid = $('#shipid').val();
    shipdesc = $('#shipdesc').val();
    shipsrc = $('#shipsrc').val();
    shipdtn = $('#shipdtn').val();
    shipsd = $('#shipsd').val();
    shipdd = $('#shipdd').val();

    if(shipid === ''){
        alert('Shipment No missing');
        $('#shipid').focus();
        return "";
    }
    if(shipdesc === ''){
        alert('Shipment Description missing');
        $('#shipdesc').focus();
        return "";
    }
    if(shipsrc === ''){
        alert('Shipment Source missing');
        $('#shipsrc').focus();
        return "";
    }
    if(shipdtn === ''){
        alert('Shipment Destination missing');
        $('#shipdtn').focus();
        return "";
    }
    if(shipsd === ''){
        alert('Shipment Date missing');
        $('#shipsd').focus();
        return "";
    }
    if(shipdd === ''){
        alert('Delivery Date missing');
        $('#shipdd').focus();
        return "";
    }
    
    var jsonStrObj = {
        id: shipid,
        desc: shipdesc,
        src: shipsrc,
        dtn: shipdtn,
        sd: shipsd,
        dd: shipdd 
    };
    return JSON.stringify(jsonStrObj);
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === ''){
        return '';
    }
    
    var putRequest = createPUTRequest(connToken, jsonStrObj, shipDBName, shipRelationName);
    alert(putRequest);
    //jquery.ajaxSetup({async: false});

    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    //jquery.ajaxSetup({async: true});
    alert(JSON.stringify(resJsonObj));
    
    resetForm();
    $('$shipid').focus();
}

function changeData(){
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, shipRelationName, localStorage.getItem('recno'));
    jquery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jquery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('shipid').focus();
}

function getEmp(){
    var shipidJsonObj = getshipidAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, shipDBName, shipRelationName, shipidJsonObj);
    jquery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jquery.ajaxSetup({async: true});
    
    if(reqJsonObj.status === 400){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#shipdesc').focus();
    }
    else if(resJsonObj.status === 2000){
        $('#shipid').prop('disabled',true);
        fillData(resJsonObj);
        
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#shipdesc').focus();
    }
}

