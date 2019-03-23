import pandas as pd
import numpy as np
import json
from pandas import DataFrame
import sys
from pymongo import MongoClient
import random


path = './Shared/'+sys.argv[1]

myclient = MongoClient('localhost', 27017)
try:
    myclient.drop_database("Artis")
except:
    mydb = myclient["Artis"]

mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Lookup_tbl"]

Result_Table = mydb["Result_tbl"]

# path='/home/dst/Documents/Data_Science/testing.xlsx'
sheet_name = 'AnalysisResults'

MainDataF = pd.DataFrame()
ComparitionD = pd.DataFrame()

try:

    MainDataF = pd.read_excel(path, sheet_name=sheet_name)
    ComparitionD = pd.read_excel(
        "./Shared/serverSupportFile.xlsx", sheet_name="dbo_FuelSpecs")


except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 422, "details": "Somthing went wrong in reading file"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)


MainDataF['Index'] = pd.Series(MainDataF.index)
records = json.loads(MainDataF.T.to_json()).values()


b = MainDataF.shape

ComparitionD = ComparitionD.dropna(how='all', axis=1)
ComparitionD = ComparitionD.apply(lambda x: pd.to_numeric(
    x, errors='coerce')).fillna(np.nan).dropna(how='all', axis=1)
ComparitionData = ComparitionD.drop(
    columns=['cstAt40Min', 'cstAt40Max']).replace(np.nan, 0)


column = ComparitionData.columns


ComparitionData['cstAt40Min'] = pd.Series(ComparitionD['cstAt40Min'].copy())
ComparitionData['cstAt40Max'] = pd.Series(ComparitionD['cstAt40Max'].copy())

W_df = MainDataF[column]
# print(ComparitionData)
# column=np.array(column,"cstAt40")


W_df['cstAt40'] = pd.Series(MainDataF['cstAt40'])
b = W_df.shape
W_df = W_df.replace(np.nan, 0)
# print(W_df)

column = W_df.columns
# print(W_df)
# print(ComparitionData.shape)
W_df = W_df.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)
ls = list(W_df.columns.values)

MainComData = ComparitionData.loc[0]
A_df = W_df.copy()
B_df = W_df.copy()


for index in range(column.__len__()):
    arr = np.array([])
    l = column[index]
    # print(MainComData['cstAt40Min'])
    # print(MainComData[index])

    if l == "cstAt40":
        # print("inside ifffff------------------------",l)

        W_df.loc[W_df[l] < MainComData['cstAt40Min'], l] = 0
        W_df.loc[W_df[l] > MainComData['cstAt40Max'], l] = 0
        A_df.loc[A_df[l] < MainComData['cstAt40Max'], l] = 0
        B_df.loc[B_df[l] > MainComData['cstAt40Min'], l] = 0
        index += 1
    elif l == 'FlashPoint':
        W_df.loc[W_df[l] > MainComData[index], l] = 0
        B_df.loc[B_df[l] < MainComData[index], l] = 0
    else:
        W_df.loc[W_df[l] > MainComData[index], l] = 0
        A_df.loc[A_df[l] < MainComData[index], l] = 0

InRengeArray = np.count_nonzero(W_df, axis=1)
OutOfRangeArray = np.count_nonzero(A_df, axis=1)
BelowRangeArray = np.count_nonzero(B_df, axis=1)


W_df['IQR_mean'] = W_df.mean(axis=1)
A_df['IQR_mean'] = A_df.mean(axis=1)
B_df['IQR_mean'] = B_df.mean(axis=1)

RangeDataFrame = DataFrame()
RangeDataFrame['In_Range'] = pd.Series(InRengeArray)
RangeDataFrame['Outof_Range'] = pd.Series(OutOfRangeArray)
RangeDataFrame['Below_Range'] = pd.Series(BelowRangeArray)

RangeDataFrame['Range'] = RangeDataFrame.idxmax(axis=1)


# print(RangeDataFrame)

win_x_max = W_df['IQR_mean'].max()/100
win_x_min = W_df['IQR_mean'].min()

# print(int(win_x_max))
# print(int(win_x_min))

Abov_x_max = A_df['IQR_mean'].max()/100
Abov_x_min = A_df['IQR_mean'].min()

