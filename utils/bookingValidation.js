function validateBookingDates(checkIn, checkOut, now = new Date()) {
  const validDay = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
  };
  const today = [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
  return validDay(checkIn) && validDay(checkOut) && checkIn >= today && checkOut > checkIn;
}
module.exports = {validateBookingDates};
