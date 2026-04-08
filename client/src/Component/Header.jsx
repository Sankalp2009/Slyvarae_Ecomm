import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Menu,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ChevronDown,
  Grid3X3,
  Home,
  LogOut,
  Menu as MenuIcon,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { Action_Type } from "../Redux/Auth_Reducer/action.jsx";
import { Action_Type as cart } from "../Redux/Cart_Reducer/action.jsx";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { IsAuth, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const nav = useNavigate();
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);
  const CartCount = items?.length || 0;
  const dispatch = useDispatch();

  // Colors
  const colors = {
    gold: "#facc15",
    goldDark: "#eab308",
    navy: "#1e3a5f",
    navyDark: "#0f172a",
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Links = [
    { path: "/", content: "Home", icon: Home },
    { path: "/product", content: "Products", icon: Grid3X3 },
  ];

  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch({ type: cart.CLEAR_CART });
    dispatch({ type: Action_Type.LOGOUT });
    setIsMobileMenuOpen(false);
    nav("/");
  };

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      bg={isScrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.95)"}
      backdropFilter="blur(20px) saturate(180%)"
      borderBottom="1px solid"
      borderColor={isScrolled ? "rgba(30, 58, 95, 0.1)" : "transparent"}
      boxShadow={isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.05)" : "none"}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Box maxW="1400px" mx="auto" px={{ base: "4", md: "6", lg: "8" }}>
        <Flex
          h={{ base: "70px", md: "80px" }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <Flex
              alignItems="center"
              gap="3"
              _hover={{ transform: "scale(1.02)" }}
              transition="transform 0.3s ease"
              role="group"
            >
              {/* Custom Logo Icon */}
              <Box position="relative">
                {/* Glow Effect */}
                <Box
                  position="absolute"
                  inset="-4px"
                  bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                  borderRadius="2xl"
                  opacity="0.4"
                  filter="blur(12px)"
                  transition="opacity 0.3s ease"
                  _groupHover={{ opacity: 0.6 }}
                />

                {/* Icon Container */}
                <Box
                  position="relative"
                  bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                  p="3"
                  borderRadius="xl"
                  boxShadow={`0 8px 24px rgba(15, 23, 42, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)`}
                  border={`1px solid rgba(250, 204, 21, 0.3)`}
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.2), transparent)",
                    transition: "left 0.6s ease",
                  }}
                  _groupHover={{
                    _before: { left: "100%" },
                  }}
                >
                  {/* Custom SVG Logo */}
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Shopping Bag Body */}
                    <path
                      d="M3.5 8C3.5 7.44772 3.94772 7 4.5 7H19.5C20.0523 7 20.5 7.44772 20.5 8V19C20.5 20.1046 19.6046 21 18.5 21H5.5C4.39543 21 3.5 20.1046 3.5 19V8Z"
                      fill={colors.gold}
                    />
                    {/* Bag Handles */}
                    <path
                      d="M8 7V5C8 3.34315 9.34315 2 11 2H13C14.6569 2 16 3.34315 16 5V7"
                      stroke={colors.gold}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Sparkle/Star Element */}
                    <path
                      d="M12 10L12.7 12.3L15 13L12.7 13.7L12 16L11.3 13.7L9 13L11.3 12.3L12 10Z"
                      fill={colors.navyDark}
                    />
                  </svg>
                </Box>

                {/* Floating Premium Badge */}
                <Box
                  position="absolute"
                  top="-3px"
                  right="-3px"
                  w="14px"
                  h="14px"
                  bg={`linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow={`0 2px 8px rgba(250, 204, 21, 0.5)`}
                  border={`2px solid ${colors.navyDark}`}
                  animation="pulse 2s ease-in-out infinite"
                >
                  <Sparkles size={7} color={colors.navyDark} strokeWidth={3} />
                </Box>
              </Box>

              {/* Logo Text */}
              <Box>
                <Flex alignItems="baseline" gap="0">
                  <Heading
                    size={{ base: "md", md: "lg" }}
                    bgGradient={`linear(to-r, ${colors.gold}, ${colors.goldDark})`}
                    bgClip="text"
                    fontWeight="900"
                    letterSpacing="-0.03em"
                    lineHeight="1"
                  >
                    ----
                  </Heading>
                  <Heading
                    size={{ base: "md", md: "lg" }}
                    color={colors.navyDark}
                    fontWeight="900"
                    letterSpacing="-0.03em"
                    lineHeight="1"
                  >
                    Sylvarae
                  </Heading>
                </Flex>
                <Flex
                  alignItems="center"
                  gap="1.5"
                  mt="1"
                  display={{ base: "none", md: "flex" }}
                >
                  <Box
                    w="12px"
                    h="2px"
                    bg={`linear-gradient(90deg, ${colors.gold}, ${colors.navy})`}
                    borderRadius="full"
                  />
                  <Text
                    fontSize="9px"
                    color={colors.navy}
                    fontWeight="700"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                  >
                    Premium Store
                  </Text>
                  <Box
                    w="12px"
                    h="2px"
                    bg={`linear-gradient(90deg, ${colors.navy}, ${colors.gold})`}
                    borderRadius="full"
                  />
                </Flex>
              </Box>
            </Flex>
          </Link>

          {/* Desktop Navigation */}
          <Flex
            display={{ base: "none", lg: "flex" }}
            gap="1"
            alignItems="center"
            bg="rgba(30, 58, 95, 0.05)"
            p="1.5"
            borderRadius="full"
            border="1px solid"
            borderColor="rgba(30, 58, 95, 0.08)"
          >
            {Links.map((el) => (
              <Link
                key={el.path}
                to={el.path}
                style={{ textDecoration: "none" }}
              >
                <Flex
                  alignItems="center"
                  gap="2"
                  px="5"
                  py="2.5"
                  borderRadius="full"
                  bg={isActiveLink(el.path) ? "white" : "transparent"}
                  boxShadow={
                    isActiveLink(el.path)
                      ? "0 2px 8px rgba(0,0,0,0.08)"
                      : "none"
                  }
                  color={isActiveLink(el.path) ? colors.navy : "gray.600"}
                  fontWeight="600"
                  fontSize="sm"
                  transition="all 0.25s ease"
                  _hover={{
                    bg: isActiveLink(el.path)
                      ? "white"
                      : "rgba(255,255,255,0.5)",
                    color: colors.navy,
                  }}
                >
                  <el.icon size={16} strokeWidth={2.5} />
                  <Text>{el.content}</Text>
                </Flex>
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{ textDecoration: "none" }}>
                <Flex
                  alignItems="center"
                  gap="2"
                  px="5"
                  py="2.5"
                  borderRadius="full"
                  bg={isActiveLink("/admin") ? "white" : "transparent"}
                  boxShadow={
                    isActiveLink("/admin")
                      ? "0 2px 8px rgba(0,0,0,0.08)"
                      : "none"
                  }
                  color={isActiveLink("/admin") ? colors.navy : "gray.600"}
                  fontWeight="600"
                  fontSize="sm"
                  transition="all 0.25s ease"
                  _hover={{
                    bg: isActiveLink("/admin")
                      ? "white"
                      : "rgba(255,255,255,0.5)",
                    color: colors.navy,
                  }}
                >
                  <Settings size={16} strokeWidth={2.5} />
                  <Text>Admin</Text>
                </Flex>
              </Link>
            )}
          </Flex>

          {/* Desktop Auth Actions */}
          <Flex
            display={{ base: "none", lg: "flex" }}
            alignItems="center"
            gap="3"
          >
            {!IsAuth ? (
              <>
                <Link to="/signin">
                  <Button
                    variant="ghost"
                    color={colors.navyDark}
                    size="md"
                    fontWeight="600"
                    borderRadius="full"
                    px="6"
                    _hover={{
                      bg: "rgba(30, 58, 95, 0.05)",
                    }}
                    transition="all 0.25s ease"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    position="relative"
                    overflow="hidden"
                    bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                    color="white"
                    size="md"
                    fontWeight="600"
                    borderRadius="full"
                    px="6"
                    boxShadow={`0 4px 15px rgba(30, 58, 95, 0.3)`}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px rgba(30, 58, 95, 0.4)`,
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.3s ease"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.2), transparent)",
                      transition: "left 0.5s ease",
                    }}
                    _hover_before={{
                      left: "100%",
                    }}
                  >
                    <Flex align="center" gap="2">
                      <Sparkles size={16} color={colors.gold} />
                      <Text>Get Started</Text>
                    </Flex>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Cart Icon with Badge */}
                <Link to="/cart">
                  <Box
                    position="relative"
                    cursor="pointer"
                    p="2.5"
                    borderRadius="xl"
                    bg="rgba(30, 58, 95, 0.05)"
                    border="1px solid"
                    borderColor="rgba(30, 58, 95, 0.1)"
                    transition="all 0.25s ease"
                    _hover={{
                      bg: "rgba(250, 204, 21, 0.1)",
                      borderColor: colors.gold,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px rgba(250, 204, 21, 0.15)`,
                    }}
                  >
                    <ShoppingCart
                      size={20}
                      strokeWidth={2}
                      color={colors.navy}
                    />
                    {CartCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-2"
                        right="-2"
                        bg={`linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`}
                        color={colors.navyDark}
                        borderRadius="full"
                        fontSize="xs"
                        minW="20px"
                        h="20px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="700"
                        boxShadow={`0 2px 8px rgba(250, 204, 21, 0.4)`}
                        border="2px solid white"
                      >
                        {CartCount > 9 ? "9+" : CartCount}
                      </Badge>
                    )}
                  </Box>
                </Link>

                {/* Divider */}
                <Box w="1px" h="8" bg="gray.200" mx="1" />

                {/* User Menu */}
                <Menu.Root positioning={{ placement: "bottom-end" }}>
                  <Menu.Trigger>
                    <Flex
                      alignItems="center"
                      gap="3"
                      cursor="pointer"
                      p="2"
                      pr="3"
                      borderRadius="full"
                      bg="rgba(30, 58, 95, 0.05)"
                      border="1px solid"
                      borderColor="rgba(30, 58, 95, 0.1)"
                      transition="all 0.25s ease"
                      _hover={{
                        bg: "rgba(30, 58, 95, 0.08)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <Avatar.Root
                        size="sm"
                        borderWidth="2px"
                        borderColor={colors.gold}
                        boxShadow={`0 0 0 2px rgba(30, 58, 95, 0.1)`}
                      >
                        <Avatar.Fallback
                          bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                          color={colors.gold}
                          fontWeight="700"
                        >
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar.Fallback>
                        <Avatar.Image src={user?.photo} />
                      </Avatar.Root>
                      <Box display={{ base: "none", xl: "block" }}>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color={colors.navyDark}
                          lineHeight="1.2"
                        >
                          {user?.name?.split(" ")[0] || "User"}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          textTransform="capitalize"
                        >
                          {user?.role || "Member"}
                        </Text>
                      </Box>
                      <ChevronDown size={16} color="#9ca3af" />
                    </Flex>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content
                        minW="240px"
                        p="2"
                        borderRadius="2xl"
                        boxShadow="0 20px 50px rgba(0, 0, 0, 0.15)"
                        border="1px solid"
                        borderColor="gray.100"
                        bg="white"
                        overflow="hidden"
                      >
                        {/* User Info Header */}
                        <Box
                          p="4"
                          mb="2"
                          borderRadius="xl"
                          bg={`linear-gradient(135deg, rgba(30, 58, 95, 0.05) 0%, rgba(250, 204, 21, 0.1) 100%)`}
                          border="1px solid"
                          borderColor="rgba(30, 58, 95, 0.1)"
                        >
                          <Flex align="center" gap="3">
                            <Avatar.Root
                              size="md"
                              borderWidth="2px"
                              borderColor={colors.gold}
                            >
                              <Avatar.Fallback
                                bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                                color={colors.gold}
                                fontWeight="700"
                                fontSize="md"
                              >
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                              </Avatar.Fallback>
                              <Avatar.Image src={user?.photo} />
                            </Avatar.Root>
                            <Box flex="1" overflow="hidden">
                              <Text
                                fontWeight="700"
                                fontSize="md"
                                color={colors.navyDark}
                                truncate
                              >
                                {user?.name || "User"}
                              </Text>
                              <Text
                                fontSize="sm"
                                color={colors.navy}
                                textTransform="capitalize"
                                fontWeight="500"
                              >
                                {user?.role || "Member"}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>

                        {/* Menu Items */}
                        <VStack align="stretch" gap="1">
                          <Link to="/me" style={{ textDecoration: "none" }}>
                            <Menu.Item
                              value="profile"
                              p="3"
                              borderRadius="xl"
                              transition="all 0.2s ease"
                              _hover={{ bg: "gray.50" }}
                            >
                              <Flex align="center" gap="3">
                                <Box
                                  p="2"
                                  borderRadius="lg"
                                  bg="blue.50"
                                  color="blue.600"
                                >
                                  <User size={16} strokeWidth={2.5} />
                                </Box>
                                <Box>
                                  <Text
                                    fontWeight="600"
                                    fontSize="sm"
                                    color="gray.800"
                                  >
                                    My Profile
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    View and edit profile
                                  </Text>
                                </Box>
                              </Flex>
                            </Menu.Item>
                          </Link>

                          <Link to="/order" style={{ textDecoration: "none" }}>
                            <Menu.Item
                              value="orders"
                              p="3"
                              borderRadius="xl"
                              transition="all 0.2s ease"
                              _hover={{ bg: "gray.50" }}
                            >
                              <Flex align="center" gap="3">
                                <Box
                                  p="2"
                                  borderRadius="lg"
                                  bg="green.50"
                                  color="green.600"
                                >
                                  <Package size={16} strokeWidth={2.5} />
                                </Box>
                                <Box>
                                  <Text
                                    fontWeight="600"
                                    fontSize="sm"
                                    color="gray.800"
                                  >
                                    My Orders
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Track your orders
                                  </Text>
                                </Box>
                              </Flex>
                            </Menu.Item>
                          </Link>

                          <Box h="1px" bg="gray.100" my="1" />

                          <Menu.Item
                            value="logout"
                            p="3"
                            borderRadius="xl"
                            transition="all 0.2s ease"
                            _hover={{ bg: "red.50" }}
                            onClick={handleLogout}
                          >
                            <Flex align="center" gap="3">
                              <Box
                                p="2"
                                borderRadius="lg"
                                bg="red.50"
                                color="red.600"
                              >
                                <LogOut size={16} strokeWidth={2.5} />
                              </Box>
                              <Box>
                                <Text
                                  fontWeight="600"
                                  fontSize="sm"
                                  color="red.600"
                                >
                                  Log Out
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  Sign out of account
                                </Text>
                              </Box>
                            </Flex>
                          </Menu.Item>
                        </VStack>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </>
            )}
          </Flex>

          {/* Mobile Menu Button & Cart */}
          <Flex
            display={{ base: "flex", lg: "none" }}
            alignItems="center"
            gap="2"
          >
            {IsAuth && (
              <Link to="/cart">
                <Box
                  position="relative"
                  p="2.5"
                  borderRadius="xl"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <ShoppingCart size={20} color={colors.navy} />
                  {CartCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-2"
                      right="-2"
                      bg={`linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`}
                      color={colors.navyDark}
                      borderRadius="full"
                      fontSize="xs"
                      minW="18px"
                      h="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="700"
                      border="2px solid white"
                    >
                      {CartCount > 9 ? "9+" : CartCount}
                    </Badge>
                  )}
                </Box>
              </Link>
            )}
            <IconButton
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              p="2.5"
              borderRadius="xl"
              bg={isMobileMenuOpen ? "rgba(30, 58, 95, 0.05)" : "gray.50"}
              border="1px solid"
              borderColor={
                isMobileMenuOpen ? "rgba(30, 58, 95, 0.1)" : "gray.100"
              }
              color={isMobileMenuOpen ? colors.navy : "gray.600"}
              transition="all 0.25s ease"
              _hover={{
                bg: "rgba(30, 58, 95, 0.1)",
              }}
            >
              {isMobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </IconButton>
          </Flex>
        </Flex>

        {/* Mobile Menu Dropdown */}
        <Box
          display={{ base: isMobileMenuOpen ? "block" : "none", lg: "none" }}
          pb="6"
          pt="4"
          borderTop="1px solid"
          borderColor="gray.100"
          animation="slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <VStack align="stretch" gap="2">
            {/* Navigation Links */}
            {Links.map((el) => (
              <Link
                key={el.path}
                to={el.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <Flex
                  alignItems="center"
                  gap="3"
                  p="4"
                  borderRadius="xl"
                  bg={
                    isActiveLink(el.path) ? "rgba(30, 58, 95, 0.05)" : "gray.50"
                  }
                  border="1px solid"
                  borderColor={
                    isActiveLink(el.path) ? "rgba(30, 58, 95, 0.1)" : "gray.100"
                  }
                  transition="all 0.2s ease"
                  _hover={{ bg: "rgba(30, 58, 95, 0.08)" }}
                >
                  <Box
                    p="2"
                    borderRadius="lg"
                    bg={isActiveLink(el.path) ? "white" : "white"}
                    color={isActiveLink(el.path) ? colors.navy : "gray.600"}
                  >
                    <el.icon size={18} strokeWidth={2.5} />
                  </Box>
                  <Text
                    fontWeight="600"
                    color={isActiveLink(el.path) ? colors.navyDark : "gray.700"}
                  >
                    {el.content}
                  </Text>
                </Flex>
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <Flex
                  alignItems="center"
                  gap="3"
                  p="4"
                  borderRadius="xl"
                  bg={
                    isActiveLink("/admin")
                      ? "rgba(30, 58, 95, 0.05)"
                      : "gray.50"
                  }
                  border="1px solid"
                  borderColor={
                    isActiveLink("/admin")
                      ? "rgba(30, 58, 95, 0.1)"
                      : "gray.100"
                  }
                  transition="all 0.2s ease"
                  _hover={{ bg: "rgba(30, 58, 95, 0.08)" }}
                >
                  <Box
                    p="2"
                    borderRadius="lg"
                    bg={isActiveLink("/admin") ? "white" : "white"}
                    color={isActiveLink("/admin") ? colors.navy : "gray.600"}
                  >
                    <Settings size={18} strokeWidth={2.5} />
                  </Box>
                  <Text
                    fontWeight="600"
                    color={
                      isActiveLink("/admin") ? colors.navyDark : "gray.700"
                    }
                  >
                    Admin Dashboard
                  </Text>
                </Flex>
              </Link>
            )}

            {/* Divider */}
            <Box h="1px" bg="gray.200" my="2" />

            {!IsAuth ? (
              <VStack gap="3" pt="2">
                <Link
                  to="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ width: "100%" }}
                >
                  <Button
                    w="full"
                    variant="outline"
                    colorPalette="gray"
                    size="lg"
                    borderRadius="xl"
                    fontWeight="600"
                    borderWidth="2px"
                    _hover={{ bg: "gray.50" }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ width: "100%" }}
                >
                  <Button
                    w="full"
                    bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                    color="white"
                    size="lg"
                    borderRadius="xl"
                    fontWeight="600"
                    boxShadow="0 4px 15px rgba(30, 58, 95, 0.3)"
                    _hover={{
                      boxShadow: "0 6px 20px rgba(30, 58, 95, 0.4)",
                    }}
                  >
                    <Flex align="center" gap="2">
                      <Sparkles size={18} color={colors.gold} />
                      Get Started Free
                    </Flex>
                  </Button>
                </Link>
              </VStack>
            ) : (
              <>
                {/* User Info Card */}
                <Box
                  p="4"
                  borderRadius="xl"
                  bg="linear-gradient(135deg, rgba(30, 58, 95, 0.05) 0%, rgba(250, 204, 21, 0.1) 100%)"
                  border="1px solid"
                  borderColor="rgba(30, 58, 95, 0.1)"
                >
                  <Flex align="center" gap="3">
                    <Avatar.Root
                      size="md"
                      borderWidth="2px"
                      borderColor={colors.gold}
                    >
                      <Avatar.Fallback
                        bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                        color={colors.gold}
                        fontWeight="700"
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar.Fallback>
                      <Avatar.Image src={user?.photo} />
                    </Avatar.Root>
                    <Box flex="1">
                      <Text
                        fontWeight="700"
                        fontSize="md"
                        color={colors.navyDark}
                      >
                        {user?.name || "User"}
                      </Text>
                      <Text
                        fontSize="sm"
                        color={colors.navy}
                        textTransform="capitalize"
                        fontWeight="500"
                      >
                        {user?.role || "Member"}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* User Menu Items */}
                <Link to="/me" onClick={() => setIsMobileMenuOpen(false)}>
                  <Flex
                    alignItems="center"
                    gap="3"
                    p="4"
                    borderRadius="xl"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.100"
                    transition="all 0.2s ease"
                    _hover={{ bg: "blue.50", borderColor: "blue.200" }}
                  >
                    <Box p="2" borderRadius="lg" bg="blue.100" color="blue.600">
                      <User size={18} strokeWidth={2.5} />
                    </Box>
                    <Box>
                      <Text fontWeight="600" color="gray.800">
                        My Profile
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        View and edit profile
                      </Text>
                    </Box>
                  </Flex>
                </Link>

                <Link to="/order" onClick={() => setIsMobileMenuOpen(false)}>
                  <Flex
                    alignItems="center"
                    gap="3"
                    p="4"
                    borderRadius="xl"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.100"
                    transition="all 0.2s ease"
                    _hover={{ bg: "green.50", borderColor: "green.200" }}
                  >
                    <Box
                      p="2"
                      borderRadius="lg"
                      bg="green.100"
                      color="green.600"
                    >
                      <Package size={18} strokeWidth={2.5} />
                    </Box>
                    <Box>
                      <Text fontWeight="600" color="gray.800">
                        My Orders
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Track your orders
                      </Text>
                    </Box>
                  </Flex>
                </Link>

                <Flex
                  alignItems="center"
                  gap="3"
                  p="4"
                  borderRadius="xl"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.100"
                  cursor="pointer"
                  onClick={handleLogout}
                  transition="all 0.2s ease"
                  _hover={{ bg: "red.50", borderColor: "red.200" }}
                >
                  <Box p="2" borderRadius="lg" bg="red.100" color="red.600">
                    <LogOut size={18} strokeWidth={2.5} />
                  </Box>
                  <Box>
                    <Text fontWeight="600" color="red.600">
                      Log Out
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Sign out of account
                    </Text>
                  </Box>
                </Flex>
              </>
            )}
          </VStack>
        </Box>
      </Box>

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </Box>
  );
}

export default Header;
