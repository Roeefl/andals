export const sumValues = (obj) => Object
  .values(obj)
  .reduce((r1, r2) => r1 + r2, 0)
