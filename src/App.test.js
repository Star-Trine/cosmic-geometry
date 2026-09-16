import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/StarCanvas', () => () => <div data-testid="star-canvas" />);
jest.mock('@vercel/analytics/react', () => ({ Analytics: () => null }), { virtual: true });
jest.mock('@vercel/speed-insights/react', () => ({ SpeedInsights: () => null }), { virtual: true });
jest.mock('./experiments/homeVisual/HomeVisual', () => () => <h1>Cosmic Geometry</h1>);
jest.mock('./pages/About', () => () => <h1>このサイトについて</h1>);

test('renders the home page and primary navigation', () => {
  window.history.pushState({}, '', '/');

  render(<App />);

  expect(screen.getByRole('heading', { name: 'Cosmic Geometry' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Works' })).toHaveAttribute('href', '/works');
});

test('renders the page for a representative route', () => {
  window.history.pushState({}, '', '/about');

  render(<App />);

  expect(screen.getByRole('heading', { name: 'このサイトについて' })).toBeInTheDocument();
});
