import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BirthInput from './BirthInput';
import { LocationApiError, searchLocations } from '../../api/location';

jest.mock('../../api/location', () => ({
  LocationApiError: class LocationApiError extends Error {
    constructor(status, code, message) {
      super(message);
      this.status = status;
      this.code = code;
    }
  },
  searchLocations: jest.fn(),
}));

const value = {
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

beforeEach(() => {
  searchLocations.mockReset();
});

test('converts an unknown birth time to timeKnown false and time null', () => {
  const onChange = jest.fn();
  render(<BirthInput value={value} onChange={onChange} onSubmit={jest.fn()} />);

  fireEvent.click(screen.getByLabelText('Birth time unknown'));

  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
    timeKnown: false,
    time: null,
  }));
});

test('submits the current form without modifying the request', () => {
  const onSubmit = jest.fn();
  render(<BirthInput value={value} onChange={jest.fn()} onSubmit={onSubmit} />);

  fireEvent.click(screen.getByRole('button', { name: 'Generate Horoscope' }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('does not render a Place name input and keeps coordinates editable', () => {
  const onChange = jest.fn();
  render(<BirthInput value={value} onChange={onChange} onSubmit={jest.fn()} />);

  expect(screen.queryByLabelText('Place name')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Latitude'), { target: { value: '36.5' } });
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
    place: expect.objectContaining({ latitude: 36.5 }),
  }));
});

test('searches City and Country, shows loading, and lists candidates', async () => {
  let resolveSearch;
  searchLocations.mockReturnValue(new Promise((resolve) => {
    resolveSearch = resolve;
  }));
  render(<BirthInput value={value} onChange={jest.fn()} onSubmit={jest.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: 'Search Location' }));
  expect(searchLocations).toHaveBeenCalledWith('Tokyo', 'Japan');
  expect(screen.getByText('Searching for locations…')).toBeInTheDocument();

  resolveSearch([candidate]);
  expect(await screen.findByRole('button', { name: /Tokyo/ })).toBeInTheDocument();
});

test('applies a selected candidate to the existing horoscope place', async () => {
  const onChange = jest.fn();
  searchLocations.mockResolvedValue([candidate]);
  render(<BirthInput value={value} onChange={onChange} onSubmit={jest.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: 'Search Location' }));
  fireEvent.click(await screen.findByRole('button', { name: /Tokyo/ }));

  expect(onChange).toHaveBeenCalledWith({
    ...value,
    place: {
      ...value.place,
      name: 'Tokyo, Japan',
      city: 'Tokyo',
      country: 'Japan',
      latitude: 35.6768601,
      longitude: 139.7638947,
      timezone: 'Asia/Tokyo',
    },
  });
});

test('shows zero-result and API failure messages', async () => {
  searchLocations.mockResolvedValueOnce([]);
  const { rerender } = render(
    <BirthInput value={value} onChange={jest.fn()} onSubmit={jest.fn()} />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Search Location' }));
  expect(await screen.findByText('No matching locations were found.')).toBeInTheDocument();

  searchLocations.mockRejectedValueOnce(
    new LocationApiError(502, 'LOCATION_API_REQUEST_FAILED', 'Location search failed.'),
  );
  rerender(<BirthInput value={value} onChange={jest.fn()} onSubmit={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Search Location' }));
  await waitFor(() => {
    expect(screen.getByText('Location search failed.')).toBeInTheDocument();
  });
});
