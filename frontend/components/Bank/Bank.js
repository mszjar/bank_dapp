"use client"
import { Text, Flex, Heading, Input, Button } from '@chakra-ui/react'
import React from 'react'

const Bank = () => {
  return (
    <Flex width="100%">
      <Flex direction="column" width="100%">
        <Heading as='h2' size='xl'>
          Your balance is:
        </Heading>
        <Text mt="1rem">56 Eth</Text>
        <Heading as='h2' size='xl' mt='2rem'>
          Deposit:
        </Heading>
        <Flex mt="1rem">
          <Input placeholder="Amount" />
          <Button colorScheme='purple'>Deposit</Button>
        </Flex>
        <Heading as='h2' size='xl' mt='2rem'>
          Withdraw:
        </Heading>
        <Flex mt="1rem">
          <Input placeholder="Amount" />
          <Button colorScheme='purple'>Withdraw</Button>
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
    </Flex>
  )
}

export default Bank
