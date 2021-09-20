import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { observer } from 'mobx-react-lite';
import googleLoginButton from '../../assets/google-signin.png';

export const LoginView: React.FC = observer(() => {
  return (
    <Container>
      <Box>
        <Typography>SaldoApp</Typography>
        <Typography>Saldoing your saldo</Typography>
        <a href='/api/auth/google'>
          <img src={googleLoginButton} alt='google login button' />
        </a>
      </Box>
    </Container>
  );
});
