var Setting_port="8080";
var Setting_servername = "http://"+window.location.hostname+":"+Setting_port+"/";
/////////////////////////Function Logic!

var fieldprefix = "#URI";
//Queue of Valid Elements
var BackeFail =false;
var ValidQueue = [];


  
////VALID Queue
///Tool for caching valid URIS


function uniqueArray(inarray) {
    var o = {}, i, l = inarray.length, r = [];
    for(i=0; i<l;i+=1) o[inarray[i]] = inarray[i];
    for(i in o) r.push(o[i]);
    return r;
};

function ValidQueueAdd(element,makeunique){
	if(makeunique === undefined)
		makeunique =true;
	if(element === undefined )
		return;
		
	if(element !== undefined)
		var kurz= ShortenLink(element);
		var kurz2 = decodeURIComponent(kurz);
		ValidQueue.push(kurz2);
	if(makeunique)
		ValidQueue= uniqueArray(ValidQueue);
}


function ValidQueueLast(number){
	var out=[];
	if(number > ValidQueue.length)
		number = ValidQueue.length;
	for(var i=ValidQueue.length-1; i>=0 && out.length <= number   ; i--){
		if(out.indexOf(ValidQueue[i])==-1)
			out.push(ValidQueue[i]);
			
	
	}
	
	return out;
	
}
  
function ValidQueueContains(element){
	
	element = decodeURI(ShortenLink(element));
	element.replace(" ","_");
	for(var i=0;i<ValidQueue.length;i++)
		if(ValidQueue[i].toLowerCase() == element.toLowerCase())
			return i;
			
	return false;
		
	//return ValidQueue.inArray(ShortenLink(element));
}
  

///VALID QUEUE END
  
  
var errorIsThere =true;
function NameofField(i){
	return fieldprefix+i;
			
}
function FieldofName(Name){
		return Name.charAt( Name.length-1 );
	
}
function Lookupable(uri){
	out = "https://en.wikipedia.org/wiki/"+ShortenLink(uri);
	return out;
	
}
function Searchable(uri){
	out = "https://en.wikipedia.org/wiki/Special:Search/"+ShortenLink(uri);
	return out;
	
}

function ShortenLink(uri){

	if(uri ===undefined || !(typeof uri == 'string' || uri instanceof String))
		return "";
	if(uri.lastIndexOf("/")>0){
		return uri.substr(uri.lastIndexOf("/")+1);
		}
	else{ 
		return uri;
		}
	
}
function CreateExample(things){
	//Put Examples into the Fields
	for(i =1;i<things.length+1;i++){
		refill(i,things[i-1]);
	}
	//If The Example Has less URIs than 5 The Rest of the Fileds must be cleared
	for(i=things.length+1;i < 6;i++){
		clearField(i);
	}

}
		
function checkandCreate() {
    //alertf("test");

    Links = checkLinks();

    
    if (!Links || Links.length < 3 ||  Links.length > 5){return;}

    CreateFile(Links);

}

function checkLinks() {

    var out = new Array();
    for (var i = 1; i < 6; i++) {
    
      var value = encodeURI($(NameofField( i)).val());

      if (value == "") 
	continue;
      
      
      if (infos[i]["status"] != "ready" ) {
	checkLink(value,i);
      }else if(infos[i]["status"] == "ready") {
        out.push(infos[i]["valid"]);
      }
      
      
    }
    return out;
}

// Creates comment in the Field that there is Something not right with its Value!
function ForceCheckLinks() {
    var out = new Array();
    for (var i = 1; i < 6; i++) {
	var value = $(NameofField( i)).val();
	var value = $(NameofField( i)).val();
	
	value = encodeURI($(NameofField( i)).val());

      var temp;

	checkLink(value,i);


      
      
    }
    RefreshOwn();
    
}


	//Number of the field is the Field stat is 0 for unchecked 1 for isOks 2 for is wrong
function notifyField(numberOfTheField, stat) {
	var farbe = "";    
    if(stat==0)
    	farbe = "#FFFF00";
    else if(stat==1)
    	farbe = "#AAFFAA";
    else if(stat==2)
    	farbe = "#FFAAAA";
    else
    	return;
    
	$(NameofField(numberOfTheField)).css( "background-color", farbe );    
	
}
function refill(i, Text){
		thing = $(NameofField(i)).val(Text);		
}
  //This Function Returns False if there is an Error
  //OR it Returns The Right Value to finaly use if its an Redirect Name etc....
