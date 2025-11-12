/**
 * Currency conversion utilities
 * Exchange rate: 1 USD = 315 PKR
 */
export const USD_TO_PKR_RATE = 315;

/**
 * Convert USD amount to PKR
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in PKR
 */
export const usdToPkr = (usdAmount) => {
  return Math.round(usdAmount * USD_TO_PKR_RATE);
};

/**
 * Format PKR amount with commas
 * @param {number} amount - Amount in PKR
 * @returns {string} Formatted amount with commas
 */
export const formatPkr = (amount) => {
  return amount.toLocaleString('en-US');
};

/**
 * Format currency display with USD and PKR
 * @param {number} usdAmount - Amount in USD
 * @returns {object} Object with formatted USD and PKR strings
 */
export const formatCurrency = (usdAmount) => {
  const pkrAmount = usdToPkr(usdAmount);
  return {
    usd: `$${usdAmount}`,
    pkr: `PKR ${formatPkr(pkrAmount)}`,
    pkrOnly: formatPkr(pkrAmount)
  };
};

