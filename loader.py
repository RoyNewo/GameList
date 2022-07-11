import json
import os
def init():
    global root
    if os.path.exists('settings.json'):
        with open('settings.json') as f:
            settings = json.load(f)
        if 'root' in settings and settings['root'] != '':
            root = settings['root']
            return True
        else:
            print('No se ha definido la ruta principal')
            return False
    else:
        print('No se encontro el archivo de configuracion')
        print('Por favor, crea un archivo settings.json')
        print('Para mas informacion, ve a la pagina de github')
        return False