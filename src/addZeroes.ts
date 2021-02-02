export const addZeroes = (num: string) => {
  const dec = num.split('.')[1];
  const len = dec && dec.length > 2 ? dec.length : 2;
  return Number(num).toFixed(len);
}

addZeroes('3233.2')