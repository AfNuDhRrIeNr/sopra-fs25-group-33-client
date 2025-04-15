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
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser5]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 4 - [Begin Date] to [End Date]


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

## Contributions Week 5 - [Begin Date] to [End Date]



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

## Contributions Week 6 - [Begin Date] to [End Date]

_Continue with the same table format as above._
