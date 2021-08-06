import { helpers as h } from './helpers.js';

export let CalcApp = (function () {
  //#region Variables
  // -- Elements
  let appEl,
    dispEvalEl,
    dispEquateEl;
  // -- Flags

  // -- Other
  let currUserVal = '';
  let currUserOperator = '';
  let lastClicked = '';
  let calcs = [];
  //#endregion Variables



  let calc = {};
  //#region App Functions
  calc.Init = function () {
    appEl = document.getElementById('app');
    dispEvalEl = document.getElementById('display--eval');
    dispEquateEl = document.getElementById('display--equation');
  }
  calc.UpdateDisplay = function(newVal) {
    this.UpdateEval(newVal);
    this.UpdateEquation(); // Setup for later
  }

  calc.UpdateEval = function(newVal) {
    dispEvalEl.innerHTML = newVal;
  }

  calc.UpdateEquation = function() {
    let equateStr = '';

    for (let i = 0; i < calcs.length; i++) {
      if (i == 0) {
        equateStr += `${calcs[i].result} `;
      } else {
        equateStr += ` ${h.GetOperatorSymbol(calcs[i].operator)} ${calcs[i].num2} `;
      }
    }

    equateStr += ` ${h.GetOperatorSymbol(currUserOperator)} ${currUserVal}`;
    dispEquateEl.innerHTML = equateStr;
  }

  calc.AddCalculation = function(calc, lastOp) {
    calcs.push({ ...calc });
  }

  calc.EditCalculation = function(index, edits) {
    calcs[index] = {
      ...calcs[index],
      ...edits
    }
  }

  calc.Reset = () => {
    currUserVal = '';
    currUserOperator = '';
    lastClicked = '';
    calcs = [];
  }
  //#endregion App Functions

  //#region Handler Function
  calc.HandleNumClick = function(self) {
    currUserVal = (calcs.length <= 0) && (currUserOperator === 'equal') ? '' : h.Convert2String(currUserVal);

    // Check & set up decimal
    if (self.dataset.number === '.') {
      if (h.IsFloat(currUserVal)) return; // Returns false if the number after the decimal is zero

      return (currUserVal += '.');
    } else {
      currUserVal += self.dataset.number;
      currUserVal = h.Convert2Number(currUserVal);
    }

    // If no calcs, just update display with the same value
    if (calcs.length <= 0) {
      this.UpdateDisplay(currUserVal);
    } else {
      this.UpdateDisplay(this.operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal));
    }

    lastClicked = 'number';
    console.clear();
    console.warn(self.dataset.number);
    console.table(calcs);
  }

  calc.HandleOperatorClick = function (self) {
    if (self.dataset.operator === 'equal') {
      let tempResult = this.operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal);

      this.Reset();
      currUserVal = tempResult;
      currUserOperator = self.dataset.operator;
      this.UpdateDisplay(currUserVal);
    } else if (lastClicked !== 'operator') { // If the user last clicked a number
      currUserVal = h.Convert2Number(currUserVal);

      // Fisrt calc, set up
      if (calcs.length === 0) {
        this.AddCalculation({
          num1: 0,
          num2: currUserVal,
          operator: self.dataset.operator, // currUserOperator will be overwritten add end of function
          result: this.operate('', currUserVal)
        });
      } else {
        this.AddCalculation({
          num1: calcs[calcs.length - 1].result,
          num2: currUserVal,
          operator: currUserOperator, // currUserOperator will be overwritten add end of function
          result: this.operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal)
        });
      }

      currUserVal = '';
      lastClicked = 'operator';
      currUserOperator = self.dataset.operator;
    } else if (lastClicked === 'operator') { // lastClicked is an operator
      // Auto Invert value 
      if (currUserOperator === 'add' &&
        self.dataset.operator === 'subtract') {
        if (currUserVal === '-')
          currUserOperator = self.dataset.operator;

        currUserVal = h.ToggleNegativeSign(currUserVal); // Used ToggleNegative before Refactoring
      }
      else if (currUserOperator === 'subtract' &&
        self.dataset.operator === 'subtract') {
        currUserVal = h.ToggleNegativeSign(currUserVal);
      } else {
        currUserOperator = self.dataset.operator;
        currUserVal = '';
      }
    }

    this.UpdateEquation();
    console.clear();
    console.table(calcs);
  }

  calc.HandleFunctionClick = function(self) {
    switch (self.dataset.function) {
      case 'clear':
        this.AllClear();
        break;
      case 'integer':
        currUserVal = h.InvertVal(currUserVal);
        this.UpdateDisplay(currUserVal);
        break;
      case 'percent':
        currUserVal = h.Convert2Percent(currUserVal);
        break;
    }
  }
  //#endregion Handler Functions

  //#region Calculator Functions
  calc.Add = (a, b = 0) => a + b;
  calc.Subtract = (a, b = 0) => a - b;
  calc.Multiply = (a, b = 1) => a * b;
  calc.Divide = (a, b = 1) => a / b;

  calc.AllClear = function() {
    dispEvalEl.innerHTML = '0';
    dispEquateEl.innerHTML = '0';

    this.Reset();
  }

  calc.operate = function(o, a, b) {
    switch (o.toLowerCase()) {
      case 'add':
        return this.Add(a, b);
      case 'subtract':
        return this.Subtract(a, b);
      case 'multiply':
        return this.Multiply(a, b);
      case 'divide':
        return this.Divide(a, b);
      default:
        return a;
    }
  }

  //#endregion Calculator Functions

  return calc;
}());




/*
*
*
*
*
*
*
// Keeping this as reference incase anything breaks
// Must take in whole value and find - 
let ToggleNegative = (val) => {
  if (val === '-')
    return '';
  return '-';
}
*
*
*
*
*
*
*/
