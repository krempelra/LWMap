/**
**************Modules
**/
var sys = require ('util');
var url = require('url');
var http = require('http');
var qs = require('querystring');
var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;
var crypto = require('crypto');
var mysql      = require('mysql');

/**
**************Config Variables
**/
//Read config file with (JSON) Assotiative Array tree that uses the Keys as Follows
var fileContents = fs.readFileSync("../Settings/local.json",'utf8');
var conf = JSON.parse(fileContents); 

//Yeah Verbose ... Any questions ? Yes? LMGTFY 
var verbose =conf["verbose"];
//A Tip: Its not about Insects!
var debugOutput =false;


var SPARQLDebug=true;
var TrackerDebug=false; 

var JavaDebugOutput =true;


//Configure The Server

var runningJobs= new Array();

console.log("Reading Options");
/*
var reqconfigs=  new Array("ServerPort",
				"HostnametoListenTo",
				"Javaprefix",
				"LocationJar",
				"TDBStoreFolders",
				"TDBStorePrefix",
				"TDBStoreRedirect",
				"inputFolder",
				"outputFolder",
				"LookupFolderFromOutside");

*/

if(conf["ServerPort"] === undefined){
	console.log("Failed to read Option ServerPort");
	return false;
	}
var ServerPort =conf["ServerPort"];


if(conf["HostnametoListenTo"] === undefined){
	console.log("Failed to read Option HostnametoListenTo");
	return;
	}
var HostnametoListenTo = conf["HostnametoListenTo"];

//The Java Executable with The PARAMETERS
if(conf["Javaprefix"] === undefined){
	console.log("Failed to read Option Javaprefix");
	return;
	}
var Javaprefix =conf["Javaprefix"];

if(conf["LocationJar"] === undefined){
	console.log("Failed to read Option LocationJar");
	return;
	}
// Location of the Executable
var LocationJar =conf["LocationJar"];
//The Config for the Java Programm
var DataVersion;
if(conf["DataVersion"] === undefined){
	console.log("Failed to read Option DataVersionusing Expected DBPedia3.9");
	DataVersion = "DBPedia3.9";
}else
	DataVersion = conf["DataVersion"];


// The Location of the Datasets for the TDB Location of the Links 
if(conf["TDBStoreFolders"] === undefined){
	console.log("Failed to read Option TDBStoreFolders");
	return;
	}
	
var TDBStoreFolders = conf["TDBStoreFolders"];
if(conf["TDBStorePrefix"] === undefined){
	console.log("Failed to read Option TDBStorePrefix");
	return;
	}
var TDBStorePrefix = conf["TDBStorePrefix"];
if(conf["TDBStoreRedirect"] === undefined){
	console.log("Failed to read Option TDBStoreRedirect");
	return;
	}
var URIRedirect = conf["TDBStoreRedirect"];
if(conf["inputFolder"] === undefined){
	console.log("Failed to read Option inputFolder");
	return;
	}
// The Folder where the Textfiles with the URIS are saved. 
var inputFolder =conf["inputFolder"];
if(conf["outputFolder"] === undefined){
	console.log("Failed to read Option outputFolder");
	return;
	}
// The Folder where the Results are Stored so they can be downloaded and accessed by Sigmal JS  IN THE LOCAL FILE SYSTEM
var outputFolder = conf["outputFolder"];
if(conf["LookupFolderFromOutside"] === undefined){
	console.log("Failed to read Option LookupFolderFromOutside");
	return;
	}
//For request Answer The URL part where the File for SigmaJS can be found 
var LookupFolderFromOutside = conf["LookupFolderFromOutside"];


if(conf["UserTracking"] === undefined){
	console.log("Failed to read Option UserTracking");
	return;
	}

var UserTracking =conf["UserTracking"];
console.log("Options loaded");
//TODO Read Config File!

/**
*****************Prefix Patterns
**/

