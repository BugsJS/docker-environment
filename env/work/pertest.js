#!/usr/bin/env node

'use strict'

const process = require ('process');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require( 'child_process' );
const child_process = require('child_process');

function escapeRegex(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

function escapeTestName(str) {
  return (str+'').replace(/['" /\\`]/g, "_");// :[]+?${},.
};

function help() {
  console.log ("Use: pertest.js [-h|--help] [-t|--tests tests.json] [-r|--results results.csv] [-m|--mapfile testMap.csv] [-c|--cmd command]\n");
}

function main () {
  var resultsFile = "results.csv";
  var testsFile = "tests.json";
  var mapFile = "testMap.csv";
  var cmd = "";
  for (let j = 2; j < process.argv.length; j++) {
    if (process.argv[j][0] == "-") {
      switch (process.argv[j]) {
        case '-c':
        case '--cmd':
          cmd = process.argv[j+1];
          j++;
          break;
        case '-m':
        case '--mapfile':
          mapFile = process.argv[j+1];
          j++;
          break;
        case '-r':
        case '--results':
          resultsFile = process.argv[j+1];
          j++;
          break;
        case '-t':
        case '--tests':
          testsFile = process.argv[j+1];
          j++;
          break;
        case '-h':
        case '--help':
        default:
          help();
          return 0;
      }
    } else {

    }
  }

  var tests = JSON.parse(fs.readFileSync(testsFile, 'utf8'));

  var i = 1;
  var testMap = {};
  var results = {};
  tests.forEach(function(test){
    var mapName = "test_"+i.toString();
    i++;
    testMap[mapName] = test;
    console.log(mapName+"="+test);
    var output = "";
    try {
      output = child_process.execSync(cmd + " -g '^"+escapeRegex(test).replace(/'/g, "'\"'\"'")+"$'", {stdio:['ignore', 'pipe', 'ignore']}).toString();
      results[mapName] = 1;
    } catch (ex) {
      output = ex.stdout.toString();
      results[mapName] = 0;
    }
    var ind = output.indexOf("=========");
    if (ind != -1) {
      output = output.slice(0, ind);
    }
    var result = JSON.parse(output);
    console.log(result.tests.length.toString()+" test(s) run: "+(results[mapName]?"Pass":"Fail"));
    fs.copySync(path.resolve(process.cwd(),'./coverage/coverage.json'), path.resolve(process.cwd(),'./coverage/'+mapName+'.json'));
  });

  var res = "result;id\n";
  for(var test in results) {
    res += (results[test] ? "Pass" : "Fail") + ";" + test + '\n';
  }
  fs.writeFileSync(resultsFile, res);

  var mapres = "id@@@test_name\n";
  for(var test in testMap) {
    mapres += test + "@@@" + testMap[test] + '\n';
  }
  fs.writeFileSync(mapFile, mapres);

  console.log("Done.");

  return 0;
}

if (require.main === module) {
  try {
    process.exit (main());
  }
  catch (e) {
    console.error ("Fatal Error (try --help for help):");
    console.error (e);
    process.exit (-1);
  }
}
