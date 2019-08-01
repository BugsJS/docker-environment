#!/usr/bin/python

import argparse
import json
import csv
from array import *
from scipy.stats import rankdata

parser = argparse.ArgumentParser(description='Convert')
parser.add_argument('-i', '--input', help='Fl score JSON file')
parser.add_argument('-c', '--csv', help='BinaryDump file')
parser.add_argument('-o', '--output', help='Output csv')
parser.add_argument('-s', '--score',  help='What score. e.g.: tarantula')
args = parser.parse_args()


def main(inputfile, csvfile, outputfile, score):
   print ('Fl score JSON file is "', inputfile)
   print ('Output file is "', outputfile)
   print ('BinaryDump file is', csvfile)
   print ('Score is', score)
   #x = '{"full": {"0": {"ef": 0,"ep": 8,"nf": 1,"np": 12036,"ef/(ef+ep)": 0.0,"nf/(nf+np)": 0.00008307717869901138,"dstar": 0.0,"tarantula": 0.0,"ochiai": 0.0}}}'

   with open(inputfile) as json_file:
        y = json.load(json_file)
        T = {}
        for i in y["full"]:
            T[i] = y["full"][i][score]
        elem_vektor=[]
        tippeles_vektor=[]
        eredmeny = sorted(T, key=T.__getitem__, reverse=True)
        for elem in eredmeny:
            elem_vektor.append(elem)
            tippeles_vektor.append( abs(max(T.values()) - T[elem]))

        S = rankdata(tippeles_vektor, method='average')

        infection_ranks = {}
        for x in range(len(elem_vektor)):
            infection_ranks[elem_vektor[x]] = S[x]
            
   with open(csvfile) as csv_file, open(outputfile, mode='w+') as output:
        csv_reader = csv.reader(csv_file, delimiter=':')
        csv_writer = csv.writer(output, delimiter=";")
        line_count = 0
        for row in csv_reader:
                name = row[1] + ":" + row[2]
                csv_writer.writerow([name, infection_ranks[str(line_count)]])
                #print("{};{}".format(name,S[line_count]))
                line_count += 1
   print('Done.')


if __name__ == "__main__":
   main(args.input, args.csv, args.bugfix,  args.output, args.score)