var prefixPatterns = new Array();
prefixPatterns.push( "http://en.wikipedia.org/wiki/");
prefixPatterns.push( "https://en.wikipedia.org/wiki/");
prefixPatterns.push( "http://live.dbpedia.org/page/");
prefixPatterns.push( "http://live.dbpedia.org/resource/");
prefixPatterns.push( "http://dbpedia.org/page/");
prefixPatterns.push( "http://dbpedia.org/resource/");
prefixPatterns.push( "http://en.m.wikipedia.org/wiki/");
prefixPatterns.push( "https://en.m.wikipedia.org/wiki/");
var StandardPrefix = "http://dbpedia.org/resource/";

//Mysql INIT
/**
*********************** Init User Tracking
**/

var pool = mysql.createPool({
  host     : UserTracking["host"],
  user     : UserTracking["Username"],
  password : UserTracking["Password"],
  database : UserTracking["database"]
});

/*
if(!connected){
	console.log("couldnt establish Connection to Mysql Server");
	return; 
}
*/


console.log("Store Tracking");

//////////////Server Creation
http.createServer(function (req, response) {



	//Only Take GET Commands!
	if(req.method=='GET') {
		toConsole(req.url);

		var parsed = url.parse(req.url,true);
		var data = parsed.query;
		
		if(data == undefined || !("command" in data)){
			response.writeHead(400, {"Content-Type": "text/plain"});  
            		response.write("Bad Request Must Send Command! Parameter" );  
            		response.end();
			return;

		}
		///////////   STARTING TO PROCESSS COMMANDS
		
		/////////////////CREATE NEW USER And Its HASHES
		
		
		//Creates a User Hash is none is set!
		if(data["command"] == "getHash" &&  ("ReturnFunc" in data)){
			//The Private hash Identifies the user from the Inside -> cookie etc.
			var eventInfos ={};
			eventInfos["Timestamp"] = new Date().getTime();
			var out={}; 
			var privateHash;
			require('crypto').randomBytes(24, function(ex, buf) {
				privateHash = buf.toString('hex');
				eventInfos["User"]=privateHash;
				out["User"]=privateHash;
				//The Public Hash identifies the User to others so that they cant figuq the Private Hash out
				//This has is used to Share Visualisations by User. It Prevents Identity Theft
			
				var publicHash;
				crypto.randomBytes(24, function(ex, buf) {
					publicHash = buf.toString('hex');
					
					eventInfos["SharingUser"]=publicHash;
					out["SharingUser"]=publicHash;
				
					StoreTracking("User",eventInfos);
			
					response.writeHead(200, {"Content-Type": "application/json"});
					response.write(data["ReturnFunc"]+'(\''+JSON.stringify(out)+'\')' );
					response.end();
				});
			});
			

		/////////////////GET PUBLIC HASH FOR USER
			
		}else	if(data["command"] == "getPublicHash" &&  ("ReturnFunc" in data)&&("User" in data) && data["User"]!=""){
			//The Private hash Identifies the user from the Inside -> cookie etc.
			

			User=data["User"];
			
			pool.getConnection(function(err, connection){

				var query = 'SELECT `SharingUser` FROM `User` WHERE `User`.`User` = "'+User+'" LIMIT 1;';
				connection.query(query, function(err, rows, fields) {
					if (err) throw err;
		
					
					if (rows[0] !== undefined && rows[0].SharingUser !== undefined)
						out = 	rows[0].SharingUser;
					else
						out = false;
						
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write(data["ReturnFunc"]+'(\''+out+'\')' );
					response.end();
		
				});
	
			
				connection.release();

			});
			

		/////////////////GET Last URIs FOR USER
			
		}else	if(data["command"] == "getLastUris" &&  ("ReturnFunc" in data)&&("User" in data) && data["User"]!=""){
			//The Private hash Identifies the user from the Inside -> cookie etc.
			

			User=data["User"];
			
			pool.getConnection(function(err, connection){
				
				var query = 'SELECT `URI` FROM `CheckURI` WHERE `Success` = 1 AND `User` =  "'+User+'" ORDER BY  timestamp DESC LIMIT 30;';
				
				connection.query(query, function(err, rows, fields) {
					if (err) throw err;
					var out = [];
					//console.log(rows[0]);
					if (rows[0] !==undefined && rows[0].URI !== undefined){
						for(var j = 0;j<rows.length;j++){
							if(rows[j].URI !== undefined)
								out.push(specialEscape(rows[j].URI));
						}
					}
					response.writeHead(200, {"Content-Type": "application/json"});
					//response.write(data["ReturnFunc"]+'(\''+Uris+'\')' );
					response.write(data["ReturnFunc"]+'(\''+JSON.stringify(out)+'\')' );
			
					response.end();
			
					});
	
			
				connection.release();
			
				});
			

		/////////////////GET Last Visualisations FOR USER
			
		}else	if(data["command"] == "getMyViz" &&  ("ReturnFunc" in data)&&("User" in data) && data["User"]!=""){

			

			User=data["User"];
			
			pool.getConnection(function(err, connection){

				var query = 'SELECT `VisHash`,`URI1`,`URI2`,`URI3`,`URI4`,`URI5`,`lang` FROM `Create` WHERE  `User` = "'+User+'" ORDER BY  timestamp DESC LIMIT 30;';
				//console.log(query);
				connection.query(query, function(err, rows, fields) {
				if (err) throw err;
		
				var out = [];
				if (rows[0] !==undefined){
					for(var j = 0;j<rows.length;j++){
						var single ={};
						single.Hash = rows[j].VisHash;
						single.lang = rows[j].lang;
						single.Links = [];
						if(rows[j].URI1 !== undefined && rows[j].URI1!= "")
							single.Links.push( specialEscape(rows[j].URI1));
						
						if(rows[j].URI2 !== undefined && rows[j].URI2!= "")
							single.Links.push( specialEscape(rows[j].URI2));
							
						if(rows[j].URI3 !== undefined && rows[j].URI3!= "")
							single.Links.push( specialEscape(rows[j].URI3));
							
						if(rows[j].URI4 !== undefined && rows[j].URI4!= "")
							single.Links.push( specialEscape(rows[j].URI4));
							
						if(rows[j].URI5 !== undefined && rows[j].URI5!= "")
							single.Links.push( specialEscape(rows[j].URI5));
							
						out.push(single);
					}
				}
				response.writeHead(200, {"Content-Type": "application/json"});
				response.write(data["ReturnFunc"]+'(\''+JSON.stringify(out)+'\')' );
				response.end();
				
				
				
				});
	
			
				connection.release();

			});
			
			

			
		/////////////////CREATE FIILE
		}else	 if(data["command"] == "createfile" &&  ("ReturnFunc" in data)&& ("User" in data) && data["User"]!=""){
			delete data["command"];
			var now =new Date().getTime();

			//Try not to Start Concurrent jobs for the same User. WAIT! 
			if(runningJobs[data["User"]]!==undefined){
				
				if(runningJobs[data["User"]] + 480000 < now)
					delete runningJobs[data["User"]];
				else{
					toConsole(filename);
					wait = runningJobs[data["User"]] + 480000 - now;
					setTimeout(function() { }, wait);
					if(runningJobs[data["User"]]!==undefined)
						delete runningJobs[data["User"]];
				}
			}else{
				runningJobs[data["User"]] = now;
			}
			
			var filename="";
			var normalizedin = NormalizeInput(data);
			
			filename = FilenamefromParams(normalizedin,data["lang"],DataVersion);
			
			
			
			toConsole(filename);
			//Wenn etwas schon besteht dann wird es einfach zurückgegeben
			path.exists(inputFolder+filename+".txt", function(exists) {
				if (exists) {
					response.writeHead(200, {"Content-Type": "text/plain"});  
					response.write(data["ReturnFunc"]+'(\''+LookupFolderFromOutside +filename + ".gexf"+'\')' );  
            		
					var eventInfos ={};
					eventInfos["Timestamp"] = new Date().getTime();
					eventInfos["User"] = data["User"];
					eventInfos["lang"]= data["lang"];
				 	eventInfos["VisHash"] = filename;
					eventInfos["New"] = 0; 
					for(var i=0;i<normalizedin.length;i++)
						eventInfos["URI"+(i+1)] =normalizedin[i] ;		
				 	StoreTracking("Create",eventInfos);
					
					
					response.end();
					return;
				 } else {
					//Timestamp, Vishash, URI1,URI2,URI3,URI4,URI5, User
					
					var eventInfos ={};
					eventInfos["Timestamp"] = new Date().getTime();
					eventInfos["User"] = data["User"];
					eventInfos["lang"]= data["lang"];
				 	eventInfos["VisHash"] = filename;
					eventInfos["New"] = 1; 
					for(var i=0;i<normalizedin.length;i++)
						eventInfos["URI"+(i+1)] =normalizedin[i] ;		
				 	StoreTracking("Create",eventInfos);
					
					writeStuff(normalizedin,filename);
					TDBStoreFolder = TDBStoreFolders[data["lang"]];

					
					var command = Javaprefix+" "
					+ LocationJar +" "
					+ inputFolder + filename+".txt "
					+ TDBStoreFolder +" "  
					+ outputFolder+filename+" "
					+ TDBStorePrefix[data["lang"]];
					toConsole(command);
					child = exec(command,
					function (error, stdout, stderr){
						if(JavaDebugOutput){						
							console.log('stdout: ' + stdout);
							console.log('stderr: ' + stderr);
						}
						if(error !== null){
							toConsole('exec error: ' + error);
						}
						toConsole(LookupFolderFromOutside +filename + ".gexf");
						var eventInfos ={};
						eventInfos["Timestamp"] = new Date().getTime();
						eventInfos["VisHash"] = filename;
						
						StoreTracking("CreateFinished",eventInfos);

						
						
						response.writeHead(200, {"Content-Type": "application/json"});
						response.write(data["ReturnFunc"]+'(\''+LookupFolderFromOutside +filename + ".gexf"+'\')' );
						response.end();
						return;
					});
				}
			
			});
		
		/////////////////CHECK URI
		
		}else if (data["command"] == "checkURI" &&  ("ReturnFunc" in data) && ("User" in data) && data["User"]!="" ){


			if(! ("URItoCheck" in data)|| ! ("ReturnFunc" in data)){
				response.writeHead(400, {"Content-Type": "text/plain"});  
				response.write("Must Supply URItoCheck Parameter!" );  
				response.end();	
			}
			var searchString = data["URItoCheck"];
			var URItoCheck = NormalizeURL(data["URItoCheck"]);
			toConsole(URItoCheck);
			//Data has to be Encoded because Data in the Source is Encoded!
			var query = "ASK { <"+encodeURI(URItoCheck)+"> ?p ?o .<"+encodeURI(URItoCheck)+"> ?p ?o2 . FILTER(?o != ?o2) } LIMIT 1";
			//LOOKI LOOKI Machen http://www.w3.org/TR/2013/REC-sparql11-results-json-20130321/
			if(SPARQLDebug){
				console.log(query);
			}
			TheEarl = url.parse(TDBStoreFolders["en"]+"?query="+encodeURI(query));
			var headers ={
				"accept":"application/sparql-results+json"
			} 
			var options = {
				hostname:TheEarl.hostname,
				port: TheEarl.port,
				path: TheEarl.path,
				headers: headers,
				method: 'GET'
			};
			var out = "";
			var dataObj;
			req = http.get(options, function( res) {
				res.setEncoding('utf8');
				res.on('data', function(chunk){
					out = out+chunk;
				});
				res.on('end', function(){
					var cbvalue;
					try{
						dataObj =  JSON.parse(out);
						cbvalue = dataObj.boolean;
					}catch(e){
						var eventInfos ={};
						eventInfos["Timestamp"] = new Date().getTime();
						eventInfos["User"] = data["User"];
						eventInfos["Search"] = searchString;
						eventInfos["URI"] = "";
						eventInfos["Success"] = 0;		
						StoreTracking("CheckURI",eventInfos);

						response.writeHead(400, {"Content-Type": "application/json"});  
						response.write(data["ReturnFunc"]+'(\'Error\')' );
						response.end();	
					}
					
					//Thing Exists
					if(cbvalue){
						//Timestamp, User, Search, URI, Success
						var eventInfos ={};
						eventInfos["Timestamp"] = new Date().getTime();
						eventInfos["User"] = data["User"];
						eventInfos["Search"] = searchString;
						eventInfos["URI"] = URItoCheck;
						eventInfos["Success"] = 1;		
						StoreTracking("CheckURI",eventInfos);

						response.writeHead(200, {"Content-Type": "text/plain"});  
						response.write(data["ReturnFunc"]+'(\''+encodeURI(specialEscape(URItoCheck))+'\')' );
						response.end();	
					}else{
					//Thing does not Exist
						//TODO Richtig machen!
						var query = "SELECT ?o WHERE { <"+encodeURI(URItoCheck)+"> <http://dbpedia.org/ontology/wikiPageRedirects> ?o .} LIMIT 1";
						if(SPARQLDebug){
							console.log(query);
						}
						TheEarl = url.parse(URIRedirect+"?query="+encodeURI(query));
						var headers ={
							"accept":"application/sparql-results+json"
						};
						var options = {
							hostname:TheEarl.hostname,
							port: TheEarl.port,
							path: TheEarl.path,
							headers: headers,
							method: 'GET'
						};
						var out1 ="";
						http.get(options, function( res) {
							res.setEncoding('utf8');
							res.on('data', function(chunk){
								out1 = out1+chunk;
							});
							res.on('end', function(){
								toConsole(out1);
								var dataObj2;
								try{
									dataObj2 =  JSON.parse(out1);
								}catch(e){
									var eventInfos ={};
									eventInfos["Timestamp"] = new Date().getTime();
									eventInfos["User"] = data["User"];
									eventInfos["Search"] = searchString;
									eventInfos["URI"] = "";
									eventInfos["Success"] = 0;		
									StoreTracking("CheckURI",eventInfos);
									response.writeHead(400, {"Content-Type": "application/json"});  
									response.write(data["ReturnFunc"]+'(\'Error\')' );
									response.end();	
								}
								if(dataObj2 === undefined|| dataObj2.results === undefined || dataObj2.results.bindings.length ==0 || dataObj2.results.bindings[0]["o"] === undefined){
									var eventInfos ={};
									eventInfos["Timestamp"] = new Date().getTime();
									eventInfos["User"] = data["User"];
									eventInfos["Search"] = searchString;
									eventInfos["URI"] = "";
									eventInfos["Success"] = 0;		
									StoreTracking("CheckURI",eventInfos);

									
									response.writeHead(200, {"Content-Type": "text/plain"});  
									response.writeHead(200, {"Content-Type": "application/json"});  
									response.write(data["ReturnFunc"]+'(\''+"Not Found"+'\')' );
									response.end();	
								
								}else{

									cbvalue = dataObj2.results.bindings[0]["o"].value;
									var eventInfos ={};
									eventInfos["Timestamp"] = new Date().getTime();
									eventInfos["User"] = data["User"];
									eventInfos["Search"] = searchString;
									eventInfos["URI"] = cbvalue;
									eventInfos["Success"] = 1;		
									StoreTracking("CheckURI",eventInfos);

									response.writeHead(200, {"Content-Type": "application/json"});  
									response.write(data["ReturnFunc"]+'(\''+encodeURI(specialEscape(cbvalue))+'\')' );
									response.end();
								}	
							});
						/*
						response.writeHead(400, {"Content-Type": "text/plain"});  
						response.write("Not Found" );  
						response.end();	
						*/	
					});
					
				}

			});
			});
			req.on('error', function(e) {
				console.log('problem with request: ' + e.message);
			});
			req.end();
  			

			return;
			
		/////////////////OPEN VISUALISATION Tracking
		}else if (data["command"] == "OpenVisualisation" && data["User"]!="" && data["VisHash"]!=""&& data["SharingUser"]!="" ){
				//Timestamp, VisHash, User, SharingUser 

					var eventInfos ={};
					eventInfos["Timestamp"] = new Date().getTime();
					eventInfos["User"] = data["User"];
					eventInfos["VisHash"] = data["VisHash"];
					eventInfos["SharingUser"] = data["SharingUser"];
					StoreTracking("OpenVisualisation",eventInfos);
					response.writeHead(200, {"Content-Type": "application/json"});  
            		response.write("" );  
            		response.end();		
		/////////////////Filter VISUALISATION Tracking
		}else if (data["command"] == "FilterFacett" && data["User"]!="" && data["VisHash"]!=""&& data["FilterString"]!=""&& data["FilterOptions"]!=""){
				//Timestamp, Vishash,User, URI, FocusOpen

					var eventInfos ={};
					eventInfos["Timestamp"] = new Date().getTime();
					eventInfos["User"] = data["User"];
					eventInfos["VisHash"] = data["VisHash"];
					eventInfos["FilterString"] = data["FilterString"];
					eventInfos["FilterOptions"] = data["FilterOptions"];
					StoreTracking("FilterFacett",eventInfos);
					response.writeHead(200, {"Content-Type": "application/json"});  
            		response.write("" );  
            		response.end();		




		
		/////////////////DIRTY REST ERROR
		
		}else if (data["command"] == "ClickVisualisation" && data["User"]!="" && data["VisHash"]!=""&& data["URI"]!=""&& data["FocusOpen"]!="" ){
				//Timestamp, Vishash,User, URI, FocusOpen

					var eventInfos ={};
					eventInfos["Timestamp"] = new Date().getTime();
					eventInfos["User"] = data["User"];
					eventInfos["VisHash"] = data["VisHash"];
					eventInfos["URI"] = data["URI"];
					eventInfos["FocusOpen"] = data["FocusOpen"];
					StoreTracking("ClickVisualisation",eventInfos);
					response.writeHead(200, {"Content-Type": "application/json"});  
            		response.write("" );  
            		response.end();		




		
		/////////////////DIRTY REST ERROR
		
		}else {
			response.writeHead(400, {"Content-Type": "text/plain"});  
            		response.write("Unknown Command: "+ data["command"] );  
            		response.end();		
			return;
		}

	}else{
	
		response.writeHead(400, {"Content-Type": "text/plain"});  
            	response.write("No Get ... forGET it!" );  
            	response.end();		
		return;
	}


	//Reply Link to Output to Java Prog


//Port Etc
}).listen(ServerPort);



