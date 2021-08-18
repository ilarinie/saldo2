import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';

interface SearchFieldProps {
  onSearchTextChange: (searchText: string) => void;
  requestConfirmPurchase: (
    amount: number | undefined,
    description: string
  ) => void;
}

export const SearchField = ({
  onSearchTextChange,
  requestConfirmPurchase,
}: SearchFieldProps) => {
  const [filterText, setFilterText] = useState('');
  const debouncedFilterText = useDebouncedValue(filterText, 150);

  useEffect(() => {
    onSearchTextChange(debouncedFilterText);
  }, [debouncedFilterText]);

  return (
    <Box className='search'>
      <InputGroup>
        <Input
          className='search-input'
          onChange={(event) => setFilterText(event.target.value)}
          value={filterText}
          placeholder='Selite'
        />
        <InputRightElement
          children={
            <>
              <CloseIcon onClick={() => setFilterText('')} />
            </>
          }
        />
      </InputGroup>
      {filterText !== '' && (
        <Button
          background='positiveColor'
          marginTop='0.2em'
          isFullWidth
          onClick={() => {
            setFilterText('');
            requestConfirmPurchase(undefined, filterText);
          }}
        >
          Lisää "{filterText}"
        </Button>
      )}
    </Box>
  );
};
