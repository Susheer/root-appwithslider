import pandas as pd
import numpy as np
import json
import sys
import random
from pymongo import MongoClient

# //////////// MongoDb Connection

myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Quantile_25_tbl"]
Quant75_Table = mydb["Quantile_75_tbl"]

index = sys.argv[1]

# //////////////// Access I`th Index Row from mongoDb
df = pd.DataFrame()
Quantile25 = pd.DataFrame()
Quantile75 = pd.DataFrame()
try:
    ASingleRow = reportTable.find({}).__getitem__(int(index))
    df = pd.DataFrame.from_dict(ASingleRow, orient='index')
    Quant25 = Quant25_Table.find_one()
    Quant75 = Quant75_Table.find_one()
    Quantile25 = pd.DataFrame.from_dict(Quant25, orient='index').drop("_id")
    Quantile75 = pd.DataFrame.from_dict(Quant75, orient='index').drop("_id")
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 500, "details": "Internal Error"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)


# ///////// Remove First Id Value from data
df = df.drop("_id")

columns = np.array(df.index)
# print()
df = df.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)

# //////////////// Access Quntile values from mongodb


# DataArray=np.array(df)
# length=df.shape

# for i in range(length[0]):
#     DataArray=np.append(DataArray,df.iloc[1][0])


bellow = np.where(np.array(df) < np.array(Quantile25))
outter = np.where(np.array(df) > np.array(Quantile75))
inRange = np.where(np.logical_and(np.array(df) > np.array(
    Quantile25), np.array(df) < np.array(Quantile75)))

X_max = columns.__len__()/100

y_max = (df[0].max()/100)
y_min = (df[0].min()/y_max)-10


jsonObject = {
    "success": "true",
    "Error": [],
    # "scales": {
    #     "xAxes": [{
    #         "type": "linear",
    #         "position": "bottom",
    #         "display": "false",
    #         "ticks": {

    #         }
    #     }
    #     ]
    # },
    "WithinRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": y_min,
        "y_max": 120,
        "datasets": []
    },
    "BelowRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": y_min,
        "y_max": 120,
        "datasets": []
    },
    "AboveRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": y_min,
        "y_max": 120,
        "datasets": []
    }
}
for clm in range(inRange[0].__len__()):
    jsonObj = {
        # "label": columns[clm],
        "pointStyle": "circle",
        "label": columns[inRange[0][clm]],
        "data": [{
            "x": random.randint(1, 100),
            "y": random.randint(1, 100),
            "r": 9,
        }],
        "backgroundColor": "#008000"
    }
    jsonObject["WithinRange"]["datasets"].append(jsonObj)
for clm in range(bellow[0].__len__()):
    # print(bellow[0][clm])
    jsonObj = {
        "label": columns[bellow[0][clm]],
        "pointStyle": "circle",
        "data": [{
            "x": random.randint(1, 100),
            "y": random.randint(1, 100),
            "r": 9,
        }],
        "backgroundColor": "#FFA500"
    }
    jsonObject["BelowRange"]["datasets"].append(jsonObj)
    # dataFrame.loc[bellow[clm], 'Range'] = 'Below_Range'
for clm in range(outter[0].__len__()):
    jsonObj = {
        "label": columns[outter[0][clm]],
        "pointStyle": "circle",
        "data": [{
            "x": random.randint(1, 100),
            "y": random.randint(1, 100),
            "r": 9,
        }],
        "backgroundColor": "#FFA500"
    }
    jsonObject["AboveRange"]["datasets"].append(jsonObj)

Data = json.dumps(jsonObject)
print(Data)
