from datetime import datetime, timedelta
import time
from pymongo import MongoClient
import pandas as pd
import numpy as np
import random
import json
import sys

currentDT = datetime.now()
cur_Dt = time.mktime(datetime.strptime(
    currentDT.strftime("%d/%m/%Y "), "%d/%m/%Y ").timetuple())
cur_Date = str(int(cur_Dt))+'000'


# from_d='24'
from_d = sys.argv[1]


def Date_Picker(fromDate, toDate):
    myclient = MongoClient('localhost', 27017)
    mydb = myclient["Artis"]
    Result_Table = mydb["Result_tbl"]
    # res = Result_Table.find()

    Dataframe = pd.DataFrame()

    try:
        Dataframe = pd.DataFrame(list(Result_Table.find(
            {'Date': {'$lt': int(toDate), '$gte': int(fromDate)}})))
        if Dataframe.empty:
            errorobj = {
                "success": "false",
                "Error": [{"statusCode": 404, "details": "Records Not Found"}]
            }
            Eobject = json.dumps(errorobj)
            print(Eobject)
            # print("====================================")

    except:
        errorobj = {
            "success": "false",
            "Error": [{"statusCode": 404, "details": "Records Not Found"}]
        }
        Eobject = json.dumps(errorobj)
        print(Eobject)
        # print(eval)

    x_max = Dataframe['IQR_main'].max()/100
    x_min = Dataframe['IQR_main'].min()/x_max-20
    y_max = Dataframe['Row_Main'].max()/100
    y_min = Dataframe['Row_Main'].min()/y_max-20

    jsonObject = {
        "success": "true",
        "Error": [],
        "WithinRange": {
            "x_min": x_min,
            "x_max": 120,
            "y_min": y_min,
            "y_max": 120,
            "datasets": []
        },
        "BelowRange": {
            "x_min": x_min,
            "x_max": 120,
            "y_min": y_min,
            "y_max": 120,
            "datasets": []
        },
        "AboveRange": {
            "x_min": x_min,
            "x_max": 120,
            "y_min": y_min,
            "y_max": 120,
            "datasets": []
        }
    }
    for row in range(Dataframe.__len__()):
        if np.logical_and(Dataframe.iloc[row]['Range'] == 0, Dataframe.iloc[row]['Range_1'] == 0):
            if Dataframe.iloc[row]['Range_2'] > 20:
                jsonObj = {
                    "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
                    "pointStyle": "circle",
                    "data": [{
                        # "x": Dataframe.iloc[row]['IQR_main']/x_max,
                        # "y": Dataframe.iloc[row]['Row_Main']/y_max,
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9
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
                    "r": 9
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["AboveRange"]["datasets"].append(jsonObj)

        # elif Dataframe.iloc[row]['Range_1'] != 0:
        #     jsonObj = {
        #         "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
        #         "pointStyle": "circle",
        #         "data": [{
        #             "x": Dataframe.iloc[row]['IQR_main']/x_max,
        #             "y": Dataframe.iloc[row]['Row_Main']/y_max,
        #             "r": 9
        #         }],
        #         "backgroundColor": "#FFA500"
        #     }
        #     jsonObject["BelowRange"]["datasets"].append(jsonObj)

    data = json.dumps(jsonObject)
    return data


if from_d == '0':
    # print("000000000000000000")
    print(Date_Picker('0000000000000', cur_Date))

elif from_d == '6':
    # print("11111111111")
    date_N_days_ago = datetime.now() - timedelta(days=365)
    ago_d = date_N_days_ago.strftime("%d/%m/%Y")
    fr_date = time.mktime(datetime.strptime(ago_d, "%d/%m/%Y").timetuple())
    from_Date = str(int(fr_date)) + '000'
    print(Date_Picker(from_Date, cur_Date))


elif from_d == '12':
    # print("22222222222222222222")
    date_N_days_ago = datetime.now() - timedelta(days=91)
    ago_d = date_N_days_ago.strftime("%d/%m/%Y")
    fr_date = time.mktime(datetime.strptime(ago_d, "%d/%m/%Y").timetuple())
    from_Date = str(int(fr_date)) + '000'
    print(Date_Picker(from_Date, cur_Date))


elif from_d == '18':
    # print("33333333333333333")
    date_N_days_ago = datetime.now() - timedelta(days=30)
    ago_d = date_N_days_ago.strftime("%d/%m/%Y")
    fr_date = time.mktime(datetime.strptime(ago_d, "%d/%m/%Y").timetuple())
    from_Date = str(int(fr_date)) + '000'
    print(Date_Picker(from_Date, cur_Date))

elif from_d == '24':
    # print("44444444444")
    date_N_days_ago = datetime.now() - timedelta(days=15)
    ago_d = date_N_days_ago.strftime("%d/%m/%Y")
    fr_date = time.mktime(datetime.strptime(ago_d, "%d/%m/%Y").timetuple())
    from_Date = str(int(fr_date)) + '000'
    print(Date_Picker(from_Date, cur_Date))

else:
    # print("5555555555")
    date_N_days_ago = datetime.now() - timedelta(days=7)
    ago_d = date_N_days_ago.strftime("%d/%m/%Y")
    fr_date = time.mktime(datetime.strptime(ago_d, "%d/%m/%Y").timetuple())
    from_Date = str(int(fr_date)) + '000'
    print(Date_Picker(from_Date, cur_Date))
