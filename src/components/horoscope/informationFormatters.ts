export const formatDegreeInSign = (value: number): string =>
  `${(Math.floor(value * 100) / 100).toFixed(2)}°`;

export const formatRoundedAngle = (value: number): string =>
  `${value.toFixed(2)}°`;
