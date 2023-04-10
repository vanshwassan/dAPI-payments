import React from 'react';
import {
    Flex,
    Box,
    Stack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
} from '@chakra-ui/react';

export default function Check() {
    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
                <Box textAlign="center">
                    <Heading>Check your Payments Receipt</Heading>
                    <Heading size={2}>Check how much you paid to the contract in USD</Heading>
                </Box>
                <Box my={4} textAlign="left">
          <form>
            <FormControl mt={6}>
              <FormLabel>Enter the TokenID</FormLabel>
              <Input type="text" />
            </FormControl>
            <Button width="full" mt={4} type="submit">
              Check
            </Button>
          </form>
        </Box>
            </Box>
        </Flex>
    );
}