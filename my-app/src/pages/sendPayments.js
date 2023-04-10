import React, { useEffect,useState } from 'react'
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

import { ethers } from 'ethers';
import { abi } from './abi';


export default function Form() {

  var [token, setToken] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [sendBtnText, setSendBtnText] = useState('Approve');

  const approvePayments = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

  }

  const sendPaymentHandler = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let contract = new ethers.Contract({ token }, abi, signer);
    setContract(contract);
  }

  console.log(token)
    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
                <Box textAlign="center">
                    <Heading>Send Payments to the Contract</Heading>
                </Box>
                <Box my={4} textAlign="left">
          <form>
            <FormControl>
              <FormLabel>Select token to pay</FormLabel>
              <Stack direction='row' spacing={4} align='center'>
              <Button id='wethID' colorScheme='blue' onClick={() => setToken=('wethAddress')}>WETH</Button>
              <Button id='wmaticID' colorScheme='blue' onClick={() => setToken=('wmaticAddress')}>WMATIC</Button>
              </Stack>
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Enter the amount</FormLabel>
              <Input type="text" />
            </FormControl>
            <Button width="full" mt={4} type="submit">
            { sendBtnText }
            </Button>
          </form>
        </Box>
            </Box>
        </Flex>
    );
}