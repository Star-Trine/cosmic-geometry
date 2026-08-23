import { useState } from 'react';
import type { FormEvent } from 'react';
import { LocationApiError, searchLocations } from '../../api/location';
import type { LocationCandidate } from '../../data/location/types';
import type { HoroscopeRequest } from '../../data/horoscope/types';

type Props = {
  value: HoroscopeRequest;
  disabled?: boolean;
  onChange: (value: HoroscopeRequest) => void;
  onSubmit: () => void;
};

export default function BirthInput({
  value,
  disabled = false,
  onChange,
  onSubmit,
}: Props) {
  const [locationCandidates, setLocationCandidates] = useState<LocationCandidate[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

  const locationQuery = `${value.place.city.trim()}\u0000${value.place.country.trim()}`;
  const locationIsStale = selectedQuery !== null && selectedQuery !== locationQuery;

  const updatePlace = (
    field: keyof HoroscopeRequest['place'],
    nextValue: string | number,
  ) => {
    onChange({
      ...value,
      place: { ...value.place, [field]: nextValue },
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleLocationSearch = async () => {
    setLocationLoading(true);
    setLocationMessage(null);
    setLocationCandidates([]);
    try {
      const candidates = await searchLocations(
        value.place.city,
        value.place.country,
      );
      setLocationCandidates(candidates);
      if (candidates.length === 0) {
        setLocationMessage('No matching locations were found.');
      }
    } catch (caught) {
      setLocationMessage(
        caught instanceof LocationApiError
          ? caught.message
          : 'Locations could not be searched.',
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const selectLocation = (candidate: LocationCandidate) => {
    const city = candidate.locality ?? value.place.city.trim();
    onChange({
      ...value,
      place: {
        ...value.place,
        name: candidate.label,
        city,
        country: candidate.country,
        latitude: candidate.latitude,
        longitude: candidate.longitude,
        timezone: candidate.timezone,
      },
    });
    setSelectedQuery(`${city}\u0000${candidate.country}`);
    setLocationCandidates([]);
    setLocationMessage(`Selected: ${candidate.label}`);
  };

  return (
    <form className="horoscope-birth-input" onSubmit={handleSubmit}>
      <h2>Birth Input</h2>

      <div className="horoscope-input-grid">
        <label>
          Date
          <input
            type="date"
            required
            disabled={disabled}
            value={value.date}
            onChange={(event) => onChange({ ...value, date: event.target.value })}
          />
        </label>

        <label>
          Time
          <input
            type="time"
            required={value.timeKnown}
            disabled={disabled || !value.timeKnown}
            value={value.time ?? ''}
            onChange={(event) => onChange({ ...value, time: event.target.value })}
          />
        </label>

        <label className="horoscope-checkbox">
          <input
            type="checkbox"
            disabled={disabled}
            checked={!value.timeKnown}
            onChange={(event) =>
              onChange({
                ...value,
                timeKnown: !event.target.checked,
                time: event.target.checked ? null : '',
              })
            }
          />
          Birth time unknown
        </label>

        <label>
          City
          <input
            required
            disabled={disabled}
            value={value.place.city}
            onChange={(event) => updatePlace('city', event.target.value)}
          />
        </label>

        <label>
          Country
          <input
            required
            disabled={disabled}
            value={value.place.country}
            onChange={(event) => updatePlace('country', event.target.value)}
          />
        </label>

        <div className="horoscope-location-search">
          <button
            type="button"
            disabled={disabled || locationLoading}
            onClick={handleLocationSearch}
          >
            {locationLoading ? 'Searching…' : 'Search Location'}
          </button>

          {locationCandidates.length > 0 && (
            <div className="horoscope-location-candidates" aria-label="Location candidates">
              {locationCandidates.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  className="horoscope-location-candidate"
                  disabled={disabled}
                  onClick={() => selectLocation(candidate)}
                >
                  <strong>{candidate.locality ?? candidate.label}</strong>
                  <span>
                    {[candidate.region, candidate.country]
                      .filter((part, index, parts) =>
                        part && parts.indexOf(part) === index)
                      .join(', ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {(locationLoading || locationMessage) && (
            <p className="horoscope-location-status" aria-live="polite">
              {locationLoading ? 'Searching for locations…' : locationMessage}
            </p>
          )}
          {locationIsStale && (
            <p className="horoscope-location-status">
              Search again after changing the city or country.
            </p>
          )}

          <p className="horoscope-location-attribution">
            <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer">
              Powered by Geoapify
            </a>
            <span aria-hidden="true"> · </span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              © OpenStreetMap contributors
            </a>
          </p>
        </div>

        <label>
          Latitude
          <input
            className="horoscope-coordinate-input"
            type="number"
            min="-90"
            max="90"
            step="any"
            required
            disabled={disabled}
            value={value.place.latitude}
            onChange={(event) => updatePlace('latitude', Number(event.target.value))}
          />
        </label>

        <label>
          Longitude
          <input
            className="horoscope-coordinate-input"
            type="number"
            min="-180"
            max="180"
            step="any"
            required
            disabled={disabled}
            value={value.place.longitude}
            onChange={(event) => updatePlace('longitude', Number(event.target.value))}
          />
        </label>

        <label>
          Timezone
          <input
            required
            disabled={disabled}
            placeholder="Asia/Tokyo"
            value={value.place.timezone}
            onChange={(event) => updatePlace('timezone', event.target.value)}
          />
        </label>

      </div>

      <button type="submit" disabled={disabled}>
        {disabled ? 'Generating…' : 'Generate Horoscope'}
      </button>
    </form>
  );
}
