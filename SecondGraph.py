import pandas as pd
import numpy as np
import json
import sys
from pymongo import MongoClient
import random

index = sys.argv[1]
# index='9'
myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Lookup_tbl"]


df = pd.DataFrame()
try:
    df = pd.DataFrame(list(reportTable.find({'Index': int(index)})))
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 500, "details": "Internal Error"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)


df = df.drop(columns=["_id", "Index"])
columns = np.array(df.columns)
# print(df)

# print(columns)
df = df.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)


Quantile25 = Quant25_Table.find_one()
# Quantile75 = Quant75_Table.find_one()

Quantile25 = pd.DataFrame.from_dict(Quantile25, orient='index').drop('_id')
# print(Quantile25)

columns = np.array(Quantile25.drop(["cstAt40Max", "cstAt40Min"]).index)
columns = np.append(columns, "cstAt40")
# print(columns)
# Quantile75 = pd.DataFrame.from_dict(Quantile75, orient='index').drop(index='_id')

# Quantile75 = Quantile75.reindex(sorted(Quantile75.index))
# Quantile25 = Quantile25.reindex(sorted(Quantile25.index))

X_max = columns.__len__()/100
# print(df.loc[0].max())
y_max = (df.loc[0].max()/100)
y_min = (df.loc[0].min()/y_max)-10


jsonObject = {
    "success": "true",
    "WithinRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": float(y_min),
        "y_max": 120,
        "datasets": []
    },
    "BelowRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": float(y_min),
        "y_max": 120,
        "datasets": []
    },
    "AboveRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": float(y_min),
        "y_max": 120,
        "datasets": []
    }
}
Wct = 0
Act = 0
Bct = 0
# columns[1]
for clm in range(columns.__len__()):
    # print(df.loc[columns[clm]][0],"----------------------------------")
    # print(Quantile25.loc[columns[clm]][0])
    if np.logical_and(columns[clm] != 'cstAt40', columns[clm] != 'FlashPoint'):
        if df.iloc[0][columns[clm]] > Quantile25.loc[columns[clm]][0]:
            jsonObj = {
                "label": columns[clm],
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["AboveRange"]["datasets"].append(jsonObj)
            Act += 1
        elif df.iloc[0][columns[clm]] < Quantile25.loc[columns[clm]][0]:
            jsonObj = {
                "label": columns[clm],
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)
            Wct += 1
        # else:
        #     jsonObj = {
        #         "label": columns[clm],
        #         "pointStyle": "circle",
        #         "data": [{
        #             "x": random.randint(1, 100),
        #             "y": random.randint(1, 100),
        #             "r": 9,
        #         }],
        #         "backgroundColor": "#FFA500"
        #     }
        #     jsonObject["BelowRange"]["datasets"].append(jsonObj)
        #     Bct += 1
    else:
        if columns[clm] == 'cstAt40':
            if df.iloc[0][columns[clm]] > Quantile25.loc['cstAt40Max'][0]:
                jsonObj = {
                    "label": columns[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["AboveRange"]["datasets"].append(jsonObj)
                Act += 1
            elif np.logical_and(df.iloc[0][columns[clm]] > Quantile25.loc['cstAt40Min'][0], df.iloc[0][columns[clm]] < Quantile25.loc['cstAt40Max'][0]):
                jsonObj = {
                    "label": columns[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#008000"
                }
                jsonObject["WithinRange"]["datasets"].append(jsonObj)
                Wct += 1
            elif df.iloc[0][columns[clm]] < Quantile25.loc['cstAt40Min'][0]:
                jsonObj = {
                    "label": columns[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["BelowRange"]["datasets"].append(jsonObj)
                Bct += 1
        elif columns[clm] == 'FlashPoint':
            if df.iloc[0][columns[clm]] > Quantile25.loc['FlashPoint'][0]:
                jsonObj = {
                    "label": columns[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#008000"
                }
                jsonObject["WithinRange"]["datasets"].append(jsonObj)
                Act += 1

            elif df.iloc[0][columns[clm]] < Quantile25.loc['FlashPoint'][0]:
                jsonObj = {
                    "label": columns[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["BelowRange"]["datasets"].append(jsonObj)
                Bct += 1
# print(jsonObject)
Data = json.dumps(jsonObject)
print(Data)
# print("iiinnnn",Wct)
# print("AAbb",Act)
# print("Bell",Bct)