/**
**@param data Result of NormalizeInput
**@param filename  result of FilenamefromParams
**@output NONE!
**/
function writeStuff(data,filename){


	
	toConsole("TryWriting to :" + inputFolder+filename+".txt");
	
	fs.open(inputFolder+filename+".txt", 'a', 0666, function( e, id ) {
		for(var single in data) {
				
				toConsole("writing: "+data[single]+"\n");
				fs.write(id, encodeURI(data[single]) +"\n",null, 'utf8', function (err) {
					
			});
			
		}
		fs.close(id, function(){
			
		toConsole('file closed');
		});
	});
	
}

//
/**
** This Creates the Filename Hash
**@param array Array Result of NormalizeInput
**@param lang Language Short of Links Version
**@param dataVersion This is the DBPedia Version Used LIKE "DBPedia3.9"
**@return String that contains a Hashcode which is made up of the Combinations of Subhashes of the Input
**/
function FilenamefromParams(array,lang,dataVersion){

	array.sort();
	var concatHash =dataVersion+lang;

	for(var tempes in array){
		concatHash=concatHash+ HashString(array[tempes]);
	}
	return HashString(concatHash);

}


//This Function parses the given parameters and cleans them and Writes them to an Array that is returned
function NormalizeInput(data){

	out = new Array();
	for(var index in data) {
		if(index.lastIndexOf("uri", 0) === 0){
			var toUnterstand = decodeURI(data[index]).trim();
			//patterns to remove at Front
			for( i in prefixPatterns){
				var startpattern = prefixPatterns[i];
				if(debugOutput)
					toConsole("cropping prefix" +startpattern);
					
				if(toUnterstand.indexOf(startpattern) == 0){
					if(debugOutput)
						toConsole("cropping prefix" +startpattern+" From "+ toUnterstand);
					toUnterstand = toUnterstand.substr(startpattern.length,(toUnterstand.length- startpattern.length) );
					if(debugOutput)
						toConsole("cropping result" + toUnterstand);

				}
			}
			//Remove Whitespace for Lucky guess
			toUnterstand=toUnterstand.replace(/\s/g,"_");
			
			out.push(toUnterstand);
		}
	}

	return out;
}
//This Function parses the given parameters and cleans them and Writes them to an Array that is returned
function NormalizeURL(thing){


	var toUnterstand = decodeURI(thing).trim();
	//patterns to remove at Front
	for( i in prefixPatterns){
		var startpattern = prefixPatterns[i];
		if(debugOutput)
			toConsole("cropping prefix" +startpattern);
			
		if(toUnterstand.indexOf(startpattern) == 0){
			if(debugOutput)
				toConsole("cropping prefix" +startpattern+" From "+ toUnterstand);
			toUnterstand = ucFirst((toUnterstand.substr(startpattern.length,(toUnterstand.length- startpattern.length) )));
			if(debugOutput)
				toConsole("cropping result" + toUnterstand);
		}
	}
	//Remove Whitespace for Lucky guess
	toUnterstand=toUnterstand.replace(/\s/g,"_");
	var out = StandardPrefix+ toUnterstand

	return out;
}
function HashString(string ){
	
	
	var Hash = crypto.createHash('md5').update(string).digest("hex");
	if(debugOutput)
		toConsole(string +" -> "+ Hash);
	return Hash;
}


