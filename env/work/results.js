#!/usr/bin/env node

'use strict'

const process = require ('process');
const fs = require('fs-extra');

function help() {
  console.log ("Use: results.js [-h|--help] [-t|--tests tests.json] [-r|--results results.csv]\n");
}

function main () {
  var resultsFile = "results.csv";
  var testsFile = "tests.json";
  for (let j = 2; j < process.argv.length; j++) {
    if (process.argv[j][0] == "-") {
      switch (process.argv[j]) {
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

  var res = "result;id\n";
  var tests = JSON.parse(fs.readFileSync(testsFile, 'utf8'));
  tests.tests.forEach(function(test){
    var err = Object.keys(test.err).length > 0;
    res += (err ? "Fail" : "Pass") + ";" + test.fullTitle + '\n';
  });
  fs.writeFileSync(resultsFile, res);
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