# MainData['Row_Main'] = MainData.mean(axis=1)
MainDataF['Row_Main'] = MainDataF.mean(axis=1)

ResultDf = DataFrame()
try:
    ResultDf['Index'] = pd.Series(MainDataF.index)
    ResultDf['Row_Main'] = pd.Series(MainDataF['Row_Main'])
    ResultDf['Range'] = pd.Series(OutOfRangeArray)
    ResultDf['Range_1'] = pd.Series(BelowRangeArray)
    ResultDf['Range_2'] = pd.Series(InRengeArray)
    ResultDf['Date'] = pd.Series(MainDataF['DateBunkered'])
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 400, "details": "Did not find expected file format"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)


inRangeDf = ResultDf.loc[ResultDf['Range'] == "In_Range"]

OutRangeDf = ResultDf.loc[ResultDf['Range'] == "Outof_Range"]

BelowRangeDf = ResultDf.loc[ResultDf['Range'] == "Below_Range"]

win_y_max = inRangeDf["Row_Main"].max()/100
win_y_min = (inRangeDf["Row_Main"].min()/win_y_max)-20  # -(win_y_max/2)

Abov_y_max = OutRangeDf["Row_Main"].max()/100
Abov_y_min = (OutRangeDf["Row_Main"].min()/Abov_y_max)-20  # -(Abov_y_max/2)

#
# Below_y_max=BelowRangeDf["Row_Main"].max()/100
# Below_y_min=(BelowRangeDf["Row_Main"].min()/Below_y_max)-20#-(Below_y_max/2)
#
# print(RangeDataFrame)

Array = np.array([])

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
        "x_min": 0,
        "x_max": 120,
        "y_min": 0,
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


for row in range(b[0]):
    if RangeDataFrame.iloc[row][0] >= 24:
        # if np.logical_and(RangeDataFrame.iloc[row][1] == 0, RangeDataFrame.iloc[row][2] == 0):
        # if RangeDataFrame.iloc[row][0] != 0:
        jsonObj = {
            "label": "{} {}".format("Report", row),
            "pointStyle": "circle",
            "data": [{
                # "x": (W_df.iloc[row][ls.__len__()]/win_x_max),
                # "y": (MainDataF.iloc[row]['Row_Main']/win_y_max),
                "x": random.randint(1, 100),
                "y": random.randint(1, 100),
                "r": 9
            }],
            "backgroundColor": "#30e110"
        }
        jsonObject["WithinRange"]["datasets"].append(jsonObj)
        Array = np.append(Array, W_df.iloc[row][ls.__len__()])

    else:
        jsonObj = {
            "label": "{} {}".format("Report", row),
            "pointStyle": "circle",
            "data": [{
                # "x": (A_df.iloc[row][ls.__len__()]/Abov_x_max),
                # "y": (MainDataF.iloc[row]['Row_Main']/Abov_y_max),
                "x": random.randint(1, 100),
                "y": random.randint(1, 100),
                "r": 9
            }],
            "backgroundColor": "#FFA500"
        }
        jsonObject["AboveRange"]["datasets"].append(jsonObj)
        Array = np.append(Array, A_df.iloc[row][ls.__len__()])
    # elif RangeDataFrame.iloc[row][2] != 0:
    #     jsonObj = {
    #         "label": "{} {}".format("Report", row),
    #         "pointStyle": "circle",
    #         "data": [{
    #             # "x": (B_df.iloc[row][ls.__len__()]),
    #             # "y": (MainDataF.iloc[row]['Row_Main']),
    #             "x": random.randint(1, 100),
    #             "y": random.randint(1, 100),
    #             "r": 9
    #         }],
    #         "backgroundColor": "#FFA500"
    #     }
    #     jsonObject["BelowRange"]["datasets"].append(jsonObj)
    #     Array = np.append(Array, B_df.iloc[row][ls.__len__()])


data = json.dumps(jsonObject)
ResultDf['IQR_main'] = pd.Series(Array)

# print(records)
try:
    # records1 = json.loads(Quantile_25.T.to_json())
    reportTable.insert(records)
    records1 = json.loads(MainComData.T.to_json())
    Quant25_Table.insert(records1)
    # records2 = json.loads(Quantile_75.T.to_json())
    # Quant75_Table.insert(records2)
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
