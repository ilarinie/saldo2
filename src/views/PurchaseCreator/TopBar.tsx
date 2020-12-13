import { CloseIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export interface TopBarProps {

}

export const TopBar: React.FC<TopBarProps> = () => {
    return (
        <Box className='top-bar'>
        <Link to='/'>
          <Flex alignItems='center'>
            <CloseIcon />
            <Text>
              SULJE
            </Text>
          </Flex>
        </Link>
      </Box>
    )
}