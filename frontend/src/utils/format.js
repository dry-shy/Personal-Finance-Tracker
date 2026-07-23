export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCurrency(value, { sign = '' } = {}) {
  const amount = Number(value) || 0;
  return `${sign}₹${numberWithCommas(Math.abs(amount).toFixed(2))}`;
}
