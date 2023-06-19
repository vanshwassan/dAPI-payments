import React, { useEffect,useState } from 'react'
import {
  ChakraProvider,
  IconButton,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Button,
  HStack,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Form from './pages/sendPayments';
import Check from './pages/checkReceipt';

import { ethers } from 'ethers';
// import { abi } from './abi';


function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [ConnectButtonText, setConnectButtonText] = useState('Connect Wallet');

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum) {
      if (window.ethereum.networkVersion !== '1287') {
        alert('Please connect to Moonbase-alpha Testnet');
        return;
      } else {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          setDefaultAccount(accounts[0]);
          setConnectButtonText(accounts[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }} else {
      setErrorMessage('Please install MetaMask!');
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid p={7}>
        <HStack spacing='28px' justifyContent="right">
          <ColorModeSwitcher />
          <Button onClick={connectWalletHandler}> {ConnectButtonText} </Button>
          {errorMessage}
          </HStack>
          <VStack spacing={8}>
            <Form/>
            <Check />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
