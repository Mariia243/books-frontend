export const formatNumber = (number) => {
  if (!number) return "0";
  const suffixes = ["", "k", "M", "B", "T"];
  const exponent = Math.floor(Math.log(Math.abs(number)) / Math.log(1000));
  const adjustedNumber = number / Math.pow(1000, exponent);
  const formattedNumber = adjustedNumber;

  return formattedNumber + suffixes[exponent];
};
