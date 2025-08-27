import moment from 'moment';
// export const isQuizStartAvailable = (startDateTime) => {
//   console.log("startDateTime", startDateTime)
//   if (!startDateTime) return false;

//   // console.log("startDateTime:", startDateTime);

//   const start = moment(startDateTime, 'hh:mm a, DD MMM YYYY');
//   const now = moment();

//   // console.log("Parsed start:", start.format());
//   // console.log("Now:", now.format());
//   // console.log("Available:", now.isSameOrAfter(start));

//   return now.isSameOrAfter(start); // true if now >= start
// };


export const isQuizStartAvailable = (startDateTime) => {
  // console.log("startDateTime", startDateTime)
  if (!startDateTime) return false;

  let start;

  // Try parsing known formats
  if (startDateTime.includes(',')) {
    // Format: "hh:mm a, DD MMM YYYY"
    start = moment(startDateTime, 'hh:mm a, DD MMM YYYY');
  } else {
    // Format: "YYYY-MM-DD"
    start = moment(startDateTime, 'YYYY-MM-DD');
  }

  const now = moment();

  return now.isSameOrAfter(start); // true if now >= start
};


export const isQuizUpcoming = (startDateTime) => {
  if (!startDateTime) return false;
  const now = new Date();
  const start = new Date(startDateTime);
  return now < start;
};




export const formatStartDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Invalid date';

  const parsed = moment(dateTimeString, 'hh:mm a, DD MMM YYYY');

  if (!parsed.isValid()) return 'Invalid date';

  // Return in format: "26 Jul 2025"
  return parsed.format('DD MMM YYYY');
};