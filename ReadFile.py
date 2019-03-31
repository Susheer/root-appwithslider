import pandas as pd
import numpy as np
import json
from pandas import DataFrame
import sys
from pymongo import MongoClient
import random
# import getSlider_New
from datetime import datetime, timedelta
import time

currentDT = datetime.now()
cur_Dt = time.mktime(datetime.strptime(
    currentDT.strftime("%d/%m/%Y "), "%d/%m/%Y ").timetuple())
cur_Date = str(int(cur_Dt))+'000'

path = './Shared/'+sys.argv[1]
# path='/home/dst/Documents/Data_Science/mmmm.xlsx'
sheet_name = 'AnalysisResults'

myclient = MongoClient('localhost', 27017)
try:
    myclient.drop_database("Artis")
except:
    mydb = myclient["Artis"]


mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Lookup_Table = mydb["Lookup_tbl"]
Result_Table = mydb["Result_tbl"]


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
    exit()
    # print("--------------------------------------------------")


# MainDataF['Index'] = pd.Series(MainDataF.index)

MainDataF = MainDataF.drop(columns=[
                           'AirwayNumber', 'SealNumberSupplier', 'SealNumberRetained', 'SealNumberMARPOL', 'SealNumber'])
# MainDataF = MainDataF.dropna(how='all', axis=1)
# print(MainDataF)
# print(MainDataF.columns)
# b = MainDataF.shape
records = json.loads(MainDataF.T.to_json()).values()

ComparitionD = ComparitionD.dropna(how='all', axis=1)


# print(ComparitionD.loc[1])

MainComData = pd.DataFrame()
MainComData = ComparitionD.loc[5]


clmn = MainComData.drop(['Specification', 'Grade', 'Type',
                         'cstAt40Min', 'cstAt40Max']).dropna(how='all').index
MainComData = MainComData.drop(
    ['Specification', 'Grade', 'Type']).dropna(how='all')
Lookupclmn = MainComData.index
# print(MainComData)
clmn = np.append(clmn, 'cstAt40')
# print(clmn)
# print(Lookupclmn)
ReportData = MainDataF[clmn]
ReportData = ReportData.dropna(how='all', axis=1)


W_df = ReportData.copy()
W_df.loc[W_df['FlashPoint'] == 0.0, 'FlashPoint'] = 1
A_df = ReportData.copy()
B_df = ReportData.copy()
Zero_Array = (W_df == 0).astype(int).sum(axis=1)
Range = ReportData.shape
# print(ReportData.shape)
# NaN_Value=W_df.isna().sum()
# print(NaN_Value)
NaN_Value = W_df.apply(lambda x: x.count(), axis=1)
# print(NaN_Value)
RangeDataFrame = DataFrame()

RangeDataFrame['NaN_Values'] = pd.Series(NaN_Value)
RangeDataFrame['NaN_Values'] = RangeDataFrame.sub([Range[1]])

# print(W_df.iloc[3])

# print(W_df.loc[])

for index in range(clmn.__len__()):
    arr = np.array([])
    l = clmn[index]
    if l in ReportData.columns:
        if l == 'cstAt40':
            if np.logical_and('cstAt40Max' in Lookupclmn[:, ], 'cstAt40Min' in Lookupclmn[:, ]):
                W_df.loc[W_df[l] < MainComData['cstAt40Min'], l] = 0
                W_df.loc[W_df[l] > MainComData['cstAt40Max'], l] = 0
                A_df.loc[A_df[l] < MainComData['cstAt40Max'], l] = 0
                B_df.loc[B_df[l] > MainComData['cstAt40Min'], l] = 0
            elif 'cstAt40Max' in Lookupclmn[:, ]:
                W_df.loc[W_df[l] > MainComData['cstAt40Max'], l] = 0
                A_df.loc[A_df[l] < MainComData['cstAt40Max'], l] = 0
            elif 'cstAt40Min' in Lookupclmn[:, ]:
                W_df.loc[W_df[l] < MainComData['cstAt40Min'], l] = 0
                B_df.loc[B_df[l] > MainComData['cstAt40Min'], l] = 0
        elif l == 'FlashPoint':
            W_df.loc[W_df[l] < MainComData[l], l] = 0
            B_df.loc[B_df[l] > MainComData[l], l] = 0
        else:
            W_df.loc[W_df[l] > MainComData[l], l] = 0
            A_df.loc[A_df[l] < MainComData[l], l] = 0
# print(W_df.loc[1])

InRengeArray = np.count_nonzero(W_df, axis=1)
OutOfRangeArray = np.count_nonzero(A_df, axis=1)
BelowRangeArray = np.count_nonzero(B_df, axis=1)

# print(W_df.iloc[3])

W_df['IQR_mean'] = W_df.mean(axis=1)
A_df['IQR_mean'] = A_df.mean(axis=1)
B_df['IQR_mean'] = B_df.mean(axis=1)


