import {
  formatDegreeInSign,
  formatLongitudeAsSignDegree,
  formatRoundedAngle,
} from './informationFormatters';

test.each([
  [0, 'Aries', '0.00°'],
  [29.999, 'Aries', '29.99°'],
  [30, 'Taurus', '0.00°'],
  [66.509, 'Gemini', '6.50°'],
  [308.14, 'Aquarius', '8.14°'],
  [359.999, 'Pisces', '29.99°'],
  [360, 'Aries', '0.00°'],
])('formats cusp longitude %s as separate sign and degree fields', (longitude, sign, degree) => {
  expect(formatLongitudeAsSignDegree(longitude)).toEqual({ sign, degree });
});

test('truncates sign-relative degrees to two decimal places', () => {
  expect(formatDegreeInSign(29.999)).toBe('29.99°');
  expect(formatDegreeInSign(14.567)).toBe('14.56°');
  expect(formatDegreeInSign(0)).toBe('0.00°');
});

test('rounds absolute angles and aspect values to two decimal places', () => {
  expect(formatRoundedAngle(186.425)).toBe('186.43°');
  expect(formatRoundedAngle(117.954999)).toBe('117.95°');
  expect(formatRoundedAngle(1.876)).toBe('1.88°');
  expect(formatRoundedAngle(0)).toBe('0.00°');
});
