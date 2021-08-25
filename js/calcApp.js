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

  //#region Setters, Getters, & Helpers
  let calculator = {
    // getCurrUserVal: () => currUserVal,
    getCurrUserVal: () => {
      console.log(`--- ${typeof currUserVal} - ${currUserVal} ---`);
      
      return currUserVal;
    },
    setCurrUserVal: (newVal) => currUserVal = newVal,
    getCurrUserOperator: () => currUserOperator,
    setCurrUserOperator: (newVal) => currUserOperator = newVal,
    getLastClicked: () => lastClicked,
    setLastClicked: (newVal) => lastClicked = newVal,
    getDispEvalEl: () => dispEvalEl.innerText,
    setDispEvalEl: (newVal) => dispEvalEl.innerText = newVal,
    getDispEquateEl: () => dispEquateEl.innerText,
    setDispEquateEl: (newVal) => dispEquateEl.innerText = newVal,
    getLastResult: () => !calculator.isCalcsEmpty() ? calcs[calcs.length - 1].result : 'No results Found',
    getLastOperator: () => !calculator.isCalcsEmpty() ? calcs[calcs.length - 1].operator : 'No operators Found',
    getCalcs: () => calcs,
    isCalcsEmpty: () => h.IsEmpty(calcs)
  };
  //#endregion Setters & Getters

  //#region App Functions
  calculator.Init = function (/* app, eval, equate */) {// Adding parameters breaks this, strict mode or whatever idk
    // appEl = document.getElementById(app);
    // dispEvalEl = document.getElementById(eval);
    // dispEquateEl = document.getElementById(equate);

    appEl = document.getElementById('app');
    dispEvalEl = document.getElementById('display--eval');
    dispEquateEl = document.getElementById('display--equation');
  }
  
  calculator.UpdateDisplay = function (val, ovrWrtStr) {
    let currUserVal = this.getCurrUserVal();

    if (!this.isCalcsEmpty()) { // If calcs is empty, cant use operate function
      // The user has only inputed a decimal or is adding zeros to an already zero decimal value
      if (val === '.' || h.Convert2Number(val) === 0)
        currUserVal = 0;

      val = this.Operate(
        this.getCurrUserOperator(), 
        this.getLastResult(), 
        currUserVal
      );
    }
    else if (this.isCalcsEmpty() && val === '.') {
      val = '0.';
    }

    this.UpdateEval(val);
    this.UpdateEquation(ovrWrtStr);
  }

  calculator.UpdateEval = function(newVal) {
    this.setDispEvalEl(newVal);
  }

  calculator.UpdateEquation = function(ovrWrtStr) {
    let equateStr = '';

    for (let i = 0; i < calcs.length; i++) {
      equateStr += (i != 0) ? ` ${h.GetOperatorSymbol(calcs[i].operator)} ${calcs[i].num2} ` : `${calcs[i].result} `;
    }

    equateStr += ` ${h.GetOperatorSymbol(currUserOperator)} ${this.getCurrUserVal() === '.' ? '0.' : this.getCurrUserVal()}`;

    this.setDispEquateEl(ovrWrtStr ? ovrWrtStr : equateStr);
  }

  calculator.AddCalculation = function(calc) {
    calcs.push({ ...calc });
  }

  calculator.EditCalculation = function(index, edits) {
    calcs[index] = {
      ...calcs[index],
      ...edits
    }
  }

  calculator.Reset = function() {
    this.setCurrUserVal('');
    this.setCurrUserOperator('');
    this.setLastClicked('');
    calcs = [];
  }
  //#endregion App Functions

  //#region Calculator Functions
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

  calculator.Backspace = function() {
    let newCurrUserVal = h.Convert2String(this.getCurrUserVal());

    // Remove the last number / character of the string
    newCurrUserVal = newCurrUserVal.slice(0, -1);

    if (newCurrUserVal.length <= 0)
      newCurrUserVal = 0;

    // Check if its not a float and 
    if(!h.IsFloat(newCurrUserVal) && newCurrUserVal != '0.') {
      newCurrUserVal = h.Convert2Number(newCurrUserVal);
    }

    this.setCurrUserVal(newCurrUserVal);
    this.UpdateDisplay(newCurrUserVal);
  }
  
  calculator.Operate = function(o, a, b) {
    switch (o) {
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
