'use client'; // Ensure this file is treated as a client component

import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client, Account } from 'appwrite';
import { Button, Stack } from '@chakra-ui/react'; // Import Chakra UI Button and Stack components

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Initialize Appwrite client and account here
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId);

const account = new Account(client);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (err) {
        router.replace('/login/login'); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />

      <div style={{display:"flex", justifyContent:"center", flexDirection:"column", marginTop:"15px", marginBottom:"15px", backdropFilter:"blur(25px)", alignItems:"center"}} >
        <h5>Welcome to the Dashboard, {user.name}</h5>
        <p>This is a protected page.</p>
      </div>

      <Stack spacing={4} align="center" mb={8}>
        <Button onClick={() => router.push('/createmember')} colorScheme="teal">
          Click Here To Add new Member
        </Button>
        <Button onClick={() => router.push('/memberlists')} colorScheme="teal">
         Click Here to   View Members List
        </Button>
        
      </Stack>
     
    </div>
  );
}
