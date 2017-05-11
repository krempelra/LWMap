
//EXAMPLE FOR JSON SETTING FILE
// The Slashes mean its a Comment! 
//This is an example textfile WONT WORK When used with Comments!
{ 

"verbose": true, 
//Create a lot of Output

"ServerPort": "8080", 
//Port where this server should be running on

"HostnametoListenTo": "MY_HOST_NAME_OR_IP", 
//The Host Name of the Server

"Javaprefix": "java -jar -Xmx4g", 
//The Prefix For the Java Executable. If you want to use a Speacial java or Change parameters

"LocationJar": "/LOCATION_IN_LOCAL_FILESYSTEM/SOURCE_PATH/Java_exec/contextviztest2.jar", 
//The Full Location of the Backend Jar
"TDBStoreFolders":{ 
	"en":"/LOCATION_IN_LOCAL_FILESYSTEM/dbpediaENPageLinks", 
	"de":"/LOCATION_IN_LOCAL_FILESYSTEM/dbpediaDEPageLinks"
},
//Where The TDBStores are The Language Code shows which Language they are good to Query for

"TDBStorePrefix":{ 
	"en":"http://dbpedia.org/resource/", 
	"de":"http://dbpedia.org/resource/"
},
//The Prefix The Stores Usualy Use for Their Identifiers

"inputFolder": "/LOCATION_IN_LOCAL_FILESYSTEM/txt/", 
//The Folder where the Text Files are that get Created as Instructions for the Process (Collection of requested Page Links with Hash)
"outputFolder": "/LOCATION_IN_LOCAL_FILESYSTEM/PUBLIC_FILE_FOLDER/", 
//The Internal Location of the Files (mount it please?)

"LookupFolderFromOutside": "http://_THE_LOCATION_OF_THE_FILES/PUBLIC_FILE_FOLDER/"
//The Location where The Data Can be Accessed on the Web
}

//This Configures the User Tracking Connection just mysql is Availible Name User Password Database and Host!
"UserTracking" : {

"type":"mysql",
"Username":"Tracking",
"Password":"XXXXXX",
"host":"hostAdress",
"database":"Tracking",



}


// DONT FORGET TO CHANGE THE LOCATION OF THE SETTINGS FIE IN THE NODEJS EXECUTION SCRTIPT!
