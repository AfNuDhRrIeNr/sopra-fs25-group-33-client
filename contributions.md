# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - [24.03.25] to [02.04.25]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **Alumen-Eng** | 26.03.25   | [commit c73f0f7](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/c73f0f7) | Design of Lobby for 1 and 2 player | Lobby is the prestate of the game and necessary to get into a game. |
|                    | 30.03.25   | [commit 80cc206](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/80cc206) [commit 57f0599](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/57f0599) | Create the design of the gamestate page | Gamestate is needed to play the game |
| **AfNuDhRrIeNr** | 25.03.25   | [Commit 35b62ce](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/35b62ce646edc8369f6d878e5ecc13035b64fe5d)| Implementing game structure (lobby database structure) | relevant for creating a lobby |
|                    | 27.03.25   | [Commit df2acfd](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/df2acfd16a25d522bd2c416688ce5396b2fd39ec) | createGame endpoint implementation| relevant for creating a new game (creating lobby)|
|                    | 30.03.25   | [Commit bd786f2](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/bd786f246e7227a9f8773040004d779c7b48e5e2) | Implementation lobby endpoint GET & PUT (3 commits in total [67f2da0], [651acd1]) | User can join a game |
| **Mex7180** | 01.04.25   | [Commit b13efce](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/b13efced7701f106863cc2521f10db5945332f2e) | Implement websocket handshake & endpoint to exchange game state with necessary classes & DTO's| Underlying basis for the communication within the game (send game state, moves, validate words etc.) |
|             | 01.04.25   | [Commit a253525](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/a2535252641416e51d564e4bb8da0f6b96ee4c41) | Add unit tests for websocket implementations (task above) | Verify correctness of handshake and server to client communication subscriptions.
|                    | 01.04.25   | [Commit 9d92b14](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/9d92b140349d0831b820b46a9e797bda8c14b505) | Implement frontend application to test websockets as postman does not work with STOM protocol | Allows backend team to test and verify their implementation first before publishing code for client |
|              |   26.03.25         | [Commit e3147c7](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/e3147c7534114a7ad1949d134c24be790d7dcdb8) | Set up first draft of entity such that everybody can start working | Ensure that everybody has the same entities and no conficts occure |
| **LucKer58** | 26.03.25   | [Commit ad3827f](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/ad3827fefdd462a3e43e98310a8ae521e6747fc4)| Implement users/register endpoint and funtionality | User needs account to play the game|
|                    | 26.03.25   | [Commit 42a9585](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/42a95850d1c986b843748bd1b4c765be5f85a339) | Implement users/login endpoint and funtionality | Allows only users with valid credentials to login and play
|                    | 29.03.25   | [Commit 5ebe85b](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/5ebe85bf103d59b1cb7ddf6b27f41480fa98803e) | Test cases for the users/register and users/login endpoints | Asserts validity of endpoints |
|                    | 29.03.25 - 01.04.25   | [Commit 2cd41aa](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/2cd41aace03df686d7d9276c1ce2f47ed907942e) | Write and test the logic of the validation of a move and generate the new words | Essential to for the playing of the game. Also important to test, such that the algorithm really works |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **SilvanKasper** | 25.03.25   | [Commit fcec503](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/fcec503a1e376296fb6709d97e0e903a1b02447d) | Design of login page | Login is the landing page of ScrabbleNow |
|                    | 26.03.25   | [Commit 8c422b2](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/8c422b242729fa8325b460fba54473ec3f91fbed)| Both Login and Register work from the same page | Only logged in users can play ScrabbleNow |
|                    | 26.03.25   | [Commit 61d6a1a](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/pull/40/commits/61d6a1aa08780ff33e35f2b5023e3e58932ad149) | Design the Dashboards components | From the Dashboard a user can create or join a game |
| | 01.04.25  | [Commit d8b93f4](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/d8b93f4b8af53c5bd00d31ed06dd8fe123095afa) | Implement feature to send and recieve friend requests | Crucial since in our V1 only friends can play ScrabbleNow together |

---

