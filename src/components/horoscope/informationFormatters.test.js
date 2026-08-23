import {
  formatDegreeInSign,
  formatRoundedAngle,
} from './informationFormatters';

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
