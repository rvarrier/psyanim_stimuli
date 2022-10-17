const dataArray = require('./mimic_start_position.json')
const dataObj = JSON.parse(dataArray); // each coordinate is dataObj.x[i], dataObj.y[i]

// assign the loaded random initial positions to true prey
let truePreyPosVariations = [];
let nvals = dataObj.x.length // e.g. 72
//for (let i = 0; i < (nvals/2); i++)
for (let i = (nvals/2); i < nvals; i++)
{
    console.log(i,dataObj.x[i],dataObj.y[i])
}
console.log(dataObj.x[0],dataObj.x[71])