## Contributions Week 2 - [02.04.25] to [09.04.25]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **Alumen-Eng** | 06.04.25  | [commit 6cb28af](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/6cb28af) | Gamestate design almost completed| A complete Gamestate design is necessary to play the game. |
|                    | 06.04.25   | [commit ccb6031](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/ccb6031) | Drag and Drop feature of playing tiles | Drag and Drop is how tiles are moved and ultimately moves are made. |
|                    | 05.04.25   | [commit 17bba70](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/17bba70) [commit f06ec14](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/f06ec14)| Figure out how many tiles of a letter are left in play | This info can be used to strategize following moves |
|                    | 06.04.25   | [commit 85a2394](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/85a2394) [commit 7f615a2](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/7f615a2)| Connect to Websocket in Gamestate | Websocket is used to display info on the gamestate page for both players |
|                    | 08.04.25  | [b0deb94](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/b0deb94) [ce1b389](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/ce1b389)| Design selection for tiles to exchange | Tile exchange is an integral part of Scrabble, being able to select tiles is integral to exchanging them |
| **AfNuDhRrIeNr** |    |  |  | Joker Week |
| **LucKer58** | 05.04.25   | [Commit c75490f](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/c75490fac17573f6ce171d673fce1f3c35ec8dca) | Make the call to the external API to check every generated word for its validity | Important for the user to understand if the all the new words generated by the newly placed tiles are valid |
|                    | 06.- 07.04.25   | [Commit af8e26c](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/af8e26c962cf50322c35b07a5ecd5fc9806312af) | Understand Websocket endpoints and implement functionality for validation | Important for communication between front- and backend and important that only the user who validates gets response and not both users who |
| **Mex7180** | 04.04.2025  | [Commit cf3ccb6](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/pull/159/commits/cf3ccb6844e14b23c74a09256983969b5118b159) | Adjust Game Put endpoint to support GameState changes & remove possibility to add players | Preparations for sending Game invitations which are needed to play the game. |
|            | 08.04.2025 |  [Commit 8a6d473](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/pull/159/commits/8a6d47377a0ec350997fb84f75733928f5f8fa99) |  (Part 2 to commit above)  | (Part 2 to commit above)
|                    | 08.04.2025   | [Commit e759461](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/e759461d05f738d1c1bfe9f2a99ad493b1984e96) | Implement Get, Put & Post endpoint for Game Invitations & (partially) cover implementation with test cases | Allows for users to invite each other and to play the game toghether. |
|          | 08.04.2025 | [Commit b098fb9](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/b098fb9eeb2560e1901ab1e53c5e3887b085a2b5) | (Part 2 to commit above) | (Part 2 to commit above) |
| **SilvanKasper** |   |  |  | Joker Week |

---

## Contributions Week 3 - [09.04.25] to [16.04.25]


| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **Alumen-Eng** | 15.04.2025   | [Commit bb8691d](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/6bb8691d) | Websocket connection working | Websocket is important to keep gamestate update to date for multiple users |
|                    | 16.04.2025   | [Commit 2425b1a](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/2425b1a) | Refilling hand using tiles from backend after commit | a player always needs to have 7 tiles in their hand |
|                    | 16.04.2025   | [Commit f644b55](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/f644b55) | Comitted tiles are immutable | Tiles on the board should not be moveable anymore |
|                    | 16.04.2025   | [Commit a8e35bd](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/a8e35bd) | Exchanging tiles for new ones | To refill hand with possibly more useful tiles |
| **AfNuDhRrIeNr** | 09.04.2025   | [Commit 8679316](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/8679316ca7ea2ecdf7b7c6d3e4f042f0b53d640a)| implement letterCount constant, implemented letterBag game entity | Keeping track of the letters left |
|                    | 14.04.2025   | [Commit 7048d7a](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/7048d7a934656fa311dcbf6013c6af0e221df96d) | implementing exchangeTiles, assignTiles, getRemainingLetters endpoint & the corresponding logic | assigning tiles, exchanging tiles and ask for remaining letters |
|                    | 15.04.2025   | [Commit 774e004](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/774e0041ae1c39242b8cc699f8e34b847950fd5b) | Bugfix exchange tiles & bugfix lobby creation | player wants to exchange tiles & player want to create lobby |
| **LucKer58** | 10.04.25   | [Commit c1fba12](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/c1fba128bc4535cf4c8005afd2b9d6e084cec7df) | implement LetterPoints constant and BoardStatus constant | For calculation of the points of a move |
|                    | 12-13.04.25   | [Commit dea36b0](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/dea36b0050aef84b1e141e4be985fb7bbfdc6dbc) | Add MoveSubmitService to calculate points for a move and persist new GameBoard | needed to inform players on points |
| **Mex7180** | 15.04.2025   | [Commit 8a52e6c](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/8a52e6cd1fee414e58e04f77e2e057bcce35ce24) | Implement FriendRequests GET, POST, PUT endpoint. Required updates to user entity (fix infinite self referencing) | Enables the whole invite friends and play with friends workflow. |
|                    | 15.04.2024   | [Commit 6ac4a30](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/6ac4a308378bc619aedca17680ffabf604aee738) | Adjust GET users endpoint to allow for filtering and sorting of users] | For Leaderboard and frontend to detailed user information for one user only |
| **SilvanKasper**  | 10.04.25   | [Commit f8afb93](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/f8afb933bc081ab7d8e66a78838b90ae99153270) [Commit c1a09c5](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/c1a09c5dd55bc3dbb59e84827cef1db8ba163aa0) | Implement Logic for GameInvitations and FriendRequests | Both must work before two players can play against eachother |
|                    | 12.04.25   | [Commit 789b68f](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/789b68fd857dc3b6a11a79131028c67187e28109) [Commit 5a9c9a1](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/5a9c9a1ea7465544c07858f4091c412ffa7e86bf)| GameState: Add Timer, Custom Modals and adapt Button hovering | Those are important parts of our GameState page, relevant to play |
|                    | 14.04.25   | [Commit bc69a1b](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/bc69a1b84eea788f1ea1fb0e5712f56156325227) [Commit 5ae926a](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/5ae926a96e762f20b9f3173996d7fc96123c896e)| Handle Authorization for all API Requests and complete their implementation | Authorization is used all over our API and thus very important |
|                    | 15.04.25   | [Commit 0f0d461](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/0f0d4619f866f603cac0982fc1c9b58a3d2293d7) | Polling for FriendRequests, FriendList and GameInvitations | Needed for two player version of ScrabbleNow |

