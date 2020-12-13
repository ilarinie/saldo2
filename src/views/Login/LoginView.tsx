import { Button, Container, Heading, Input, Spacer, Stack, Text } from "@chakra-ui/react"
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react"
import { RootContext } from "../../state/RootContext";

export const LoginView: React.FC = observer(() => {

    const { loginError, logIn } = useContext(RootContext);
    const [ secret, setSecret ] = useState('');

    return (
        <Container>
            <Stack spacing={5}>
                <Spacer />
                <Heading>SaldoApp Login</Heading>
                <Input type='password' onChange={(event) => setSecret(event.target.value)}/>
                <Button colorScheme='teal' onClick={() => logIn(secret)}>Login</Button>
                {loginError && <Text>{loginError}</Text>}
            </Stack>
        </Container>
    )
});