export const sumValues = (obj) => {
  if (!obj) return 0;
  
  return Object
    .values(obj)
    .reduce((r1, r2) => r1 + r2, 0)
};