---

## Contributions Week 4 & 5 - [16.04.25] to [30.04.25]


| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **Alumen-Eng** | 19.04.25   | [Commit d670a5a](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/d670a5a) | Two player gameState functionalities | Two players are needed to play the game |
|                    | 29.04.25   | [Commit d9f5e42](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/d9f5e42) | Routing to eval page | Before eval page design, you should be able to reach it. |
| **AfNuDhRrIeNr** | 18.04.25   | [Commit e0d1f18](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/e0d1f18687313882c82332b3407fb6bf12f0bc31) | give up function backend & frontend commit e7fc083 | User should be able to surrender|
|                    | 22.04.25   | [Commit 7f70359](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/7f703591b44d0564ef4d802cca53a89723e60481) | integration test with test database for the m3 report | Cooperation between different components |
| **LucKer58** | 18.04.25   | [Commit 0b2e01b](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/0b2e01be6abc272af16fd8e04ef58b3ada87cb07) [Commit 9cf5c1d](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/043659bcea3a16d124fc5c4f3a050a9ac523526d)| Implement the websocket endpoint logic of the submission part and write corresponding test| Point calculation, gameboard persistence, communication to frontend |
|                    | 20.04.25   | [Commit 9cf5c1d](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/9cf5c1d745fc078d183d02e6cb8190a417037b4c) | Fixing the algorithm for the calculation of the points | To calculate the correct points |
|                    | 26.04.25   | [Commit b3a19d9](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/b3a19d9e2948e9934f8bc18973f38718344c43f5) | implementing the logic that if a word is evaluated as invalid from the API, I can ask my opponent if the word could be valid (not sure if we want to do this) | Slang words could not be in the dictionary |
| **Mex7180** | 23.04.25   | Commit [5d57f56ec29483a2f9338165a8366fa260e1d33c](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/5d57f56ec29483a2f9338165a8366fa260e1d33c), Commit[22356bde011c755455f1c17ca508b8a9e928c04e](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/22356bde011c755455f1c17ca508b8a9e928c04e), Commit[f343d2135bbd11e68e7ecf706fd1ec2a59e74da9](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/f343d2135bbd11e68e7ecf706fd1ec2a59e74da9) | Fix bugs with invitations | Important logic concerning game invitations was missing. As an example a user could invite more than 2 users to a game etc. causing the application to break. |
|                    | 29.04.25   | Commit[e4bde0c0a9c7f221cae3e78f86dc6a3b4354aa9d](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/e4bde0c0a9c7f221cae3e78f86dc6a3b4354aa9d)    Commit[c6e13addcc68dbf4be209152dfea8bb36f013138](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/c6e13addcc68dbf4be209152dfea8bb36f013138)| Fix bug with reloading page, investigate persistance of tiles | Currently reloading the page would result in losing data and the current state on the board and no call to the backend would be done. |
| **SilvanKasper** | 19.04.25   | [Commit 6522b48](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/6522b4812600681541fc9d1c14eecbb7cec36419) | Both players in same Lobby, update UI accordingly, Refactoring of CustomModal | Players must join same lobby to play against eachother, CustomModal reduces code redundancy |
|  | 27.04.25   | [Commit 4253fa3](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/4253fa3c5527748dac4cc599b064647ec0268faa) [Commit 4b3383f](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/4b3383f8c95d064cc135107018d906324b1a252c)| Autostart Timer and New bag design | Time must be started directly when the player enters the GameState, the new design makes the page less overloaded. |
|  | 29.04.25   | [Commit bd63b09](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/bd63b09d0ff58c1ab18ea4fa0894b2ce1a2f4737) | Implement Turn Timer | If there is no time limit per turn a player that leads can wait until the time is over. That is avoided by a time limit |