function toConsole(string){

	if(verbose)
		console.log(string);
	
	
}

// just upper case for the First leave the rest
function ucFirst(string) {
	
	return string.substring(0, 1).toUpperCase() + string.substring(1);

}

function specialEscape(string){
	return escape(string);
}


////////////////////////////TRACKING

/**
** **** Tracking Vars
** Timestamp -> Unix Timestamp
** URI -> Wikipedia URI
** User -> Hash of User same as in Cookie
** VisHash -> Has Of A Visualisation
** UserWhoIsSharing ->  see User a User Hash
** Search -> Sting
** Succsess -> Boolean if a Lookup was Successfull
** New -> Boolean if a Visualisation is New or Not If its just a Redo it is simple
** **** Tracking Events
** Create
Timestamp,Vishash , URI1,URI2,URI3,URI4,URI5, User, New
** CreateFinished
Timestamp, Vishash
** OpenVisualisation
Timestamp, VisHash, User, UserwhoisSharing 
** CheckURI Parameters of the Cecking of an URI
Timestamp, User, Search, URI, Success
** AllowVis User has Entered Hash and is Allowed to Use the VisService  (Optional)
Timestamp, User
**/

function StoreTracking(event,DataArray){
	mysqlTracker(event,DataArray);
	JsonTracker(event, DataArray);
}
//Json Tracker puts JSON Objects to Console
function JsonTracker(event, DataArray){
	
	j = {"event":event,
		"data":DataArray
		};
	console.log(JSON.stringify(j));
}

function mysqlTracker(event, DataArray){	
	pool.getConnection(function(err, connection){
		var insertdata=  mysqlSerializeEvent(DataArray, connection);
		var query = 'INSERT INTO `'+event+'` '+insertdata+";";
		if(TrackerDebug){
			console.log(query);
		}
		connection.query(query, function(err, rows, fields) {

		  if (err){ 
			console.log("ERROR:");
			console.log(err);
		  throw err};
		});
		
		
		connection.release();

	});
}

function mysqlSerializeEvent(DataArray,connection){
	var out;
	var Fields="";
	var Vals="";
	for (key in DataArray) {
		if(Fields!="")
			Fields+= ", `"+key+"`";
		else
			Fields="`"+key+"`";
		
		if(Vals !="")
			Vals+= ', '+connection.escape(DataArray[key]);
		else
			Vals=  connection.escape(DataArray[key]);
	}	
	
	out=" ("+Fields+") VALUES ("+Vals+") ";
	return out;

}
