# Binding of isaac four souls
Binding of isaac four souls is a board game created by Edmund Mcmillen and published by MAESTRO MEDIA. ***They are not affiliated with this project***.
This server + client allows for playing the game online similar to [Tabletop Simulator](https://steamcommunity.com/sharedfiles/filedetails/?id=2501791757) in the browser.
To learn the rules and how to play, check out [foursouls.com](https://foursouls.com/rules/)

## Resources
All cards are fetched from: https://pop-life.com/foursouls/

## Setup
* The server requires [node](https://nodejs.org/en/)
* Clone the repo
* In the client folder run `npm install` and `npm build` to install dependencies and build the client
* In the server folder run `npm install` and `num start` to start the server. By default the server will use port 80. This can be changed by changing `PORT` in the top of index.ts

## Instructions

Select a name and join the lobby. The first player to join will be the leader and have the ability to start the game. 
![Join](https://user-images.githubusercontent.com/3136092/184553345-dcb401af-b876-4ee1-b27a-f845dfffe150.png)

In the lobby, select what character to play.
![Lobby](https://user-images.githubusercontent.com/3136092/184553396-fd36f9f8-fbb5-43c2-9565-d8e740bb0772.png)

Move the cards using the mouse. You can also show your hand to other players and let the take your cards using the `show hand` and `open hand` buttons.
Roll the dice by pressing the dice in the middle of the board. Edit decks and look at the top cards without others seeing it by pressing the `edit a deck` button. Turn cards 90 degrees by double clicking them and add counters when hovering the cards in your play field. 
***Note: Once you are in a game, it will not be possible to rejoin, so dont refresh the browser window***
![Board](https://user-images.githubusercontent.com/3136092/184553421-e69443a1-7219-4bd0-9421-dec35daee36f.png)
