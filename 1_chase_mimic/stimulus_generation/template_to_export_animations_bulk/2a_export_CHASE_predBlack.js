//import psyanim and our base .psyn files
// adapted from /psyanim/src/customBuild_exportVideos.js and /psaynim/src/customBuild_exportMultipleMimic.js 

import { fromSaveStr } from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/SaveLoad";
import dataStr from "/Users/f0053cz/Documents/GitHub/chase_mimic_study/stimulus_generation/base_stim_chase_predBlack.psyn";
// In these Psyanim files, the predator is always the black agent.
// Replace this by ...predGrey.psyn to generate a set of videos where the predator is always the grey agent. (Also rename the export file 
// accordingly when defining the variable "flname" below)
import VideoExporter from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/VideoExporter";
// CHANGE FILENAMES AS NECESSARY

const condition = 'all';
// 'all' to create all videos
//'redo_bad' to redo some bad videos again, 
// CHANGE AS NECESSARY

var export_path; // location where the files will be exported. 

if (condition == 'all') {
    //console.log('in all');
    export_path = "/Users/f0053cz/Documents/GitHub/chase_mimic_study/stimulus_generation/chase_.webm";
    //CHANGE THIS AS NECESSARY - MAKE SURE THE FULL FILE PATH EXISTS!
    // In this case "chase_" is the prefix. The fulle filename will be "chase_<flname>.webm", where flname is as defined inside the for loop each iteration
}

if (condition == 'redo_bad') {
    //console.log('in redo')
    export_path = "/Users/f0053cz/Documents/GitHub/chase_mimic_study/stimulus_generation/chase_.webm";
    //CHANGE THIS AS NECESSARY - MAKE SURE THE FULL FILE PATH EXISTS!
}


console.log('export_path', export_path) // print file path - use this to check if you entered the right path.

let world = fromSaveStr(dataStr);
console.log(world)
let exportOptions = { // all the export parameters
    exportPath: export_path,
    variationGroups: [],
    frameRate: 30,
    motionBlurFrames: 0,
    quality: 1,
    numRecollapses: 0, // error with this feature. Usually used to keep multiple versions with the same set of parameters
    doExportState: true,
    doExportPsyn: true, // this creates a .psyn file for every .webm file
    doExportCheat: false
};

let subtletyVariations = [];
for (let subtlety of[0, 30, 60, 90, 120, 150]) {
    subtletyVariations.push( // list of objects with the variations. CHANGE AS NECESSARY
        [
            { motiv: "predator-motiv", param: "subtlety", val: subtlety }
        ]
    );
}

// 2 positions for the predator and prey agents (in addition to the original position)
let posPredatorPreyVariations = [
    [ // predator left, prey right
        { motiv: "initMotiv_predAgent", param: "initPos_x", val: 350 },
        { motiv: "initMotiv_predAgent", param: "initPos_y", val: 450 },
        { motiv: "initMotiv_preyAgent", param: "initPos_x", val: 850 },
        { motiv: "initMotiv_preyAgent", param: "initPos_y", val: 450 }
    ],
    [ // predator right, prey left
        { motiv: "initMotiv_predAgent", param: "initPos_x", val: 850 },
        { motiv: "initMotiv_predAgent", param: "initPos_y", val: 450 },
        { motiv: "initMotiv_preyAgent", param: "initPos_x", val: 350 },
        { motiv: "initMotiv_preyAgent", param: "initPos_y", val: 450 }
    ]
];

let bad_root_filenames;
if (condition == 'redo_bad') { // CHANGE THE FILE NAMES HERE IF YOU WANT TO REDO ONLY THE BAD FILES!
    // enter the names of the files that need to be created again
    bad_root_filenames = ['pred_subt0_Black_Posx_850_var1']
}
//console.log(bad_root_filenames)

let make_file;
for (let var_i of subtletyVariations) { //0,30,...150
    for (let var_j of posPredatorPreyVariations) { // LR or RL
        for (let var_k = 0; var_k < 3; var_k++) { // recollapses

            const pred_xpos = var_j[0] //object for initpos_x
            const last_ind = pred_xpos.param.length - 1
            let flname = "pred_subt" + var_i[0].val + '_Black_Pos' + pred_xpos.param[last_ind] + "_" + pred_xpos.val + "_var" + var_k
            console.log(flname)

            if (condition == 'all') { //make all videos
                make_file = true
            } else { //make videos only to replace the bad ones.
                make_file = (condition == 'redo_bad') && (bad_root_filenames.includes(flname)); //.find(element => flname))
            }
            console.log('make_file', make_file)

            if (make_file) {
                let varGroup = {
                    name: flname,
                    variations: [
                        ...var_i,
                        ...var_j,
                    ]
                }
                exportOptions.variationGroups.push(varGroup);
            }
        }
    }
}

VideoExporter.exportAll(world, exportOptions);