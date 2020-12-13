import { render, screen} from '@testing-library/react';
import LoadingScreen from '.';

test('LoadingScreen matches snapshot', () => {
    render(<LoadingScreen message='testMessage' />);
    expect(screen).toMatchSnapshot();
    const message = screen.getByText(/testMessage/i);
    expect(message).toBeInTheDocument();
});