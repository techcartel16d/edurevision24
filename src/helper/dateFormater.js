export const formatDateDDMMYYYY = inputDate => {
  if (!inputDate) return '';

  const date = new Date(inputDate);

  if (isNaN(date.getTime())) return ''; // Invalid date handling

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const ddmmmFormatterWithTime = inputDate => {
  // console.log("inputDate==>", inputDate)
  const date = new Date(inputDate);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dd = String(date.getDate()).padStart(2, '0');
  const mmm = months[date.getMonth()];
  let hh = date.getHours();
  const mm = String(date.getMinutes()).padStart(2, '0');
  const A = hh >= 12 ? 'PM' : 'AM';

  hh = hh % 12;
  hh = hh === 0 ? 12 : hh;
  hh = String(hh).padStart(2, '0');

  return `${dd}${mmm} ${hh}:${mm} ${A}`;
};
