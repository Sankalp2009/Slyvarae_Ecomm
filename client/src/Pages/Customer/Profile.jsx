import React from "react";
import {
  Mail,
  User,
  Calendar,
  Shield,
  ShoppingCart,
  Package,
  Home,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Box,
  Flex,
  Text,
  Heading,
  Card,
  Button,
  Grid,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { isAdminRole } from "../../Utils/authHeaders.js";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = isAdminRole(user?.role);

  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Box minH="100vh" bg="#f0f2f7ff" py={8} px={4}>
      <Box maxW="7xl" mx="auto">
        <Heading size="3xl" fontWeight="bold" mb={8}>
          My Profile
        </Heading>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Profile Card */}
          <Card.Root boxShadow="md" overflow="hidden" bg="white">
            <Card.Body p={8}>
              {/* Avatar Section */}
              <Flex direction="column" align="center" mb={8}>
                <Avatar.Root
                  colorPalette="green"
                  variant={"subtle"}
                  size="lg"
                  shape="rounded"
                >
                  <Avatar.Image src={user.photo} />
                  <User size={40} />
                  {/* <Avatar.Fallback name="Nue Camp" /> */}
                </Avatar.Root>
              </Flex>

              {/* Edit Form or Display Info */}
              <Flex direction="column" gap={4}>
                {/* Full Name */}
                <Flex
                  align="start"
                  gap={4}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                >
                  <Box color="gray.600" mt={1}>
                    <User size={20} />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Full Name
                    </Text>
                    <Text fontWeight="semibold" fontSize="md">
                      {user.name}
                    </Text>
                  </Box>
                </Flex>

                {/* Email Address */}
                <Flex
                  align="start"
                  gap={4}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                >
                  <Box color="gray.600" mt={1}>
                    <Mail size={20} />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Email Address
                    </Text>
                    <Text fontWeight="semibold" fontSize="md">
                      {user.email}
                    </Text>
                  </Box>
                </Flex>

                {/* Role */}
                <Flex
                  align="start"
                  gap={4}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                >
                  <Box color="gray.600" mt={1}>
                    <Shield size={20} />
                  </Box>
                  <Box flex={1}>
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          Role
                        </Text>
                        <Text
                          fontWeight="semibold"
                          fontSize="md"
                          textTransform="capitalize"
                        >
                          {user.role}
                        </Text>
                      </Box>
                      {isAdmin && (
                        <Badge colorPalette="blue" size="lg">
                          Admin
                        </Badge>
                      )}
                    </Flex>
                  </Box>
                </Flex>

                {/* Member Since */}
                <Flex
                  align="start"
                  gap={4}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                >
                  <Box color="gray.600" mt={1}>
                    <Calendar size={20} />
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      Member Since
                    </Text>
                    <Text fontWeight="semibold" fontSize="md">
                      {user.createdAt || user.created_at
                        ? new Date(
                            user.createdAt || user.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Card.Body>
          </Card.Root>

          {/* Quick Actions Card */}
          <Card.Root boxShadow="md" overflow="hidden" bg="white">
            <Card.Body p={6}>
              <Heading size="lg" fontWeight="bold" mb={6}>
                Quick Actions
              </Heading>

              <Flex direction="column" gap={3}>
                {/* View Orders */}
                <Button
                  onClick={() => navigate("/order")}
                  variant="outline"
                  size="lg"
                  justifyContent="flex-start"
                  _hover={{
                    bg: "blue.50",
                    borderColor: "blue.500",
                  }}
                >
                  <Flex align="center" gap={3} w="full">
                    <Box color="blue.500">
                      <Package size={24} />
                    </Box>
                    <Text fontWeight="medium">View Orders</Text>
                  </Flex>
                </Button>

                {/* View Cart */}
                <Button
                  onClick={() => navigate("/cart")}
                  variant="outline"
                  size="lg"
                  justifyContent="flex-start"
                  _hover={{
                    bg: "green.50",
                    borderColor: "green.500",
                  }}
                >
                  <Flex align="center" gap={3} w="full">
                    <Box color="green.500">
                      <ShoppingCart size={24} />
                    </Box>
                    <Text fontWeight="medium">View Cart</Text>
                  </Flex>
                </Button>

                {/* Browse Products */}
                <Button
                  onClick={() => navigate("/product")}
                  variant="outline"
                  size="lg"
                  justifyContent="flex-start"
                  _hover={{
                    bg: "purple.50",
                    borderColor: "purple.500",
                  }}
                >
                  <Flex align="center" gap={3} w="full">
                    <Box color="purple.500">
                      <Home size={24} />
                    </Box>
                    <Text fontWeight="medium">Browse Products</Text>
                  </Flex>
                </Button>

                {/* Admin Dashboard (if admin) */}
                {isAdmin && (
                  <Button
                    onClick={() => navigate("/admin")}
                    variant="solid"
                    colorPalette="blue"
                    size="lg"
                    justifyContent="flex-start"
                  >
                    <Flex align="center" gap={3} w="full">
                      <Shield size={24} />
                      <Text fontWeight="medium">Admin Dashboard</Text>
                    </Flex>
                  </Button>
                )}
              </Flex>
            </Card.Body>
          </Card.Root>
        </Grid>
      </Box>
    </Box>
  );
}

export default Profile;
