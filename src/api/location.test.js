import { LocationApiError, searchLocations } from './location';

const candidate = {
  id: 'tokyo',
  label: 'Tokyo, Japan',
  locality: 'Tokyo',
  region: 'Tokyo',
  country: 'Japan',
  countryCode: 'jp',
  latitude: 35.6768601,
  longitude: 139.7638947,
  timezone: 'Asia/Tokyo',
};

test('posts City and Country and accepts normalized candidates', async () => {
  const fetchImpl = jest.fn().mockResolvedValue(
    new Response(JSON.stringify({ candidates: [candidate] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  );

  await expect(searchLocations('Tokyo', 'Japan', fetchImpl)).resolves.toEqual([
    candidate,
  ]);
  expect(fetchImpl).toHaveBeenCalledWith('/api/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city: 'Tokyo', country: 'Japan' }),
  });
});

test('accepts an empty candidate list', async () => {
  const fetchImpl = jest.fn().mockResolvedValue(
    new Response(JSON.stringify({ candidates: [] }), { status: 200 }),
  );
  await expect(searchLocations('Nowhere', 'Nowhere', fetchImpl)).resolves.toEqual([]);
});

test('rejects malformed successful responses', async () => {
  const fetchImpl = jest.fn().mockResolvedValue(
    new Response(JSON.stringify({ candidates: [{ ...candidate, timezone: null }] }), {
      status: 200,
    }),
  );
  await expect(searchLocations('Tokyo', 'Japan', fetchImpl)).rejects.toEqual(
    expect.objectContaining({ code: 'INVALID_RESPONSE' }),
  );
});

test('maps API and network failures', async () => {
  const apiFailure = jest.fn().mockResolvedValue(
    new Response(
      JSON.stringify({ error: { code: 'INVALID_INPUT', message: 'Invalid city.' } }),
      { status: 400 },
    ),
  );
  await expect(searchLocations('', 'Japan', apiFailure)).rejects.toEqual(
    new LocationApiError(400, 'INVALID_INPUT', 'Invalid city.'),
  );

  await expect(
    searchLocations('Tokyo', 'Japan', jest.fn().mockRejectedValue(new Error('offline'))),
  ).rejects.toEqual(expect.objectContaining({ code: 'NETWORK_ERROR' }));
});
