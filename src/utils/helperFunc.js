const getFirstLetterName = (firstName, lastName) => {
  if (firstName) {
    return firstName.charAt(0) + lastName.charAt(0);
  }
  return 'U';
};

export default getFirstLetterName;
