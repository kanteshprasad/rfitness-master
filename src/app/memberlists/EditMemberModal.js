// EditMemberModal.js
'use client';

import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, useDisclosure } from '@chakra-ui/react';

const EditMemberModal = ({ show, onClose, member, onSave }) => {
  const [selectedMember, setSelectedMember] = React.useState(member);

  React.useEffect(() => {
    setSelectedMember(member);
  }, [member]);

  const handleSave = () => {
    onSave(selectedMember);
  };

  return (
    <Modal isOpen={show} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Member</ModalHeader>
        <ModalBody>
          {selectedMember && (
            <div>
              <FormControl mb={3}>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={selectedMember.name}
                  onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Months</FormLabel>
                <Input
                  type="number"
                  value={selectedMember.months}
                  onChange={(e) => setSelectedMember({ ...selectedMember, months: parseInt(e.target.value, 10) })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Date of Joining (DOJ)</FormLabel>
                <Input
                  type="date"
                  value={selectedMember.doj.split('T')[0]} // Format for date input
                  onChange={(e) => setSelectedMember({ ...selectedMember, doj: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Payment</FormLabel>
                <Input
                  type="text"
                  value={selectedMember.payment}
                  onChange={(e) => setSelectedMember({ ...selectedMember, payment: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Date of Birth (DOB)</FormLabel>
                <Input
                  type="date"
                  value={selectedMember.dob.split('T')[0]} // Format for date input
                  onChange={(e) => setSelectedMember({ ...selectedMember, dob: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Goal</FormLabel>
                <Input
                  type="text"
                  value={selectedMember.goal}
                  onChange={(e) => setSelectedMember({ ...selectedMember, goal: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={selectedMember.email}
                  onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="text"
                  value={selectedMember.phone}
                  onChange={(e) => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Payment Method</FormLabel>
                <Input
                  type="text"
                  value={selectedMember.paymentmethod}
                  onChange={(e) => setSelectedMember({ ...selectedMember, phone: e.target.value })}
                />
              </FormControl>

              
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>Close</Button>
          <Button colorScheme="blue" onClick={handleSave}>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditMemberModal;
