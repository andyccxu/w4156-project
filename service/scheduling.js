/**
 * parses the time string into
 * hours and minutes, return them as Numbers
 * @param {string} timeString "HH:MM" or "HH:MM [AM/PM]"
 * @return {[Number, Number]} [hours, minutes]
 */
function parseTime(timeString) {
  const arr = timeString.split(':');
  if (arr.length > 2) {
    return [];
  }

  let [hours, minutes] = arr;
  hours = Number(hours.trim());

  // check if minutes ends with "AM" or "PM"
  if (minutes.includes('AM')) {
    minutes = minutes.slice(0, -2);
  }

  if (minutes.includes('PM')) {
    minutes = minutes.slice(0, -2);
    hours += 12;
  }

  minutes = Number(minutes.trim());
  if (minutes > 59 | minutes < 0) {
    return [];
  };
  if (hours > 23 | hours < 0) {
    return [];
  };

  return [hours, minutes];
}


module.exports.parseTime = parseTime;
