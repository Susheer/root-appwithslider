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
# DataIndex = 'Density'
# index='15'

# //////////////// Access I`th Index Row from mongoDb


df = pd.DataFrame()
# Quantile25 = pd.DataFrame()
# Quantile75 = pd.DataFrame()
try:
    ASingleRow = reportTable.find({}).__getitem__(int(index))
    df = pd.DataFrame.from_dict(ASingleRow, orient='index').drop("_id")

except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 500, "details": "Internal Error"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)

Quantile25 = Quant25_Table.find_one()
Quantile75 = Quant75_Table.find_one()
Quantile25 = pd.DataFrame.from_dict(Quantile25, orient='index').drop("_id")
Quantile75 = pd.DataFrame.from_dict(Quantile75, orient='index').drop("_id")
data = df.loc[DataIndex][0]
dff = df.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)
# arr = np.array(df)
Data = dff.loc[DataIndex][0]


Qt25 = Quantile25.loc[DataIndex][0]
Qt75 = Quantile75.loc[DataIndex][0]

jsonObject = {
    "success": "true",
    "Error": [],
    "WithinRange": {
        "x_min": 0,
        "x_max": 100,
        "y_min": 0,
        "y_max": 100,
        "datasets": []
    },
    "BelowRange": {
        "x_min": 0,
        "x_max": 100,
        "y_min": 0,
        "y_max": 100,
        "datasets": []
    },
    "AboveRange": {
        "x_min": 0,
        "x_max": 100,
        "y_min": 0,
        "y_max": 100,
        "datasets": []
    }
}

if Data < Qt25:
    jsonObj = {
        "label": str(data),
        "pointStyle": "circle",

        "data": [{
            "x": 25,
            "y": 70,
            "r": 9,
            "keepTooltipOpen": 'true'
        }],
        "backgroundColor": "#FFA500"
    }
    jsonObject["BelowRange"]["datasets"].append(jsonObj)
elif Data > Qt75:
    jsonObj = {
        "label": str(data),
        "pointStyle": "circle",

        "data": [{
            "x": 25,
            "y": 70,
            "r": 9,
            "keepTooltipOpen": 'true'
        }],
        "backgroundColor": "#FFA500"
    }
    jsonObject["AboveRange"]["datasets"].append(jsonObj)
else:
    jsonObj = {
        "label": str(data),
        "pointStyle": "circle",

        "data": [{
            "x": 25,
            "y": 70,
            "r": 9,
            "keepTooltipOpen": 'true'
        }],
        "backgroundColor": "#008000"
    }
    jsonObject["WithinRange"]["datasets"].append(jsonObj)

data = json.dumps(jsonObject)

print(data)
