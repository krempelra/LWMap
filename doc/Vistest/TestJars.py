#!/usr/bin/python

import sys
import os
import json
def main():
	PathofJars = sys.argv[1]
	InputDir = sys.argv[2]
	outputDir = sys.argv[3]
	
	print PathofJars
	print InputDir
	print outputDir
	
	#The Executables that should be testet.
	JarsToTest=[]
	#Files for the Sources
	FilesToProcess = []
	
	
	for filename in os.listdir(PathofJars):
			JarsToTest.append(filename);
	

	JarsToTest = sorted(JarsToTest)	

	for filename in os.listdir(InputDir):
		if filename.find("report_") < 0:		
			FilesToProcess.append(filename);
	
	FilesToProcess = sorted(FilesToProcess)
	for jar in JarsToTest:
		directory = outputDir+"/"+jar+"/"
		#CreateFolder For TestJars  
		if not os.path.exists(directory):
    			os.makedirs(directory)

		for filename in FilesToProcess:
			Exec(PathofJars+"/"+jar, directory+"/"+filename, InputDir+"/"+filename)
		
		#Create Executable Command
	
	
	ListOfVizz = []
	
	SimpleHTML = "<html><body><h1>Visualisation Tests</h1>";


	for filename in FilesToProcess:
		Stuff = {'name': filename,'versions': [] }
		SimpleHTML += "<h3>"+filename+"</h3>\n"
		with open(InputDir+"/"+filename) as f:
			for line in f:
				SimpleHTML+="<a href='"+f+"'>"+f+"</a></br>";
		
		for jar in JarsToTest:
			Stuff["versions"].append(outputDir+"/"+jar+"/"+filename)
			SimpleHTML += "<a href='display.html?existingFile="+outputDir+"/"+jar+"/"+filename+".gexf"+"' target='_blank'>"+jar+"</a><br> \n"
		ListOfVizz.append(Stuff)
	SimpleHTML += "<BR></body></html>";

	f= open("index.html","w")
	f.write(SimpleHTML);
	f.close();
	#json.dumps(ListOfVizz, outputDir+"/meta.json")		
	
	
def Exec(ExcecFile ,outputFile,Inputfile):
	if os.path.isfile(outputFile +".gexf"):
		print "File Allready exists "+outputFile
	else:
		os.system("java -jar " + ExcecFile +" " +Inputfile+" http://localhost:3030/en/query "+ outputFile +"  http://dbpedia.org/resource/"  )
		
main()
