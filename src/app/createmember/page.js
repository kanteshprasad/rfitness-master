"use client";

import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import { Client, Databases, Storage, Account, ID } from "appwrite";
import imageCompression from "browser-image-compression";
import {
  Box,
  Select,
  Button,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Spinner,
  useDisclosure,
  Alert,
  Flex,
  useColorMode,
  useColorModeValue,
  Center,
  FormHelperText,
  LightMode,
  DarkMode,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { color } from "framer-motion";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID;
const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID;
const paymentBucketId = process.env.NEXT_PUBLIC_PAYMENT_BUCKET_ID;
const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(projectId);

const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);

const getTodayDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatDateToDDMMYY = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = String(date.getFullYear()).slice(2); // Get last two digits of year
  return `${day}${month}${year}`;
};
const CreateMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    months: "",
    doj: getTodayDate,
    payment: "",
    paymentmethod: "",
    batch: "",
    batch: "",
    dob: "",
    goal: "",
    email: "",
    phone: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [customImageId, setCustomImageId] = useState("");
  const [customPaymentImageId, setCustomPaymentImageId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const formbg = useColorModeValue("#33334d", "white");
  const btncolors = useColorModeValue("yellow", "teal");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (err) {
        setError("Failed to fetch user.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateCustomImageId = (name) => {
    const sanitizedName = name.replace(/\s+/g, "");
    const randomThreeDigitNumber = Math.floor(100 + Math.random() * 900);
    return `${sanitizedName}_${randomThreeDigitNumber}`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const compressedBlob = new Blob([compressedFile], { type: file.type });
        const uniqueImageId = generateCustomImageId(formData.name);
        const compressedFileObject = new File(
          [compressedBlob],
          `${uniqueImageId}.jpg`,
          { type: file.type }
        );
        setImageFile(compressedFileObject);
        setCustomImageId(uniqueImageId);
      } catch (err) {
        setError("Failed to compress image.");
      }
    }
  };

  const handlePaymentChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const compressedBlob = new Blob([compressedFile], { type: file.type });
        const uniquePaymentImageId = generateCustomImageId(formData.name);
        const compressedFileObject = new File(
          [compressedBlob],
          `${uniquePaymentImageId}.jpg`,
          { type: file.type }
        );
        setPaymentFile(compressedFileObject);
        setCustomPaymentImageId(uniquePaymentImageId);
      } catch (err) {
        setError("Failed to compress payment file.");
      }
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Convert dojDate to Date object with the default time
      const dojDate = new Date(`${formData.doj}T00:00:00.000Z`);

      // Create a new Date object for doeDate
      const doeDate = new Date(dojDate);
      doeDate.setDate(doeDate.getDate() + parseInt(formData.months) * 30);
      const formattedDOE = `${
        doeDate.toISOString().split("T")[0]
      }T00:00:00.000Z`;

      // Convert formattedDOJ to dd-mm-yyyy format with current time
      const formattedDOJ = `${dojDate.toISOString().split("T")[0]}T${
        dojDate.toTimeString().split(" ")[0]
      }.000Z`;

      let pictureURL = "";
      if (imageFile) {
        await storage.createFile(bucketId, customImageId, imageFile);
        pictureURL = customImageId;
      }

      let paymentImageURL = "";
      if (paymentFile) {
        await storage.createFile(
          paymentBucketId,
          customPaymentImageId,
          paymentFile
        );
        paymentImageURL = customPaymentImageId;
      }

      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        ...formData,
        months: parseInt(formData.months),
        doj: formattedDOJ, // Send formatted date to Appwrite
        doe: formattedDOE,
        picture: pictureURL,
        paymentIMG: paymentImageURL,
      });

      setSuccess("Member created successfully!");
      setFormData({
        name: "",
        months: "",
        doj: getTodayDate(), // Reset to today's date
        payment: "",
        paymentmethod: "",
        batch: "",
        dob: "",
        goal: "",
        email: "",
        phone: "",
      });
      setImageFile(null);
      setPaymentFile(null);
      setCustomImageId("");
      setCustomPaymentImageId("");

      setShowModal(true); // Show the modal on success
    } catch (err) {
      setError(`Failed to create member. ${err.message}`);
    } finally {
      setLoading(false);
    }
    console.log(formData);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
      name: "",
      months: "",
      doj: getTodayDate(), // Reset to today's date
      payment: "",
      paymentmethod: "",
      batch: "",
      dob: "",
      goal: "",
      email: "",
      phone: "",
    });
    setImageFile(null);
    setPaymentFile(null);
    setCustomImageId("");
    setCustomPaymentImageId("");
    setStep(1); // Reset to step 1
    setSuccess(""); // Remove success alert
    router.push("/dashboard"); // Navigate to dashboard
  };

  const handleTextChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      otherGoal: e.target.value,
    }));
  };
  return (
    <>
      <Navbar></Navbar>
      <Box marginTop={"15vh"} width={"100vw"}>
        <Center>
          <Box
            border={"2px solid black"}
            p={"25"}
            width={{
              base: "90vw", // 0-48em
              md: "50%", // 48em-80em,
              xl: "35%", // 80em+
            }}
            borderRadius={"25px"}>
            <Text fontSize='2xl' mb={4}>
              Add New Member
            </Text>
            {error && (
              <Alert status='error' mb={4}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert status='success' mb={4}>
                {success}
              </Alert>
            )}

            <Progress
              value={(step - 1) * 33.33}
              mb={4}
              colorScheme={btncolors}
            />
            <Center>
              <Text mb={4}>Step {step}/4</Text>
            </Center>

            <form p={6} onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <FormControl id='name' mb={4} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      border={"1px solid black"}
                    />
                    <FormHelperText>Enter Full Name</FormHelperText>
                  </FormControl>
                  <FormControl id='months' mb={4} isRequired>
                    <FormLabel>Months</FormLabel>
                    <NumberInput
                      name='months'
                      value={formData.months}
                      onChange={(value) =>
                        handleChange({ target: { name: "months", value } })
                      }
                      min={1}>
                      <NumberInputField border={"1px solid black"} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>Select Number of Months</FormHelperText>
                  </FormControl>
                  <FormControl id='doj' mb={4} isRequired>
                    <FormLabel>Date of Joining</FormLabel>
                    <Input
                      border={"1px solid black"}
                      type='date'
                      name='doj'
                      value={formData.doj || getTodayDate()}
                      onChange={handleChange}
                    />

                    <FormHelperText> Select Calender for Date</FormHelperText>
                  </FormControl>

                  <Button colorScheme={btncolors} onClick={handleNext}>
                    Next
                  </Button>
                </>
              )}
              {step === 2 && (
                <>
                  <FormControl id='payment' mb={4} isRequired>
                    <FormLabel>Payment</FormLabel>
                    <NumberInput
                       name='payment'
                      value={formData.payment}
                      onChange={(value) =>
                        handleChange({
                          target: {
                            name: "payment",
                            value: parseInt(value, 10) || 0,
                          },
                        })
                      }
                      placeholder='Enter amount paid'>
                      <NumberInputField border={"1px solid black"} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText> Mode of Payment </FormHelperText>
                    <Select
                      name='paymentmethod'
                      value={formData.paymentmethod}
                      placeholder='Select payment Method'
                      onChange={handleSelectChange}>
                      <option value='cash'>Cash</option>
                      <option value='upi/online'>UPI/Online</option>
                      <option value='partial'>Pending</option>
                    </Select>
                  </FormControl>

                  <FormControl id='batch' mb={4}>
                    <FormHelperText> Select Batch</FormHelperText>
                    <Select
                      name='batch'
                      value={formData.batch}
                      placeholder='Select Batch'
                      onChange={handleSelectChange}>
                      <option value='Morning'>Morning</option>
                      <option value='Evening'>Evening</option>
                      <option value='Not-Specified'>Not-Specified</option>
                    </Select>
                  </FormControl>

                  <FormControl id='dob' mb={4} isRequired>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input
                      border={"1px solid black"}
                      type='date'
                      name='dob'
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl id='goal' mb={4} isRequired>
                    <FormLabel>Goal</FormLabel>
                    <Select
                      name='goal'
                      value={formData.goal}
                      placeholder='Select Goal'
                      onChange={handleSelectChange}>
                      <option value='Body Building'>Body Building</option>
                      <option value='Fat Loss'>Fat Loss</option>
                      <option value='Weight Gain'>Weight Gain</option>
                      <option value='Body Recomposition'>
                        Body Recomposition
                      </option>
                      <option value='Competition'>Competition</option>
                      <option value='Powerlifting'>Powerlifting</option>
                      <option value='Mobility'>Mobility</option>
                      <option value='Others'>Others</option>
                    </Select>
                    {formData.goal === "Others" && (
                      <Box mt={4}>
                        <FormLabel htmlFor='otherGoal'>
                          Please specify
                        </FormLabel>
                        <Input
                          border={"1px solid black"}
                          type='text'
                          name='otherGoal'
                          placeholder='Specify your goal'
                          value={formData.otherGoal}
                          onChange={handleTextChange}
                        />
                      </Box>
                    )}
                  </FormControl>
                  <Button colorScheme={btncolors} mr={4} onClick={handlePrev}>
                    Previous
                  </Button>
                  <Button colorScheme={btncolors} onClick={handleNext}>
                    Next
                  </Button>
                </>
              )}
              {step === 3 && (
                <>
                  <FormControl id='email' mb={4} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      border={"1px solid black"}
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl id='phone' mb={4} isRequired>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      border={"1px solid black"}
                      type='text'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <Button colorScheme={btncolors} mr={4} onClick={handlePrev}>
                    Previous
                  </Button>
                  <Button colorScheme={btncolors} onClick={handleNext}>
                    Next
                  </Button>
                </>
              )}
              {step === 4 && (
                <>
                  <FormControl id='picture' mb={4}>
                    <FormLabel>Profile Picture</FormLabel>
                    <Input
                      border={"1px solid black"}
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  <FormControl id='payment-info' mb={4}>
                    <FormLabel>Payment Information</FormLabel>
                    <Input
                      border={"1px solid black"}
                      type='file'
                      accept='image/*'
                      onChange={handlePaymentChange}
                    />
                  </FormControl>
                  <Button colorScheme={btncolors} mr={4} onClick={handlePrev}>
                    Previous
                  </Button>
                  <Button
                    colorScheme={btncolors}
                    type='submit'
                    disabled={loading}>
                    {loading ? <Spinner size='sm' /> : "Add Member"}
                  </Button>
                </>
              )}
            </form>

            <Modal isOpen={isOpen} onClose={handleModalClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Success</ModalHeader>
                <ModalBody>
                  <Text>
                    Member added successfully! <strong>{formData.name}</strong>
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme={btncolors} onClick={handleModalClose}>
                    OK
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default CreateMember;
