var coverageVariable = null,
    testNum = 0,
    fs = require("fs"),
    actualMap,
    covV,
    keyList,
    path,
    pathToCurrentDir,
    indexOf_second_underscore,
    testname_Map = {},
    mkdirp = require('mkdirp'),
    first = true,
    results,
    getDirName = require('path').dirname;



function globals() { return this; }
function varsList() {
  return Object.getOwnPropertyNames(globals());
}



beforeEach(function(){
   
   if (coverageVariable == null) {
            var vars = varsList(),
                regex = new RegExp(/^\$\$cov_.*\$\$$/);
            for (var vn in vars) {
                if (regex.test(vars[vn])) {
                        coverageVariable = vars[vn];
                        break;
                }
            }
    }
    if (coverageVariable != null) {
	if(first){
		results = "result;id\n";
		covV = global[coverageVariable];
		keyList = Object.keys(covV);
        	path  = keyList[0];
		pathToCurrentDir = path.substring(0,path.lastIndexOf("/"));

        	indexOf_second_underscore = path.indexOf("_", path.indexOf("_") + 1);
		pathToCurrentDir = path.substring(0, path.indexOf("/",path.indexOf("/", indexOf_second_underscore)+1));
        	path = path.substring(0, indexOf_second_underscore) + "_data";
		
		mkdirp(getDirName(path + "/tests/json/init.json"), function (err) {
                	if (err) console.error(err);
                	try{
                        	fs.writeFileSync(path + "/tests/json/init.json", JSON.stringify(covV));
                	} catch(error){
                	        console.error(error);
        	        }
	        });
		first = false;
	}
    }

});



afterEach(function(){
    let test_Fulltitle = this.currentTest.fullTitle();
    
       
    if (coverageVariable == null) {
	    var vars = varsList(),
		regex = new RegExp(/^\$\$cov_.*\$\$$/);
	    for (var vn in vars) {
    		if (regex.test(vars[vn])) {
	    		coverageVariable = vars[vn];
	    		break;
    		}
	    }
    }
    if (coverageVariable != null) {
		
        let actualCoverage = "{",
	    s = " ",
	    b = " ",
	    f = " ";

	keyList.forEach(function(entry){

		let covVar =  covV["" + entry + ""];

		f = JSON.stringify(covVar.f);
		
		actualCoverage += "\"" + entry + "\"";
		actualCoverage += " : {"
		actualCoverage += "\"s\" : " + "{}" + ",";
		actualCoverage += "\"b\" : " + "{}" + ",";
		actualCoverage += "\"f\" : " + f + ",";
		actualCoverage += "\"fnMap\" : " + JSON.stringify(covV["" + entry + ""].fnMap) + ",";
                actualCoverage += "\"statementMap\" : " + "{}" + ",";
                actualCoverage += "\"branchMap\" : " + "{}";
		actualCoverage += "},";	
	});
        actualCoverage = actualCoverage.substring(0, actualCoverage.length-1);
        actualCoverage += "}";
	
	testNum++;
	results += this.currentTest.state +";test_" + testNum +"\n";
	mkdirp(getDirName(path + "/tests/json/test_" + testNum + ".json"), function (err) {
              if (err) console.error(err);
     	      try{
            	fs.writeFileSync(pathToCurrentDir + "/coverage/test_"+ testNum + ".json", actualCoverage);
              } catch(err){
       		console.error(err);
		
   	     }
	});

	
	testname_Map["test_" + testNum + ""] = test_Fulltitle;


	console.log('\x1b[40m%s\x1b[0m', test_Fulltitle )
	console.log(this.currentTest.state === "passed" ? '\x1b[42m\x1b[30m\x1b[4m\x1b[5m\x1b[1m%s\x1b[0m' +"Pass": '\x1b[41m\x1b[30m\x1b[4m\x1b[5m\x1b[1m%s\x1b[0m' + "Fail");
	
	keyList.forEach(function(entry){
         let covVar =  covV["" + entry + ""];


	 for (let key in covVar.f)
                   if (covVar.f.hasOwnProperty(key))
                        covV["" + entry + ""].f[key] = 0;
	});  
	

	
    }


});


after(function() {

	actualMap = "{";
        keyList.forEach(function(entry){
                actualMap += "\"" + entry + "\"";
                actualMap += " : {"
                actualMap += "\"fnMap\" : " + JSON.stringify(covV["" + entry + ""].fnMap) + ",";
                actualMap += "\"statementMap\" : " + "{}" + ",";
                actualMap += "\"branchMap\" : " + "{}";
                actualMap += "},";
        });
        actualMap = actualMap.substring(0, actualMap.length-1);
        actualMap += "}";


	try {
		fs.writeFileSync(path + "/tests/json/maps.json", actualMap);
		fs.writeFileSync(pathToCurrentDir + "/testMap.csv", JSON.stringify(testname_Map));
		console.log(pathToCurrentDir + "/results.txt");
		fs.writeFileSync(pathToCurrentDir + "/perTest_results.txt", results);

        } catch(err) {
                console.error(err);
        }
});

