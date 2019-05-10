export const getFirstLetterName = (firstName, lastName) => {
  if (firstName) {
    return firstName.charAt(0) + lastName.charAt(0);
  } else {
    return 'U'
  }
};
