import loader, gamelistexport
def main():
    if loader.init():
        gamelistexport.main()
if __name__ == "__main__":
    main()