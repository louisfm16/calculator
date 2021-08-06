export let helpers = {
  IsNumber(val) {
    return typeof val === 'number';
  },
  IsFloat(val) {
    return val > Math.floor(val);
  },
  IsString(val) {
    return typeof val === 'string';
  },
  IsNegative(val) {
    return (this.Convert2Number(val) < 0);
  },
  InvertVal(val) {
    return (this.IsNegative(val)) ? Math.abs(val) : -Math.abs(val);
  },
  ToggleNegativeSign(val) {
    return (this.Convert2String(val).includes('-')) ? '' : '-';
  },
  Convert2String(val) {
    return (!this.IsString(val)) ? val.toString() : val;
  },
  Convert2Number(val) {
    return (!this.IsNumber(val)) ? parseFloat(val) : val;
  },
  Convert2Percent(val) {
    return (this.Convert2Number(val) / 100);
  },
  GetOperatorSymbol(operator) {
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
  },


  // Need to remove these
  Str2Num: (str) => {
    let newNum = parseInt(str, 10);
    return !isNaN(newNum) ? newNum : console.error('ERROR, must be a valid number');
  },
  Str2Float: (str) => {
    let newNum = parseFloat(str);
    return !isNaN(newNum) ? newNum : console.error('ERROR, must be a valid float');
  },
  InvertNumber: (num) => {
    // Check if number
    num = (typeof num === 'number') ? num : num.toString();
    num = (num < 0) ? Math.abs(num) : Math.abs(num) * -1;

    return num;
  }
};