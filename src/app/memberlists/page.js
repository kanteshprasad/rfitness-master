'use client';

import React, { useState, useEffect } from 'react';
import { Client, Databases, Storage } from 'appwrite';
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  useToast,
  useDisclosure,
  Text,
  VStack,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import MemberCard from './MemberCard';
import EditMemberModal from './EditMemberModal';
import Navbar from '../components/Navbar';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID;
const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID;

// Initialize Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(projectId);

const databases = new Databases(client);
const storage = new Storage(client);

const fetchMembers = async () => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (err) {
    console.error('Failed to fetch members', err);
    return [];
  }
};

const fetchFileUrls = async () => {
  try {
    const fileList = await storage.listFiles(bucketId);
    const fileData = [];
    for (const file of fileList.files) {
      const result = await storage.getFileDownload(bucketId, file.$id);
      fileData.push({ id: file.$id, url: result.href });
    }
    return fileData;
  } catch (error) {
    console.error('Failed to fetch file URLs', error);
    return [];
  }
};

const deleteMember = async (memberId) => {
  try {
    await databases.deleteDocument(databaseId, collectionId, memberId);
    return true;
  } catch (err) {
    console.error('Failed to delete member', err);
    return false;
  }
};

const updateMember = async (memberId, updatedData) => {
  try {
    const { $databaseId, $collectionId, ...dataToUpdate } = updatedData;
    await databases.updateDocument(databaseId, collectionId, memberId, dataToUpdate);
    return true;
  } catch (err) {
    console.error('Failed to update member', err);
    return false;
  }
};

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const { isOpen: isEditModalOpen, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const loadMembers = async () => {
      const data = await fetchMembers();
      setMembers(data);
    };
    loadMembers();
  }, []);

  useEffect(() => {
    const loadFileUrls = async () => {
      const urls = await fetchFileUrls();
      setFileUrls(urls);
    };
    loadFileUrls();
  }, []);

  const handleEdit = (member) => {
    setSelectedMember(member);
    onOpenEditModal();
  };

  const handleDelete = async (member) => {
    const success = await deleteMember(member.$id);
    if (success) {
      setMembers(members.filter((m) => m.$id !== member.$id));
      toast({
        title: 'Success',
        description: 'Member deleted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete member.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSave = async (updatedMember) => {
    const success = await updateMember(updatedMember.$id, updatedMember);
    if (success) {
      setMembers(members.map((m) => (m.$id === updatedMember.$id ? updatedMember : m)));
      onCloseEditModal();
      toast({
        title: 'Success',
        description: 'Member updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update member.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Create a map of file URLs by file ID for easy access
  const fileUrlMap = new Map(fileUrls.map(file => [file.id, file.url]));

  return (
    <>
      <Navbar />
      <Container  maxW="container.xl" mt={8}>
        
      

        <VStack spacing={8} align="stretch">
          <HStack bg='gray.700' justify="center" p={4} borderRadius="md">
            <Heading  color="yellow.300" >Total Number of Members {members.length}</Heading>
          </HStack>
          <Grid
        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        templateRows="repeat(auto-fill, 80px)"
        gap={4} // Optional: Adds space between grid items
        autoFlow="dense" // Optional: Adjusts the flow of grid items
      >
           
              {members.map((member, index) => (
                <MemberCard
                  key={member.$id}
                  member={member}
                  fileUrl={fileUrlMap.get(member.picture)} // Assuming picture is the field in member document
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  serialNumber={index + 1}
                />
              ))}
           
            </Grid>
          <EditMemberModal
            isOpen={isEditModalOpen}
            onClose={onCloseEditModal}
            member={selectedMember}
            onSave={handleSave}
          />
        </VStack>

        
      </Container>
    </>
  );
};

export default MemberList;
