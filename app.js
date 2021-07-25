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

//#endregion Variables

//#region App Functions
let Init = function () {
  appEl = document.getElementById('app');
  dispEvalEl = document.getElementById('display--eval');
  dispEquateEl = document.getElementById('display--equation');
}

let UpdateDisplay = (newVal) => {
  dispEvalEl.innerHTML = newVal;
}
//#endregion App Functions

//#region Helper Function
let IsNumber = (arg) => {
  return typeof arg === 'number';
}
//#endregion Helper Functions

//#region Calculator Functions
let Add = (a, b) => a + b;
let Subtract = (a, b) => a - b;
let Multiply = (a, b) => a * b;
let Divide = (a, b) => a / b;

let operate = (o, a, b) => {
  if(!IsNumber(a) || !IsNumber(b)) 
    return console.error('ERROR, argument must be type of number');

  o = o.toLowerCase();
  
  switch(o) {
    case 'add':
      UpdateDisplay(Add(a, b));
      break;
    case 'subtract':
      UpdateDisplay(Subtract(a, b));
      break;
    case 'multiply':
      UpdateDisplay(Multiply(a, b));
      break;
    case 'divide':
      UpdateDisplay(Divide(a, b));
      break;
    default:
      return console.error('ERROR, Invalid operator!');
  }
}

//#endregion Calculator Functions