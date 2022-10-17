//import psyanim and our base .psyn files
import {fromSaveStr} from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/SaveLoad";
import dataStr from "/Users/f0053cz/Documents/psyanim_notapp/psyanim_notapp_new_mimic_expt/test_version/base_stim_chase_new.psyn";
import VideoExporter from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/VideoExporter";
import AltConfig from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/AltConfig";

let world = fromSaveStr(dataStr);
console.log(world)
let exportOptions = {
  //exportPath: "./vids/mimictest.webm",
  //exportPath: "/Users/f0053cz/Documents/psyanim_notapp/psyanim_notapp_new_mimic_expt/test_version/vids/chase/chase_.webm",
  exportPath: "/Users/f0053cz/Documents/psyanim_notapp/psyanim_notapp_new_mimic_expt/test_version/test_export/test_.webm",
  variationGroups: [],
  frameRate: 30,
  motionBlurFrames: 0,
  quality: 1,
  numRecollapses: 0, // change this to 2 in the final version
  doExportState: true,
  doExportPsyn: true,
  doExportCheat: false
};

if world.agents[0]._name.localeCompare('predAgent') == 0
console.log('predAgent: ' + typeof world.agents[0]._name + ',' + world.agents[0]._name.length)
console.log(', ' + )

// color variations for predator and mimicking agent 
// NOTE: that "black" and "grey" are the names of faces created within the GUI
// same goes for "setPredatorFace" and "setPreyFace", which are motivators created within the GUI
/*let colorVariations = [
  [
    // this is a variation with the predator black and the prey grey
    {motiv: "setPredatorFace", param: "face", val: "black"},
    {motiv: "setPreyFace", param: "face", val: "grey"},
  ],
  [
    // this is a variation with the predator grey and the prey black
    {motiv: "setPredatorFace", param: "face", val: "grey"},
    {motiv: "setPreyFace", param: "face", val: "black"},
  ]
];*/

let altConfig_G = new AltConfig();
let altConfig_B = new AltConfig();

altConfig_G.agentConfigs = {
  predAgent: { faceName: "grey"},
  preyAgent: { faceName: "black"},
}


exportOptions.altConfigs = [altConfig_G];


VideoExporter.exportAll(world, exportOptions);