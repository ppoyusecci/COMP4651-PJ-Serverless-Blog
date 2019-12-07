import os
import requests
from urllib.parse import parse_qs

def handle(req):
    query = os.environ['Http_Query']
    params = parse_qs(query)
    action = params['action'][0]

    gateway_hostname = os.getenv("gateway_hostname")
    r = requests.get("http://" + gateway_hostname + ":8080/function/redis-fn", data=action)

    ## Read "./html/[action].html" files
    #path = os.environ['Http_Path']
    #pathArr = path.split("/")
    #pageName = pathArr[1]
    #dirname = os.path.dirname(__file__)
    #page = os.path.join(dirname, 'html', action + '.html')
    #with(open(page, 'r')) as file:
    #    html = file.read()

    return r.text;