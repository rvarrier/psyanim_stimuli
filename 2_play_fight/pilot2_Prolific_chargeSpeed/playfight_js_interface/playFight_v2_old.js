//import psyanim and our base .psyn files
import { fromSaveStr } from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/SaveLoad"; // CHANGE THIS
import dataStr from "/Users/f0053cz/Documents/Psyanim_stim_generation/2_playfight/pilot2/playfight_js_interface/playFight_v2.psyn"; // CHANGE THIS
import VideoExporter from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/VideoExporter"; // CHANGE THIS

var export_folder = "/Users/f0053cz/Documents/Psyanim_stim_generation/2_playfight/pilot2/playfight_js_interface/vids/"; //CHANGE THIS TO WHEREVER YOU WANT TO SAVE THE FILE
var fileName_prefix = "playFight_" //CHANGE THIS TO THE DESIRED FILE PREFIX
var export_path = export_folder + fileName_prefix + '.webm';
console.log('test')
console.log('export_path', export_path)
    // @ALISON: CONSOLE.LOG(). PRINTS OUT THE CONTENTS. GREAT TOOL FOR DEBUGGING AND LEARNING HOW A CODE WORKS.

let world = fromSaveStr(dataStr);
console.log(world) // prints out the world
let exportOptions = {
    exportPath: export_path,
    variationGroups: [],
    frameRate: 30,
    motionBlurFrames: 0,
    quality: 1,
    numRecollapses: 0, // NUMBER OF VARIATIONS YOU WANT TO CREATE
    doExportState: true,
    doExportPsyn: true, // EXPORT A NEW .PSYN FILE FOR EVERY VIDEO?
    doExportCheat: false
};

const wanderSpeed_rel = true; // true, false  CHANGE THIS TO MAKE WANDER SPEED ABSOLUTE OR RELATIVE

let chargeSpeedVariations = [];
let wanderspeedVariations = [];
for (let speed of[20, 60, 100, 140, 180, 220]) {
    //for (let speed of [20,40,60,80,100,120,140,160,180,200,220]){
    // // CHANGE THWE CHARGE SPEEDS YOU WANT HERE

    //console.log(speed)
    chargeSpeedVariations.push(
        [
            { motiv: "playFight-motiv4", param: "chargeParams_chargeSpeed", val: speed }
        ]
    );

    if (wanderSpeed_rel) {
        wanderspeedVariations.push(
            [
                { motiv: "playFight-motiv4", param: "wanderParams_maxSpeed", val: speed * .75 } // speed - 10 }
            ]
        );
    } else {
        wanderspeedVariations.push(
            [
                { motiv: "playFight-motiv4", param: "wanderParams_maxSpeed", val: 50 }
            ]
        );
    }
}
//let wanderSpeed = world.getMotivByName("playFight-motiv4").wanderParams_maxSpeed;


const xvals = [world.getMotivByName("initMotiv_playing_agent1").initPos_x, world.getMotivByName("initMotiv_playing_agent2").initPos_x]
console.log('world.getMotivByName("initMotiv_playing_agent1")initPos_x', world.getMotivByName("initMotiv_playing_agent1").initPos_x)
    //[200, 400] //[350,850] when world = [1200,900], [200, 400] when world = [600,450]. Smaller world helps with more interactions
let yval = world.getMotivByName("initMotiv_playing_agent1").initPos_y //225 // 450 when world = [1200,900], 225 when world = [600,450],
    // SWAP INITIAL POSITION OF THE AGENTS
let initPosVariations = [
    [ // starting position variation 1 (agent 1 on the left, agent 2 on the right)
        { motiv: "initMotiv_playing_agent1", param: "initPos_x", val: xvals[0] }, //350 }, // x coordinate agent 1
        { motiv: "initMotiv_playing_agent1", param: "initPos_y", val: yval }, //450 }, // y coordinate agent 2
        { motiv: "initMotiv_playing_agent2", param: "initPos_x", val: xvals[1] }, //850 }, // x coordinate agent 1
        { motiv: "initMotiv_playing_agent2", param: "initPos_y", val: yval }, //450 } // y coordinate agent 2
    ],
    [ // variation 2: agent 1 on the right, agent 2 on the left
        { motiv: "initMotiv_playing_agent1", param: "initPos_x", val: xvals[1] }, //850 },
        { motiv: "initMotiv_playing_agent1", param: "initPos_y", val: yval }, //450 },
        { motiv: "initMotiv_playing_agent2", param: "initPos_x", val: xvals[0] }, //350 }, 
        { motiv: "initMotiv_playing_agent2", param: "initPos_y", val: yval }, //450 }
    ]
];

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

let posStr;
let nSpeeds = chargeSpeedVariations.length;
let var_i_charge, var_i_wander;

const nReps = 10; // CHANGE NUMBER OF COPIES OF EACH TYPE HERE

//for (let var_i of chargeSpeedVariations) {
for (let i of range(0, nSpeeds - 1)) {
    var_i_charge = chargeSpeedVariations[i]
    var_i_wander = wanderspeedVariations[i]

    for (let var_j of initPosVariations) { // LR or RL
        for (let var_k = 0; var_k < nReps; var_k++) {
            // MANUALLY CREATE 3 VARIATIONS OF THE SAME SET OF PARAMS BECAUSE
            // OF A BUG IN THE NUM_RECOLLAPSES

            let pred_xpos = var_j[0] //object for initpos_x
            console.log('pred_xpos.val:', pred_xpos.val, ',typeof(xvals.values):', typeof(xvals.values), ', xvals:', xvals, ', Math.min(xvals):', Math.min(xvals))
            if ((pred_xpos.val == xvals[0]) && (pred_xpos.val < xvals[1])) { // if xvals goes from low to high: e.g. xval = [200,400]
                posStr = 'L';
            } else if ((pred_xpos.val == xvals[1]) && (pred_xpos.val < xvals[0])) { // if xvals goes from high to low:  e.g. xval = [200,400] 
                posStr = 'L';
            } else {
                posStr = 'R';
            }

            //let flname = "_chargeSpeed" + var_i[0].val + '_GreyAgentXPos' + pred_xpos.val + "_var" + var_k //CHANGE TO DESIRED FILENAME
            let flname = "_chargeSpeed" + var_i_charge[0].val + '_wander' + var_i_wander[0].val + '_Grey' + posStr + "_var" + var_k; //CHANGE TO DESIRED FILENAME
            console.log(flname) // print file name (visualize on the console log)

            let varGroup = { // create a variation group
                name: flname,
                variations: [
                    ...var_i_charge,
                    ...var_i_wander,
                    ...var_j,
                ]
            }

            exportOptions.variationGroups.push(varGroup); // export a variation.
        }
    }
}
VideoExporter.exportAll(world, exportOptions);