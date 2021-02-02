import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Container } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';

interface SliderProps {
  children: ReactNode;
}

export const Slider = ({ children }: SliderProps) => {
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <Container
      bg='lighterDark'
      className={`slider ${fullScreen && 'fullsize'}`}
    >
      {fullScreen && (
        <ChevronDownIcon
          className='sliderChevron'
          onClick={() => setFullScreen(!fullScreen)}
        >
          y
        </ChevronDownIcon>
      )}
      {!fullScreen && (
        <ChevronUpIcon
          className='sliderChevron'
          onClick={() => setFullScreen(!fullScreen)}
        >
          y
        </ChevronUpIcon>
      )}
      {children}
    </Container>
  );
};
