function reverseString(str) {
  if (!str) return str;
  return str.split('').reverse().join('');
}