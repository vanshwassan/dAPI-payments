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
// import { WETHabi } from './abi/WETH.json';
// import { WMATICabi } from './abi/WMATIC.json';

export default function Form(props) {
  // var [token, setToken] = useState("0x0000000000000000000000000000000000000000");
  const [amount, setAmount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [sendBtnText, setSendBtnText] = useState('Approve');
  const ABI = require('./abi/WETH.json');

  const setWeth = async => {
    const token = "0x45b68a86e5f4cfE1F5002aA1A528E367FEA3a7d6";
    console.log(token)
    PaymentsHandler(token);
  }
  const setWmatic = async => {
    const token = "0xf12Fd06B008739F18732F972782375DDBa1c3527";
    PaymentsHandler(token);
  }


  const PaymentsHandler = async (token) => {
    console.log("Approving Payment");
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);


    const signer = tempProvider.getSigner();
    setSigner(signer);
    console.log("Signer set successfully")

    console.log(signer)

    let contract = new ethers.Contract(token, ABI, signer);
    setContract(contract);
    console.log("Contract Loaded Successfully")

    try {
      const approve = await contract.approve('0x1D982184951f7A1C819a1eD6879C14af0Aa83cD7', '10000000000000000000', { gasLimit: 1000000 });
      await approve.await();
      console.log("Approved Successfully")
    } catch (err) {
      console.error(err);
    }
  };

  const sendPayment = async (token) => {
    console.log("Sending Payment");
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    const signer = tempProvider.getSigner();
    setSigner(signer);
    console.log("Signer set successfully")

    console.log(signer)

    let contract = new ethers.Contract(token, ABI, signer);
    setContract(contract);
    console.log("Contract Loaded Successfully")

    let transferAmount = document.getElementById('sendamount').value;
    try {
      const transfer = await contract.transfer('0x1D982184951f7A1C819a1eD6879C14af0Aa83cD7', transferAmount, { gasLimit: 1000000 });
      await transfer.wait();
      console.log("Transfer Successful")
    } catch (err) {
      console.error(err);
    }
  }

  // const sendPaymentHandler = async () => {
  //   let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
  //   setProvider(tempProvider);


  //   let contract = new ethers.Contract({ token }, ABI, signer);
  //   setContract(contract);
  //   const tx = await contract.approve(signer.getAddress(), '10000000000000000000');
  //   await tx.wait();
  // }

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
              <Button colorScheme='blue' onClick={(setWeth)}>WETH</Button>
              <Button colorScheme='blue' onClick={(setWmatic)}>WMATIC</Button>
              </Stack>
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Enter the amount</FormLabel>
              <Input type="number" id='sendamount'/>
            </FormControl>
            <Button width="full" mt={4} type="submit" onClick={sendPayment}>
            { sendBtnText }
            </Button>
          </form>
        </Box>
            </Box>
        </Flex>
    );
}