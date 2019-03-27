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
        print(Eobject)

except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 404, "details": "Records Not Found"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)

x_max = Dataframe['IQR_main'].max()/100
x_min = Dataframe['IQR_main'].min()/x_max-20
y_max = Dataframe['Row_Main'].max()/100
y_min = Dataframe['Row_Main'].min()/y_max-20

# print(x_max," ", x_min," ",y_min," ",y_max)

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
    # if np.logical_and(Dataframe.iloc[row]['Range'] == 0, Dataframe.iloc[row]['Range_1'] == 0):
    # if Dataframe.iloc[row]['Range_2'] > 24:
    if np.logical_and(Dataframe.iloc[row]['Range'] == 1, Dataframe.iloc[row]['Range_2'] == Dataframe.iloc[row]['Range_1']):
        jsonObj = {
            "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
            "pointStyle": "circle",
            "data": [{
                # "x": Dataframe.iloc[row]['IQR_main'],
                # "y": Dataframe.iloc[row]['Row_Main'],
                "x": random.randint(1, 100),
                "y": random.randint(1, 100),
                "r": 9
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
                "r": 9
            }],
            "backgroundColor": "#FFA500"
        }
        jsonObject["AboveRange"]["datasets"].append(jsonObj)

    # else
    #     jsonObj = {
    #         "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
    #         "pointStyle": "circle",
    #         "data": [{
    #             "x": Dataframe.iloc[row]['IQR_main'],
    #             "y": Dataframe.iloc[row]['Row_Main'],
    #             "r": 9
    #         }],
    #         "backgroundColor": "#FFA500"
    #     }
    #     jsonObject["BelowRange"]["datasets"].append(jsonObj)


data = json.dumps(jsonObject)
print(data)
