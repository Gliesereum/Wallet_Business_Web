export const getFirstLetterName = (firstName, lastName) => {
  if (firstName) {
    return firstName.charAt(0) + lastName.charAt(0);
  }
  return 'U';
};

export const getDate = (date, inHours = false) => {
  if (!date) return 'Нету данных';

  const dateInMS = new Date(date);

  if (inHours) {
    const hh = String(dateInMS.getHours()).padStart(2, '0');
    const mm = String(dateInMS.getMinutes()).padStart(2, '0');

    return `${hh}:${mm}`;
  }

  const YYYY = dateInMS.getFullYear();
  const MM = String(dateInMS.getMonth() + 1).padStart(2, '0'); // month of the year
  const DD = String(dateInMS.getDate()).padStart(2, '0'); // day of the month

  return `${DD}.${MM}.${YYYY}`;
};
