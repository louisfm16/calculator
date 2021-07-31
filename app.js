// DOM Loaded check
if (document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  Init();
} else {
  document.addEventListener("DOMContentLoaded", () => Init());
}

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

//#region App Functions
let Init = function () {
  appEl = document.getElementById('app');
  dispEvalEl = document.getElementById('display--eval');
  dispEquateEl = document.getElementById('display--equation');

  SetUpListeners();
}

let UpdateDisplay = (newVal) => {
  UpdateEval(newVal);
  UpdateEquation(); // Setup for later
}

let UpdateEval = (newVal) => {
  dispEvalEl.innerHTML = newVal;
}

let UpdateEquation = () => {
  let equateStr = '';

  for(let i = 0; i < calcs.length; i++) {
    if(i == 0) {
      equateStr += `${calcs[i].result} `;
    } else {
      equateStr += ` ${GetOperatorSymbol(calcs[i].operator)} ${calcs[i].num2} `;
    }
  }

  equateStr += ` ${GetOperatorSymbol(currUserOperator)} ${currUserVal}`;
  dispEquateEl.innerHTML = equateStr;
}

let AddCalculation = (calc, lastOp) => {
  calcs.push({ ...calc });
}

let EditCalculation = (index, edits) => {
  calcs[index] = {
    ...calcs[index],
    ...edits
  }
}
//#endregion App Functions

//#region Handler Function
let SetUpListeners = () => {
  let numEl = document.querySelectorAll('.btn--number');
  let operatorEl = document.querySelectorAll('.btn--operator');

  numEl.forEach(e => {
    e.addEventListener('click', HandleNumClick);
  });

  operatorEl.forEach(e => {
    e.addEventListener('click', HandleOperatorClick);
  });
}

let HandleNumClick = function () {
  currUserVal = currUserVal.toString();

  // Check & set up decimal
  if (this.dataset.number === '.') {
    if(IsFloat(currUserVal)) return;

    return (currUserVal += '.');
  } else {
    currUserVal += this.dataset.number;
    currUserVal = Str2Float(currUserVal);
  }

  // If no calcs, just update display
  if (calcs.length <= 0) {
    UpdateDisplay(currUserVal);
  } else {
    // If one calc, update first calc real time
    // if(calcs.length === 1) {
    //   EditCalculation(0, { result: operate(calcs[0].operator, calcs[0].num2, currUserVal)}); // Edit/Fix/Correct the first calc
    // }

    // let latestCalcIndex = (calcs.length - 1);
    // EditCalculation(latestCalcIndex, { num2: currUserVal });
    UpdateDisplay(operate(currUserOperator, calcs[calcs.length-1].result, currUserVal));
  }

  lastClicked = 'number';
  console.clear();
  console.table(calcs);
}

let HandleOperatorClick = function () {
  // If the user clicks an operator again, simply update
  if (lastClicked !== 'operator') {
    currUserVal = IsFloat(currUserVal) ? Str2Float(currUserVal) : Str2Num(currUserVal);
    // Fisrt calc, set up
    if (calcs.length === 0) {
      AddCalculation({
        num1: 0,
        num2: currUserVal,
        operator: this.dataset.operator, // currUserOperator will be overwritten add end of function
        result: operate('', currUserVal)
      });
    } else {
      AddCalculation({
        num1: calcs[calcs.length - 1].result,
        num2: currUserVal,
        operator: currUserOperator, // currUserOperator will be overwritten add end of function
        result: operate(currUserOperator, calcs[calcs.length - 1].result, currUserVal)
      });
    }
    
    currUserVal = '';
    lastClicked = 'operator';
    currUserOperator = this.dataset.operator;
  } else if (lastClicked === 'operator') { // lastClicked is an operator
    // Auto Invert value 
    if (currUserOperator === 'add' &&
      this.dataset.operator === 'subtract') {
      if (currUserVal === '-') 
        currUserOperator = this.dataset.operator;

      currUserVal = ToggleNegative(currUserVal);
    }
    else if (currUserOperator === 'subtract' &&
      this.dataset.operator === 'subtract') {
        currUserVal = ToggleNegative(currUserVal);
    } else {
      currUserOperator = this.dataset.operator;
    }
  }

  console.clear();
  console.table(calcs);
}
//#endregion Handler Functions

//#region Helper Function
let IsNumber = (n) => {
  return typeof n === 'number';
}

let IsFloat = (n) => {
  return n > Math.floor(n);
}

let InvertVal = (n) => {
  if(n < 0)
    return Math.abs(n);

  return -Math.abs(n);
}

let ToggleNegative = (val) => {
  if(val === '-')
    return '';
  return '-';
}

let Str2Num = (str) => {
  let newNum = parseInt(str, 10);
  return !isNaN(newNum) ? newNum : console.error('ERROR, must be a valid number');
}

let Str2Float = (str) => {
  let newNum = parseFloat(str);
  return !isNaN(newNum) ? newNum : console.error('ERROR, must be a valid float');
}

let GetOperatorSymbol = (operator) => {
  switch (operator) {
    case 'add':
      return '+';
    case 'subtract':
      return '-';
    case 'multiply':
      return '*';
    case 'divide':
      return '/';
    default:
      return '';
  }
}
//#endregion Helper Functions

//#region Calculator Functions
let Add = (a, b = 0) => a + b;
let Subtract = (a, b = 0) => a - b;
let Multiply = (a, b = 1) => a * b;
let Divide = (a, b = 1) => a / b;

let operate = (o, a, b) => {
  // if(!IsNumber(a) || !IsNumber(b)) 
  //   return console.error('ERROR, argument must be type of number');

  o = o.toLowerCase();
  
  switch(o) {
    case 'add':
      return Add(a, b);
    case 'subtract':
      return Subtract(a, b);
    case 'multiply':
      return Multiply(a, b);
    case 'divide':
      return Divide(a, b);
    default:
      return a;
  }
}

//#endregion Calculator Functions