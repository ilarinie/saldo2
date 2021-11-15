import { Container, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import { selectLoginStatus } from 'client/store/authSlice'
import { useAppSelector } from 'client/store/hooks'
import googleLoginButton from '../../assets/google-signin.png'
import hero from '../../assets/hero.jpg'
import sample from '../../assets/vidja.mp4'

export const LoginView = () => {
  const loginStatus = useAppSelector(selectLoginStatus)

  return (
    <LoginContainer>
      <video autoPlay loop muted playsInline controls>
        <source src={sample} type='video/mp4' />
      </video>
      <LoginContents>
        {loginStatus === 'UNAUTHORIZED' ? (
          <>
            <Typography variant='h2' sx={{ fontFamily: 'LogoFont' }}>
              Saldo
            </Typography>
            <Typography variant='caption'>for</Typography>
            <Typography variant='h6' gutterBottom>
              Saldoing your saldos
            </Typography>
            <a href='/api/auth/google'>
              <img src={googleLoginButton} style={{ marginTop: '36px' }} alt='google login button' />
            </a>
          </>
        ) : (
          <Box>Loading..</Box>
        )}
      </LoginContents>
    </LoginContainer>
  )
}

const LoginContainer = styled(Container)`
  /* background: url('${hero}');/ */
  video {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }
  width: 100vw;
  height: 100vh;
  /* background-size: cover; */
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const LoginContents = styled(Box)`
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  text-align: center;
  padding: 3em;
`
