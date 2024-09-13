'use client'; // This directive ensures the file is treated as a client component

import { useState, useEffect } from 'react';
import { Client, Account } from 'appwrite';
import { useRouter } from 'next/navigation';
import { Box, Flex, Text, Button, useColorMode, Stack } from '@chakra-ui/react';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Initialize Appwrite client and account here
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId);

const account = new Account(client);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('light'); // Set the default color mode to light

    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (err) {
        setUser(null); // No session found
      }
    };

    fetchUser();
  }, [setColorMode]);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current'); // Log out current session
      router.replace('/login'); // Redirect to login page after logout
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <Box as="nav" bg='gray.700' p={4} boxShadow="md">
      <Flex align="center" justify="space-between">
        <Text color='yellow.300' fontSize="xl" fontWeight="bold">
          <a href="/home">Rfitness</a>
        </Text>
        <Stack direction="row" spacing={4}>
          <Button color='yellow.300' as="a" href="/home" variant="link">
            Home
          </Button>
          {user ? (
            <>
              <Button color='yellow.300' as="a" href="/dashboard" variant="link">
                Dashboard
              </Button>
              <Button as="a" onClick={handleLogout}
               display={{ base: 'none', md: 'inline-flex' }}
               fontSize={'sm'}
               fontWeight={600}
               color={'white'}
               bg={'red.400'}
             
               _hover={{
                 bg: 'red.300',
               }}>
                Logout
              </Button>
            </>
          ) : (
            <Button as="a" 
              href="/login"
             display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
          
            _hover={{
              bg: 'pink.300',
            }}>
              Login
            </Button>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
