import { render, screen } from '@testing-library/react';
import ArrowIcon from '.';

test('ArrowIcon matches snapshot', () => {
  render(<ArrowIcon up color='red' />);
  expect(screen).toMatchSnapshot();
});
