export const formatDegreeInSign = (value: number): string =>
  `${(Math.floor(value * 100) / 100).toFixed(2)}°`;

export const formatRoundedAngle = (value: number): string =>
  `${value.toFixed(2)}°`;

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const formatLongitudeAsSignDegree = (
  longitude: number,
): { sign: string; degree: string } => {
  const normalized = longitude === 360 ? 0 : longitude;
  const signIndex = Math.floor(normalized / 30);
  // Remove subtraction noise before applying the existing degree formatter.
  const degreeInSign = Number((normalized - signIndex * 30).toFixed(10));
  return { sign: SIGN_NAMES[signIndex], degree: formatDegreeInSign(degreeInSign) };
};
