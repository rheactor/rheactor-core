export function clamp(value: number, min: number, max: number) {
  return value < min ? min : Math.min(value, max);
}

export function formatNumber(
  value: number,
  decimals = 0,
  decimalSeparator = ".",
  thousandSeparator = "",
) {
  const [valueNumber, valueDecimal] = value.toFixed(decimals).split(".") as [string, string];

  const valueFormatted =
    thousandSeparator === ""
      ? valueNumber
      : valueNumber.replaceAll(/\B(?=(?:\d{3})+(?!\d))/gv, thousandSeparator);

  return decimals === 0 ? valueFormatted : valueFormatted + decimalSeparator + valueDecimal;
}
