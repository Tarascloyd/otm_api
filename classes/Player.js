
class Player {
  constructor (args) {
    this.id=args.id;
    this.name=args.name;
    this.age=args.age;
    this.power=args.power;
    this.speed=args.speed;
    this.skill=args.skill;
    this.pokrtskill=[args.gskill, args.hskill, args.cskill, args.iskill]
    this.points=args.points;
    this.totalw=args.wins;
    this.totall=args.loses;
    this.totaltitles=args.titles;
    this.elorating=args.elo;
    this.maxelo=args.maxelo;
    this.seeding=0;
  }
  setEloRating (change) {
    this.elorating+=change
    if (this.elorating>this.maxelo) {
      this.maxelo=this.elorating
    }
    if (this.elorating<100) this.elorating=100
  }
  getLevelPokrt(pokrt) {
    return Math.round((this.power + this.speed + this.skill + this.pokrtskill[pokrt])/4)
  }
   getLevel() {
    return Math.round((this.power + this.speed + this.skill + (this.pokrtskill.reduce((acc, item) => acc + item, 0))/4)/4)
  }
  
}

module.exports = Player