function checkLink(toCheck,i) {
	startofend=toCheck.lastIndexOf("/");
  if(startofend>0)
	toCheck = specialEscape(toCheck);
  else
	toCheck = specialEscape(toCheck.charAt(0).toUpperCase() + toCheck.slice(1));
  if(toCheck == ""){
	notifyField(i,0);
	infos[i]["Valid"]="";
	infos[i]["status"] = "empty";
	$("lookup"+i).hide();
	return;
  }
  var validQueCheck =ValidQueueContains(toCheck);

  if(validQueCheck!==false){
	var data = ValidQueue[validQueCheck];
	refill(i, decodeURI(ShortenLink(data)));
  	notifyField(i,1);
	infos[i]["valid"] = data;
	infos[i]["status"] = "ready";
	lookup = "#lookup"+i;
	$(lookup).show();
	$(lookup).attr("href",Lookupable(data));
	for(var j =1 ;j<6;j++){
		if(infos[j]["status"] == "wrong" ){
		  errorIsThere =true;

		}
		if(j != i && infos[i]["valid"] == infos[j]["valid"]){
				clearField(j);
			}
	}
	return;
  }
  
  
    $.ajax({
      url: Setting_servername+'?' +'command=checkURI&ReturnFunc=_checkURI'+i+'&URItoCheck=' + toCheck+'&User='+ExperimentID,
      type: 'GET',
      dataType: "jsonp",
      jsonpCallback: "_checkURI"+i,
      success: function (data, textStatus) {
	data = decodeURI(data);
      	if(data == "Not Found"){
      		error =true;
		errorIsThere=true;
      		notifyField(i,2);
		infos[i]["Valid"]="";
		infos[i]["status"] = "wrong";
		lookup = "#lookup"+i;
		$(lookup).show();
		$(lookup).attr("href",Searchable(toCheck));
      		}
      	else if(toCheck!= data){
		ValidQueueAdd(data);
      		refill(i, decodeURI(unescape(ShortenLink(data))));
      		notifyField(i,1);
		infos[i]["valid"] = data;
		infos[i]["status"] = "ready";
		lookup = "#lookup"+i;
		$(lookup).show();
		$(lookup).attr("href",Lookupable(data));
      		for(var j =1 ;j<6;j++){
			if(infos[j]["status"] == "wrong" ){
			  errorIsThere =true;

			}
			if(j != i && infos[i]["valid"] == infos[j]["valid"]){
				clearField(j);
			}
				
		}
      	}
	else if(toCheck== data){
		ValidQueueAdd(data);
      		notifyField(i,1);
		infos[i]["valid"] = data;
		infos[i]["status"] = "ready";
		lookup = "#lookup"+i;
		$(lookup).show();
		
		$(lookup).attr("href",Lookupable(data));
      		for(var j =1 ;j<6;j++){
			if(infos[j]["status"] == "wrong" ){
			  errorIsThere =true;
			  
			  }
			  
			if(j != i && infos[i]["valid"] == infos[j]["valid"]){
				clearField(j);
			}
		}
      	}
	
	RefreshOwn();
      	
      },
      error: function (e) {notifyField(i,0);}
    });

}


function clearField(num){
  	notifyField(num,0);
	infos[num]["Valid"]="";
	infos[num]["status"] = "empty";
	$("#URI"+num).val("");
	$("#lookup"+num).hide();
  
  
}

function CreateFile(arrayOfLinks) {

    var params = new Array();
    params.push("User="+ExperimentID);
    
    params.push("command=createfile");
    params.push("ReturnFunc=_createfile");
    for (i = 0; i < arrayOfLinks.length; i++) {
      params.push("uri" + i + "=" + arrayOfLinks[i]);
    }
    var lang = encodeURI($('#lang').val());
    params.push("lang=" + lang);
    isLoadin();
    $.ajax({
      url: Setting_servername+'?' + params.join("&"),
      type: 'GET',
      dataType: "jsonp",
      jsonpCallback: "_createfile",
      success: function (thecreatedfile, textStatus) {
        //data =eval(data);
	destiny = thecreatedfile;
	destiny = destiny.substring(destiny.lastIndexOf('/')+1, destiny.lastIndexOf('.'));
        
        finishedLoadin(destiny);
        //createView(destiny);



      }
    });


}

function getPublicHash() {
    var params = new Array();
    params.push("User="+ExperimentID);
    
    params.push("command=getPublicHash");
    params.push("ReturnFunc=_getPH");
    $.ajax({
      url: Setting_servername+'?' + params.join("&"),
      type: 'GET',
      dataType: "jsonp",
      jsonpCallback: "_getPH",
      success: function (PubHash, textStatus) {

	PublicExperimentID = PubHash;

      }
    });


}

  
function printReport(hash){
    var loc = window.location.protocol +"//"+ window.location.hostname;

    if(window.location.port!= 80)
        loc=loc+":"+window.location.port;

	var report = loc+"/pubfiles/report_"+hash ;
	$("#LoadingDiv").append(report);
	$.get( loc+"/pubfiles/report_"+hash , function(data) {
		var lines = data.split('\n');
		for(var i = 0;i < lines.length;i++){

			outer = $('<p/>',{'text': lines[i]});
			out = outer.html();
			out += "<br/>";
			$("#ReportDiv").append(out);
		}
    			
	}, 'text');	  	
  
}
  
function isLoadin(hash) {
	//updatereport(hash);#
	$("#LoadingDiv").show();
	$("#navigation").hide();
}
  
 
  
  /*
  Json Example For an Example
  {
  "id":"TheWild20s",
  "title":"The 20s in fashion and Swing Music and Crime",
  "description":"This very Sparse example shows that all things here are just Connected to two of the Articles. But a Few Nodes are drawn to the Center by the other contexts that interrelate here.",
  "Links":["http://en.wikipedia.org/wiki/Swing_music","http://en.wikipedia.org/wiki/Fashion","http://en.wikipedia.org/wiki/1920s","http://en.wikipedia.org/wiki/Gangster"]
  
  }
  
  
  */

  
