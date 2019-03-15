
import pandas as pd
import numpy as np
import json

from pandas import DataFrame


import sys
from pymongo import MongoClient
import pymongo


myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
reportTable = mydb["report"]
Quant25_Table = mydb["Quant25_tbl"]
Quant75_Table = mydb["Quant75_tbl"]

path = './Shared/'+sys.argv[1]
sheet_name = 'AnalysisResults'

MainDataF = pd.read_excel(path,
                          sheet_name=sheet_name,
                          index_col=None)

records = json.loads(MainDataF.T.to_json()).values()
reportTable.insert(records)

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

data_xls = MainDataF.copy()

data_xls = data_xls.apply(
    lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)
q2 = data_xls.quantile(.25, axis=0)

q4 = data_xls.quantile(.75, axis=0)


# dff = MainDataF()

b = data_xls.shape
MainData = MainDataF.copy()

ls = list(data_xls.columns.values)

mainDataFrame = data_xls.copy()
OutOfRange = data_xls.copy()
BelowRange = data_xls.copy()

for index in range(ls.__len__()):
    arr = np.array([])
    l = ls[index]

    mainDataFrame.loc[mainDataFrame[l] < q2[index], l] = 0
    mainDataFrame.loc[mainDataFrame[l] > q4[index], l] = 0
    OutOfRange.loc[OutOfRange[l] < q4[index], l] = 0
    BelowRange.loc[BelowRange[l] > q2[index], l] = 0
# print('in renge', mainDataFrame)
# print('out of range', OutOfRange)
# print('below range', BelowRange)

InRengeArray = np.count_nonzero(mainDataFrame, axis=1)
OutOfRangeArray = np.count_nonzero(OutOfRange, axis=1)
BelowRangeArray = np.count_nonzero(BelowRange, axis=1)

# print('Inrenge', InRengeArray)
# print('Outof', OutOfRangeArray)
# print('Below', BelowRangeArray)

mainDataFrame['IQR_mean'] = mainDataFrame.mean(axis=1)
OutOfRange['IQR_mean'] = OutOfRange.mean(axis=1)
BelowRange['IQR_mean'] = BelowRange.mean(axis=1)

RangeDataFrame = DataFrame()
RangeDataFrame['In_Range'] = pd.Series(InRengeArray)
RangeDataFrame['Outof_Range'] = pd.Series(OutOfRangeArray)
RangeDataFrame['Below_Range'] = pd.Series(BelowRangeArray)

RangeDataFrame['Range'] = RangeDataFrame.idxmax(axis=1)


MainData['Row_Main'] = MainData.mean(axis=1)


for row in range(b[0]):
    report = "Report "  # +row
    # report+=row
    if RangeDataFrame.iloc[row][3] == 'In_Range':
        jsonObj = {
            "label": "{}{}".format("Report", row),
            "pointStyle": "circle",
            "data": [{
                "x": mainDataFrame.iloc[row][ls.__len__()],
                "y": MainData.iloc[row]['Row_Main'],
                "r":9
            }],
            "backgroundColor": "#30e110",
            "borderColor": "white"
        }

        jsonObject["WithinRange"]["datasets"].append(jsonObj)
        # print(MainData.iloc[1][1])
        # arr1 = np.append(arr1, mainDataFrame.iloc[row][ls.__len__()])
    elif RangeDataFrame.iloc[row][3] == 'Below_Range':
        jsonObj = {
            "label": "{}{}".format("Report", row),
            "pointStyle": "circel",
            "data": [{
                "x": BelowRange.iloc[row][ls.__len__()],
                "y": MainData.iloc[row]['Row_Main'],
                "r":9
            }],
            "backgroundColor": "#ec260e",
            "borderColor": "white"
        }

        jsonObject["BelowRange"]["datasets"].append(jsonObj)
        #arr1 = np.append(arr1, BelowRange.iloc[row][ls.__len__()])
    else:
        jsonObj = {
            "label": "{}{}".format("Report", row),
            "pointStyle": "circle",
            "data": [{
                "x": OutOfRange.iloc[row][ls.__len__()],
                "y": MainData.iloc[row]['Row_Main'],
                "r":9
            }],
            "backgroundColor": "#FFFF00",
            "borderColor": "white"
        }
        jsonObject["AboveRange"]["datasets"].append(jsonObj)
        #arr1 = np.append(arr1, OutOfRange.iloc[row][ls.__len__()])

data = json.dumps(jsonObject)


print(data)
