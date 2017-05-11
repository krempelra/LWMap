

function showExistingFilter(){
	return;
	absatz = $("<div/>");
	for( entry in  Filter.filters){
		$("<p/>",{"text":Filter.filters[entry].field+":"+Filter.filters[entry].value}).appendTo(absatz);
	}
	container = $("#Facet_show");
	container.empty();
	absatz.appendTo(container);

}

function drawFilterMenu(){

	//Exclusive Radio
	
	facettOptions= $("#Facet_show");

	facettOptions.append("Exclusive Filtering");
	exclusive = $("<div/>",{"class":"input-group" });

	exclusiveon = $("<input/>",{  "type":"radio", "name":"exclusive", "value":"true","id":"FilterExclusiveOn", "onchange":"changeFilterMenu()" }).appendTo(exclusive);
	if(Filter.exclusive)
		exclusiveon.attr("checked",true);
	exclusive.append("on");
	exclusiveoff = $("<input/>",{"type":"radio",  "name":"exclusive", "value":"false","id":"FilterExclusiveOff", "onchange":"changeFilterMenu()" }).appendTo(exclusive);
	if(!Filter.exclusive)
		exclusiveoff.attr("checked",true);
	exclusive.append("off");

	exclusive.appendTo(facettOptions);

	facettOptions.append("just highlight no hiding");
	//Highlight Radio
	justHighlight = $("<div/>",{"class":"input-group" });
	justHighlightOn = $("<input/>",{ "type":"radio", "name":"justHighlight", "value":"true","id":"justHighlightOn", "onchange":"changeFilterMenu()" }).appendTo(justHighlight);
	justHighlight.append("on");
	if(Filter.justHighlight)
		justHighlightOn.attr("checked",true);
	justHighlightOff = $("<input/>",{"type":"radio",   "name":"justHighlight", "value":"false","id":"justHighlightOff", "onchange":"changeFilterMenu()" }).appendTo(justHighlight);
	justHighlight.append("off");
	if(!Filter.justHighlight)
		justHighlightOff.attr("checked",true);
	justHighlight.appendTo(facettOptions);
}

function changeFilterMenu(){

	if($("#FilterExclusiveOn").is(':checked')){
		Filter.exclusive =true;
	}else{
		Filter.exclusive =false;
	}
	if($("#justHighlightOn").is(':checked')){
		Filter.highlight =true;
	}else{
		Filter.highlight =false;
	}
	SigmaGraph_Filter(Filter);
	NotifyFilter();
	
	
	

}

function redofilter(){
	//Redo Filter Array
	newFilters= [];
	
	for (var i = Filter.filters.length - 1; i >= 0; i--) {
		if(Filter.filters[i] !== undefined)
			newFilters.push(Filter.filters[i]);
	
	}
	Filter.filters = newFilters;

}





/**
*
*
* @param distinct If This Flag isset the Faccet has Exclusive Values false Just Works for Stings then they are Contained Checked 
**/

function addFilter(Name,entry,distinct){
	var allreadythere =false;
	redofilter();	

	for (var i = Filter.filters.length - 1; i >= 0; i--) {
		if(Filter.filters[i].value == entry && Filter.filters[i].field == Name ){

			allreadythere =true;
			break;
		}
	}

	if(!allreadythere){
		var Filterparameter= {"value":entry,"field":Name,"distinct":distinct};
		Filter.filters[Filter.filters.length]=Filterparameter;
	}

	SigmaGraph_Filter(Filter);
	NotifyFilter();
}

function removeFilter(Name,entry){
	var toremove;
	redofilter();
	for (var i =0; i < Filter.filters.length; i++) {
		if(Filter.filters[i].value == entry && Filter.filters[i].field == Name){
			toremove=i;
			break;
		}
	}
	delete Filter.filters[i];
	redofilter();
	SigmaGraph_Filter(Filter);
	
	NotifyFilter();
}

function createAnnotatedCheckboxRow(checkbox, number,Name)
{
	var row= $("<tr/>");
	//var one= $("<div/>",{"class":"col-lg-6"});
	//var two= $("<td/>",{"class":"input-group"});
	//var span= $("<span/>",{"class":"input-group-addon"});
	var td1 = $("<td/>");
	checkbox.appendTo(td1);
	var td2 = $("<td/>");
	number.appendTo(td2);
	var td3 = $("<td/>");
	Name.appendTo(td3);
	
	td1.appendTo(row);
	td2.appendTo(row);
	td3.appendTo(row);
	
	//two.appendTo(one);
	
	//two.appendTo(row);
	return row;
	
}

