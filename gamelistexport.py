import loader, csv_parser, galaxy_library_export
from icecream import ic
import requests
from PIL import Image
import os

def main():
    galaxy_library_export.main()
    csv_parser.main(['gamelistexport.py','--image-list'])
    if os.path.exists(f'{loader.root}/imagelist.txt'):
        with open(f'{loader.root}/imagelist.txt') as file:
            while (line := file.readline().rstrip()):
                ic(line)
                im = Image.open(requests.get(line, stream=True).raw).convert("RGB")
                imagename = str(line).replace("http://images.gog.com/","").replace("?namespace=gamesdb","")
                ic(imagename)
                imageroute = f'{loader.root}/images/{imagename}'
                im.save(imageroute, "webp")
    csv_parser.main(['gamelistexport.py','--html5'])        

if __name__ == "__main__":
    main()