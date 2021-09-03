import { helpers as h } from './helpers.js';

export let CalcApp = (function () {
  //#region Variables
  // -- Elements
  let appEl;
  let dispEvalEl;
  let dispEquateEl;
  let historyPanelEl;

  // -- Other
  let currUserVal = '0';
  let currUserOperator = '';
  let lastClicked = '';
  let calcs = [];
  let history = [];
  //#endregion Variables

  //#region Setters, Getters, & Helpers
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
    getLastResult: () => !calculator.isCalcsEmpty() ? calcs[calcs.length - 1].result : 0, // if no results, return a default of zero
    getLastOperator: () => !calculator.isCalcsEmpty() ? calcs[calcs.length - 1].operator : 'No operators Found',
    getCalcs: () => calcs,
    isCalcsEmpty: () => h.IsEmpty(calcs),
    getHistory: () => history,
    setHistory: () => {
      let latestOperation = calculator.Operate(
        calculator.getCurrUserOperator(), 
        calculator.getLastResult(), 
        calculator.getCurrUserVal()
      );

      history = [
        ...history,
        // ? May be better to append to calcs instead of saving curr Val and Operate
        // ? it may disable our use of UpdateEquate though
        {
          calcs: calculator.getCalcs(),
          currUserVal: calculator.getCurrUserVal(),
          currUserOperator: calculator.getCurrUserOperator(),
          result: latestOperation,
          timestamp: h.timeStamp()
        }
      ];
    },
    saveHistory: () => {
      window.localStorage.setItem('history', JSON.stringify(history));

      let his = JSON.parse(window.localStorage.getItem('history'));
      his.forEach(h => {
        console.log(`${calculator.FormatHistoryEquations(h)} = ${h.result}`);
      });
    },
    clearHistory: () => {
      history = [];
      window.localStorage.removeItem('history');
    }
  };
  //#endregion Setters & Getters

  //#region App Functions
  calculator.Init = function () {
    appEl = document.getElementById('app');
    dispEvalEl = document.getElementById('display--eval');
    dispEquateEl = document.getElementById('display--equation');
    historyPanelEl = document.getElementById('history-panel');

    if (window.localStorage.getItem('history')) {
      history = JSON.parse(window.localStorage.getItem('history'));
    }

    calculator.LoadHistory(historyPanelEl);
    // calculator.clearHistory(); // ! For testing only
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

  calculator.FormatHistoryEquations = function (history) {
    let equateStr = '';
    let calcs = history.calcs;

    for (let i = 0; i < calcs.length; i++) {
      equateStr += (i != 0) ? `${h.GetOperatorSymbol(calcs[i].operator)} ${calcs[i].num2} ` : `${calcs[i].result} `;
    }

    equateStr += `${h.GetOperatorSymbol(history.currUserOperator)} ${history.currUserVal}`;

    return equateStr;
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

  // TODO: Should backspace operators and previous numbers as well
  calculator.Backspace = function() {
    let newCurrUserVal = h.Convert2String(this.getCurrUserVal());

    // Remove the last number / character of the string
    newCurrUserVal = newCurrUserVal.length <= 1 ? '0' : newCurrUserVal.slice(0, -1);

    // Check if it doesnt have a decimal
    if(!newCurrUserVal.includes('.')) {
      newCurrUserVal = h.Convert2Number(newCurrUserVal);
    }

    this.setCurrUserVal(newCurrUserVal);
    this.UpdateDisplay(newCurrUserVal);
  }

  calculator.Archive = function() {
    this.setHistory();
    this.saveHistory();
    this.LoadHistory(historyPanelEl);
  }

  calculator.LoadHistory = function(el) {
    el.innerHTML = '';
    let history = calculator.getHistory();
    let item;

    history.forEach((h, i) => {
      item = document.createElement('div');
      item.classList.add('history-panel--item');
      item.setAttribute('data-index', i);

      let timestamp = document.createElement('p');
      timestamp.classList.add('timestamp');
      timestamp.innerText = h.timestamp;

      let result = document.createElement('p');
      result.classList.add('result');
      result.innerText = h.result;
     
      let equation = document.createElement('p');
      equation.classList.add('equation');
      equation.innerText = calculator.FormatHistoryEquations(h);

      item.append(timestamp);
      item.append(result);
      item.append(equation);

      el.append(item);
    });
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
