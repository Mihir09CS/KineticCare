/**
 * Formats ISO date string into readable date (e.g. "Aug 15, 2026")
 * @param {string|Date} dateStr 
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

/**
 * Formats 24-hr HH:MM time into 12-hr time with AM/PM (e.g. "09:00" -> "9:00 AM")
 * @param {string} time24 
 * @returns {string}
 */
export const formatTime = (time24) => {
  if (!time24 || !time24.includes(":")) return time24 || "";
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 to 12
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Combines date and start-end time range into a single string
 * e.g. "Aug 15, 2026 (9:00 AM - 10:00 AM)"
 */
export const formatDateTimeRange = (dateStr, startTime, endTime) => {
  const formattedDate = formatDate(dateStr);
  const formattedStart = formatTime(startTime);
  const formattedEnd = formatTime(endTime);
  return `${formattedDate} • ${formattedStart} - ${formattedEnd}`;
};
