# Documentation

### Introduction

The goal of this project was to implement the board game Scrabble on a website
in order to make it easier for friends to play the game without having to worry
too much about time, place or if someone owns the game.

### Technologies

We made use of WebSockets for seemless synchronisation between the players during a game and
REST endpoints to handle out of game interactions.

### High-level components:

- [Game Entity](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/blob/main/src/main/java/ch/uzh/ifi/hase/soprafs24/entity/Game.java):
  The Game Entity stores all the necessary information for a game like, the players, the start time, the points of the players, the board, the tiles and much more.
- [Game Controller](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/blob/main/src/main/java/ch/uzh/ifi/hase/soprafs24/controller/GameController.java):
  The Game Controller handles the interactions that lead up to a game, creating a game, adding users to a game, retrieving information about a certain game. The Game Controller accesses and possibly changes the values stored inside the Game Entity
- [Websocket Controller](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/blob/main/src/main/java/ch/uzh/ifi/hase/soprafs24/websocket/WebSocketController.java):
  The Websocket Controller is responsible for all the actions during the actual game. All actions are sent to the Controller where they are then handled and changes are propagated to the Game Entity and saved there.

### Launch & Deployment

To run, our project needs the [Server repository](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server) and the [Client repository](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client). 
<br>After having cloned these two repositories,
follow the respective
[Server README.md](https://github.com/HASEL-UZH/sopra-fs25-template-server/blob/main/README.md)
and [Client README.md](https://github.com/HASEL-UZH/sopra-fs25-template-client)
from the templates used. <br> With that both the server and the client should be
running locally. <br> Releases can be pushed onto a new branch and then
approval for a merge can be requested.

### Illustrations

![image](https://github.com/user-attachments/assets/04ef2957-d364-4f92-9a48-791a6e869be4)

Our landing page is the login/register page. After having created an account or
logging in, the user is then routed to the dashboard page.

![image](https://github.com/user-attachments/assets/8476ed66-d9b8-41fe-baa6-cbdf895007e6)

On here the user can add friends, create a lobby for a game or checkout the
leaderboard. Creating a game pushes the user to a lobby where they can invite a
different user.

![image](https://github.com/user-attachments/assets/d4df77d2-cceb-4f6d-b14e-488fd6421c07)

After an invited user accepted, the host can then start the game upon which both
users are pushed to the same game page.

![image](https://github.com/user-attachments/assets/caf40bb0-d8df-430d-b8ce-736cc74e83fb)

Here the two users can play their game and also checkout the rules for the game
if they are unfamiliar with them. After the game has ended, the users will be
pushed to the evaluation page.

![image](https://github.com/user-attachments/assets/edd443ff-9332-48b5-b158-65b9313d59b3)

On this page they can start a rematch with the same opponent or go back to the
dashboard page.

### Roadmap

- Increasing amount of players from 2 to 4
- Changing global timer to personal timer that is running only on one's turn
- Add user profiles

### Authors and acknowledgment
* Eng Manuel - [Alumen-Eng](https://github.com/Alumen-Eng)
* Zanetti Luca - [Mex7180](https://github.com/Mex7180)
* Kern Lucien- [LucKer58](https://github.com/LucKer58)
* Kasper Silvan - [SilvanKasper](https:://github.com/SilvanKasper)
* Fuhrer Andrin- [AfNuDhRrIeNr](https://github.com/AfNuDhRrIeNr)

We would like to thank Lukas Niederhart, our TA, for providing useful guidance and input.
