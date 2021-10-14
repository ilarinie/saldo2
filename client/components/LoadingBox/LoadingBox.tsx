import { Box } from '@mui/material'

export interface LoadingBoxProps {
    isLoading: boolean
    error: string
}

export const LoadingBox = ({ isLoading, error }: LoadingBoxProps) => {
    if (!isLoading && !error) {
        return null
    }
    return (
        <Box>
            {isLoading &&
                <Box>Loading...</Box>
            }
            {error && <Box>{error}</Box>}
        </Box>
    )
}