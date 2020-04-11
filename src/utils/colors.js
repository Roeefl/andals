export function hexToRgb(hex) {
  const noHashtag = hex.substr(1);
  
  const bigInt = parseInt(noHashtag, 16);
  const r = (bigInt >> 16) & 255;
  const g = (bigInt >> 8) & 255;
  const b = bigInt & 255;

  return `${r}, ${g}, ${b}`;
};
