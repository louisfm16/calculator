import { CalcApp} from './calcApp.js';

document.addEventListener("DOMContentLoaded", () => Init());

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

let HandleNumClick = function () {
  CalcApp.HandleNumClick(this);
}

let HandleOperatorClick = function () {
  CalcApp.HandleOperatorClick(this);
}

let HandleFunctionClick = function () {
  CalcApp.HandleFunctionClick(this);
}
//#endregion Handler Functions