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


export default function Check(props) {
    const [amount, setAmount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const ABI = require('./abi/Payments.json');
    const PaymentsContractAddress = "0x1D982184951f7A1C819a1eD6879C14af0Aa83cD7";

    const checkReceipt = async (e) => {
            e.preventDefault();
            console.log("Checking Receipt");
            let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(tempProvider);
    
            const signer = tempProvider.getSigner();
            setSigner(signer);
            console.log("Signer set successfully")
        
            let contract = new ethers.Contract(PaymentsContractAddress, ABI, signer);
            setContract(contract);
            console.log("Contract Loaded Successfully")

            const tokenID = e.target.tokenid.value;
            console.log(tokenID)
            try {
            const check = await contract.checkReceipt(tokenID, { gasLimit: 1000000 });
            console.log(check.toString());
            const finalAmount = check.toString()/10**18;
            setAmount(finalAmount);
            } catch (err) {
            console.error(err);
            }
        };

    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={2}>
                <Box textAlign="center">
                    <Heading>Check your Payments Receipt</Heading>
                    <Heading size={2}>Check how much you paid to the contract in USD</Heading>
                </Box>
                <Box my={4} textAlign="left">
          <form onSubmit={checkReceipt}>
            <FormControl mt={6}>
              <FormLabel>Enter the TokenID</FormLabel>
              <Input type="text" id='tokenid'/>
            </FormControl>
            <Button width="full" mt={4} type="submit">
              Check
            </Button>
            <p>You Paid : ${ amount }</p>
          </form>
        </Box>
            </Box>
        </Flex>
    );
}