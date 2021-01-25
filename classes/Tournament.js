const Match = require('./Match.js')
const data = require('./data.js')

class Tournament {
  static count = 1
  
  constructor (players, pokrt, type) {
    this.pokrt = pokrt;
    this.type = type;
    this.id = Tournament.count++;
    this.players = players;
    this.totalplayes = this.players.length;
    this.currentstage=0;
    console.log(`Tournament ${this.id}(${this.pokrt}) type ${this.type} (${this.totalplayes} players) is starting`);
  }
    
  start () {
    for (let i=0; i<Math.log2(this.totalplayes); i++) {
      if (this.currentstage==0) {
        console.log("stage ", i)
        this.stagewithdraw()
      } else {
        console.log("stage ", i)
        this.stagewithoutdraw()
      }
      this.currentstage++
    }
    console.log(`Winner of this tournamet ${this.id} is ${this.players[0].name}`)
    this.players[0].totaltitles++
    this.players[0].points+=data.pointsTable[this.type-1][this.totalplayes][this.currentstage]
    
    return this.players[0]
  }
  
  stagewithdraw() {
    const numOfPlayers = this.players.length
    for (let i = numOfPlayers - 1; i > numOfPlayers/4+1; i--) {
      const j = Math.floor(Math.random() * (i - numOfPlayers/4-1)) + numOfPlayers/4;
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
    this.stagewithoutdraw()
  }
  stagewithoutdraw() {
    let stageplayers = []
    const numOfPlayers = this.players.length
    for (let i=0; i<(numOfPlayers/2); i++) {
      const match1 = new Match(this.pokrt, this.players[i], this.players[numOfPlayers-i-1],data.pointsTable[this.type-1][this.totalplayes][this.currentstage])
      stageplayers.push(match1.play())
    }
    this.players = stageplayers
  }
}

module.exports = Tournament


