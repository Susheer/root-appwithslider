import pandas as pd
from pandas import DataFrame
import numpy as np
import json

import sys

data=sys.argv[1]

dataFrame=pd.read_json(data, orient='columns')

def firstPage(data):
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

    data_xls = data.copy()
    print("reading completed")
    data_xls = data_xls.apply(lambda x: pd.to_numeric(x, errors='coerce')).fillna(0)
    q2 = data_xls.quantile(.25, axis=0)

    q4 = data_xls.quantile(.75, axis=0)


    dff = DataFrame()

    b = data_xls.shape
    MainData = data.copy()

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
    print('in renge', mainDataFrame)
    print('out of range', OutOfRange)
    print('below range', BelowRange)

    InRengeArray = np.count_nonzero(mainDataFrame, axis=1)
    OutOfRangeArray = np.count_nonzero(OutOfRange, axis=1)
    BelowRangeArray = np.count_nonzero(BelowRange, axis=1)

    print('Inrenge', InRengeArray)
    print('Outof', OutOfRangeArray)
    print('Below', BelowRangeArray)

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
        report="Report "#+row
        #report+=row
        if RangeDataFrame.iloc[row][3] == 'In_Range':
            jsonObj={
                "label": "{} {}".format("Report ", row),
                "radius": 9,
                "pointStyle": "rectRounded",
                "data": [{
                    "x": mainDataFrame.iloc[row][ls.__len__()],
                    "y": MainData.iloc[row]['Row_Main']
                }],
                "backgroundColor": "#30e110"
            }

            jsonObject["WithinRange"]["datasets"].append(jsonObj)
            # print(MainData.iloc[1][1])
            # arr1 = np.append(arr1, mainDataFrame.iloc[row][ls.__len__()])
        elif RangeDataFrame.iloc[row][3] == 'Below_Range':
            jsonObj = {
                "label": "{} {}".format("Report ", row),
                "radius": 9,
                "pointStyle": "rectRounded",
                "data": [{
                    "x": BelowRange.iloc[row][ls.__len__()],
                    "y": MainData.iloc[row]['Row_Main']
                }],
                "backgroundColor": "#ec260e"
            }

            jsonObject["BelowRange"]["datasets"].append(jsonObj)
            #arr1 = np.append(arr1, BelowRange.iloc[row][ls.__len__()])
        else:
            jsonObj = {
                "label": "{} {}".format("Report ", row),
                "radius": 9,
                "pointStyle": "rectRounded",
                "data": [{
                    "x": OutOfRange.iloc[row][ls.__len__()],
                    "y": MainData.iloc[row]['Row_Main']
                }],
                "backgroundColor": "#FFFF00"
            }

            jsonObject["AboveRange"]["datasets"].append(jsonObj)
            #arr1 = np.append(arr1, OutOfRange.iloc[row][ls.__len__()])

    data=json.dumps(jsonObject)
    return data

print(firstPage(dataFrame))