function finishedLoadinMULE(destiny) {
    $("#downloadLink").prop("href", destiny);
    var linkwithoutparams = "";

    if (window.location.href.indexOf('?') >= 0) linkwithoutparams = window.location.href.slice(0, window.location.href.indexOf('?'));

    else linkwithoutparams = window.location.href;    


    TheLINK = createLink(destiny,PublicExperimentID);
    
    $("#Permalink").prop("href",TheLINK);
    $("#Permalinkhigh").prop("href",TheLINK);
    $("#PermalinkCopyPaste").prop("value",TheLINK);;
    $("#LoadingDiv").hide();
    $("#downloadLinkwrap").show();
    $("#Permalinkwrap").show();
}
  

function finishedLoadin(destiny) {
    var loc = window.location.protocol +"//"+ window.location.hostname;

    if(window.location.port!= 80)
        loc=loc+":"+window.location.port;
    $("#downloadLink").prop("href", decodeURI(loc+"/pubfiles/"+destiny+".gexf"));

    var linkwithoutparams = "";
    if (window.location.href.indexOf('?') >= 0) 
	linkwithoutparams = window.location.href.slice(0, window.location.href.indexOf('?'));
    else linkwithoutparams = window.location.href;

    TheLINK = createLink(destiny,PublicExperimentID);
    
    $("#Permalink").prop("href",TheLINK);
    $("#Permalinkhigh").prop("href",TheLINK);
    $("#PermalinkCopyPaste").prop("value",TheLINK);
    $("#LoadingDiv").hide();
    $("#downloadLinkwrap").show();
    $("#Permalinkwrap").show();
    $("#sigma-example-parent").show();
    $("#sigmatoolbar").show();
    
    
    $('#FinishedModal').modal('show');
    
    var a = window.open(TheLINK,'_viz');
    a.focus();

}

//Creation of Trackable Permalinks
function createLink(hash,Pubid){
	var out;
	var linkwithoutparams = "";
	 if (window.location.href.indexOf('?') >= 0) 
		linkwithoutparams = window.location.href.slice(0, window.location.href.indexOf('?'));
	else linkwithoutparams = window.location.href;
	
	linkwithoutpFile = linkwithoutparams.slice(0, window.location.href.lastIndexOf('/'));
	out = linkwithoutpFile +"/display.html?existingFile=" + hash + "&idReferencer=" + Pubid;
	
	//DEBUGMESSAGE("This is the Permalink : "+out);
	
	return out;
	
}
	
//Create/Load Identification Token!
function Bake_bake(){
	
	ExperimentID = getCookie("ExperimentID");

	
	if(!document.cookie|| ExperimentID =="" || ExperimentID.length <23  ){
		//Get Hash from Server
	    $.ajax({
		url: Setting_servername+'?' +'command=getHash&ReturnFunc=_GetHash',
		type: 'GET',
		dataType: "jsonp",
		jsonpCallback: "_GetHash",
		success: function (data, textStatus) {
			dates = JSON.parse(data);
			
			ExperimentID = dates.User;
			PublicExperimentID = dates.SharingUser;
			document.cookie = "ExperimentID="+ExperimentID+";expires=Wed, 31 Dec 2014 23:59:59 GMT;";

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { 
                     BackeFail =true;
                }
		
	});
	
	
	}
}	

//Remove Cookie from Browser after Restart (No Date!)
function Bake_crumble(){
	document.cookie = "ExperimentID="+ExperimentID+";";
	
}	

function Bake_redo(NewId){

    var params = new Array();
    params.push("User="+NewId);
    
    params.push("command=getPublicHash");
    params.push("ReturnFunc=_getPH");

    $.ajax({
      url: Setting_servername+'?' + params.join("&"),
      type: 'GET',
      dataType: "jsonp",
      jsonpCallback: "_getPH",
      success: function (PubHash, textStatus) {
	if(PubHash != "NOT FOUND"){
		PublicExperimentID = PubHash;
		ExperimentID = NewId;
		document.cookie = "ExperimentID="+ExperimentID+";expires=Wed, 31 Dec 2014 23:59:59 GMT;";
	}
	else{
		$("#IdentificationField").val(ExperimentID);
		alert("The Hash you have entered isnt a User Hash");
	}
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
	$("#IdentificationField").val(ExperimentID);
	alert("The Hash you have entered isnt a User Hash");
      }
    });
	
}	




//Coockie Function that retrives special Cookie
function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++){
		var c = ca[i].trim();
		if (c.indexOf(name)==0) 
			return c.substring(name.length,c.length);
	}
	return "";
} 
	
// GET Parameters in URL
function checkParams(){
	//check for parameters in the URL
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	var vars = new Array();
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	if ("existingFile" in vars) {
		createExistingFile(decodeURI(vars["existingFile"]));
		// createView(destiny);
	}
	return vars;
}


// GET Parameters in URL
function specialEscape(string){
	return escape(string);
}

