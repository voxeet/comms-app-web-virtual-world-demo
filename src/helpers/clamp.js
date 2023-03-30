export const clamp = (min, max) => (value) =>
  value < min ? min : value > max ? max : value;
