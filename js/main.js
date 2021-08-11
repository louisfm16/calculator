import { helpers as h } from './helpers.js';
import {CalcApp} from './calcApp.js';

document.addEventListener("DOMContentLoaded", () => Init());

const _debug = true;

//#region App Functions
let Init = function () {
  CalcApp.Init();
  SetUpListeners();
}


//#region Handler Function
let SetUpListeners = () => {
  let numEl = document.querySelectorAll('.btn--number');
  let operatorEl = document.querySelectorAll('.btn--operator');
  let functionEl = document.querySelectorAll('.btn--function');

  numEl.forEach(e => {
    e.addEventListener('click', HandleNumClick);
  });

  operatorEl.forEach(e => {
    e.addEventListener('click', HandleOperatorClick);
  });

  functionEl.forEach(e => {
    e.addEventListener('click', HandleFunctionClick);
  });
}

// These will control the flow of the Calculator App,
// CalcApp will control the behind the scenes dark magic stuff
let HandleNumClick = function () {
  // Replace the currUserVal if the user clicks a number
  // right after clicking the equal sign
  let tempVal = (
      CalcApp.isCalcsEmpty() && (CalcApp.getCurrUserOperator() === 'equal')
    ) ? '' : h.Convert2String(CalcApp.getCurrUserVal());

  // User clicked decimal point
  if (this.dataset.number === '.') {
    if (h.IsFloat(tempVal)) return; // Do nothing if already a decimal

    return (tempVal += '.'); // Convert to Decimal if not already one
  } else { // User clicked a number
    tempVal += this.dataset.number;
    tempVal = h.Convert2Number(tempVal);
  }

  CalcApp.setCurrUserVal(tempVal);
  CalcApp.UpdateDisplay(CalcApp.getCurrUserVal());
  CalcApp.setLastClicked('number');

  // Debug
  if(_debug)
  {
    console.clear();
    console.warn(this.dataset.number);
    console.table(CalcApp.getCalcs());
  }
}

let HandleOperatorClick = function () {
  CalcApp.HandleOperatorClick(this);
}

let HandleFunctionClick = function () {
  let funcBtnClicked = this.dataset.function;

  switch (funcBtnClicked) {
    case 'clear':
      CalcApp.AllClear();
      break;
    case 'integer':
      CalcApp.InvertCurrUserVal();
      CalcApp.UpdateDisplay(CalcApp.getCurrUserVal());
      break;
    case 'percent':
      CalcApp.CurrUserVal2Percent();
      CalcApp.UpdateDisplay(CalcApp.getCurrUserVal());
      break;
  }
}
//#endregion Handler Functions