// app/page.js

'use client'; // This directive ensures the file is treated as a client component

import Navbar from './components/Navbar';
import { Client, Account } from 'appwrite';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';



const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;


// Initialize Appwrite client and account
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject(projectId);
const account = new Account(client);

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (err) {
        setUser(null); // No session found
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <h1>Welcome to the Home Page</h1>
      {!user && (
        <div>
          <p>Please <a href="/login">login</a> to access more features.</p>
        </div>
      )}
    </div>
  );
}
