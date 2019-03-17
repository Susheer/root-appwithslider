import pandas as pd
import numpy as np
import json
import sys
import random
from pymongo import MongoClient


myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Quantile_25_tbl"]
Quant75_Table = mydb["Quantile_75_tbl"]
# -----------------


index = sys.argv[1]
DataIndex = sys.argv[2]

# //////////////// Access I`th Index Row from mongoDb
ASingleRow = reportTable.find({}).__getitem__(int(index))
df = pd.DataFrame.from_dict(ASingleRow, orient='index').iloc[1:]
df = df.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)
arr = np.array(df)

Quantile25 = Quant25_Table.find_one()
Quantile75 = Quant75_Table.find_one()

Quantile25 = pd.DataFrame.from_dict(Quantile25, orient='index').iloc[1:]
Quantile75 = pd.DataFrame.from_dict(Quantile75, orient='index').iloc[1:]

Qt25 = np.array(Quantile25)
Qt75 = np.array(Quantile75)

Data = arr[int(DataIndex)]

# print(Qt25[int(DataIndex)])
# print(Qt75[int(DataIndex)])

# print(arr[int(DataIndex)])

jsonObject = {
    "success": "true",

    "WithinRange": {
        "datasets": []
    },
    "BelowRange": {
        "datasets": []
    },
    "AboveRange": {
        "datasets": []
    }

}

if Data < Qt25[int(DataIndex)]:
    jsonObj = {
        "label": "{} {}".format("Data : ", Data),
        "pointStyle": "circle",

        "data": [{
            "x": random.randint(1, 101),
            "y": random.randint(1, 101),
            "r": 9,
            "keepTooltipOpen": 'true'
        }],
        "backgroundColor": "#FFA500"
    }

    jsonObject["BelowRange"]["datasets"].append(jsonObj)

elif Data > Qt75[int(DataIndex)]:
    jsonObj = {
        "label": "{} {}".format("Data : ", Data),
        "pointStyle": "circle",

        "data": [{
            "x": random.randint(1, 101),
            "y": random.randint(1, 101),
            "r": 9,
            "keepTooltipOpen": 'true'
        }],
        "backgroundColor": "#FFA500"
    }

    jsonObject["AboveRange"]["datasets"].append(jsonObj)
else:
    jsonObj = {
        "label": "{} {}".format("Data : ", Data),
        "pointStyle": "circle",

        "data": [{
            "x": random.randint(1, 101),
            "y": random.randint(1, 101),
            "r": 9,
            "keepTooltipOpen": 'true'
        }],
        "backgroundColor": "#008000"
    }
    jsonObject["WithinRange"]["datasets"].append(jsonObj)

data = json.dumps(jsonObject)

print(data)
