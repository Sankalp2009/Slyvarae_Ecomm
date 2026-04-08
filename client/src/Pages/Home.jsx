import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Crown,
  Gift,
  Heart,
  Package,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

function Home() {
  // Color palette
  const colors = {
    gold: "#facc15",
    goldDark: "#eab308",
    goldLight: "#fef3c7",
    navy: "#1e3a5f",
    navyDark: "#0f172a",
    navyLight: "#334155",
  };

  const features = [
    {
      icon: Crown,
      title: "Premium Quality",
      description:
        "Handpicked products that meet our highest standards of excellence",
      gradient: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
    },
    {
      icon: Truck,
      title: "Express Delivery",
      description:
        "Free express shipping on orders over $50, delivered to your door",
      gradient: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`,
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description:
        "Bank-level encryption protecting every transaction you make",
      gradient: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
    },
    {
      icon: Gift,
      title: "Exclusive Rewards",
      description: "Earn points on every purchase and unlock VIP benefits",
      gradient: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`,
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers", suffix: "" },
    { icon: Package, value: "100K+", label: "Products Sold", suffix: "" },
    { icon: Star, value: "4.9", label: "Customer Rating", suffix: "/5" },
    { icon: Award, value: "99%", label: "Satisfaction Rate", suffix: "" },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Fashion Enthusiast",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      text: "Absolutely love the quality and the premium experience. Every purchase feels special!",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Tech Professional",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "The fastest delivery I've ever experienced. Products always arrive in perfect condition.",
      rating: 5,
    },
    {
      name: "Emily Chen",
      role: "Interior Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      text: "Exceptional customer service and the rewards program is fantastic. Highly recommended!",
      rating: 5,
    },
  ];

  const categories = [
    { name: "Electronics", icon: "⚡", count: "2.5K+ Items" },
    { name: "Fashion", icon: "👗", count: "5K+ Items" },
    { name: "Home & Living", icon: "🏠", count: "3K+ Items" },
    { name: "Beauty", icon: "✨", count: "1.8K+ Items" },
  ];

  const { IsAuth } = useSelector((state) => state.auth);

  return (
    <Box minH="100vh" bg="#fafafa" overflow="hidden">
      {/* Hero Section */}
      <Box
        position="relative"
        bg={`linear-gradient(135deg, ${colors.navyDark} 0%, ${colors.navy} 50%, ${colors.navyLight} 100%)`}
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          inset="0"
          opacity="0.05"
          bgImage="radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
          bgSize="40px 40px"
        />

        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="-100px"
          right="-100px"
          w="400px"
          h="400px"
          bg={colors.gold}
          borderRadius="full"
          opacity="0.1"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-150px"
          left="-100px"
          w="500px"
          h="500px"
          bg={colors.gold}
          borderRadius="full"
          opacity="0.08"
          filter="blur(100px)"
        />

        <Container
          maxW="7xl"
          px={{ base: 4, sm: 6, lg: 8 }}
          py={{ base: 16, md: 24, lg: 32 }}
          position="relative"
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 12, lg: 16 }}
            alignItems="center"
          >
            {/* Left Content */}
            <Stack
              gap={{ base: 6, md: 8 }}
              textAlign={{ base: "center", lg: "left" }}
            >
              {/* Premium Badge */}
              <Flex
                justify={{ base: "center", lg: "flex-start" }}
                css={{ animation: "fadeInUp 0.6s ease-out" }}
              >
                <Box
                  bg="rgba(250, 204, 21, 0.15)"
                  border="1px solid"
                  borderColor="rgba(250, 204, 21, 0.3)"
                  color={colors.gold}
                  px={5}
                  py={2.5}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="600"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  backdropFilter="blur(10px)"
                >
                  <Sparkles size={16} />
                  Premium Shopping Experience
                </Box>
              </Flex>

              {/* Main Heading */}
              <Box css={{ animation: "fadeInUp 0.8s ease-out" }}>
                <Heading
                  size={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="800"
                  lineHeight="1.1"
                  mb={6}
                  color="white"
                  letterSpacing="-0.02em"
                >
                  Discover
                  <br />
                  <Text as="span" color={colors.gold}>
                    Luxury
                  </Text>{" "}
                  Redefined
                </Heading>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color="gray.300"
                  maxW="550px"
                  mx={{ base: "auto", lg: 0 }}
                  lineHeight="1.8"
                >
                  Curated collections of premium products, exceptional quality,
                  and an unparalleled shopping experience designed just for you.
                </Text>
              </Box>

              {/* CTA Buttons */}
              <Flex
                gap={4}
                justify={{ base: "center", lg: "flex-start" }}
                flexWrap="wrap"
                css={{ animation: "fadeInUp 1s ease-out" }}
              >
                {IsAuth ? (
                  <Link to="/product">
                    <Button
                      size="lg"
                      bg={colors.gold}
                      color={colors.navyDark}
                      _hover={{
                        bg: colors.goldDark,
                        transform: "translateY(-3px)",
                        boxShadow: `0 20px 40px rgba(250, 204, 21, 0.3)`,
                      }}
                      px={10}
                      py={7}
                      borderRadius="full"
                      fontWeight="700"
                      fontSize="md"
                      boxShadow={`0 10px 30px rgba(250, 204, 21, 0.25)`}
                      transition="all 0.3s ease"
                    >
                      <Flex align="center" gap={2}>
                        Explore Collection
                        <ArrowRight size={18} />
                      </Flex>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button
                        size="lg"
                        bg={colors.gold}
                        color={colors.navyDark}
                        _hover={{
                          bg: colors.goldDark,
                          transform: "translateY(-3px)",
                          boxShadow: `0 20px 40px rgba(250, 204, 21, 0.3)`,
                        }}
                        px={10}
                        py={7}
                        borderRadius="full"
                        fontWeight="700"
                        fontSize="md"
                        boxShadow={`0 10px 30px rgba(250, 204, 21, 0.25)`}
                        transition="all 0.3s ease"
                      >
                        <Flex align="center" gap={2}>
                          Start Shopping
                          <ArrowRight size={18} />
                        </Flex>
                      </Button>
                    </Link>
                    <Link to="/product">
                      <Button
                        size="lg"
                        variant="outline"
                        borderColor="rgba(255,255,255,0.3)"
                        color="white"
                        _hover={{
                          bg: "rgba(255,255,255,0.1)",
                          borderColor: colors.gold,
                          color: colors.gold,
                          transform: "translateY(-3px)",
                        }}
                        px={10}
                        py={7}
                        borderRadius="full"
                        fontWeight="600"
                        fontSize="md"
                        transition="all 0.3s ease"
                      >
                        Browse Products
                      </Button>
                    </Link>
                  </>
                )}
              </Flex>

              {/* Trust Indicators */}
              <Flex
                gap={6}
                align="center"
                justify={{ base: "center", lg: "flex-start" }}
                flexWrap="wrap"
                pt={4}
                css={{ animation: "fadeInUp 1.2s ease-out" }}
              >
                <Flex align="center" gap={2}>
                  <Flex>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        fill={colors.gold}
                        color={colors.gold}
                      />
                    ))}
                  </Flex>
                  <Text fontSize="sm" color="gray.400" fontWeight="500">
                    4.9/5 Rating
                  </Text>
                </Flex>
                <Box
                  w="1px"
                  h="5"
                  bg="gray.600"
                  display={{ base: "none", md: "block" }}
                />
                <Text fontSize="sm" color="gray.400" fontWeight="500">
                  Trusted by 50,000+ Customers
                </Text>
              </Flex>
            </Stack>

            {/* Right Content - Premium Card */}
            <Box
              display={{ base: "none", lg: "block" }}
              position="relative"
              css={{ animation: "float 6s ease-in-out infinite" }}
            >
              {/* Main Card */}
              <Box
                bg="rgba(255, 255, 255, 0.03)"
                backdropFilter="blur(20px)"
                p={8}
                borderRadius="3xl"
                border="1px solid rgba(255, 255, 255, 0.1)"
                boxShadow="0 25px 80px rgba(0, 0, 0, 0.3)"
                position="relative"
                overflow="hidden"
              >
                {/* Card Glow */}
                <Box
                  position="absolute"
                  top="-50%"
                  right="-50%"
                  w="100%"
                  h="100%"
                  bg={`radial-gradient(circle, ${colors.gold}20 0%, transparent 70%)`}
                />

                <Stack gap={6} position="relative">
                  {/* Header */}
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Box
                        bg={`linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`}
                        p={3}
                        borderRadius="xl"
                        boxShadow={`0 8px 20px rgba(250, 204, 21, 0.3)`}
                      >
                        <Crown size={28} color={colors.navyDark} />
                      </Box>
                      <Box>
                        <Text
                          fontSize="xs"
                          color="gray.400"
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          Exclusive
                        </Text>
                        <Heading size="md" color="white">
                          VIP Access
                        </Heading>
                      </Box>
                    </Flex>
                    <Badge
                      bg={colors.gold}
                      color={colors.navyDark}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="700"
                      fontSize="xs"
                    >
                      LIMITED
                    </Badge>
                  </Flex>

                  {/* Featured Product Image */}
                  <Box
                    h="220px"
                    bg={`linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyDark} 100%)`}
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                    border="1px solid rgba(250, 204, 21, 0.2)"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
                      alt="Premium Product"
                      objectFit="cover"
                      w="100%"
                      h="100%"
                      opacity="0.9"
                    />
                    <Box
                      position="absolute"
                      bottom={4}
                      left={4}
                      bg="rgba(0,0,0,0.7)"
                      backdropFilter="blur(10px)"
                      px={4}
                      py={2}
                      borderRadius="xl"
                    >
                      <Text fontSize="sm" color={colors.gold} fontWeight="600">
                        Up to 50% OFF
                      </Text>
                    </Box>
                  </Box>

                  {/* Stats Grid */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <Box
                      textAlign="center"
                      p={4}
                      bg="rgba(250, 204, 21, 0.1)"
                      borderRadius="xl"
                      border="1px solid rgba(250, 204, 21, 0.2)"
                    >
                      <Text fontSize="2xl" fontWeight="800" color={colors.gold}>
                        2K+
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        textTransform="uppercase"
                      >
                        Products
                      </Text>
                    </Box>
                    <Box
                      textAlign="center"
                      p={4}
                      bg="rgba(255, 255, 255, 0.05)"
                      borderRadius="xl"
                      border="1px solid rgba(255, 255, 255, 0.1)"
                    >
                      <Text fontSize="2xl" fontWeight="800" color="white">
                        24/7
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.400"
                        textTransform="uppercase"
                      >
                        Support
                      </Text>
                    </Box>
                  </Grid>
                </Stack>
              </Box>

              {/* Floating Elements */}
              <Box
                position="absolute"
                top="-20px"
                right="-20px"
                bg={colors.gold}
                p={4}
                borderRadius="2xl"
                boxShadow={`0 15px 40px rgba(250, 204, 21, 0.4)`}
                css={{ animation: "pulse 2s ease-in-out infinite" }}
              >
                <Zap size={24} color={colors.navyDark} />
              </Box>
              <Box
                position="absolute"
                bottom="40px"
                left="-30px"
                bg="white"
                p={4}
                borderRadius="2xl"
                boxShadow="0 15px 40px rgba(0, 0, 0, 0.2)"
              >
                <Flex align="center" gap={3}>
                  <Box bg={colors.goldLight} p={2} borderRadius="lg">
                    <Truck size={20} color={colors.navyDark} />
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Free Shipping
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="700"
                      color={colors.navyDark}
                    >
                      On $50+
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={{ base: 16, md: 20 }} bg="white" position="relative">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap={{ base: 6, md: 10 }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                textAlign="center"
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.100"
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
                  borderColor: colors.gold,
                  bg: "white",
                }}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  h="3px"
                  bg={`linear-gradient(90deg, ${colors.gold}, ${colors.goldDark})`}
                  transform="scaleX(0)"
                  transformOrigin="left"
                  transition="transform 0.3s ease"
                  _groupHover={{ transform: "scaleX(1)" }}
                />
                <Flex justify="center" mb={4}>
                  <Box
                    bg={`linear-gradient(135deg, ${colors.navyDark} 0%, ${colors.navy} 100%)`}
                    p={4}
                    borderRadius="xl"
                    boxShadow="0 8px 20px rgba(15, 23, 42, 0.2)"
                  >
                    <stat.icon size={28} color={colors.gold} />
                  </Box>
                </Flex>
                <Heading
                  size={{ base: "xl", md: "2xl" }}
                  mb={2}
                  color={colors.navyDark}
                >
                  {stat.value}
                  <Text as="span" fontSize="lg" color="gray.400">
                    {stat.suffix}
                  </Text>
                </Heading>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="gray.500"
                  fontWeight="500"
                >
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box py={{ base: 16, md: 24 }} bg="#fafafa">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Box textAlign="center" mb={{ base: 12, md: 16 }}>
            <Text
              fontSize="sm"
              fontWeight="700"
              color={colors.gold}
              mb={3}
              textTransform="uppercase"
              letterSpacing="0.2em"
            >
              Shop by Category
            </Text>
            <Heading
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              color={colors.navyDark}
              mb={4}
            >
              Explore Our Collections
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.500"
              maxW="2xl"
              mx="auto"
            >
              Browse through our carefully curated categories to find exactly
              what you're looking for
            </Text>
          </Box>

          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap={{ base: 4, md: 6 }}
          >
            {categories.map((category, index) => (
              <Link to="/product" key={index}>
                <Box
                  bg="white"
                  p={{ base: 6, md: 8 }}
                  borderRadius="2xl"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.100"
                  transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-10px)",
                    boxShadow: `0 25px 50px rgba(15, 23, 42, 0.1)`,
                    borderColor: colors.gold,
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  <Text fontSize="4xl" mb={4}>
                    {category.icon}
                  </Text>
                  <Heading size="md" color={colors.navyDark} mb={2}>
                    {category.name}
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {category.count}
                  </Text>
                </Box>
              </Link>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 16, md: 24 }} bg="white">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Box textAlign="center" mb={{ base: 12, md: 16 }}>
            <Text
              fontSize="sm"
              fontWeight="700"
              color={colors.gold}
              mb={3}
              textTransform="uppercase"
              letterSpacing="0.2em"
            >
              Why Choose Us
            </Text>
            <Heading
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              color={colors.navyDark}
              mb={4}
            >
              The Premium Shopping
              <br />
              <Text as="span" color={colors.gold}>
                Experience
              </Text>
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.500"
              maxW="2xl"
              mx="auto"
            >
              We're committed to providing you with the best shopping
              experience, from product quality to customer service.
            </Text>
          </Box>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={{ base: 6, md: 8 }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.100"
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  transform: "translateY(-10px) scale(1.02)",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)",
                  bg: "white",
                }}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  w="100px"
                  h="100px"
                  bg={feature.gradient}
                  opacity="0.1"
                  borderRadius="full"
                  transform="translate(30%, -30%)"
                />
                <Box
                  bg={feature.gradient}
                  p={4}
                  borderRadius="xl"
                  display="inline-flex"
                  mb={5}
                  boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)"
                >
                  <feature.icon
                    size={28}
                    color={
                      feature.gradient.includes(colors.gold)
                        ? colors.navyDark
                        : colors.gold
                    }
                  />
                </Box>
                <Heading size="md" mb={3} color={colors.navyDark}>
                  {feature.title}
                </Heading>
                <Text fontSize="sm" color="gray.500" lineHeight="1.8">
                  {feature.description}
                </Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        py={{ base: 16, md: 24 }}
        bg={`linear-gradient(135deg, ${colors.navyDark} 0%, ${colors.navy} 100%)`}
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          inset="0"
          opacity="0.03"
          bgImage="radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
          bgSize="40px 40px"
        />

        <Container
          maxW="7xl"
          px={{ base: 4, sm: 6, lg: 8 }}
          position="relative"
        >
          <Box textAlign="center" mb={{ base: 12, md: 16 }}>
            <Text
              fontSize="sm"
              fontWeight="700"
              color={colors.gold}
              mb={3}
              textTransform="uppercase"
              letterSpacing="0.2em"
            >
              Testimonials
            </Text>
            <Heading
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              color="white"
              mb={4}
            >
              What Our Customers Say
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.400"
              maxW="2xl"
              mx="auto"
            >
              Don't just take our word for it - hear from our satisfied
              customers
            </Text>
          </Box>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={{ base: 6, md: 8 }}
          >
            {testimonials.map((testimonial, index) => (
              <Box
                key={index}
                p={{ base: 6, md: 8 }}
                borderRadius="2xl"
                bg="rgba(255, 255, 255, 0.03)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                transition="all 0.4s ease"
                _hover={{
                  transform: "translateY(-8px)",
                  bg: "rgba(255, 255, 255, 0.06)",
                  borderColor: `rgba(250, 204, 21, 0.3)`,
                }}
              >
                {/* Stars */}
                <Flex mb={4}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={colors.gold}
                      color={colors.gold}
                    />
                  ))}
                </Flex>

                {/* Quote */}
                <Text fontSize="md" color="gray.300" lineHeight="1.8" mb={6}>
                  "{testimonial.text}"
                </Text>

                {/* Author */}
                <Flex align="center" gap={4}>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    w="50px"
                    h="50px"
                    borderRadius="full"
                    objectFit="cover"
                    border="2px solid"
                    borderColor={colors.gold}
                  />
                  <Box>
                    <Text fontWeight="600" color="white">
                      {testimonial.name}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {testimonial.role}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        py={{ base: 20, md: 32 }}
        bg="white"
        position="relative"
        overflow="hidden"
      >
        {/* Background Elements */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="800px"
          h="800px"
          bg={`radial-gradient(circle, ${colors.goldLight} 0%, transparent 70%)`}
          opacity="0.5"
        />

        <Container
          maxW="4xl"
          px={{ base: 4, sm: 6, lg: 8 }}
          position="relative"
        >
          <Box
            bg={`linear-gradient(135deg, ${colors.navyDark} 0%, ${colors.navy} 100%)`}
            p={{ base: 10, md: 16 }}
            borderRadius="3xl"
            textAlign="center"
            position="relative"
            overflow="hidden"
            boxShadow="0 30px 80px rgba(15, 23, 42, 0.3)"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-50px"
              right="-50px"
              w="200px"
              h="200px"
              bg={colors.gold}
              borderRadius="full"
              opacity="0.1"
            />
            <Box
              position="absolute"
              bottom="-80px"
              left="-80px"
              w="250px"
              h="250px"
              bg={colors.gold}
              borderRadius="full"
              opacity="0.08"
            />

            <Stack gap={8} position="relative">
              <Box
                display="inline-flex"
                mx="auto"
                bg={`linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`}
                p={4}
                borderRadius="2xl"
                boxShadow={`0 15px 40px rgba(250, 204, 21, 0.3)`}
              >
                <ShoppingBag size={36} color={colors.navyDark} />
              </Box>

              <Heading
                size={{ base: "xl", md: "2xl", lg: "3xl" }}
                color="white"
              >
                Ready to Experience
                <br />
                <Text as="span" color={colors.gold}>
                  Premium Shopping?
                </Text>
              </Heading>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.300"
                maxW="xl"
                mx="auto"
              >
                Join thousands of satisfied customers and discover why Sylvarae is
                the preferred destination for premium products.
              </Text>

              <Flex gap={4} flexWrap="wrap" justify="center">
                {IsAuth ? (
                  <Link to="/product">
                    <Button
                      size="lg"
                      bg={colors.gold}
                      color={colors.navyDark}
                      _hover={{
                        bg: colors.goldDark,
                        transform: "translateY(-3px)",
                        boxShadow: `0 20px 40px rgba(250, 204, 21, 0.35)`,
                      }}
                      px={10}
                      py={7}
                      borderRadius="full"
                      fontWeight="700"
                      fontSize="md"
                      boxShadow={`0 10px 30px rgba(250, 204, 21, 0.25)`}
                      transition="all 0.3s ease"
                    >
                      <Flex align="center" gap={2}>
                        Explore Products
                        <ArrowRight size={18} />
                      </Flex>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button
                      size="lg"
                      bg={colors.gold}
                      color={colors.navyDark}
                      _hover={{
                        bg: colors.goldDark,
                        transform: "translateY(-3px)",
                        boxShadow: `0 20px 40px rgba(250, 204, 21, 0.35)`,
                      }}
                      px={10}
                      py={7}
                      borderRadius="full"
                      fontWeight="700"
                      fontSize="md"
                      boxShadow={`0 10px 30px rgba(250, 204, 21, 0.25)`}
                      transition="all 0.3s ease"
                    >
                      <Flex align="center" gap={2}>
                        Create Free Account
                        <ArrowRight size={18} />
                      </Flex>
                    </Button>
                  </Link>
                )}
              </Flex>

              <Flex
                gap={{ base: 4, md: 8 }}
                align="center"
                color="gray.400"
                flexWrap="wrap"
                justify="center"
                fontSize="sm"
              >
                <Flex align="center" gap={2}>
                  <CheckCircle size={18} color={colors.gold} />
                  <Text>Free Shipping</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Clock size={18} color={colors.gold} />
                  <Text>24/7 Support</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Heart size={18} color={colors.gold} />
                  <Text>50K+ Happy Customers</Text>
                </Flex>
              </Flex>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
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
        `}
      </style>
    </Box>
  );
}

export default Home;
