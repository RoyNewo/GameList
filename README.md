# GameList

This library takes the work from:

 - **AB1908: GOG Galaxy Export Script** =>
   https://github.com/AB1908/GOG-Galaxy-Export-Script   
   
 - **Varstahl: GOG Galaxy HTML5 exporter** =>   
   https://github.com/Varstahl/GOG-Galaxy-HTML5-exporter

  

So first, kudos to them and their hard work.  

It takes their two main processes and makes it only one.

Also, this program is ready to be used locally or by docker, the difference would be the config in settings.json

## Usage

if you want to use it in local set root option in setting the path where you are downloaded this repository for example:

/home/user/Github/GameList

  

Also, if you are using this in windows directly or mac it would take the location of your galaxy-2.0.db automatically

 - Windows: "C:\\ProgramData\\GOG.com\\Galaxy\\storage\\galaxy-2.0.db"
 - Mac: "/Users/Shared/GOG.com/Galaxy/Storage/galaxy-2.0.db"

But for Linux you must copy galaxy-2.0.db to the path you are added to settings.json

Next, in the repository there is a requirements.txt that has all the python Python modules needed so, standing in the path of this repository:

    pipenv  install  -r requirements.txt

Finally, just need to execture the main.py file (make sure that you are in the correct path):

    pipenv shell
    python3 main.py

## Docker
First build the docker image. My recommendation is:

 1. Go to the path of this repository
 2. `docker build -t RoyNewo/GameList:latest .`

After that run the image, but take these considerations:

 - You need to pass the galaxy-2.0.db location if you can reach directly or copy the file to some path that you can pass to docker (if you are going to copy the file i recommend putting it in this repository directly).
 - You need to pass the path where you downloaded this repository, because the docker is going to generate images, index.html and some other files.

***Examples:***
With docker run:

    enter code here
With docker-compose:

    enter code here
