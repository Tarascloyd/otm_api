const Tournament = require('../classes/Tournament.js')
const utils = require('../controllers/game.utils.js')

class Week {
  constructor (listOfPlayers) {
    this.listOfPLayers = listOfPlayers
    this.requests = Week.getRequest(listOfPlayers.length)
    this.maxType = Week.bestOfRequests(this.requests)
    this.numFreeSpaces = Week.getNumFreeSpaces(this.requests)
    this.maxPlayers = listOfPlayers.length
  }

  static getNumberOfPlayers(avg) {
    const poket = [8,16,32,64,128]
    const coef = poket.map (num => {
        let f = Math.abs(avg-num)*(-2)+100;
        if (f<5) f=5
        return f
    })
    const kubik = utils.getRndInteger(1, coef.reduce((num, acc) => num + acc, 0));
    let sum = 0
    for (let i=0; i<5; i++) {
      sum += coef[i]
      if (kubik < sum+1) {
        return poket[i]  
      }
    }
  }
  static getRequest(maxPlayers) {
    let maxTournaments = Math.round(maxPlayers / 32);
    if (maxTournaments<3) maxTournaments = 3;
    let minTournaments = Math.round(maxPlayers / 64);
    if (minTournaments<1) minTournaments = 1;
    const numOfTournaments = utils.getRndInteger(minTournaments, maxTournaments);
    const averageNumOfPlayers = Math.round(maxPlayers/numOfTournaments);
    while(true) {
      let requests = []
      for (let i=0; i<numOfTournaments; i++) {
        const tournament = {
          type: utils.getRndInteger (1, 5),
          number: Week.getNumberOfPlayers(averageNumOfPlayers),
          players: [],
          isFull: false
        }
        tournament.atrPoints = Week.getTornamentsPoints(tournament.type, tournament.number)
        requests.push(tournament);
      }
      const sumofPlayers = requests.reduce((acc, tour) => acc + tour.number, 0)
      if (sumofPlayers < maxPlayers) return requests
    }
  }
  static bestOfRequests(requests) {
    return Math.max.apply(null, requests.map(tournament => (!tournament.isFull ?tournament.type : 0)))
  }
  static getNumFreeSpaces(requests) {
    return requests.reduce((acc, tournament) => tournament.number + acc, 0)
  }
  static sortByAttraction = (arr) => {
    arr.sort((a, b) => b.atrPoints - a.atrPoints)
  }
  static sortByType = (arr) => {
    arr.sort((a, b) => (a.type - b.type || a.number - b.number))
  }
  static getTornamentsPoints = (type, number) => {
    let points = type * 70 + Math.round(number/6);
    if (type==5) points += 200
    return points
  }
  
  getPlayers() {
    let players = [];
    const n = this.numFreeSpaces;
    utils.sortByPoints(this.listOfPLayers);
    while (players.length < n) {
      const maxType = Week.bestOfRequests(this.requests);
      const baseProb = maxType * 20 - 15;
      let count = 0;
      this.listOfPLayers.map(player => {
        count ++;
        let prob = baseProb;
        switch (true) {
          case count < n/8+1:
            if (maxType<4) prob-=15;
            break;
          case count < n/4+1:
            prob+=10;
            break;
          case count < n*3/8+1:
            prob+=15;
            break;
          case count < n/2+1:
            prob+=30;
            break;
          default:
            prob+=50;
            break;
        }
        if (utils.getRndInteger(1,99)<prob) {
          if (!players.includes(player) && players.length < n) {
            players.push(player);
            Week.sortByAttraction(this.requests);
            this.requests[0].players.push(player);
            if (this.requests[0].players.length == this.requests[0].number) {
              this.requests[0].isFull = true
              this.requests[0].atrPoints -=5000
            } else {
              this.requests[0].atrPoints -= utils.getRndInteger(10,17)
            }
          }
        }

      })
    }
  }

  start() {
    Week.sortByType(this.requests)
    this.requests.map (tour => {
      utils.getSeeding(tour.players);
      const GrandSlam1 = new Tournament(tour.players, utils.getRndInteger(0,3), tour.type);
      tour.winner = GrandSlam1.start();
    })
    this.requests.map (tour => {
      console.log(`Tournament:  ${tour.type} type, ${tour.number} players, winner - ${tour.winner.name} (${tour.winner.seeding})`)
    })  
  }


}

module.exports = Week