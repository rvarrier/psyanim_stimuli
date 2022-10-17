//import psyanim and our base .psyn files
//import files from the psyanim drive (This JS file is saved inside .../testversion for me),
// hence the whole location of psyn files
import { fromSaveStr } from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/SaveLoad";
import dataStr from "/Users/f0053cz/Documents/GitHub/chase_mimic_study/test_version/base_stim_mimic_predBlack.psyn";
import VideoExporter from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/VideoExporter";

let condition = 'redo_bad'; //'all'
var export_path, bad_inds_array, bad_inds_obj;

if (condition == 'redo_bad') {
  //console.log('in redo')
  bad_inds_array = require('/Users/f0053cz/Documents/GitHub/chase_mimic_study/test_version/bad_MIMIC_inds_3.json'); //CHANGE HERE AS REQUIRED
  bad_inds_obj = JSON.parse(bad_inds_array); // each coordinate is dataObj.x[i], dataObj.y[i]
  export_path = "/Users/f0053cz/Documents/GitHub/chase_mimic_study/test_version/vids/mimic4/mimic_flipped_.webm"; //CHANGE HERE AS REQUIRED
}// else {
//  console.log('not in redo')
//}
if (condition == 'all') {
  //console.log('in all');
  export_path = "/Users/f0053cz/Documents/GitHub/chase_mimic_study/test_version/vids/mimic4/mimic_flipped_test_.webm"; //CHANGE HERE AS REQUIRED
}

let world = fromSaveStr(dataStr);
console.log(world)
let exportOptions = {
  //exportPath: "./vids/mimictest.webm",
  exportPath: export_path,
  //exportPath: "/Users/f0053cz/Documents/psyanim_notapp/psyanim_notapp_new_mimic_expt/test_version/test_gui/mimic_flipped_.webm",
  variationGroups: [],
  frameRate: 30,
  motionBlurFrames: 0,
  quality: 1,
  numRecollapses: 2, // DON'T change this to 2 in the final version
  doExportState: true,
  doExportPsyn: true,
  doExportCheat: true
};

// IMPORTANT THING TO CHECK: Are cheat and non-cheat versions the same motion trajectory? (otherwise cheat)
// doesn't make sense.

// 6 subtlety variations (we use "wander" in lieu of 180)
let subtletyVariations = [];
for (let subtlety of [0, 30, 60, 90, 120, 150]) {
  subtletyVariations.push(
    [
      { motiv: "predator-motiv", param: "subtlety", val: subtlety }
    ]
  );
}

// load json file which has 72 random (x,y) coordinates within the world
const dataArray = require('/Users/f0053cz/Documents/GitHub/chase_mimic_study/test_version/mimic_start_position.json')
const dataObj = JSON.parse(dataArray); // each coordinate is dataObj.x[i], dataObj.y[i]

// assign the loaded random initial positions to true prey
let truePreyPosVariations = [];
let nvals = dataObj.x.length // e.g. 72
const start_ind = 0; //36
for (let i = start_ind; i < (nvals / 2); i++) {
  truePreyPosVariations.push(
    [
      { motiv: "initMotiv_invisPreyAgent", param: "initPos_x", val: dataObj.x[i] },
      { motiv: "initMotiv_invisPreyAgent", param: "initPos_y", val: dataObj.y[i] }
    ]
  );
}

// 2 starting positions for the predator and mimicking agent (in addition to the original position)
// NOTE: used in case of the "MIMIC" category
let posPredatorMimicVariations = [
  [
    { motiv: "initMotiv_predAgent", param: "initPos_x", val: 350 },
    { motiv: "initMotiv_predAgent", param: "initPos_y", val: 450 },
    { motiv: "initMotiv_fakePreyAgent", param: "initPos_x", val: 850 },
    { motiv: "initMotiv_fakePreyAgent", param: "initPos_y", val: 450 }
  ],
  [
    { motiv: "initMotiv_predAgent", param: "initPos_x", val: 850 },
    { motiv: "initMotiv_predAgent", param: "initPos_y", val: 450 },
    { motiv: "initMotiv_fakePreyAgent", param: "initPos_x", val: 350 },
    { motiv: "initMotiv_fakePreyAgent", param: "initPos_y", val: 450 }
  ]
];

let ind = 0; // to loop through the random initial prey positions
let pred_xpos, last_ind, export_vid;
for (let var_i of subtletyVariations) { // 0,30,...150
  for (let var_j of posPredatorMimicVariations) { // pred start position left or right

    //for use in file name
    pred_xpos = var_j[0] //object for initpos_x
    last_ind = pred_xpos.param.length - 1
  
    for (let pos = 0; pos < 3; pos++)
    { // 3 variants with different start position
      let pos_ind = ind + start_ind; // random_position_index
      if (condition == 'redo_bad')
      {
        console.log('in loop', pos_ind)
        if (bad_inds_obj.black.find(element => element == pos_ind )) {
          export_vid = true;
          console.log('bad vid ind:', pos_ind)
        } else {
          export_vid = false;
        }
      }
      else
      { // all vids
        console.log('all')
        export_vid = true;
      }
      console.log(export_vid)
      if (export_vid == true)
      {
        console.log("start position ind:" + pos_ind)
        let var_k = truePreyPosVariations[ind]; // set a random start position
        let flname = "pred_subt" + var_i[0].val + '_Black_Pos' + pred_xpos.param[last_ind] + "_" + pred_xpos.val + "_InvisPreyLocInd_" + (pos_ind+1)
        console.log(flname)

        let varGroup = {
          //name: "mimic_subt" + var_i[0].val + 'pred' + var_m[0].label + "_",
          name: flname,
          variations: [
            //...var_m,
            ...var_i,
            ...var_j,
            ...var_k,
          ]
        }
        exportOptions.variationGroups.push(varGroup);
      }
      ind++;
    } // iterations
    //}
  } // L or R
} // 0,30...150

VideoExporter.exportAll(world, exportOptions);