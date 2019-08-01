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

  try {
     console.log(child_process.execSync(cmd + " /work/hook.js", {stdio:['pipe', 'pipe', 'pipe']}).toString());    
  } catch (ex) {
     console.log('\x1b[41m%s\x1b[0m', ex.stderr.toString());    
  }

  console.log('\x1b[42m\x1b[30m\x1b[4m\x1b[5m\x1b[1m%s\x1b[0m',"Done.");

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



