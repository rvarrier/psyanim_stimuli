//import psyanim and our base .psyn files
import { fromSaveStr } from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/SaveLoad";
import dataStr from "/Users/f0053cz/Documents/GitHub/chase_mimic_study/test_version/base_stim_wander_predGrey.psyn";
import VideoExporter from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/VideoExporter";

let world = fromSaveStr(dataStr);
console.log(world)
let exportOptions = {
  //exportPath: "./vids/mimictest.webm",
  //exportPath: "/Users/f0053cz/Documents/psyanim_notapp/psyanim_notapp_new_mimic_expt/test_version/vids/wander/wander_.webm",
  exportPath: "/Users/f0053cz/Documents/GitHub/chase_mimic_study/test_version/vids/wander3/wander_.webm",
  variationGroups: [], 
  frameRate: 30,
  motionBlurFrames: 0,
  quality: 1,
  numRecollapses: 0,//5, // change this to 5 in the final version if there's no loop for this below
  doExportState: true,
  doExportPsyn: true,
  doExportCheat: false
};


// 2 positions for the predator and prey agents (in addition to the original position)
// NOTE: used in case of the "MIMIC" category
let posPredatorPreyVariations = [
  [
    { motiv: "initMotiv_predAgent", param: "initPos_x", val: 350 },
    { motiv: "initMotiv_predAgent", param: "initPos_y", val: 450 },
    { motiv: "initMotiv_preyAgent", param: "initPos_x", val: 850 },
    { motiv: "initMotiv_preyAgent", param: "initPos_y", val: 450 }
  ],
  [
    { motiv: "initMotiv_predAgent", param: "initPos_x", val: 850 },
    { motiv: "initMotiv_predAgent", param: "initPos_y", val: 450 },
    { motiv: "initMotiv_preyAgent", param: "initPos_x", val: 350 },
    { motiv: "initMotiv_preyAgent", param: "initPos_y", val: 450 }
  ]
];

let pred_xpos, last_ind;
for (let var_j of posPredatorPreyVariations) {// LR or RL
  pred_xpos = var_j[0] //object for initpos_x
  last_ind = pred_xpos.param.length - 1
  for (let var_k = 0; var_k < 6; var_k++) {// recollapses
    //let flname = "pred_Grey_Pos" + pred_xpos.param[last_ind] + "_" + pred_xpos.val
    let flname = "pred_Grey_Pos" + pred_xpos.param[last_ind] + "_" + pred_xpos.val + "_var" + var_k
    console.log(flname)
    let varGroup = {
      name: flname,
      variations: [
        ...var_j,
      ]
    }
    exportOptions.variationGroups.push(varGroup);
  }
}

console.log(exportOptions)
VideoExporter.exportAll(world, exportOptions);