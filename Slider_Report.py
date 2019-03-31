from pymongo import MongoClient
import pandas as pd
import json
import numpy as np
import random
import sys
# fromDate = 1397692800000
# toDate = 1400457600000

fromDate = sys.argv[1]
toDate = sys.argv[2]


myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
Result_Table = mydb["Result_tbl"]
res = Result_Table.find()

Dataframe = pd.DataFrame()
try:
    Dataframe = pd.DataFrame(list(Result_Table.find(
        {'Date': {'$lt': int(toDate), '$gte': int(fromDate)}})))
    if Dataframe.empty:
        errorobj = {
            "success": "false",
            "Error": [{"statusCode": 404, "details": "Records Not Found"}]
        }
        Eobject = json.dumps(errorobj)
        # print(Eobject)
        exit()

except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 404, "details": "Records Not Found"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)
    exit()
#
# x_max = Dataframe['IQR_main'].max()/100
# x_min = Dataframe['IQR_main'].min()/x_max-20
# y_max = Dataframe['Row_Main'].max()/100
# y_min = Dataframe['Row_Main'].min()/y_max-20

# print(x_max," ", x_min," ",y_min," ",y_max)
In_rad=0
A_rad=0
In_RangeArray = Dataframe.loc[Dataframe['Limit'] == "In_Range"]
In_count = In_RangeArray.shape
Above_RangeArray = Dataframe.loc[Dataframe['Limit'] == "Above_Range"]
Abov_count = Above_RangeArray.shape

if In_count[0] <= 100:
    In_rad = 9
elif In_count[0] < 500:
    In_rad = 8
elif In_count[0] < 1000:
    In_rad = 7
elif In_count[0] < 3000:
    In_rad = 6
elif In_count[0] < 5000:
    In_rad = 5
else:
    In_rad = 4

if Abov_count[0] < 100:
    A_red = 9
elif Abov_count[0] < 500:
    A_red = 8
elif Abov_count[0] < 1000:
    A_red = 7
elif Abov_count[0] < 3000:
    A_red = 6
elif Abov_count[0] < 5000:
    A_red = 5
else:
    A_red = 4

jsonObject = {
    "success": "true",
    "Error": [],
    "WithinRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": -10,
        "y_max": 120,
        "datasets": []
    },
    "BelowRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": -10,
        "y_max": 120,
        "datasets": []
    },
    "AboveRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": -10,
        "y_max": 120,
        "datasets": []
    }
}
for row in range(Dataframe.__len__()):
    if Dataframe.iloc[row]['Range'] == Dataframe.iloc[row]['In_Range']:
        # if np.logical_and(Dataframe.iloc[row]['Range'] == 0, Dataframe.iloc[row]['Range_1'] == 0):
        # if Dataframe.iloc[row]['Range_2'] > 20:
        jsonObj = {
            "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
            "pointStyle": "circle",
            "data": [{
                # "x": Dataframe.iloc[row]['IQR_main'],
                # "y": Dataframe.iloc[row]['Row_Main'],
                "x": random.randint(1, 100),
                "y": random.randint(1, 100),
                "r": In_rad
            }],
            "backgroundColor": "#008000"
        }
        jsonObject["WithinRange"]["datasets"].append(jsonObj)

    else:
        jsonObj = {
            "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
            "pointStyle": "circle",
            "data": [{
                # "x": Dataframe.iloc[row]['IQR_main'],
                # "y": Dataframe.iloc[row]['Row_Main'],
                "x": random.randint(1, 100),
                "y": random.randint(1, 100),
                "r": A_red
            }],
            "backgroundColor": "#FFA500"
        }
        jsonObject["AboveRange"]["datasets"].append(jsonObj)


data = json.dumps(jsonObject)
print(data)