---

## Contributions Week 6 - [30.04.25] to [07.05.25]



| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **Alumen-Eng** | 4.5.25   | [Commit e3ea6f6](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/e3ea6f6) | vote to end the game, clickable tiles on the board to return to hand, new custom modal added for decisions, are you sure alert before surrender | Features that add to the experience of playing, vote to end the game is easier than keeping track of number of skips |
|                    | 2.5.25   | [Commit bdf1737](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/bdf1737) | Design of eval page | The endstate / eval page is for after the game ends, allows for navigation and correct handling for when the game is over. |
| **AfNuDhRrIeNr** | 02.05.25   | [Commit a69b05a](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/a69b05a7a7d56d96a0680b8eeaa3fe498684b8a9) | Updating the highscore of each user after a game if necessary and differentiate between surrender and game end action. | The highscore needs to be updated for the leaderboard & if a user surrendered the setSurrenderedPlayerId gets set. |
|                    | 05..05.25-06.05.25   | [Commit edd3c54](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/edd3c54d2fbe75413ca64d1e1fb6f3a6325d3882) | Implementing games deletion endpoint & corresponding tests. | Relevant for the deletion of game entities.|
| **Mex7180** | 06.05.25   | [Commit 3bb0f59](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/3bb0f59a5134f729d7402623353b291c5fd3b80c) | Improvements concerning userTurn, initial fetch and tile management in frontend. | Resolves issues with reloading the page / losing connection. Enables the game to actually be persistent. |
|                    | 06.05.25   | [Commit a91f4b0](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/a91f4b0ec3599f32354ac19e0455c69e538b9066)     [Commit b808d49](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/b808d4954c90e721bee930113a61105a500e0542)    [Commit a9c81c5](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/a9c81c576997d674a851b19da115639fb16edb6e) | Fix bug in exchange tiles function & fix naming conventions. Clean up WebSocketController, adds Initial GameState Fetch endpoints & fixes bugs in letter exchange/reassignment logic. Extend WebSocketController tests | Allows for persistent ganme state and no issues with reloading / losing connection to server. |
| **LucKer58** | 30.04.25   | [Commit 666b6da](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/666b6daa9177b5520db242dd1043eaf23f6f2581) [Commit 7d994dd](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/7d994dd7e59fc6920a52037714dc9fa075070a41)| Set logout the user when he clicks on logout and adjust its status and write corresponding test| Only logged in users should be able to play and important to see status of friends |
|                    | 02.04.25   | [Commit 31e47cd](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/31e47cd6ddc9078c8f7d4d8812bfac2e2f1c74cc) | Also the word multipliers should only be applied for newly placed tiles | Calculate the correct result |
|                    | 03.04.25   | [Commit 9c1aa3d](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/9c1aa3d8b12eb699d59f6688ed57b2e1646c93f8) | The friend's username and status should be sent for the friend's list | Needed to display the status of a friend to see if he is ready to be invited to a game |
| **Silvan Kasper** | 01.05.25  | [Commit 7bc78ca](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/7bc78ca0db6813d7628e2e73b975ef6445802c54) | Design & Logic of Leaderboard page | The leaderboard is the globally persistent part of our game  |
|                    | 01.05.25   | [Commit 84a86f0](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/84a86f08cb4a4c333293332cb23a19b86c8c813f) | Create FriendRequest component to handle in all headers | Same behaviour for each header and nice to have |
|                    | 05.05.25   | [Commit f293144](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/f29314409429afe8bca106bc3899357147fbd1f1) | Upgrade Friends List on Dashboard with status dot and play icon | Now one can see if the friends are available and can invite them directly from dashboard |

