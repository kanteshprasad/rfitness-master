'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Client, Account } from 'appwrite';
import { useRouter } from 'next/navigation';





const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;


// Initialize Appwrite client and account here
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(projectId);

const account = new Account(client);

function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
        router.push('/dashboard'); // Redirect to dashboard if user is logged in
      } catch (err) {
        setUser(null); // No session found
      }
    };

    checkUserSession();
  }, [router]);

  return (
    <>
      <Navbar />
      <div
        className='home'
        style={{
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(25px)',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <h3>
          This app is currently <br />
          accessible only by the admin,<br />
          kindly<br />
          <a href="/login">Login</a>
        </h3>
      </div>
    </>
  );
}

export default Home;
