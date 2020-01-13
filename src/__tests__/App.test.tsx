import React from 'react';
import { render } from '@testing-library/react';

import App from '../components/App';

describe('<App />', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('WELCOME TO NOTHING 🤗')).toBeInTheDocument();
  });
});
