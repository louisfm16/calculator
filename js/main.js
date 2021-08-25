import { helpers as h } from './helpers.js';
import {CalcApp} from './calcApp.js';

document.addEventListener("DOMContentLoaded", () => Init());

const _debug = true;

let Init = function () {
  CalcApp.Init('app', 'display--eval', 'display--equation'); // Pass in ID's for elements used by CalcApp
  SetUpListeners();
}

//#region Handler Function
let SetUpListeners = () => {
  let numEl = document.querySelectorAll('.btn--number');
  let operatorEl = document.querySelectorAll('.btn--operator');
  let functionEl = document.querySelectorAll('.btn--function');
  let specialEl = document.querySelectorAll('.special-btns--btn');

  // let historyEl = document.getElementById('history');
  // let backspaceEl = document.getElementById('backspace');

  numEl.forEach(e => {
    e.addEventListener('click', (e) => HandleNumClick(e.target.dataset.number));
  });

  operatorEl.forEach(e => {
    e.addEventListener('click', (e) => HandleOperatorClick(e.target.dataset.operator));
  });

  functionEl.forEach(e => {
    e.addEventListener('click', (e) => HandleFunctionClick(e.target.dataset.function));
  });

  specialEl.forEach(e => {
    e.addEventListener('click', (e) => HandleSpecialClick(e.target.id)); // ? Log does not spit out ID always
  });
}

/* 
 * These will control the flow of the Calculator App,
 * CalcApp will control the behind the scenes dark magic stuff
*/
// ! Bug when doing the following calculation (0.5+0.555) results in running 0000's
let HandleNumClick = function (numClicked) {
  let tempVal = h.Convert2String(CalcApp.getCurrUserVal());

  // User clicked decimal point
  if (numClicked === '.') {
    if (h.IsFloat(tempVal)) return; // Do nothing if already a decimal

    tempVal += '.'; // Convert to Decimal if not already one
  } else { // User clicked a number
    tempVal += numClicked;
    
    // Is the user trying to add a zeros after the decimal
    let isAddingZeros = (h.Convert2Number(tempVal) === 0 && tempVal.includes('.'));
    tempVal = isAddingZeros ? tempVal : h.Convert2Number(tempVal);
  }

  CalcApp.setCurrUserVal(tempVal);
  // Dont update display if the user clicks a decimal without a value
  CalcApp.UpdateDisplay(CalcApp.getCurrUserVal());
  CalcApp.setLastClicked('number');

  // Debug
  if(!_debug)
  {
    console.clear();
    console.warn(numClicked);
    console.table(CalcApp.getCalcs());
  }
}

let HandleOperatorClick = function (latestOp) {
  let currUsrOp = CalcApp.getCurrUserOperator();
  let currUsrVal = CalcApp.getCurrUserVal();
  let lastResult = CalcApp.getLastResult();

  // Fallback
  let newUsrOp = currUsrOp;
  let newUsrVal = currUsrVal;

  if (latestOp === 'equal') { // Calculate result no matter what was clicked prior and return out of the function
    if(currUsrOp === 'equal') return; // Do nothing

    let tempResult = CalcApp.Operate(currUsrOp, lastResult, currUsrVal);
    newUsrVal = tempResult;
    newUsrOp = latestOp;

    CalcApp.Reset();
  }
  else if (CalcApp.getLastClicked() === 'operator') { // Users last clicked an operator, thus has not clicked a new number to equate on yet
    newUsrOp = latestOp; // Update the newUsrOp right of the bat

    if(latestOp === 'subtract') {
      if (currUsrVal === '-') {
        newUsrVal = '';
      }
      else if (currUsrVal === '') {
        newUsrVal = '-';
        newUsrOp = currUsrOp; // keep the same operator if only changing the negative sign
      }
    }
  }
  // User user is clicking an operator for the first time this round
  else if (CalcApp.getLastClicked() !== 'operator') {
    newUsrVal = h.Convert2Number(currUsrVal);

    let newCalc = {
      num1: lastResult,
      num2: newUsrVal,
      operator: currUsrOp, // currUserOperator will be overwritten add end of function
      result: CalcApp.Operate(currUsrOp, lastResult, newUsrVal)
    };

    // First calc, set up
    if (CalcApp.isCalcsEmpty()) {
      newCalc = {
        ...newCalc,
        num1: 0,
        operator: latestOp, // currUserOperator will be overwritten add end of function
        result: CalcApp.Operate('', newUsrVal)
      }
    }

    CalcApp.AddCalculation(newCalc);
    newUsrVal = '';
    newUsrOp = latestOp;
    CalcApp.setLastClicked('operator');
  }

  CalcApp.setCurrUserVal(newUsrVal);
  CalcApp.setCurrUserOperator(newUsrOp);

  if(latestOp === 'equal') {
    CalcApp.UpdateDisplay(CalcApp.getCurrUserVal()); // Updates equation inside
  }
  else {
    CalcApp.UpdateEquation(); // Updates equation inside
  }

  if (!_debug) {
    console.clear();
    console.table(CalcApp.getCalcs());
  }
}

let HandleFunctionClick = function (funcClicked) {
  switch (funcClicked) {
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

let HandleSpecialClick = function (specialClicked) {
  switch (specialClicked) {
    case 'history':
      //  No clue yet
      break;
    case 'backspace':
      // remove the last character in currUserVal
      CalcApp.Backspace();
      break;
    default:
      // ? probably that weird bug noted in event Listener for this btn
      console.warn(`Default was activated, ${specialClicked}`);
  }
}
//#endregion Handler Functions