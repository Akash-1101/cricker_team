const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
app.use(express.json());
const dbpath = path.join(__dirname, "cricketTeam.db");
const sqlite3 = require("sqlite3");
let db = null;
const initializingServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("The server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializingServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const playersAllQuery = `SELECT * FROM cricket_team ORDER BY player_id`;
  const dbresponse = await db.all(playersAllQuery);
  let list = [];
  for (let i of dbresponse) {
    let updateItem = convertDbObjectToResponseObject(i);
    list.push(updateItem);
  }
  response.send(list);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const PostQuery = `INSERT INTO cricket_team (player_id,player_name,jersey_number,role) VALUES (20,'${playerName}',${jerseyNumber},'${role})' `;
  try {
    const dbreponse = await db.run(PostQuery);
  } catch (e) {
    console.log(`DB:ERROR`);
  }

  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId}`;
  const dbresponse1 = await db.get(getPlayerQuery);
  //   let updateItem = convertDbObjectToResponseObject(dbresponse);
  response.send(dbresponse1);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const Updatequery = `UPDATE 
                             cricket_team 
                        SET 
                            player_name='${playerName}',
                            jersey_number=${jerseyNumber},
                            role='${role}'`;
  await db.run(Updatequery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
