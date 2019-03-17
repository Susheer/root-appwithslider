import pandas as pd
import numpy as np
import json
from pandas import DataFrame
import sys
from pymongo import MongoClient


myclient = MongoClient('localhost', 27017)
try:
    myclient.drop_database("Artis")
except:
    mydb = myclient["Artis"]

mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Quantile_25_tbl"]
Quant75_Table = mydb["Quantile_75_tbl"]
Result_Table = mydb["Result_tbl"]

# path='/home/dst/Documents/Data_Science/report.xlsx'

path = './Shared/'+sys.argv[1]
sheet_name = 'AnalysisResults'

MainDataF = pd.DataFrame()

try:
    MainDataF = pd.read_excel(path, sheet_name=sheet_name)
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 422, "details": "Somthing went wrong in reading file"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)

records = json.loads(MainDataF.T.to_json()).values()

data_xls = MainDataF.copy()

data_xls = data_xls.apply(
    lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)
Quantile_25 = data_xls.quantile(.25, axis=0)

Quantile_75 = data_xls.quantile(.75, axis=0)

b = data_xls.shape
MainData = MainDataF.copy()

ls = list(data_xls.columns.values)

mainDataFrame = data_xls.copy()
OutOfRange = data_xls.copy()
BelowRange = data_xls.copy()

for index in range(ls.__len__()):
    arr = np.array([])
    l = ls[index]

    mainDataFrame.loc[mainDataFrame[l] < Quantile_25[index], l] = 0
    mainDataFrame.loc[mainDataFrame[l] > Quantile_75[index], l] = 0
    OutOfRange.loc[OutOfRange[l] < Quantile_75[index], l] = 0
    BelowRange.loc[BelowRange[l] > Quantile_25[index], l] = 0

InRengeArray = np.count_nonzero(mainDataFrame, axis=1)
OutOfRangeArray = np.count_nonzero(OutOfRange, axis=1)
BelowRangeArray = np.count_nonzero(BelowRange, axis=1)

mainDataFrame['IQR_mean'] = mainDataFrame.mean(axis=1)
OutOfRange['IQR_mean'] = OutOfRange.mean(axis=1)
BelowRange['IQR_mean'] = BelowRange.mean(axis=1)


RangeDataFrame = DataFrame()
RangeDataFrame['In_Range'] = pd.Series(InRengeArray)
RangeDataFrame['Outof_Range'] = pd.Series(OutOfRangeArray)
RangeDataFrame['Below_Range'] = pd.Series(BelowRangeArray)

win_x_max = mainDataFrame['IQR_mean'].max()/100
win_x_min = mainDataFrame['IQR_mean'].min()-5

Abov_x_max = OutOfRange['IQR_mean'].max()/100
Abov_x_min = OutOfRange['IQR_mean'].min()-5

Below_x_max = BelowRange['IQR_mean'].max()/100
Below_x_min = BelowRange['IQR_mean'].min()-5


RangeDataFrame['Range'] = RangeDataFrame.idxmax(axis=1)


MainData['Row_Main'] = MainData.mean(axis=1)

ResultDf = DataFrame()
try:
    ResultDf['Index'] = pd.Series(MainDataF.index)
    ResultDf['Row_Main'] = pd.Series(MainData['Row_Main'])
    ResultDf['Range'] = pd.Series(RangeDataFrame['Range'])
    ResultDf['Date'] = pd.Series(MainData['DateBunkered'])
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 400, "details": "Did not find expected file format"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)

y_max = ResultDf['Row_Main'].max()/100
y_min = ResultDf['Row_Main'].min()-5


Array = np.array([])

jsonObject = {
    "success": "true",
    "Error": [],
    "WithinRange": {
        "x_min": win_x_min,
        "x_max": win_x_max,
        "y_min": y_min,
        "y_max": y_max,
        "datasets": []
    },
    "BelowRange": {
        "x_min": Below_x_min,
        "x_max": Below_x_max,
        "y_min": y_min,
        "y_max": y_max,
        "datasets": []
    },
    "AboveRange": {
        "x_min": Abov_x_min,
        "x_max": Abov_x_max,
        "y_min": y_min,
        "y_max": y_max,
        "datasets": []
    }
}


for row in range(b[0]):

    if RangeDataFrame.iloc[row][3] == 'In_Range':
        jsonObj = {
            "label": "{} {}".format("Report", row),
            "pointStyle": "circle",
            "data": [{
                "x": mainDataFrame.iloc[row][ls.__len__()],
                "y": MainData.iloc[row]['Row_Main'],
                "r": 9
            }],
            "backgroundColor": "#008000"
        }
        jsonObject["WithinRange"]["datasets"].append(jsonObj)
        Array = np.append(Array, mainDataFrame.iloc[row][ls.__len__()])

    elif RangeDataFrame.iloc[row][3] == 'Below_Range':
        jsonObj = {
            "label": "{} {}".format("Report", row),
            "pointStyle": "circle",
            "data": [{
                "x": BelowRange.iloc[row][ls.__len__()],
                "y": MainData.iloc[row]['Row_Main'],
                "r": 9
            }],
            "backgroundColor": "#FFA500"
        }
        jsonObject["BelowRange"]["datasets"].append(jsonObj)
        Array = np.append(Array, BelowRange.iloc[row][ls.__len__()])

    else:
        jsonObj = {
            "label": "{} {}".format("Report", row),
            "pointStyle": "circle",
            "data": [{
                "x": OutOfRange.iloc[row][ls.__len__()],
                "y": MainData.iloc[row]['Row_Main'],
                "r": 9
            }],
            "backgroundColor": "#FFA500"
        }
        jsonObject["AboveRange"]["datasets"].append(jsonObj)
        Array = np.append(Array, OutOfRange.iloc[row][ls.__len__()])

data = json.dumps(jsonObject)
ResultDf['IQR_main'] = pd.Series(Array)


try:
    records1 = json.loads(Quantile_25.T.to_json())
    reportTable.insert(records)
    records1 = json.loads(Quantile_25.T.to_json())
    Quant25_Table.insert(records1)
    records2 = json.loads(Quantile_75.T.to_json())
    Quant75_Table.insert(records2)
    result = json.loads(ResultDf.T.to_json()).values()
    Result_Table.insert(result)
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 500, "details": "Internal Error"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)

print(data)
