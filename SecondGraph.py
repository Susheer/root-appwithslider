import pandas as pd
import numpy as np
import json
import sys
from pymongo import MongoClient
import random

index = sys.argv[1]
# index='A18344019'
myclient = MongoClient('localhost', 27017)
mydb = myclient["Artis"]
reportTable = mydb["report_tbl"]
Quant25_Table = mydb["Lookup_tbl"]


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


# df = df.dropna(how='all', axis=1)
# print(df)
Lookup_row = Quant25_Table.find_one()
Lookup_db = pd.DataFrame.from_dict(Lookup_row, orient='index').drop('_id')
# print(Lookup_db)

cst40 = 0

if np.logical_and('cstAt40Max' in Lookup_db.index, 'cstAt40Min' in Lookup_db.index):
    Lookup_clm = Lookup_db.drop(['cstAt40Max', 'cstAt40Min']).index
    Lookup_clm = np.append(Lookup_clm, 'cstAt40')
    cst40 = 1
elif 'cstAt40Max' in Lookup_db.index:
    Lookup_clm = Lookup_db.drop('cstAt40Max').index
    Lookup_clm = np.append(Lookup_clm, 'cstAt40')
    cst40 = 2
elif 'cstAt40Min' in Lookup_db.index:
    Lookup_clm = Lookup_db.drop('cstAt40Min').index
    Lookup_clm = np.append(Lookup_clm, 'cstAt40')
    cst40 = 3
else:
    Lookup_clm = Lookup_db.index


dff = df[Lookup_clm]
dff = dff.dropna(how='all', axis=1)

column = dff.columns
# print(column)

# print(df.loc[0]['Comment'])
if df.loc[0]['Comment'] != None:
    data = df.loc[0]['Comment']
    # print('---------------', df.loc[0]['Comment'])
else:
    data = 'N/A'
# print(data,'-----------------')
jsonObject = {
    "success": "true",
    "Comments": data,
    "WithinRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": -10,
        "y_max": 120,
        "datasets": []
    },
    "BelowRange": {
        "x_min": -10,
        "x_max": 120,
        "y_min": -10,
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
Wct = 0
Act = 0
Bct = 0

for clm in range(column.__len__()):
    # if column[clm] in df.columns:
    # print('not nan-----------', df.iloc[0][Lookup_clm[clm]])
    if np.logical_and(column[clm] != 'cstAt40', column[clm] != 'FlashPoint'):
        if df.iloc[0][column[clm]] > Lookup_db.loc[column[clm]][0]:
            jsonObj = {
                "label": column[clm],
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#FFA500"
            }
            jsonObject["AboveRange"]["datasets"].append(jsonObj)

        elif df.iloc[0][column[clm]] < Lookup_db.loc[column[clm]][0]:
            jsonObj = {
                "label": column[clm],
                "pointStyle": "circle",
                "data": [{
                    "x": random.randint(1, 100),
                    "y": random.randint(1, 100),
                    "r": 9,
                }],
                "backgroundColor": "#008000"
            }
            jsonObject["WithinRange"]["datasets"].append(jsonObj)

    else:
        if np.logical_and(column[clm] == 'cstAt40', cst40 == 1):
            if df.iloc[0][column[clm]] > Lookup_db.loc['cstAt40Max'][0]:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["AboveRange"]["datasets"].append(jsonObj)

            elif np.logical_and(df.iloc[0][column[clm]] > Lookup_db.loc['cstAt40Min'][0], df.iloc[0][column[clm]] < Lookup_db.loc['cstAt40Max'][0]):
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#008000"
                }
                jsonObject["WithinRange"]["datasets"].append(jsonObj)

            elif df.iloc[0][column[clm]] < Lookup_db.loc['cstAt40Min'][0]:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["BelowRange"]["datasets"].append(jsonObj)
        elif np.logical_and(column[clm] == 'cstAt40', cst40 == 2):
            if df.iloc[0][column[clm]] > Lookup_db.loc['cstAt40Max'][0]:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["AboveRange"]["datasets"].append(jsonObj)
            else:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#008000"
                }
                jsonObject["WithinRange"]["datasets"].append(jsonObj)
        elif np.logical_and(column[clm] == 'cstAt40', cst40 == 3):
            if df.iloc[0][column[clm]] < Lookup_db.loc['cstAt40Min'][0]:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["BelowRange"]["datasets"].append(jsonObj)
            else:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#008000"
                }
                jsonObject["WithinRange"]["datasets"].append(jsonObj)

        elif column[clm] == 'FlashPoint':
            if df.iloc[0][column[clm]] > Lookup_db.loc['FlashPoint'][0]:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#008000"
                }
                jsonObject["WithinRange"]["datasets"].append(jsonObj)

            elif df.iloc[0][column[clm]] < Lookup_db.loc['FlashPoint'][0]:
                jsonObj = {
                    "label": column[clm],
                    "pointStyle": "circle",
                    "data": [{
                        "x": random.randint(1, 100),
                        "y": random.randint(1, 100),
                        "r": 9,
                    }],
                    "backgroundColor": "#FFA500"
                }
                jsonObject["BelowRange"]["datasets"].append(jsonObj)


Data = json.dumps(jsonObject)
print(Data)
