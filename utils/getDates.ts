// Get today's date
export const getToday = () => {
  const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
  return today;
};

// Get the date one year from today
export const getNextYear = () => {
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearDate = nextYear.toISOString().split("T")[0]; // Get YYYY-MM-DD format
  return nextYearDate;
};
