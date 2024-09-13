import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Heading,
  Image,
  Stack,
  Flex,
  Button,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableCaption,
  HStack,
  VStack,
  Spacer,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const MemberCard = ({ member, fileUrl, onEdit, onDelete , serialNumber }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
   
 
    <>

      <Flex
      bg='gray.700'
      p={5}
      borderRadius='25px'
        direction='row'
        alignItems='center'
        mb='4'
        cursor='pointer'
        onClick={handleOpen}
      >
       
       <Text color='yellow.300' marginRight='35px' fontWeight='bold'  >  {serialNumber} </Text>

        <Image
          src={fileUrl || '/default-profile-picture.png'}
          alt='Profile'
          boxSize='50px'
          objectFit='cover'
          borderRadius='full'
          border='2px solid yellow'
          mr='4'
        />
        <Text fontWeight='bold' color='yellow.300'>
          {member.name}
        </Text>
      </Flex>

      {isOpen && (
   

    <Card 
      flexWrap='wrap'
      width={{ base: '90vw', lg: '80vw' }}
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      boxShadow='lg'
      bg='gray.800'
      color='white'
      mb='4'
      zIndex='overlay'
      position='absolute'
    >
      <CardBody>
        {/* Name and Image */}
        <Center>
        <VStack spacing={4} align='start'>
          
          <Heading size='md' color='yellow.300'>
            {member.name}
          </Heading>
          <Heading size='sm' color='yellow.200'>
            Member Details
          </Heading>
          
        </VStack>
        </Center>

        <Flex direction={{ base: 'column', lg: 'row' }} spacing={4} mt='4'>
          {/* Image Section */}
          <Center flex='1'>
            <Image
              src={fileUrl || '/default-profile-picture.png'}
              alt='Profile'
              boxSize='250px'
              objectFit='contain'
              border='2px solid yellow'
              m={3}
            />
          </Center>

          {/* Table Section */}
          <Flex flexWrap='wrap' direction={{ base: 'column', lg: 'row' }} spacing={4} >
            <Box
              p={4}
              borderRadius='md'
              bg='gray.700'
              border='1px solid gray.600'
              flex='1'
            >
              <Table variant='simple'>
                <Tbody>
                  <Tr>
                    <Th color='yellow.300'>Email:</Th>
                    <Td>{member.email}</Td>
                  </Tr>
                  <Tr>
                    <Th color='yellow.300'>Phone:</Th>
                    <Td>{member.phone}</Td>
                  </Tr>
                  <Tr>
                    <Th color='yellow.300'>Date of Joining:</Th>
                    <Td>{new Date(member.doj).toLocaleDateString()}</Td>
                  </Tr>
                  <Tr>
                    <Th color='yellow.300'>Date of Birth:</Th>
                    <Td>{new Date(member.dob).toLocaleDateString()}</Td>
                  </Tr>

                  <Tr>
                    <Th color='yellow.300'>Payment:</Th>
                    <Td>{member.payment}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Box
              p={4}
              borderRadius='md'
              bg='gray.700'
              border='1px solid gray.600'
              flex='1'
            >
              <Table variant='simple'>
               
                <Tbody>
                  
                  <Tr>
                    <Th color='yellow.300'>Payment Method:</Th>
                    <Td>{member.paymentmethod}</Td>
                  </Tr>
                  <Tr>
                    <Th color='yellow.300'>Batch:</Th>
                    <Td>{member.batch}</Td>
                  </Tr>
                  <Tr>
                    <Th color='yellow.300'>Goal:</Th>
                    <Td>{member.goal}</Td>
                  </Tr>
                  <Tr>
                    <Th color='yellow.300'>Months:</Th>
                    <Td>{member.months}</Td>
                  </Tr>
                  <Tr>
                    <Th color='yellow.300'>Date of Expiry:</Th>
                    <Td>{new Date(member.doe).toLocaleDateString()}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Flex>
      </CardBody>

      <Divider borderColor='gray.600' />

      <CardFooter>
  <Flex width='100%' direction={{ base: 'column', lg: 'row' }} alignItems='center' gap='4'>
    <Button
      variant='solid'
      colorScheme='yellow'
      onClick={() => onEdit(member)}
    >
      <FaEdit /> Edit
    </Button>
  
    <Button
      variant='outline'
      colorScheme='red'
      onClick={() => onDelete(member)}
    >
      <FaTrash /> Delete
    </Button>
    <Spacer />
    <Button
      as='a'
      href={`mailto:${member.email}`}
      variant='solid'
      colorScheme='teal'
      leftIcon={<FaEdit />}
    >
      Email
    </Button>
    <Button
      as='a'
      href={`tel:${member.phone}`}
      variant='solid'
      colorScheme='teal'
      leftIcon={<FaEdit />}
    >
      Call
    </Button>
  </Flex>
</CardFooter>
<Button
                position='absolute'
                top='4'
                right='4'
                onClick={handleClose}
                colorScheme='red'
                
              >
                {<FaTimes />}
              </Button>

    </Card> )};
    </>
  )
};

export default MemberCard;






