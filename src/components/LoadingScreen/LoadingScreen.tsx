import { Center, Stack, Heading, Spinner } from "@chakra-ui/react"

interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Loading..."}) => {
    return (
        <Center height='100vh'>
          <Stack alignItems='center'>
            <Heading>{message}</Heading>
            <Spinner />
          </Stack>
        </Center>
    )
}