import React, { useState } from "react";
import {
  Input,
  Box,
  Field,
  Button,
  Heading,
  Flex,
  Text,
  Container,
  Stack,
  Grid,
  Image,
  IconButton
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../components/ui/toaster.jsx";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Action_Type } from "../../Redux/Auth_Reducer/action.jsx";
import {
  User,
  Mail,
  Lock,
  Upload,
  Sparkles,
  CheckCircle,
  ArrowRight,
  X,
} from "lucide-react";

const InitialState = {
  name: "",
  email: "",
  password: "",
  photo: "",
};

// ✅ FIXED: Remove trailing slash from API URL
const API_BASE_URL = "https://shopsy.up.railway.app/api/v1/users";

function Register() {
  const [IsInput, setIsInput] = useState(InitialState);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState("url"); // 'url' or 'file'
  const nav = useNavigate();
  const dispatch = useDispatch();

  // ✅ Handle Input Change
  const HandleChange = (e) => {
    const { name, value } = e.target;
    setIsInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle File Selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toaster.error({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPEG, PNG, GIF, WebP)",
        duration: 3000,
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toaster.error({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        duration: 3000,
      });
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    // Reset file input
    const fileInput = document.getElementById("photo-file-input");
    if (fileInput) fileInput.value = "";
  };

  // ✅ Convert image to base64 for upload
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // ✅ OPTIMIZED: Better validation and error handling
  const HandleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!IsInput.name || !IsInput.email || !IsInput.password) {
      toaster.error({
        title: "Validation Error",
        description: "Please fill all required fields",
        duration: 3000,
      });
      return;
    }

    // Check if photo is provided (either URL or file)
    if (uploadMethod === "url" && !IsInput.photo) {
      toaster.error({
        title: "Validation Error",
        description: "Please provide a profile photo URL",
        duration: 3000,
      });
      return;
    }

    if (uploadMethod === "file" && !selectedFile) {
      toaster.error({
        title: "Validation Error",
        description: "Please select a profile photo",
        duration: 3000,
      });
      return;
    }

    if (IsInput.password.length < 8) {
      toaster.error({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      dispatch({ type: Action_Type.SIGNUP_REQUEST });

      let photoData = IsInput.photo;

      // If file upload method, convert to base64
      if (uploadMethod === "file" && selectedFile) {
        try {
          photoData = await convertToBase64(selectedFile);
        } catch (error) {
          throw new Error(`Failed to process image file ${error}`);
        }
      }

      // ✅ Add timeout controller (15 seconds for image upload)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: IsInput.name.trim(),
          email: IsInput.email.trim(),
          password: IsInput.password,
          photo: photoData,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      const { Token, User } = result;

      // ✅ Store token in localStorage
      localStorage.setItem("token", Token);
      localStorage.setItem("user", JSON.stringify(User));

      dispatch({
        type: Action_Type.SIGNUP_SUCCESS,
        payload: { token: Token, user: User },
      });

      toaster.success({
        title: "Welcome aboard! 🎉",
        description: "Your account has been created successfully",
        duration: 2000,
      });

      setIsInput(InitialState);
      setSelectedFile(null);
      setPreviewUrl("");

      setTimeout(() => nav("/"), 800);
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "Something went wrong";

      if (error.name === "AbortError") {
        errorMessage = "Request timeout. Please try again with a smaller image.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toaster.error({
        title: "Signup failed",
        description: errorMessage,
        duration: 3000,
      });

      dispatch({ type: Action_Type.SIGNUP_FAILURE });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: CheckCircle, text: "Access to exclusive deals" },
    { icon: CheckCircle, text: "Personalized recommendations" },
    { icon: CheckCircle, text: "Fast & secure checkout" },
    { icon: CheckCircle, text: "Track your orders in real-time" },
  ];

  return (
    <Box minH="100vh" bg="linear-gradient(to bottom right, #f8fafc, #e2e8f0)" position="relative" overflow="hidden">
      <Toaster />

      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        width="400px"
        height="400px"
        bg="purple.100"
        borderRadius="full"
        opacity="0.3"
        filter="blur(80px)"
      />
      <Box
        position="absolute"
        bottom="-150px"
        left="-150px"
        width="500px"
        height="500px"
        bg="pink.100"
        borderRadius="full"
        opacity="0.3"
        filter="blur(80px)"
      />

      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 8, md: 12 }}>
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: 8, lg: 16 }}
          alignItems="center"
          minH={{ base: "auto", lg: "85vh" }}
        >
          {/* Left Side - Information Panel (Hidden on Mobile) */}
          <Box display={{ base: "none", lg: "block" }} position="relative">
            <Stack gap={8}>
              {/* Header */}
              <Box>
                <Flex align="center" gap={2} mb={4}>
                  <Box bg="purple.100" p={2} borderRadius="lg">
                    <Sparkles size={24} color="#9333ea" />
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="purple.600" textTransform="uppercase">
                    Join Our Community
                  </Text>
                </Flex>
                <Heading size={{ base: "2xl", md: "3xl", lg: "4xl" }} mb={4} lineHeight="1.2">
                  Start Your Shopping
                  <br />
                  <Text as="span" bgGradient="to-r" gradientFrom="purple.600" gradientTo="pink.500" bgClip="text">
                    Adventure Today
                  </Text>
                </Heading>
                <Text fontSize={{ base: "md", lg: "lg" }} color="gray.600" maxW="500px">
                  Create your free account and unlock access to thousands of amazing products with exclusive member benefits.
                </Text>
              </Box>

              {/* Benefits List */}
              <Stack gap={4}>
                {benefits.map((benefit, index) => (
                  <Flex
                    key={index}
                    align="center"
                    gap={3}
                    p={4}
                    bg="white"
                    borderRadius="xl"
                    boxShadow="sm"
                    transition="all 0.3s"
                    _hover={{
                      transform: "translateX(8px)",
                      boxShadow: "md",
                    }}
                  >
                    <Box bg="green.100" p={2} borderRadius="lg">
                      <benefit.icon size={20} color="#10B981" />
                    </Box>
                    <Text fontWeight="medium" color="gray.700">
                      {benefit.text}
                    </Text>
                  </Flex>
                ))}
              </Stack>

              {/* Stats */}
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <Box textAlign="center" p={4} bg="white" borderRadius="xl" boxShadow="sm">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    50K+
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Members
                  </Text>
                </Box>
                <Box textAlign="center" p={4} bg="white" borderRadius="xl" boxShadow="sm">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    100K+
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Products
                  </Text>
                </Box>
                <Box textAlign="center" p={4} bg="white" borderRadius="xl" boxShadow="sm">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    4.9★
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Rating
                  </Text>
                </Box>
              </Grid>
            </Stack>
          </Box>

          {/* Right Side - Registration Form */}
          <Flex justify="center" align="center">
            <Box
              w="full"
              maxW="500px"
              bg="white"
              borderRadius="3xl"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.1)"
              p={{ base: 6, sm: 8, md: 10 }}
              position="relative"
              overflow="hidden"
            >
              {/* Decorative gradient bar */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="6px"
                bgGradient="to-r"
                gradientFrom="purple.500"
                gradientTo="pink.500"
              />

              <Stack gap={6}>
                {/* Header */}
                <Box textAlign="center">
                  <Flex justify="center" mb={4}>
                    <Box
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      p={4}
                      borderRadius="2xl"
                      boxShadow="0 8px 20px rgba(102, 126, 234, 0.3)"
                    >
                      <User size={32} color="white" />
                    </Box>
                  </Flex>
                  <Heading size={{ base: "xl", md: "2xl" }} mb={2}>
                    Create Account
                  </Heading>
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                    Fill in your details to get started
                  </Text>
                </Box>

                {/* Form */}
                <form onSubmit={HandleSubmit}>
                  <Stack gap={4}>
                    {/* Name Field */}
                    <Field.Root>
                      <Field.Label fontWeight="medium" fontSize="sm">
                        Full Name
                      </Field.Label>
                      <Box position="relative">
                        <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" zIndex="1">
                          <User size={18} color="#9CA3AF" />
                        </Box>
                        <Input
                          type="text"
                          name="name"
                          value={IsInput.name}
                          onChange={HandleChange}
                          placeholder="John Doe"
                          pl="40px"
                          h="48px"
                          borderRadius="xl"
                          borderColor="gray.300"
                          _focus={{
                            borderColor: "purple.500",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          }}
                          required
                          disabled={isLoading}
                        />
                      </Box>
                    </Field.Root>

                    {/* Email Field */}
                    <Field.Root>
                      <Field.Label fontWeight="medium" fontSize="sm">
                        Email Address
                      </Field.Label>
                      <Box position="relative">
                        <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" zIndex="1">
                          <Mail size={18} color="#9CA3AF" />
                        </Box>
                        <Input
                          type="email"
                          name="email"
                          value={IsInput.email}
                          onChange={HandleChange}
                          placeholder="john@example.com"
                          pl="40px"
                          h="48px"
                          borderRadius="xl"
                          borderColor="gray.300"
                          _focus={{
                            borderColor: "purple.500",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          }}
                          required
                          disabled={isLoading}
                        />
                      </Box>
                    </Field.Root>

                    {/* Password Field */}
                    <Field.Root>
                      <Field.Label fontWeight="medium" fontSize="sm">
                        Password
                      </Field.Label>
                      <Box position="relative">
                        <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" zIndex="1">
                          <Lock size={18} color="#9CA3AF" />
                        </Box>
                        <Input
                          type="password"
                          name="password"
                          value={IsInput.password}
                          onChange={HandleChange}
                          placeholder="••••••••"
                          pl="40px"
                          h="48px"
                          borderRadius="xl"
                          borderColor="gray.300"
                          _focus={{
                            borderColor: "purple.500",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          }}
                          required
                          minLength={8}
                          disabled={isLoading}
                        />
                      </Box>
                      <Field.HelperText fontSize="xs" color="gray.500" mt={1}>
                        Must be at least 8 characters long
                      </Field.HelperText>
                    </Field.Root>

                    {/* Photo Upload Method Toggle */}
                    <Field.Root>
                      <Field.Label fontWeight="medium" fontSize="sm">
                        Profile Photo
                      </Field.Label>
                      
                      {/* Upload Method Selector */}
                      <Flex gap={2} mb={3}>
                        <Button
                          size="sm"
                          flex={1}
                          variant={uploadMethod === "url" ? "solid" : "outline"}
                          colorPalette="purple"
                          onClick={() => {
                            setUploadMethod("url");
                            handleRemoveFile();
                          }}
                          disabled={isLoading}
                        >
                          Enter URL
                        </Button>
                        <Button
                          size="sm"
                          flex={1}
                          variant={uploadMethod === "file" ? "solid" : "outline"}
                          colorPalette="purple"
                          onClick={() => {
                            setUploadMethod("file");
                            setIsInput(prev => ({ ...prev, photo: "" }));
                          }}
                          disabled={isLoading}
                        >
                          Upload File
                        </Button>
                      </Flex>

                      {/* URL Input Method */}
                      {uploadMethod === "url" && (
                        <Input
                          type="url"
                          name="photo"
                          value={IsInput.photo}
                          onChange={HandleChange}
                          placeholder="https://example.com/photo.jpg"
                          h="48px"
                          borderRadius="xl"
                          borderColor="gray.300"
                          _focus={{
                            borderColor: "purple.500",
                            boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                          }}
                          required
                          disabled={isLoading}
                        />
                      )}

                      {/* File Upload Method */}
                      {uploadMethod === "file" && (
                        <Box>
                          {!selectedFile ? (
                            <Box
                              as="label"
                              htmlFor="photo-file-input"
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              h="120px"
                              border="2px dashed"
                              borderColor="purple.300"
                              borderRadius="xl"
                              bg="purple.50"
                              cursor="pointer"
                              transition="all 0.3s"
                              _hover={{
                                borderColor: "purple.500",
                                bg: "purple.100",
                              }}
                            >
                              <Upload size={32} color="#9333ea" />
                              <Text fontSize="sm" color="purple.600" mt={2} fontWeight="medium">
                                Click to upload photo
                              </Text>
                              <Text fontSize="xs" color="gray.500" mt={1}>
                                PNG, JPG, GIF or WebP (Max 5MB)
                              </Text>
                              <input
                                id="photo-file-input"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                                disabled={isLoading}
                              />
                            </Box>
                          ) : (
                            <Box position="relative">
                              <Flex
                                align="center"
                                gap={3}
                                p={3}
                                border="2px solid"
                                borderColor="purple.300"
                                borderRadius="xl"
                                bg="purple.50"
                              >
                                {previewUrl && (
                                  <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    boxSize="60px"
                                    objectFit="cover"
                                    borderRadius="lg"
                                  />
                                )}
                                <Box flex={1}>
                                  <Text fontSize="sm" fontWeight="medium" color="gray.700" noOfLines={1}>
                                    {selectedFile.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                  </Text>
                                </Box>
                                <IconButton
                                  size="sm"
                                  variant="ghost"
                                  colorPalette="red"
                                  onClick={handleRemoveFile}
                                  aria-label="Remove file"
                                  disabled={isLoading}
                                >
                                  <X size={18} />
                                </IconButton>
                              </Flex>
                            </Box>
                          )}
                        </Box>
                      )}

                      <Field.HelperText fontSize="xs" color="gray.500" mt={1}>
                        {uploadMethod === "url" 
                          ? "Provide a direct link to your profile picture"
                          : "Choose a photo from your device"}
                      </Field.HelperText>
                    </Field.Root>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      w="full"
                      h="52px"
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      color="white"
                      borderRadius="xl"
                      fontSize="md"
                      fontWeight="bold"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.3s"
                      loading={isLoading}
                      loadingText="Creating account..."
                      disabled={isLoading}
                    >
                      <Flex align="center" gap={2}>
                        Create Account
                        <ArrowRight size={20} />
                      </Flex>
                    </Button>

                    {/* Divider */}
                    <Flex align="center" gap={3} my={2}>
                      <Box flex="1" h="1px" bg="gray.200" />
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        Already a member?
                      </Text>
                      <Box flex="1" h="1px" bg="gray.200" />
                    </Flex>

                    {/* Login Link */}
                    <Link to="/signin">
                      <Button
                        w="full"
                        h="52px"
                        variant="outline"
                        colorPalette="purple"
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="medium"
                        _hover={{
                          bg: "purple.50",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.3s"
                        disabled={isLoading}
                      >
                        Sign In Instead
                      </Button>
                    </Link>

                    {/* Terms */}
                    <Text fontSize="xs" color="gray.500" textAlign="center" px={4}>
                      By creating an account, you agree to our{" "}
                      <Text as="span" color="purple.600" fontWeight="medium" cursor="pointer">
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text as="span" color="purple.600" fontWeight="medium" cursor="pointer">
                        Privacy Policy
                      </Text>
                    </Text>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Flex>
        </Grid>
      </Container>
    </Box>
  );
}

export default Register;