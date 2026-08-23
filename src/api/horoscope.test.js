import { requestHoroscope } from './horoscope';

const request = {
  date: '1995-09-12',
  time: '14:30',
  timeKnown: true,
  place: {
    name: 'Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
};

const responseBody = {
  horoscope: {},
  analysis: {},
  visualProfile: {},
};

test('posts the request and returns a horoscope response', async () => {
  const fetchImpl = jest.fn().mockResolvedValue(new Response(
    JSON.stringify(responseBody),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  ));

  await expect(requestHoroscope(request, fetchImpl)).resolves.toStrictEqual(responseBody);
  expect(fetchImpl).toHaveBeenCalledWith('/api/horoscope', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify(request),
  }));
});

test('preserves the backend error code and message', async () => {
  const fetchImpl = jest.fn().mockResolvedValue(new Response(
    JSON.stringify({ error: { code: 'INVALID_INPUT', message: 'Invalid date' } }),
    { status: 400, headers: { 'Content-Type': 'application/json' } },
  ));

  await expect(requestHoroscope(request, fetchImpl)).rejects.toEqual(
    expect.objectContaining({
      status: 400,
      code: 'INVALID_INPUT',
      message: 'Invalid date',
    }),
  );
});
