const Player = require('../classes/Player.js')
const Match = require('../classes/Match.js')
const Tournament = require('../classes/Tournament.js')
const Week = require('../classes/Week.js')
const utils = require('./game.utils.js')

const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: "postgres://wrbetfiymlulha:fc7970280bff58a139b9b8da6bbacff6de4c4e231784715c63f248f50fc08019@ec2-79-125-86-58.eu-west-1.compute.amazonaws.com:5432/da1dgcsikfl2ud",
            ssl: {
        rejectUnauthorized: false
    }
    }
});



async function play() {
  const rows = await db('players').join('plskills', 'players.id', 'plskills.plid')
                                  .join('plstats', 'players.id', 'plstats.plid')
                      .select(
                                'players.id',
                                'players.name',
                                'players.age',
                                'plskills.power',
                                'plskills.speed',
                                'plskills.skill',
                                'plskills.gskill',
                                'plskills.hskill',
                                'plskills.cskill',
                                'plskills.iskill',
                                'plstats.wins',
                                'plstats.loses',
                                'plstats.titles',
                                'plstats.elo',
                                'plstats.maxelo',
                                'plstats.points',
                              )
  let players = [];
  for (row of rows) {
    players.push(new Player (row));
  }

//SINGLE MATCH BETWEEN TWO RANDOM PLAYERS
  // for (let i=0; i<256; i++) {
  //   var player1 = utils.getRndInteger(0, players.length-1)
  //   while (true) {
  //       var player2 = utils.getRndInteger(0, players.length-1)
  //       if (player1 != player2) {
  //         const match1 = new Match(utils.getRndInteger(0,3), players[player1], players[player2], 0)
  //         match1.play()
  //         break
  //       }
  //   }
  // }

//SINGLE TOURNAMENT
  // for (let i=0; i<1; i++) {
  //   utils.sortByPoints(players);
  //   const type = utils.getRndInteger(1,4);
  //   const spisok = utils.getPlayers(players, 16, type);
  //   utils.getSeeding(spisok);
  //   const GrandSlam1 = new Tournament(spisok, utils.getRndInteger(0,3), type);
  //   GrandSlam1.start();
  // }

  const week1 = new Week(players)
  week1.getPlayers()
  week1.start()



 
  for (player of players) {
    await db('plstats')
      .where('plid', '=', player.id)
      .update({
        wins: player.totalw,
        loses: player.totall,
        titles: player.totaltitles,
        elo: Math.round(player.elorating),
        maxelo: Math.round(player.maxelo),
        points: player.points,
      })
  }

  await utils.printTop30Players (players);
  
}

module.exports.play = play;