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
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import { Toaster, toaster } from "../../components/ui/toaster.jsx";
import { useDispatch } from "react-redux";
import { Action_Type } from "../../Redux/Auth_Reducer/action.jsx";
import {
  Mail,
  Lock,
  LogIn,
  Shield,
  Zap,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Package,
} from "lucide-react";

const InitialState = {
  email: "",
  password: "",
};

function Login() {
  const [IsInput, setIsInput] = useState(InitialState);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setIsInput((Prev) => ({
      ...Prev,
      [name]: value,
    }));
  };
 
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      dispatch({ type: Action_Type.LOGIN_REQUEST });
      let Response = await fetch("https://slyvarae-ecomm.onrender.com/api/v1/users/login", {
        method: "post",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          email: IsInput.email,
          password: IsInput.password,
        }),
      });
      let result = await Response.json();

      if (!Response.ok) {
        throw new Error(result.message || "Login failed");
      }

      const { Token, User } = result;

      dispatch({
        type: Action_Type.LOGIN_SUCCESS,
        payload: { token: Token, user: User },
      });

      toaster.success({
        title: "Welcome back! 👋",
        description: "You've successfully logged in",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // ✅ Role-based redirect
      setTimeout(() => {
        if (User.role === "admin" || User.role === "Admin") {
          nav("/admin");
        } else {
          nav("/");
        }
      }, 1500);
    } catch (error) {
      toaster.error({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatch({ type: Action_Type.LOGIN_FAILURE });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Zap, text: "Lightning fast checkout", color: "yellow" },
    { icon: Shield, text: "Secure & encrypted", color: "green" },
    { icon: TrendingUp, text: "Best deals & offers", color: "blue" },
    { icon: Package, text: "Fast delivery", color: "purple" },
  ];

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(to bottom right, #f8fafc, #e2e8f0)"
      position="relative"
      overflow="hidden"
    >
      <Toaster />

      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        width="400px"
        height="400px"
        bg="blue.100"
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
        bg="purple.100"
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
                  <Box bg="blue.100" p={2} borderRadius="lg">
                    <LogIn size={24} color="#3B82F6" />
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="blue.600"
                    textTransform="uppercase"
                  >
                    Welcome Back
                  </Text>
                </Flex>
                <Heading size={{ base: "2xl", md: "3xl", lg: "4xl" }} mb={4} lineHeight="1.2">
                  Continue Your
                  <br />
                  <Text
                    as="span"
                    bgGradient="to-r"
                    gradientFrom="blue.600"
                    gradientTo="purple.500"
                    bgClip="text"
                  >
                    Shopping Journey
                  </Text>
                </Heading>
                <Text fontSize={{ base: "md", lg: "lg" }} color="gray.600" maxW="500px">
                  Sign in to access your account, track orders, and enjoy exclusive member benefits.
                </Text>
              </Box>

              {/* Features Grid */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {features.map((feature, index) => (
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
                      transform: "translateY(-4px)",
                      boxShadow: "md",
                    }}
                  >
                    <Box bg={`${feature.color}.100`} p={2} borderRadius="lg">
                      <feature.icon size={20} color={`var(--chakra-colors-${feature.color}-600)`} />
                    </Box>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      {feature.text}
                    </Text>
                  </Flex>
                ))}
              </Grid>

              {/* Testimonial Card */}
              <Box
                bg="white"
                p={6}
                borderRadius="2xl"
                boxShadow="lg"
                borderLeft="4px solid"
                borderColor="blue.500"
              >
                <Flex gap={1} mb={3}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="#FCD34D" color="#FCD34D" />
                  ))}
                </Flex>
                <Text fontSize="md" color="gray.700" mb={4} fontStyle="italic">
                  "Amazing shopping experience! Fast delivery and excellent customer service. Highly recommended!"
                </Text>
                <Flex align="center" gap={3}>
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      Sarah Johnson
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Verified Customer
                    </Text>
                  </Box>
                </Flex>
              </Box>

              {/* Stats */}
              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <Box textAlign="center" p={4} bg="white" borderRadius="xl" boxShadow="sm">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    50K+
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Active Users
                  </Text>
                </Box>
                <Box textAlign="center" p={4} bg="white" borderRadius="xl" boxShadow="sm">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    100K+
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Orders
                  </Text>
                </Box>
                <Box textAlign="center" p={4} bg="white" borderRadius="xl" boxShadow="sm">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    99%
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Satisfied
                  </Text>
                </Box>
              </Grid>
            </Stack>
          </Box>

          {/* Right Side - Login Form */}
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
                gradientFrom="blue.500"
                gradientTo="purple.500"
              />

              <Stack gap={6}>
                {/* Header */}
                <Box textAlign="center">
                  <Flex justify="center" mb={4}>
                    <Box
                      bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      p={4}
                      borderRadius="2xl"
                      boxShadow="0 8px 20px rgba(59, 130, 246, 0.3)"
                    >
                      <LogIn size={32} color="white" />
                    </Box>
                  </Flex>
                  <Heading size={{ base: "xl", md: "2xl" }} mb={2}>
                    Welcome Back
                  </Heading>
                  <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
                    Sign in to your account to continue
                  </Text>
                </Box>

                {/* Form */}
                <form onSubmit={HandleSubmit}>
                  <Stack gap={5}>
                    {/* Email Field */}
                    <Field.Root>
                      <Field.Label fontWeight="medium" fontSize="sm">
                        Email Address
                      </Field.Label>
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left="12px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex="1"
                        >
                          <Mail size={18} color="#9CA3AF" />
                        </Box>
                        <Input
                          type="email"
                          name="email"
                          value={IsInput.email}
                          onChange={HandleChange}
                          placeholder="john@example.com"
                          pl="40px"
                          h="52px"
                          borderRadius="xl"
                          borderColor="gray.300"
                          fontSize="md"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                          }}
                          required
                        />
                      </Box>
                    </Field.Root>

                    {/* Password Field */}
                    <Field.Root>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Field.Label fontWeight="medium" fontSize="sm">
                          Password
                        </Field.Label>
                      </Flex>
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left="12px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex="1"
                        >
                          <Lock size={18} color="#9CA3AF" />
                        </Box>
                        <Input
                          type="password"
                          name="password"
                          value={IsInput.password}
                          onChange={HandleChange}
                          placeholder="••••••••"
                          pl="40px"
                          h="52px"
                          borderRadius="xl"
                          borderColor="gray.300"
                          fontSize="md"
                          _focus={{
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                          }}
                          required
                        />
                      </Box>
                    </Field.Root>

                    {/* Remember Me & Terms */}
                    <Flex justify="space-between" align="center">
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input type="checkbox" style={{ width: "16px", height: "16px" }} />
                        <Text fontSize="sm" color="gray.600">
                          Remember me
                        </Text>
                      </label>
                    </Flex>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      w="full"
                      h="56px"
                      bg="linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
                      color="white"
                      borderRadius="xl"
                      fontSize="md"
                      fontWeight="bold"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                      }}
                      _active={{
                        transform: "translateY(0)",
                      }}
                      transition="all 0.3s"
                      loading={isLoading}
                      loadingText="Signing in..."
                    >
                      <Flex align="center" gap={2}>
                        Sign In
                        <ArrowRight size={20} />
                      </Flex>
                    </Button>

                    {/* Divider */}
                    <Flex align="center" gap={3} my={2}>
                      <Box flex="1" h="1px" bg="gray.200" />
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        New here?
                      </Text>
                      <Box flex="1" h="1px" bg="gray.200" />
                    </Flex>

                    {/* Register Link */}
                    <Link to="/signup">
                      <Button
                        w="full"
                        h="52px"
                        variant="outline"
                        colorPalette="blue"
                        borderRadius="xl"
                        fontSize="md"
                        fontWeight="medium"
                        _hover={{
                          bg: "blue.50",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.3s"
                      >
                        Create New Account
                      </Button>
                    </Link>

                    {/* Security Badge */}
                    <Flex
                      align="center"
                      justify="center"
                      gap={2}
                      p={3}
                      bg="gray.50"
                      borderRadius="lg"
                    >
                      <Shield size={16} color="#10B981" />
                      <Text fontSize="xs" color="gray.600">
                        Your information is{" "}
                        <Text as="span" fontWeight="bold" color="green.600">
                          100% secure
                        </Text>
                      </Text>
                    </Flex>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Flex>
        </Grid>

        {/* Mobile Features - Shown only on mobile */}
        <Box display={{ base: "block", lg: "none" }} mt={8}>
          <Grid templateColumns="repeat(2, 1fr)" gap={3}>
            {features.map((feature, index) => (
              <Flex
                key={index}
                align="center"
                gap={2}
                p={3}
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
              >
                <Box bg={`${feature.color}.100`} p={2} borderRadius="lg">
                  <feature.icon size={16} color={`var(--chakra-colors-${feature.color}-600)`} />
                </Box>
                <Text fontSize="xs" fontWeight="medium" color="gray.700">
                  {feature.text}
                </Text>
              </Flex>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;