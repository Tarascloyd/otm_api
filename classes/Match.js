class Match {
  constructor (pokrt, play1, play2, pointsForLoser) {
    this.pokrt = pokrt;
    this.play1 = play1;
    this.play2 = play2;
    this.pointsForLoser = pointsForLoser
    this.score1=0;
    this.score2=0;
    console.log(`${play1.name}(${play1.seeding}) vs (${play2.seeding})${play2.name}`);
  }
  static countProbabilityByElo(rating1, rating2) {
    return 1.0 * 1.0 / (1 + 1.0 * (Math.pow(10, 1.0 * (rating1 - rating2) / 400)))
  }
  static getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  static setProbability (lvl1, lvl2) {
    if (lvl1>lvl2) {
      var probability = 100 - Math.round((0.5-(lvl1-lvl2)*0.005-(lvl1-lvl2)*0.00875)*100);
    } else {
      var probability = Math.round((0.5-(lvl2-lvl1)*0.005-(lvl2-lvl1)*0.00875)*100);
    }
    if (probability<1) probability=1
    if (probability>99) probability=99
    return probability
  }
  play () {
    const lvl1 = this.play1.getLevelPokrt(this.pokrt);
    const lvl2 = this.play2.getLevelPokrt(this.pokrt);
    let ver = Match.setProbability(lvl1, lvl2);
    let score = "(";
    while (this.score1<2 && this.score2<2) {
      score += this.playSet(ver);
    }
    console.log(`${this.score1} - ${this.score2}${score.slice(0,-2)})`)
    return this.afterMatch()
  }
  
  playSet (probability) {
    let gameScore1 = 0;
    let gameScore2 = 0;
    while ((gameScore1<6 && gameScore2<6) 
          || 
          (gameScore1-gameScore2==1 || gameScore1-gameScore2==-1 || gameScore1-gameScore2==0)
          && 
          (gameScore1!=7 && gameScore2!=7)) {
            if ((gameScore1+gameScore2)%2===0) {
              var probabilityInGame=probability+30
            } else {
              var probabilityInGame=probability-30
            }
            if (probabilityInGame < 1) probabilityInGame = 1
            if (probabilityInGame > 99) probabilityInGame = 99
      let kubik = Match.getRndInteger(0,99)
      if (kubik < probabilityInGame) {
        gameScore1+=1;
      } else {
        gameScore2+=1
      }
    }
    if (gameScore1>gameScore2) {
      this.score1+=1 
    } else {
      this.score2+=1
    }
    return gameScore1.toString() + " - " + gameScore2.toString() + ", "
  }
  
  afterMatch() {
    const eloRating1 = this.play1.elorating;
    const eloRating2 = this.play2.elorating;
    if (this.score1 > this.score2) {
      const probabilityByElo = Match.countProbabilityByElo(eloRating1,eloRating2)
      this.play1.totalw++
      this.play2.totall++
      this.play1.setEloRating(probabilityByElo*40)
      this.play2.setEloRating(probabilityByElo*-40)
      this.play2.points+=this.pointsForLoser
      return this.play1
    } else {
      const probabilityByElo = Match.countProbabilityByElo(eloRating2,eloRating1)
      this.play2.totalw++
      this.play1.totall++
      this.play2.setEloRating(probabilityByElo*40)
      this.play1.setEloRating(probabilityByElo*-40)
      this.play1.points+=this.pointsForLoser
      return this.play2
    }
  }
}

module.exports = Match

