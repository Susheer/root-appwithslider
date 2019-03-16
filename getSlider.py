from datetime import datetime, timedelta
import time
from pymongo import MongoClient
import pandas as pd
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

    except:
        errorobj = {
            "success": "false",
            "Error": [{"statusCode": 404, "details": "Records Not Found"}]
        }
        Eobject = json.dumps(errorobj)
        print(Eobject)

    x_min = Dataframe['IQR_main'].min()
    x_max = Dataframe['IQR_main'].max()
    y_min = Dataframe['Row_Main'].min()
    y_max = Dataframe['Row_Main'].max()

    jsonObject = {
        "success": "true",
        "Error": [],
        "WithinRange": {
            "x_min": x_min,
            "x_max": x_max,
            "y_min": y_min,
            "y_max": y_max,
            "datasets": []
        },
        "BelowRange": {
            "x_min": x_min,
            "x_max": x_max,
            "y_min": y_min,
            "y_max": y_max,
            "datasets": []
        },
        "AboveRange": {
            "x_min": x_min,
            "x_max": x_max,
            "y_min": y_min,
            "y_max": y_max,
            "datasets": []
        }
    }
    for row in range(Dataframe.__len__()):
        if Dataframe.iloc[row]['Range'] == 'In_Range':
            jsonObj = {
                "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
                "pointStyle": "circle",
                "data": [{
                    "x": Dataframe.iloc[row]['IQR_main'],
                    "y": Dataframe.iloc[row]['Row_Main'],
                    "r": 9
                }],
                "backgroundColor": "#30e110"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)

        elif Dataframe.iloc[row]['Range'] == 'Below_Range':
            jsonObj = {
                "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
                "pointStyle": "circle",
                "data": [{
                    "x": Dataframe.iloc[row]['IQR_main'],
                    "y": Dataframe.iloc[row]['Row_Main'],
                    "r": 9
                }],
                "backgroundColor": "#ec260e"
            }
            jsonObject["BelowRange"]["datasets"].append(jsonObj)

        else:
            jsonObj = {
                "label": "{} {}".format("Report", Dataframe.iloc[row]['Index']),
                "pointStyle": "circle",
                "data": [{
                    "x": Dataframe.iloc[row]['IQR_main'],
                    "y": Dataframe.iloc[row]['Row_Main'],
                    "r": 9
                }],
                "backgroundColor": "#FFFF00"
            }
            jsonObject["AboveRange"]["datasets"].append(jsonObj)

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
