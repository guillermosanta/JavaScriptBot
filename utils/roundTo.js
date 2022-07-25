module.exports = roundTo = (number, digits) => {
  return +(Math.round(number + `e+${digits}`) + `e-${digits}`);
};
