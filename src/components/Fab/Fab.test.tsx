import { render, screen} from '@testing-library/react';
import Fab from '.';

test('Fab matches snapshot', () => {
    render(<Fab onClick={() => {}} />);
    expect(screen).toMatchSnapshot();
});