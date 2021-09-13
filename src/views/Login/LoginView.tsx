import { Container, Heading, Spacer, Stack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import googleLoginButton from '../../assets/google-signin.png';

export const LoginView: React.FC = observer(() => {
  return (
    <Container>
      <Stack spacing={5} alignItems='center'>
        <Spacer />
        <Heading>SaldoApp</Heading>
        <Heading as='h3' size='md'>
          Saldoing your saldo
        </Heading>
        <a href='/api/auth/google'>
          <img src={googleLoginButton} alt='google login button' />
        </a>
      </Stack>
    </Container>
  );
});
