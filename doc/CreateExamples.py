#!/usr/bin/python

import sys
import os
import json
import urllib
def main():
	
	if len(sys.argv) < 2:
		print "Please Insert 2 Variables"
		print "1. The location of the Settings File"
		print "2. The location of the Examples file"
		

	SettingsFile = sys.argv[1]
	ExampleFile = sys.argv[2]
	


	json_settings=open(SettingsFile)

	settings=json.load(json_settings)

	


	json_examples=open(ExampleFile)

	examples=json.load(json_examples)

	for lang ,endpoint in settings["TDBStoreFolders"].items():
		for example in examples["examples"]:
			f= open(settings["inputFolder"]+example["id"]+"_"+lang+".txt","w")
			
			for link in example["Links"]:
				templikend= link.split('/')[-1]
				f.write(templikend+"\n")		
			
			f.close()

			Exec(settings["LocationJar"] , settings["inputFolder"]+example["id"]+"_"+lang+".txt",endpoint,settings["outputFolder"]+example["id"]+"_"+lang)
		

def Exec(ExcecFile ,Inputfile , endpoint ,outputFile,):
	execcommand= "java -jar " + ExcecFile +" " +Inputfile+" "+endpoint+" "+ outputFile +"  http://dbpedia.org/resource/"  ;
	if os.path.isfile(outputFile +".gexf"):
		print "File Allready exists "+outputFile
	else:
		print execcommand
		os.system(execcommand)
		
main()