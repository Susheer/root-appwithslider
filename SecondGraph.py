import pandas as pd
import numpy as np
import json
import sys
from pymongo import MongoClient

# //////////// MongoDb Connection

myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Quantile_25_tbl"]
Quant75_Table = mydb["Quantile_75_tbl"]

index = sys.argv[1]

# //////////////// Access I`th Index Row from mongoDb
ASingleRow = reportTable.find({}).__getitem__(int(index))
df = pd.DataFrame.from_dict(ASingleRow, orient='index')

# ///////// Remove First Id Value from data
df = df.drop("_id")

columns = np.array(df.index)
# print()
df = df.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)

# //////////////// Access Quntile values from mongodb
Quantile25 = Quant25_Table.find_one()
Quantile75 = Quant75_Table.find_one()

Quantile25 = pd.DataFrame.from_dict(Quantile25, orient='index').drop("_id")
Quantile75 = pd.DataFrame.from_dict(Quantile75, orient='index').drop("_id")

# DataArray=np.array(df)
# length=df.shape

# for i in range(length[0]):
#     DataArray=np.append(DataArray,df.iloc[1][0])

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


bellow = np.where(np.array(df) < np.array(Quantile25))
outter = np.where(np.array(df) > np.array(Quantile75))
inRange = np.where(np.logical_and(np.array(df) > np.array(
    Quantile25), np.array(df) < np.array(Quantile75)))

for clm in range(inRange[0].__len__()):
    jsonObj = {
        # "label": columns[clm],
        "pointStyle": "circle",
        "label": columns[inRange[0][clm]],
        "data": [{
            "x": float(inRange[0][clm]),
            "y": df.iloc[clm][0],
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
            "x": float(bellow[0][clm]),
            "y": df.iloc[clm][0],
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
            "x": float(outter[0][clm]),
            "y": df.iloc[clm][0],
            "r": 9,
        }],
        "backgroundColor": "#FFA500"
    }
    jsonObject["AboveRange"]["datasets"].append(jsonObj)

Data = json.dumps(jsonObject)
print(Data)