---

## Contributions Week 7 - [07.05.25] to [14.05.25]
| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **Alumen-Eng** | 11.05.25   | [Commit 1627dd0](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/1627dd0) [Commit 505b524](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/505b524) | Added some loading between pages, restrictions to visiting sites, paused since Silvan already did the same | Further feedback whether something is happening or not. |
|                    | 13.05.25   |  | cleaning up project board | project board is also graded |
| **AfNuDhRrIeNr** | 07.05.25   |  | clean up the project board | Feedback M3 |
|                    | 08.05.25 - 13.05.25   | [Commit 6bca5b9](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/6bca5b9672cb6fc87e1d283e63e7932ad76aed09) | Timer synchronization backend | Both user should have the same remaining time |
| **Mex7180** | 07.05.25   | n.a. | Clean up project board & enhance traceability | Room for improvement after M3 evaluation. |
|                    | 13.05.25   |  [Commit e81f125](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/e81f125567f4c4bd37ced8f2203d536133e750ca)          [Commit e69444a](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/e69444af4f5ee1dc3c34884bcf539b02894d4ced)| Fix last bugs with tile reassignemnts and board updates (reloading in between actions) & start integrating changes into main (front end)| Enhanced user experience and not loss of state when page is reloaded. |
|                    | 13.05.25   |  [Commit 1915188](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/19151882e010f6ba6ffd528627801573b3412d07)   [Commit 7868e53](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/7868e5399b484c518a6d80c0b5e515fc9111a047) [Commit 6b78d70](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/6b78d708e235a0b9b22626af4d5dbfab68b54a35) | Fix last bugs with tile reassignemnts and board updates (reloading in between actions) & start integrating changes into main (back end) |  Enhanced user experience and not loss of state when page is reloaded. |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **SilvanKasper** | 07.05.25   | n.a. | Clean up project board | [Why this contribution is relevant] |
|                    | 09.05.25   | [Commit 7948890](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/7948890ffbea22d080e6d52bf0cf57cb15d1f440) [Commit b8048c9](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/b8048c95fca3fa564d8c772bce8adea9b0615ceb)| Refactoring FriendRequests, FriendList, Leaderboard. New hook useAuth to prevent unauthorized access. | Overall makes code more robust and clean |
|                    | 13.05.25   | [Commit 62f917b](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commits/82-refactor-silvan-and-sync-time-between-users/) | Sync timer once per minute with backend (took a bit of debugging) | Timer only managed on client so far, could differ significantly from actual played time. |

---

## Contributions Week 8 - [14.05.25] to [21.05.25]
| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **Alumen-Eng** | 16.05.25   | [Commit 446d900](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/446d900) | Finish eval page with correct informations | To get a good sense of the played game |
|                    | 16.05.25   | [Commit edac162](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/edac162) | Added loading animations throughout the flow, lobby actions improved | Loading animation is necessary to let the user know that the site has not crashed and the request was received. More Lobby functionality was needed to match it with expected behaviour. If someone leaves the lobby, the user that is left can now invite someone again to fill the lobby. |
| **AfNuDhRrIeNr** | 15.05.25   | [Commit dbcf633](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/dbcf633306044f7033e2435f6e9430fbaeed9930) | adding tests (addtional commit: 546d6bf)| code coverage |
|                    | 18.05.25   | [Commit 91401a3](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-server/commit/91401a3e1bb6888c44c6b627d11e3341f7453192) | surrender id gets saved in the game entity | retrieve information on whether a player has given up on the game eval page|
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **SilvanKasper** | 14.05.25   | [Commit 0f7e823](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/0f7e823235569c7ad91ffda9cba7fda1cb0ce9de) [Commit 27616c2](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/27616c2a60000c9f00132aa3c4286696cad6d4b9) | Bugfixes for Timer, User status and highscore | Data has to be updated in order to display it later |
|                    | 15.05.25   | [Commit 3e557d0](https://github.com/AfNuDhRrIeNr/sopra-fs25-group-33-client/commit/3e557d06cf9559c63d95c0fc12f84db5e5ba6d54) | The help icon links to the Scrabble Rules and explains how the buttons work | This makes our application easier to learn and increases usability |

---

## Contributions Week 9 - [21.05.25] to [23.05.25]
| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@githubUser1]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser5]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---
