//import psyanim and our base .psyn files
import { fromSaveStr } from "/Users/f0053cz/Documents/GitHub/psyanim/psyanim/src/js/components/utils/SaveLoad.js"; //you can also use the full path: /home/..../js/compoents/utils/SaveLoad"
import dataStr from "/Users/f0053cz/Documents/GitHub/chase_mimic_study/stimulus_generation/base_stim_chase_predBlack.psyn";
//change this to where you have psyanim. If it's not inside the psyanim folder, use the full path

let world = fromSaveStr(dataStr);
console.log(world)