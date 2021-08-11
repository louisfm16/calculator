import { helpers as h } from './helpers.js';

export let CalcApp = (function () {
  //#region [Standard] Variables
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

  //#region [Standard] Setters, Getters, & Helpers
  let calculator = {
    getCurrUserVal: () => currUserVal,
    setCurrUserVal: (newVal) => currUserVal = newVal,
    getCurrUserOperator: () => currUserOperator,
    setCurrUserOperator: (newVal) => currUserOperator = newVal,
    getLastClicked: () => lastClicked,
    setLastClicked: (newVal) => lastClicked = newVal,
    getDispEvalEl: () => dispEvalEl.innerText,
    setDispEvalEl: (newVal) => dispEvalEl.innerText = newVal,
    getDispEquateEl: () => dispEquateEl.innerText,
    setDispEquateEl: (newVal) => dispEquateEl.innerText = newVal,
    getCalcs: () => calcs,
    isCalcsEmpty: () => h.IsEmpty(calcs)
  };
  //#endregion Setters & Getters

  //#region [Standard] App Functions
  calculator.Init = function () {
    appEl = document.getElementById('app');
    dispEvalEl = document.getElementById('display--eval');
    dispEquateEl = document.getElementById('display--equation');
  }
  
  calculator.UpdateDisplay = function (val, ovrWrtStr) {
    if (calcs.length <= 0) { // If calcs is empty, cant use operate function
      this.UpdateEval(val);
    } else {
      this.UpdateEval(this.Operate(
        this.getCurrUserOperator(), 
        calcs[calcs.length - 1].result, 
        this.getCurrUserVal()
      ));
    }

    this.UpdateEquation(ovrWrtStr); // Setup for later
  }

  calculator.UpdateEval = function(newVal) {
    // dispEvalEl.innerHTML = newVal;
    this.setDispEvalEl(newVal);
  }

  calculator.UpdateEquation = function(ovrWrtStr) {
    let equateStr = '';

    for (let i = 0; i < calcs.length; i++) {
      if (i == 0) {
        equateStr += `${calcs[i].result} `;
      } else {
        equateStr += ` ${h.GetOperatorSymbol(calcs[i].operator)} ${calcs[i].num2} `;
      }
    }

    equateStr += ` ${h.GetOperatorSymbol(currUserOperator)} ${currUserVal}`;

    // dispEquateEl.innerHTML = ovrWrtStr ? ovrWrtStr : equateStr;
    this.setDispEquateEl(ovrWrtStr ? ovrWrtStr : equateStr);
  }

  calculator.AddCalculation = function(calc, lastOp) {
    calcs.push({ ...calc });
  }

  calculator.EditCalculation = function(index, edits) {
    calcs[index] = {
      ...calcs[index],
      ...edits
    }
  }

  calculator.Reset = () => {
    currUserVal = '';
    currUserOperator = '';
    lastClicked = '';
    calcs = [];
  }
  //#endregion App Functions

  //#region [Todo] Handler Function
  calculator.HandleOperatorClick = function (self) {
    if (self.dataset.operator === 'equal') {
      let tempResult = this.Operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal);

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
          result: this.Operate('', currUserVal)
        });
      } else {
        this.AddCalculation({
          num1: calcs[calcs.length - 1].result,
          num2: currUserVal,
          operator: currUserOperator, // currUserOperator will be overwritten add end of function
          result: this.Operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal)
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
  //#endregion Handler Functions

  //#region [Todo] Calculator Functions
  calculator.Add = (a, b = 0) => a + b;
  calculator.Subtract = (a, b = 0) => a - b;
  calculator.Multiply = (a, b = 1) => a * b;
  calculator.Divide = (a, b = 1) => a / b;

  calculator.AllClear = function () {
    this.Reset();
    this.UpdateDisplay('0', '0');
  }
  calculator.InvertCurrUserVal = function() {
    let invertedVal = h.InvertVal(this.getCurrUserVal());
    this.setCurrUserVal(invertedVal);
  };
  calculator.CurrUserVal2Percent = function () {
    let invertedVal = h.Convert2Percent(this.getCurrUserVal());
    this.setCurrUserVal(invertedVal)
  }
  
  calculator.Operate = function(o, a, b) {
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

  return calculator;
}());
