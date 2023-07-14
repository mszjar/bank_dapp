"use client"

// Outil permettant de générer des identifiants unique
// car en ReactJS, lorsque l'on fait un map, chaque élément
// doit avoir une "KEY" unique
import { v4 as uuidv4 } from 'uuid';

// REACT
import { useState, useEffect } from 'react'

// CHAKRA-UI
import { Heading, Flex, Text, Input, Button, useToast } from '@chakra-ui/react'

// CONTRACT
import Contract from '../../public/Bank.json'
import { ethers } from "ethers"

// WAGMI
import { prepareWriteContract, writeContract, readContract } from '@wagmi/core'
import { useAccount } from 'wagmi'

// VIEM (pour les events)
import { createPublicClient, http, parseAbiItem } from 'viem'
import { hardhat } from 'viem/chains'

const Bank = () => {

  // viem
  const client = createPublicClient({
    chain: hardhat,
    transport: http(),
  })

  // toast
  const toast = useToast()

  // useAccount
  const { isConnected, address } = useAccount()

  // contract
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

  // state
  const [depositAmount, setDepositAmount] = useState(null)
  const [withdrawAmount, setWithdrawAmount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [depositEvents, setDepositEvents] = useState([])
  const [withdrawEvents, setWithdrawEvents] = useState([])

  // deposit
  const deposit = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: 'deposit',
        value: ethers.parseEther(depositAmount)
      });

      await writeContract(request);

      toast({
        title: 'Deposit',
        description: `Deposit success, ${depositAmount} Eth`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: `Deposit failed, ${depositAmount} Eth`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  // withdraw
  const withdraw = async () => {
    try {
      const { request } = await prepareWriteContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: 'withdraw',
        args: [ethers.parseEther(withdrawAmount)]
      });

      await writeContract(request);
      // update balance
      const balance = await getBalanceOfUser()
      setBalance(ethers.formatEther(balance))

      toast({
        title: 'withdraw',
        description: `withdraw success, ${withdrawAmount} Eth`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: `withdraw failed, ${withdrawAmount} Eth`,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  // get balance of the user on the smart contract
  const getBalanceOfUser = async () => {
    try {
      const data = await readContract({
        address: contractAddress,
        abi: Contract.abi,
        functionName: 'getBalanceOfUser',
        account: address
      });
      console.log(data)
      return data;
    } catch (error) {
      console.log(error.message)
    }
  }

  // get events
  const getEvents = async () => {
    // get all the deposit events
    const depositLogs = await client.getLogs({
      event: parseAbiItem('event etherDeposit(address indexed account, uint amount)'),
      fromBlock: 0n,
      toBlock: 'latest'
    })
    console.log(depositLogs)
  }



  useEffect(() => {
    const getBalanceAndEvents = async () => {
      if (address !== 'undefine') {
        const balance = await getBalanceOfUser()
        setBalance(ethers.formatEther(balance))
        await getEvents()
      }
    }
    getBalanceAndEvents()
  }, [address])

  return (
    <Flex width="100%">
      { isConnected ? (
      <Flex direction="column" width="100%">
        <Heading as='h2' size='xl'>
          Your balance is:
        </Heading>
        <Text mt="1rem">{balance}</Text>
        <Heading as='h2' size='xl' mt='2rem'>
          Deposit:
        </Heading>
        <Flex mt="1rem">
          <Input onChange={e=> setDepositAmount(e.target.value)} placeholder="Amount" />
          <Button colorScheme='purple' onClick={ () => deposit() }>Deposit</Button>
        </Flex>
        <Heading as='h2' size='xl' mt='2rem'>
          Withdraw:
        </Heading>
        <Flex mt="1rem">
          <Input onChange={e=> setWithdrawAmount(e.target.value)} placeholder="Amount" />
          <Button colorScheme='purple' onClick={ () => withdraw() }>Withdraw</Button>
        </Flex>
        <Heading as='h2' size='xl' mt='2rem'>
          Deposit events:
        </Heading>
        <Flex mt="1rem" direction='column'>

        </Flex>
        <Heading as='h2' size='xl' mt='2rem'>
          Withdraw events:
        </Heading>
        <Flex mt="1rem" direction='column'>

        </Flex>
      </Flex>
          ) : (
            <Flex direction="column" width="100%">
              <Heading as='h2' size='xl'>
                Please connect your wallet
              </Heading>
            </Flex>
          )}
    </Flex>
  )
}

export default Bank
