import pandas as pd
import numpy as np
import json
import sys
import random
from pymongo import MongoClient


myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Lookup_tbl"]

# -----------------


index = sys.argv[1]
DataIndex = sys.argv[2]
# DataIndex = 'Density'
# index='A15150002'




df = pd.DataFrame()
try:
    df = pd.DataFrame(list(reportTable.find({'SampleNumber': (index)})))
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 500, "details": "Internal Error"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)


df = df.dropna(how='all', axis=1)

# //////////////// Access I`th Index Row from mongoDb
# ASingleRow = reportTable.find({}).__getitem__(int(index))
# df = pd.DataFrame.from_dict(ASingleRow, orient='index').drop('_id'))
# df = pd.DataFrame(list(reportTable.find({'Index': int(index)})))
# print(df.columns)
if DataIndex in df.columns:
    data = df.iloc[0][DataIndex]
    # print(data)
# print(data)
dff = df.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)
# arr = np.array(df)
Data = dff.iloc[0][DataIndex]
# print(Data)


Quantile25 = Quant25_Table.find_one()
# Quantile75 = Quant75_Table.find_one()

Quantile25 = pd.DataFrame.from_dict(Quantile25, orient='index').drop('_id')
# Quantile75 = pd.DataFrame.from_dict(Quantile75, orient='index').drop('_id')

# print(Quantile25.loc[DataIndex][0])
# print(Quantile75.loc[DataIndex])


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
        "y_max": 120,
        "datasets": []
    }
}

if np.logical_and(DataIndex != 'cstAt40', DataIndex != 'FlashPoint'):
    if Data < Quantile25.loc[DataIndex][0]:
        jsonObj = {
            "label":"{} {}".format("Observation",str(Data)),#str(Data),
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

    elif Data > Quantile25.loc[DataIndex][0]:
        jsonObj = {
            "label": "{} {}\n\n\n{}\n{} {} {}".format("Observation",str(Data), "Remedy", DataIndex,"is less than", Quantile25.loc[DataIndex][0]),# str(Data),
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
    # else:
    #     jsonObj = {
    #         "label": str(data),
    #         "pointStyle": "circle",
    #
    #         "data": [{
    #             "x": 25,
    #             "y": 70,
    #             "r": 9,
    #             "keepTooltipOpen": 'true'
    #         }],
    #         "backgroundColor": "#008000"
    #     }
    #     jsonObject["WithinRange"]["datasets"].append(jsonObj)
else:
    if DataIndex == 'cstAt40':
        if Data > Quantile25.loc['cstAt40Max'][0]:
            jsonObj = {
                "label": "{} {}\n\n\n{}\n{} {} {}".format("Observation",str(Data), "Remedy", DataIndex,"is less than", Quantile25.loc['cstAt40Max'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["AboveRange"]["datasets"].append(jsonObj)

        elif np.logical_and(Data > Quantile25.loc['cstAt40Min'][0], Data < Quantile25.loc['cstAt40Max'][0]):
            jsonObj = {
                "label": "{} {}".format("Observation",str(Data)),
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)

        elif Data < Quantile25.loc['cstAt40Min'][0]:
            jsonObj = {
                "label": "{} {}\n\n\n{}\n{} {} {}".format("Observation",str(Data), "Remedy", DataIndex,"is greater than", Quantile25.loc['cstAt40Min'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["BelowRange"]["datasets"].append(jsonObj)
    elif DataIndex == 'FlashPoint':
        if Data > Quantile25.loc['FlashPoint'][0]:
            jsonObj = {
                "label": "{} {}".format("Observation",str(Data)),
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)

        elif Data < Quantile25.loc['FlashPoint'][0]:
            jsonObj = {
                "label": "{} {}\n\n\n{}\n{} {} {}".format("Observation",str(Data), "Remedy", DataIndex,"is grater than", Quantile25.loc['FlashPoint'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["BelowRange"]["datasets"].append(jsonObj)


data = json.dumps(jsonObject)

print(data)
