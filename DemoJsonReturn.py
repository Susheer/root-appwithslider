import json


def retunJson(self):
    jsonObject = {
        "success": "true",
        "WithinRange": {
            "datasets": [{
                "label": "Report1",
               
                "pointStyle": "rectRounded",
                "data": [{
                    "x": 20,
                    "y": 410,
                    "r": 9,
                }],
                "backgroundColor": "#30e110"
            }]
        },
        "BelowRange": {
            "datasets": [{
                "label": "Report1",
                "radius": 9,
                "pointStyle": "rectRounded",
                "data": [{
                    "x": 20,
                    "y": 410
                }],
                "backgroundColor": "#ec260e"
            }]
        },
        "AboveRange": {
            "datasets": [{
                "label": "Report1",
                "radius": 9,
                "pointStyle": "rectRounded",
                "data": [{
                    "x": 20,
                    "y": 410
                }],
                "backgroundColor": "#FFFF00"
            }]
        }

    }
    return json.dumps(jsonObject)


print(retunJson(1))
