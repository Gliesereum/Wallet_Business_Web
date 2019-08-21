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
    const hh = String(dateInMS.getUTCHours()).padStart(2, '0');
    const mm = String(dateInMS.getUTCMinutes()).padStart(2, '0');

    return `${hh}:${mm}`;
  }

  const YYYY = dateInMS.getUTCFullYear();
  const MM = String(dateInMS.getUTCMonth() + 1).padStart(2, '0'); // month of the year
  const DD = String(dateInMS.getUTCDate()).padStart(2, '0'); // day of the month

  return `${DD}.${MM}.${YYYY}`;
};

export const checkInputHandler = (inputField, form) => (e) => {
  const { value } = e.target;

  const regExp = {
    phone: /^[\d]{0,12}$/,
    code: /^[\d]{0,6}$/,
  };

  if (Number.isNaN(value) || !regExp[inputField].test(value)) {
    return form.getFieldValue(inputField);
  }

  return value;
};