RangeDataFrame['In_Range'] = pd.Series(InRengeArray)
# print(RangeDataFrame)
RangeDataFrame['Range'] = RangeDataFrame['In_Range'] + \
    RangeDataFrame['NaN_Values']
RangeDataFrame['In_Range'] = pd.Series(NaN_Value)

RangeDataFrame['NaN_Values'] = pd.Series(Zero_Array)
RangeDataFrame['In_Range'] = RangeDataFrame['In_Range'] - \
    RangeDataFrame['NaN_Values']
RangeDataFrame = RangeDataFrame.drop(columns='NaN_Values')


RangeDataFrame['Limit'] = np.where((RangeDataFrame['Range'] == RangeDataFrame['In_Range']),  'In_Range', 'Above_Range')

# print(RangeDataFrame)
RangeDataFrame['Index'] = pd.Series(MainDataF['SampleNumber'])
RangeDataFrame['Date'] = pd.Series(MainDataF['DateBunkered'])
# RangeDataFrame['Outof_Range'] = pd.Series(OutOfRangeArray)
# RangeDataFrame['Below_Range'] = pd.Series(BelowRangeArray)

# print(RangeDataFrame)


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

date_N_days_ago = datetime.now() - timedelta(days=15)
ago_d = date_N_days_ago.strftime("%d/%m/%Y")
fr_date = time.mktime(datetime.strptime(ago_d, "%d/%m/%Y").timetuple())
from_Date = str(int(fr_date)) + '000'
# print(Date_Picker(from_Date, cur_Date))


try:
    reportTable.insert(records)
    records1 = json.loads(MainComData.T.to_json())
    Lookup_Table.insert(records1)
    result = json.loads(RangeDataFrame.T.to_json()).values()
    Result_Table.insert(result)
except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 500, "details": "Internal Error"}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)
    exit()


# data = json.dumps(jsonObject)

Dataframe = pd.DataFrame()

try:
    Dataframe = pd.DataFrame(list(Result_Table.find(
        {'Date': {'$lt': int(cur_Date), '$gte': int(from_Date)}})))
    if Dataframe.empty:
        errorobj = {
            "success": "false",
            "Error": [{"statusCode": 404, "details": "No records available in given filter"}]
        }
        Eobject = json.dumps(errorobj)
        # print(Eobject)
        exit()
        # print("====================================")

except:
    errorobj = {
        "success": "false",
        "Error": [{"statusCode": 404, "details": "No records availbale in given filter "}]
    }
    Eobject = json.dumps(errorobj)
    print(Eobject)
    exit()



In_rad=0
A_red=0
In_RangeArray = Dataframe.loc[Dataframe['Limit'] == "In_Range"]
In_count = In_RangeArray.shape
Above_RangeArray = Dataframe.loc[Dataframe['Limit'] == "Above_Range"]
Abov_count = Above_RangeArray.shape


if In_count[0] <= 100:
    In_rad = 9
elif In_count[0] < 500:
    In_rad = 8
elif In_count[0] < 1000:
    In_rad = 7
elif In_count[0] < 3000:
    In_rad = 6
elif In_count[0] < 5000:
    In_rad = 5
elif In_count[0] < 7000:
    In_rad = 4

if Abov_count[0] < 100:
    A_red = 9
elif Abov_count[0] < 500:
    A_red = 8
elif Abov_count[0] < 1000:
    A_red = 7
elif Abov_count[0] < 3000:
    A_red = 6
elif Abov_count[0] < 5000:
    A_red = 5
elif Abov_count[0] < 7000:
    A_red = 4




for row in range(Dataframe.__len__()):
    if Dataframe.iloc[row]['Range'] == Dataframe.iloc[row]['In_Range']:
        # if np.logical_and(Dataframe.iloc[row]['Range'] == 0, Dataframe.iloc[row]['Range_1'] == 0):
        #     if Dataframe.iloc[row]['Range_2'] > 20:
        jsonObj = {
            "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
            "pointStyle": "circle",
            "data": [{
                # "x": Dataframe.iloc[row]['IQR_main']/x_max,
                # "y": Dataframe.iloc[row]['Row_Main']/y_max,
                "x": random.randint(1, 100),
                "y": random.randint(1, 100),
                "r": In_rad
            }],
            "backgroundColor": "#008000"
        }
        jsonObject["WithinRange"]["datasets"].append(jsonObj)

    else:
        jsonObj = {
            "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
            "pointStyle": "circle",
            "data": [{
                # "x": Dataframe.iloc[row]['IQR_main']/x_max,
                # "y": Dataframe.iloc[row]['Row_Main']/y_max,
                "x": random.randint(1, 100),
                "y": random.randint(1, 100),
                "r": A_red
            }],
            "backgroundColor": "#FFA500"
        }
        jsonObject["AboveRange"]["datasets"].append(jsonObj)


data = json.dumps(jsonObject)


# data = getSlider_New.Date_Picker(from_Date, cur_Date)
print(data)
