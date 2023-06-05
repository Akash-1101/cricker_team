// const express = require("express");
// const app = express();
// const { open } = require("sqlite");
// const path = require("path");
// app.use(express.json());
// const dbpath = path.join(__dirname, "cricketTeam.db");
// const sqlite3 = require("sqlite3");
// let db = null;
// const initializingServer = async () => {
//   try {
//     db = await open({
//       filename: dbpath,
//       driver: sqlite3.Database,
//     });
//     app.listen(3001, () => {
//       console.log("The server running at http://localhost:3000");
//     });
//   } catch (e) {
//     console.log(`DB Error: ${e.message}`);
//     process.exit(1);
//   }
// };
// initializingServer();

// const convertDbObjectToResponseObject = (dbObject) => {
//   return {
//     playerId: dbObject.player_id,
//     playerName: dbObject.player_name,
//     jerseyNumber: dbObject.jersey_number,
//     role: dbObject.role,
//   };
// };

// app.get("/players/", async (request, response) => {
//   const getPlayersQuery = `
//     SELECT
//       *
//     FROM
//       cricket_team;`;
//   const playersArray = await db.all(getPlayersQuery);
//   response.send(
//     playersArray.map((eachPlayer) =>
//       convertDbObjectToResponseObject(eachPlayer)
//     )
//   );
// });

// app.post("/players/", async (request, response) => {
//   const { playerName, jerseyNumber, role } = request.body;
//   const postPlayerQuery = `
//   INSERT INTO
//     cricket_team (player_name, jersey_number, role)
//   VALUES
//     ('${playerName}', ${jerseyNumber}, '${role}');`;
//   const player = await db.run(postPlayerQuery);
//   response.send("Player Added to Team");
// });

// app.get("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const getBookQuery = `
//         SELECT
//         *
//         FROM
//         cricket_team
//         WHERE
//         player_id = ${playerId};`;
//   const book = await db.get(getBookQuery);
//   const playDE = convertDbObjectToResponseObject(book);
//   response.send(playDE);

//   //   const { playerId } = request.params;
//   //   const getPlayerQuery = `SELECT
//   //                                 *
//   //                             FROM
//   //                                 cricket_team
//   //                             WHERE
//   //                                  player_id=${playerId}`;
//   //   const dbresponse = await db.get(getPlayerQuery);
//   //   //   let updateItem = convertDbObjectToResponseObject(dbresponse);
//   //   response.send(dbresponse);
// });

// app.put("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const playerDetails = request.body;
//   const { playerName, jerseyNumber, role } = playerDetails;
//   const Updatequery = `UPDATE
//                              cricket_team
//                         SET
//                             player_name='${playerName}',
//                             jersey_number=${jerseyNumber},
//                             role='${role}'
//                         WHERE
//                             player_id=${playerId}`;

//   await db.run(Updatequery);
//   response.send("Player Details Updated");
// });

// app.delete("/players/:playerId/", async (request, response) => {
//   const { playerId } = request.params;
//   const deleteQuery = `DELETE FROM
//       cricket_team
//     WHERE
//       player_id = ${playerId};`;
//   await db.run(deleteQuery);
//   response.send("Player Removed");
// });

// module.exports = app;
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team ORDER BY player_id`;
  const playersArray = await database.all(getPlayersQuery);
  //   response.send(
  //     playersArray.map((eachPlayer) =>
  //       convertDbObjectToResponseObject(eachPlayer)
  //     )
  //   );
  response.send(playersArray);
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT 
      * 
    FROM 
      cricket_team 
    WHERE 
      player_id = ${playerId};`;
  const player = await database.get(getPlayerQuery);
  response.send(convertDbObjectToResponseObject(player));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await database.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`;

  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