//Creates One Filter view
function createFilterView( Name){

//Crate Wrapper


//AddElement
//The Rows in The Column

var Panel = $('<div/>',{"class":"panel panel-default"});
var PanelHEAD = $('<div/>',{"class":"panel-heading","text":Name});



var uncolapse=      $('<input/>', {
	"type":"button",
	'value':"+/-",
	'onclick': "$('#"+Name+"_tablecontainer').slideToggle('slow');"
	});
uncolapse.appendTo(PanelHEAD);
PanelHEAD.appendTo(Panel);
var collapsable = $('<div/>',{"id":Name+"_tablecontainer"});
var table =$('<table/>',{"class":"table table-striped"});

var thead=      $('<thead/>');
var headrow = $('<tr/>').appendTo(thead);

var head1=      $('<td/>',{"text":"Filter"}).appendTo(headrow);
var head2=      $('<td/>',{"text":"count"}).appendTo(headrow);
var head3=      $('<td/>',{"text":"value"}).appendTo(headrow);

thead.appendTo(table);
var tbody=      $('<tbody/>');
//var row = $('<tr/>').appendTo(table);
//var FieldActivate = $('<td/>', {"colspan":"3","text":Name}).appendTo(row);

for( entry in  ClassesArray[Name]){
	if(entry.indexOf("__") == 0)
		continue;
	if(ClassesArray[Name][entry]==1)
		continue;
	
//	var row = $('<tr/>').appendTo(table);

//	var FieldActivate = $('<td/>').appendTo(row);
	Modifiers = "";
	if(ClassesArray[Name]["__distinct"]==false)
		Modifiers = "Multi";
	else
		Modifiers = "Single";
	var Activator = $('<input/>', {
		"type":"Checkbox",
		"id": Name+"_"+entry+"_"+Modifiers+"_box",
		"class": "Checkbox_"+Name

	})

	
	Activator.change(function() {
		var params = $(this).attr("id").split("_");
		
		//params[0] = params[0].substr(0, params[0].indexOf("--known"));
		if(params[2]=="Multi")
			distinct = false;
		else
			distinct =true;
			
		if($(this).is(":checked")){

			addFilter(params[0],params[1],distinct);
			
		}else{

			removeFilter(params[0],params[1]);
		}
	}


	);

	var Field1 = $('<span/>',{
		"class":"badge",
		"text":ClassesArray[Name][entry]

		});
	
	tempentry = entry;
	if(entry.length > 30)
		tempentry = entry.substr(0,27)+"...";
	
	var Field2 = $('<span/>',{
		"text":tempentry

		});
	
	var row = createAnnotatedCheckboxRow(Activator,Field1,Field2);
	row.appendTo(tbody);
	

		
}
tbody.appendTo(table);
table.appendTo(collapsable);
collapsable.appendTo(Panel);
Panel.appendTo($("#FacetteDiv"));
//Row Checkbox Activate/Deactivate



//Row Count The Sum of the Options

//Row Class The Class or Value  

//AddHeadline

//AddElement
	
}


function importFilters(FilterOptions,FilterString){
	Filter = JSON.parse(decodeURIComponent(FilterOptions));
  	Filter.filters = JSON.parse(decodeURIComponent(FilterString));

	NotifyFilter();
}
function ActivateFilterMenus(){

	for (var i = 0; i < Filter.filters.length; i++) {
		

		if(Filter.filters[i].distinct)
			Modifiers = "Single";
		else
			Modifiers = "Multi";

		tocheckname = "#"+Filter.filters[i].field+"_"+Filter.filters[i].value+"_"+Modifiers+"_box";
		tocheck = $(tocheckname);
		tocheck.attr("checked","checked");
	};
}

function GetFilterString(){
	return encodeURIComponent(JSON.stringify(Filter.filters));


}
function GetFilterOptions(){

  	var tempo;
  	tempo = Filter.filters;
	delete Filter.filters;
	var FilterOptions = encodeURIComponent(JSON.stringify(Filter));
	Filter.filters = tempo;
	return FilterOptions;

}

  function NotifyFilter(){
  	var tempfilter = Filter;
	

  	var Filterstring = GetFilterString();
	var FilterOptions =GetFilterOptions();
	
	$.ajax({
		url: Setting_servername +'?' +'command=FilterFacett&User='+ExperimentID+"&VisHash="+ VisHash+"&FilterString="+Filterstring+"&FilterOptions="+FilterOptions,
		type: 'GET',
      dataType: "jsonp",
	  jsonpCallback: "_clickvis",
		//Loading
		success: function(data) {
	
		}
	});
  
	loadedExamples=true;
	
  }