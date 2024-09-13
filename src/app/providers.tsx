'use client'
import React from 'react'
import theme from './theme'
import { ChakraProvider ,ColorModeScript } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}  >   {children}</ChakraProvider>
}