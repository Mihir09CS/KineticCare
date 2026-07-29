/**
 * Formats a number as Indian Rupee (INR) currency (e.g. ₹25.00 or ₹25)
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};
