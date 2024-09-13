'use client'; // This directive ensures the file is treated as a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client, Account } from 'appwrite';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Stack, 
  Text, 
  useToast, 
  Container 
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';


const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
// Initialize Appwrite client and account here
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(projectId);

const account = new Account(client);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await account.createEmailPasswordSession(email, password);
      console.log(response); // Success
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err); // Log detailed error
      setError('Login failed. Please check your credentials.');
      toast({
        title: 'Login failed',
        description: 'Please check your credentials.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.log(email, password, process.env.NEXT_PUBLIC_PROJECT_ID);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxW="md" mt={8}>
        <Box p={8} shadow="md" borderWidth="1px" borderRadius="md">
          <Text fontSize="2xl" mb={4} textAlign="center">
            Login
          </Text>
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email:</FormLabel>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password:</FormLabel>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </FormControl>
              <Button 
                type="submit" 
                colorScheme="blue"
                mt={4}
              >
                Login
              </Button>
              {error && (
                <Text color="red.500" textAlign="center">
                  {error}
                </Text>
              )}
            </Stack>
          </form>
        </Box>
      </Container>
    </>
  );
}
