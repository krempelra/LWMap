
  ////////////////////////////////SigmaJS and File Loading Logic
  var ClassesArray= {};
  var SigmaInstance = undefined;
  //TheFiltering Arguments
  var Filter = { filters:[],exclusive:false,highlight:false};
  //Filter.filters =new Array();
  var SourceNodes = [];

//Filters -> Argumente die Filtern ->Key Value

//exclusive -> Inclusiver oder Exclusiver Filter


//is filter Therefor Hides Selected ( Mute) 
//True Acts like mute button
//false Acts like (Solo) Button


  function createViewMini(loadfile){
  
  //Defined on Global Scale

	//ViewportScanling
	
	var Viewporth= $("#container").height();
	
	var Viewportw=$("#container").width();
	var size=0;
	//Smallest width
	if (Viewporth < Viewportw){
	
		size= Viewporth; 
	
	}
	else{
		size= Viewportw;
	}
	
	
	factor=size/800;
	
	var set={
            defaultLabelColor: '#000',
	    defaultLabelSize: 14,
	    defaultLabelBGColor: '#000',
      defaultLabelHoverColor: '#000',
      labelSize:'proportional',
      labelSizeRatio:1.4,
      font:"helvetica",
      hoverFontStyle:'bold',
      labelThreshold: 9*factor,
      zoomingRatio:2.0,
      minNodeSize: 5*factor,
      maxNodeSize: 16*factor,
      minEdgeSize: 0.5*factor,
      maxEdgeSize: 1.0*factor,
      maxRatio: 32
    };
    contextMenus =1;
	openVis(loadfile,set,contextMenus);
}
  
  function createView(loadfile) {
	//ViewportScanling
	
	var Viewporth= $(window).height();
	
	var Viewportw=$(window).width();
	var size=0;
	//Smallest width
	if (Viewporth < Viewportw){
	
		size= Viewporth; 
	
	}
	else{
		size= Viewportw;
	}
	
	
	factor=size/800;
	
	var set={
      defaultLabelColor: '#000',
	  defaultLabelSize: 14,
	  defaultLabelBGColor: '#000',
      defaultLabelHoverColor: '#000',
      labelSize:'proportional',
      labelSizeRatio:1.4,
      font:"helvetica",
      hoverFontStyle:'bold',
      labelThreshold: 9*factor,
      zoomingRatio:2.0,
      minNodeSize: 3*factor,
      maxNodeSize: 13*factor,
      minEdgeSize: 0.5*factor,
      maxEdgeSize: 1.0*factor,
      maxRatio: 32
    };
    //Defined on Global Scale

	openVis(loadfile,set,2);
	
	}
  
  
  
  function openVis(loadfile,set,contextMenus){
  	var cont = $("#container").get(0);
	
     sigma.parsers.gexf(loadfile
     	, {
    container: "container",
    renderers:[{container: cont,type:"canvas"}],
    settings: set
  },
    function(s) {

      SigmaInstance =s;
      //Index Attributes
	function createFacette(NodeAttr,distinct,complete){
	
	ClassesArray[NodeAttr] = {};
	ClassesArray[NodeAttr]["__distinct"] = distinct;
	ClassesArray[NodeAttr]["__complete"] = complete;
	if(!complete){
		ClassesArray[NodeAttr+"--known"]={};
		ClassesArray[NodeAttr+"--known"]["__distinct"]=true;
		ClassesArray[NodeAttr+"--known"]["__complete"]=true;
	}
	s.graph.nodes().forEach(function(n) {


	if(n.attributes[NodeAttr] !== undefined && n.attributes[NodeAttr] !== ""){
		
		if(!distinct){
			var Classes = n.attributes[NodeAttr].split(",");
	
			Classes.forEach(function(attribute) {

				if(ClassesArray[NodeAttr][attribute]== undefined)
					ClassesArray[NodeAttr][attribute]=1;
				else
					ClassesArray[NodeAttr][attribute]=ClassesArray[NodeAttr][attribute]+1;
			});
		
		}else{
			//Class to String
			var Class = n.attributes[NodeAttr]+"";

			if(ClassesArray[NodeAttr][Class]== undefined)
				ClassesArray[NodeAttr][Class]=1;
			else
				ClassesArray[NodeAttr][Class]=ClassesArray[NodeAttr][Class]+1;
		
		
		}
		
		if(!complete){

			if( ClassesArray[NodeAttr+"--known"]["known"] == undefined){
				ClassesArray[NodeAttr+"--known"]["known"] = 1;
				
			}else{
				ClassesArray[NodeAttr+"--known"]["known"]=ClassesArray[NodeAttr+"--known"]["known"]+1;
			}
		}
	}else{
		if(!complete){

		
			if(ClassesArray[NodeAttr+"--known"]["unknown"] == undefined)
				ClassesArray[NodeAttr+"--known"]["unknown"] = 1;
			else
				ClassesArray[NodeAttr+"--known"]["unknown"] =ClassesArray[NodeAttr+"--known"]["unknown"]+1;
			}
		}
	});
	
	
	}

	if(contextMenus >0 ){
		drawFilterMenu();
		createFacette("hiddencontext",true,true);
		createFilterView("hiddencontext");
	}
	if(contextMenus >1){
		createFacette("classes",false,false);
	
		createFilterView("classes--known");
		createFilterView("classes");
	}
  	SigmaGraph_Filter(Filter);
    ActivateFilterMenus();
    //QUICK AND DIRTY
    //Back and Remix Button
    if( $("#BackToMainWithRemix").length > 0){
    Stringtoappend ="?";
    AllNodes = s.graph.nodes();
    for (var i = 0 ; i < AllNodes.length; i++) {
    	if(AllNodes[i].attributes["iscontext"] ==0){

    		if(i<AllNodes.length-1)
    			Stringtoappend =Stringtoappend +i+"=" +AllNodes[i].label+"&";
    		else
    			Stringtoappend =Stringtoappend +i+"=" +AllNodes[i].label;

    	}
    };

    $("#BackToMainWithRemix").attr('href', $("#BackToMainWithRemix").attr('href')+Stringtoappend);
	}

      
      s.bind('clickNode', function(e) {
      
        var nodeId = e.data.node.id,
            toKeep = s.graph.neighbors(nodeId);
	    
	if(s.centerSelect == nodeId){
		NotifyClick(e.data.node['label'],1);
		openNodeURL(e.data.node);
	}else{
		normalizeAll();
		NotifyClick(e.data.node['label'],0);
		s.centerSelect =nodeId;
	}
   toKeep[nodeId] = e.data.node;
	//s.renderers[0].settings =s.renderers[0].settings.embedObjects({labelThreshold:1,labelSizeRatio:2});

	s.graph.nodes().forEach(function(n) {
		if (toKeep[n.id]){
			n.hidden =false;
			n.highlight=true;
			
		}
		else{
			n.hidden =true;
			n.highlight=false;
		}
 
   });

   s.graph.edges().forEach(function(e) {
   	if (toKeep[e.source] && toKeep[e.target])
   		e.hidden = false;
   	else
   		e.hidden= true;
      });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s.refresh();
      });

      // When the stage is clicked, we just color each
      // node and edge with its original color.
      s.bind('clickStage',function(e){normalizeAll();});
      
      
      
     //});
      
     function normalizeAll() {
      if(s.centerSelect == undefined)
          return;
      s.centerSelect = undefined;
        s.graph.nodes().forEach(function(n) {
          n.hidden = false;
          n.highlight =false;
        });
	//s.renderers[0].settings =s.renderers[0].settings.embedObjects({labelThreshold:s.NormallabelThreshold,labelSizeRatio:s.NormallabelSizeRatio});
        s.graph.edges().forEach(function(e) {
          e.hidden = false;
          e.highlight=false;
        });
	if(Filter != undefined || Filter.filters.length > 0)
		SigmaGraph_Filter(Filter);
        // Same as in the previous event:
        s.refresh();
      }      

    });
    
    }

  



    function openNodeURL(node) {

      //Insert Here What Attribute Actually contains the URL!
      var url = "https://en.wikipedia.org/wiki/" + node['label'];
      
      window.open(url, "Info");
      self.focus();

    }


    function SigmaGraph_Filter(FilterObject){
      s= SigmaInstance;
      
      
      //If There Aint Any Filters just Unhide everything.
      if(FilterObject.filters == undefined || FilterObject.filters.length ==0){
	s.graph.nodes().forEach(function(n) {
		n.hidden =false;
		n.highlight =false; 
	});
	
	s.refresh();
	return;
      }

      
      nodes = s.graph.nodes().forEach(function(n) {
		var state;
		if(FilterObject.exclusive){
			state = true;
		}else{
			state = false;
		}
		for(var j =0;j<FilterObject.filters.length; j++){
		        filt = FilterObject.filters[j];
      	  		var condition;
	        if( "known" == filt.value && filt.field.indexOf("--known")>0){
				var feld1 = filt.field.substr(0, filt.field.indexOf("--known"));
				 condition= n.attributes[feld1]!="";

		    }else if( "unknown" == filt.value  && filt.field.indexOf("--known")>0){
				var feld2 = filt.field.substr(0, filt.field.indexOf("--known"));
				 	condition= n.attributes[feld2]=="";
			}else if(filt.distinct ==false && filt.field.indexOf("--known") <0 ){
					condition= n.attributes[filt.field].indexOf( filt.value)>=0;

		  	}else if(filt.field.indexOf("--known") <0 ){
					condition= n.attributes[filt.field] == filt.value;
			}


		  if(condition ===false && FilterObject.exclusive === true ){
		  	state = false;
		  	break;
		  }
		  if(condition ===true && FilterObject.exclusive ===false ){
		  	state = true;
		  	break;
		  }


		  }

		if(state){
			if(FilterObject.highlight){
				n.highlight = true ;
				n.hidden = false ;
			}
			else{
			  	n.hidden = false ;
			  	n.highlight = false ;
			}
		}
		else{

			if(FilterObject.highlight){
				n.highlight = false ;
				n.hidden = false ;
			}
			else{
			  n.hidden = true ;
			  n.highlight = false ;
			}
		}

   });
       s.refresh();
    }

  sigma.classes.graph.addMethod('neighbors', function(nodeId) {
    var k,
        neighbors = {},
        index = this.allNeighborsIndex[nodeId] || {};

    for (k in index)
      neighbors[k] = this.nodesIndex[k];

    return neighbors;
  });