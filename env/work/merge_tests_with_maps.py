import json
import os
#Link:
# http://techdiarypages.blogspot.com/2014/06/merging-two-json-files-using-python.html
def merge(a, b):
    "merges b into a"
    for key in b:
        if key in a:# if key is in both a and b
            if isinstance(a[key], dict) and isinstance(b[key], dict): # if the key is dict Object
                merge(a[key], b[key])
            else:
              a[key] =a[key]+ b[key]
        else: # if the key is not in dict a , add it to dict a
            a.update({key:b[key]})
    return a
for filename in os.listdir('Hessian.js_1_data/pertest_coverage/0'):
    with open('Hessian.js_1_data/pertest_coverage/0/' +filename) as fp1:
        with open('Hessian.js_1_data/tests/json/maps.json') as fp2:
            jsondata1=json.load(fp1)
            jsondata2=json.load(fp2)
            with open('Hessian.js_1_data/temp/' + filename, 'w') as f:
              json.dump(merge(jsondata1,jsondata2),f,sort_keys=False)
              print(filename + 'is being merged.')            
    fp1.close();
    f.close();

