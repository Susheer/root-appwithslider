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


if DataIndex in df.columns:
    data = df.iloc[0][DataIndex]

Data = df.iloc[0][DataIndex]
# print(Data)


Quantile25 = Quant25_Table.find_one()
# Quantile75 = Quant75_Table.find_one()

Quantile25 = pd.DataFrame.from_dict(Quantile25, orient='index').drop('_id')

cst40 = 0

if np.logical_and('cstAt40Max' in Quantile25.index, 'cstAt40Min' in Quantile25.index):
    cst40 = 1
elif 'cstAt40Max' in Quantile25.index:
    cst40 = 2
elif 'cstAt40Min' in Quantile25.index:
    cst40 = 3

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
            "label": "{},{} = {}".format("Observation", DataIndex, str(Data)),
            "pointStyle": "circle",

            "data": [{
                "x": 25,
                "y": 90,
                "r": 9,
                "keepTooltipOpen": 'true'
            }],
            "backgroundColor": "#008000"
        }

        jsonObject["WithinRange"]["datasets"].append(jsonObj)

    elif Data > Quantile25.loc[DataIndex][0]:
        jsonObj = {
            # str(Data),
            # str(Data),
            "label": "{},{} = {},,,{},{} {} {},".format("Observation", DataIndex, str(Data), "Remedy", DataIndex, "should be less than", Quantile25.loc[DataIndex][0]),
            "pointStyle": "circle",

            "data": [{
                "x": 5,
                "y": 95,
                "r": 9,
                "keepTooltipOpen": 'true'
            }],
            "backgroundColor": "#FFA500"
        }

        jsonObject["AboveRange"]["datasets"].append(jsonObj)

else:
    if np.logical_and(DataIndex == 'cstAt40', cst40 == 1):
        if Data > Quantile25.loc['cstAt40Max'][0]:
            jsonObj = {
                # str(Data),
                "label": "{},{} = {},,,{},{} {} {},".format("Observation", DataIndex, str(Data), "Remedy", DataIndex, "should be less than", Quantile25.loc['cstAt40Max'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 95,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["AboveRange"]["datasets"].append(jsonObj)

        elif np.logical_and(Data > Quantile25.loc['cstAt40Min'][0], Data < Quantile25.loc['cstAt40Max'][0]):
            jsonObj = {
                "label": "{},{} = {}".format("Observation", DataIndex, str(Data)),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 95,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)

        elif Data < Quantile25.loc['cstAt40Min'][0]:
            jsonObj = {
                "label": "{},{} = {},,,{},{} {} {},".format("Observation", DataIndex, str(Data), "Remedy", DataIndex, "should be grater than", Quantile25.loc['cstAt40Min'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 95,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["BelowRange"]["datasets"].append(jsonObj)

    elif np.logical_and(DataIndex == 'cstAt40', cst40 == 2):
        if Data > Quantile25.loc['cstAt40Max'][0]:
            jsonObj = {
                "label": "{},{} = {},,,{},{} {} {},".format("Observation", DataIndex, str(Data), "Remedy", DataIndex, "should be less than", Quantile25.loc['cstAt40Max'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 95,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["AboveRange"]["datasets"].append(jsonObj)

        else:
            jsonObj = {
                "label": "{},{} = {}".format("Observation", DataIndex, str(Data)),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 95,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)
    elif np.logical_and(DataIndex == 'cstAt40', cst40 == 3):
        if Data < Quantile25.loc['cstAt40Min'][0]:
            jsonObj = {
                "label": "{},{} = {},,,{},{} {} {},".format("Observation", DataIndex, str(Data), "Remedy", DataIndex, "should be grater than", Quantile25.loc['cstAt40Min'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 95,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["BelowRange"]["datasets"].append(jsonObj)
        else:
            jsonObj = {
                "label": "{},{} = {}".format("Observation", DataIndex, str(Data)),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 75,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)

    elif DataIndex == 'FlashPoint':
        if Data > Quantile25.loc['FlashPoint'][0]:
            jsonObj = {
                "label": "{},{} = {}".format("Observation", DataIndex, str(Data)),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 75,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)

        elif Data < Quantile25.loc['FlashPoint'][0]:
            jsonObj = {
                "label": "{},{} = {},,,{},{} {} {},".format("Observation", DataIndex, str(Data), "Remedy", DataIndex, "should be grater than", Quantile25.loc['FlashPoint'][0]),
                "pointStyle": "circle",
                "data": [{
                    "x": 5,
                    "y": 95,
                    "r": 9,
                    "keepTooltipOpen": 'true'
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["BelowRange"]["datasets"].append(jsonObj)


data = json.dumps(jsonObject)

print(data)
