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
  let tempVal;
  if (this.dataset.number === '.') {
    currUserVal += '.'; // Check if already has decimal
    tempVal = Str2Float(currUserVal);
  } 
  else {
    currUserVal += this.dataset.number;
    tempVal = Str2Num(currUserVal);
  }

  if (calcs.length <= 0) {
    UpdateDisplay(tempVal);
  } else {
    UpdateDisplay(operate(currUserOperator, calcs[calcs.length - 1].result, tempVal));
  }
}

let HandleOperatorClick = function () {
  // if (currUserOperator === this.dataset.operator) return;

  if (currUserOperator === 'add' && this.dataset.operator === 'subtract') {
    // Next number is negative
    // If Next number is already negative, invert

    // make a function for this, InvertInt()
  } else {
    currUserOperator = this.dataset.operator;
  }

  currUserVal = IsFloat(currUserVal) ? Str2Float(currUserVal) : Str2Num(currUserVal);
  // Check if array is empty
  if (calcs.length <= 0) {
    calcs.push({
      num1: 0,
      num2: currUserVal,
      operator: currUserOperator,
      result: currUserVal
    });
  } else {
    let prevRes = calcs[calcs.length - 1].result;

    calcs.push({
      num1: prevRes,
      num2: currUserVal,
      operator: currUserOperator,
      result: operate(currUserOperator, prevRes, currUserVal)
    });
  }

  currUserVal = '';
  // currUserOperator = '';
}
//#endregion Handler Functions

//#region Helper Function
let IsNumber = (n) => {
  return typeof n === 'number';
}

let IsFloat = (n) => {
  return n > Math.floor(n);
}

let Str2Num = (str) => {
  let newNum = parseInt(str, 10);
  return !isNaN(newNum) ? newNum : console.error('ERROR, must be a valid number');
}

let Str2Float = (str) => {
  let newNum = parseFloat(str, 10);
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