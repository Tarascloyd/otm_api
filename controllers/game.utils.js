const Player = require('../classes/Player.js')
const Match = require('../classes/Match.js')
const Tournament = require('../classes/Tournament.js')

const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1) ) + min;

const getPlayersRandom = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr.slice(0, n);
};

const getPlayers = (arr, n, type) => {
  let players = [];
  let baseProb = type * 20 - 5
  while (players.length<n) {
    let count = 0;
    for (player of arr) {
      count ++;
      let prob = baseProb
      switch (true) {
        case count < n/4+1:
          if (type<4) prob-=15;
          break;
        case count < n/2+1:
          prob+=5;
          break;
        case count < n*3/4+1:
          prob+=15;
          break;
        case count < n+1:
          prob+=30;
          break;
        default:
          prob+=50;
          break;
      }
      if (getRndInteger(1,99)<prob) {
        if (!players.includes(player)) {
          players.push(player);
        }
      }
      if (players.length==n) {
        break;
      }
    }
  }
  return players
}

const printAllPlayers = (arr) => {
  let count = 0;
  sortByPoints(arr);
  arr.forEach(x => console.log(`(${++count})${x.name} has ${x.totalw}/${x.totall} w/l, ${x.totaltitles} tit, points: ${x.points} ELORating: ${Math.round(x.elorating)} max:${Math.round(x.maxelo)} lvl ${x.getLevel()}`))  
}
const printTop30Players = (arr) => {
  let count = 0;
  sortByPoints(arr);
  arr.forEach(x => {
    while (count < 20) {
      return console.log(`(${++count})${x.name} has ${x.totalw}/${x.totall} w/l, ${x.totaltitles} tit, points: ${x.points} ELORating: ${Math.round(x.elorating)} max:${Math.round(x.maxelo)} lvl ${x.getLevel()}`)}
    }) 
  
}
const getSeeding = (arr) => {
  sortByPoints(arr);
  for (let i=0; i<arr.length; i++) {
    arr[i].seeding = i+1;
  }
}

const sortByEloRating = (arr) => {
  arr.sort((a, b) => b.elorating - a.elorating);    
}

const sortByPoints = (arr) => {
  arr.sort((a, b) => (b.points - a.points || b.elorating - a.elorating));    
}

module.exports = {
  getRndInteger,
  getPlayers,
  printAllPlayers,
  printTop30Players,
  getSeeding,
  sortByPoints,
}