import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Action_Type } from "../../Redux/Cart_Reducer/action.jsx";
import { Action_Type as Product } from "../../Redux/Product_Reducer/action.jsx";
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiCheck,
  FiPackage,
  FiTruck,
  FiShield,
  FiStar,
} from "react-icons/fi";
import { ArrowLeft, Heart, Share2, AlertCircle } from "lucide-react";
import { toaster } from "../../components/ui/toaster.jsx";
import {
  Spinner,
  Heading,
  Text,
  Box,
  Flex,
  Grid,
  Center,
  Badge,
  Button,
  HStack,
  VStack,
  Image,
  IconButton,
  Stack,
  Separator,
} from "@chakra-ui/react";

function ProductDetail() {
  
  const { id } = useParams();
  
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  
  const [isAdded, setIsAdded] = useState(false);
  
  const [imageLoaded, setImageLoaded] = useState(false);

  const { selectedProduct, IsLoading, IsError } = useSelector(
    (state) => state.product
  );

  const { items } = useSelector((state) => state.cart);

  const { access_token } = useSelector((state) => state.auth);

  // Fetch product details
  const LoadData = useCallback(async () => {
    try {
      dispatch({ type: Product.GET_REQUEST_BY_ID });
      const response = await axios.get(
        `https://slyvarae-ecomm.onrender.com/api/v1/Products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      dispatch({
        type: Product.GET_SUCCESS_BY_ID,
        payload: response?.data?.data,
      });
    } catch (error) {
      console.error("❌ API Error:", error);
      toaster.error({
        title: "Error loading products",
        description:
          error.response?.data?.message || "Failed to fetch products",
      });
      dispatch({
        type: Product.GET_FAILURE_BY_ID,
        payload: error.response?.data?.message,
      });
    }
  }, [dispatch, id, access_token]);

  // Check if item is already in cart
  useEffect(() => {
    if (selectedProduct && items.length > 0) {
      const existingItem = items.find(
        (item) => item._id === selectedProduct._id
      );
      if (existingItem) {
        setIsAdded(true);
      } else {
        setIsAdded(false);
      }
    }
  }, [items, selectedProduct]);

  // Handle quantity increase
  const handleIncreaseQty = () => {
    if (quantity < selectedProduct?.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQty = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    const existingItem = items.find((item) => item._id === selectedProduct._id);

    if (existingItem) {
      const newQuantity = Math.min(
        existingItem.quantity + quantity,
        selectedProduct.stock
      );

      dispatch({
        type: Action_Type.UPDATE_CART_ITEM,
        payload: {
          id: selectedProduct._id,
          updates: { quantity: newQuantity },
        },
      });

      toaster.success({
        title: "Cart updated!",
        description: `Quantity updated to ${newQuantity}`,
        duration: 2000,
      });
    } else {
      dispatch({
        type: Action_Type.ADD_TO_CART,
        payload: { ...selectedProduct, quantity },
      });

      toaster.success({
        title: "Item added successfully!",
        description: `${selectedProduct.name} added to cart`,
        duration: 2000,
      });
    }

    setIsAdded(true);
  };

  // Load data
  useEffect(() => {
    setQuantity(1);
    setImageLoaded(false);
    LoadData();
    setIsAdded(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [LoadData]);

  const productId = selectedProduct?._id ?? selectedProduct?.id;
  const productMatchesRoute =
    productId != null && String(productId) === String(id);

  if (IsLoading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack gap={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Loading product details...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (IsError) {
    return (
      <Center minH="100vh" bg="gray.50" px={4}>
        <VStack gap={4} maxW="md" textAlign="center">
          <AlertCircle size={48} color="#dc2626" />
          <Heading size="lg">Could not load product</Heading>
          <Text color="gray.600">
            The product may not exist or the request failed. Try again or go
            back to the catalog.
          </Text>
          <Flex gap={3} flexWrap="wrap" justify="center">
            <Button colorPalette="purple" onClick={() => LoadData()}>
              Retry
            </Button>
            <Link to="/product">
              <Button variant="outline" colorPalette="purple">
                Back to Products
              </Button>
            </Link>
          </Flex>
        </VStack>
      </Center>
    );
  }

  if (!selectedProduct || !productMatchesRoute) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack gap={4}>
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
            Loading product details...
          </Text>
        </VStack>
      </Center>
    );
  }

  const inStock = selectedProduct?.stock > 0;

  return (
    <Box minH="100vh" py={{ base: 4, md: 8 }} bg="gray.50">
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Breadcrumb Navigation */}
        <Flex
          mb={{ base: 4, md: 6 }}
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={3}
        >
          <Link to="/product" style={{ textDecoration: "none" }}>
            <Button
              variant="ghost"
              colorPalette="purple"
              size={{ base: "sm", md: "md" }}
              leftIcon={<ArrowLeft size={18} />}
              _hover={{
                bg: "purple.50",
                transform: "translateX(-4px)",
              }}
              transition="all 0.2s"
            >
              Back to Products
            </Button>
          </Link>

          {/* Action Buttons */}
          <Flex gap={2} display={{ base: "none", md: "flex" }}>
            <IconButton
              variant="outline"
              colorPalette="gray"
              size="md"
              aria-label="Add to wishlist"
              _hover={{ bg: "red.50", borderColor: "red.400" }}
            >
              <Heart size={18} />
            </IconButton>
            <IconButton
              variant="outline"
              colorPalette="gray"
              size="md"
              aria-label="Share product"
              _hover={{ bg: "blue.50", borderColor: "blue.400" }}
            >
              <Share2 size={18} />
            </IconButton>
          </Flex>
        </Flex>

        {/* Main Product Card */}
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="xl"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 0, lg: 8 }}
          >
            {/* Product Image Section */}
            <Box
              bg="gray.100"
              position="relative"
              minH={{ base: "300px", sm: "400px", md: "500px", lg: "600px" }}
              overflow="hidden"
            >
              {/* Stock Badge Overlay */}
              <Box position="absolute" top={4} left={4} zIndex={2}>
                <Badge
                  colorPalette={inStock ? "green" : "red"}
                  variant="solid"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  boxShadow="md"
                >
                  {inStock
                    ? `${selectedProduct.stock} In Stock`
                    : "Out of Stock"}
                </Badge>
              </Box>

              {/* Category Badge */}
              {selectedProduct?.category && (
                <Box position="absolute" top={4} right={4} zIndex={2}>
                  <Badge
                    colorPalette="purple"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    boxShadow="md"
                  >
                    {selectedProduct.category}
                  </Badge>
                </Box>
              )}

              {/* Product Image */}
              <Flex
                justify="center"
                align="center"
                h="100%"
                p={{ base: 4, md: 8 }}
              >
                <Box
                  position="relative"
                  w="100%"
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {!imageLoaded && (
                    <Spinner size="xl" color="purple.500" position="absolute" />
                  )}
                  <Image
                    src={selectedProduct?.image}
                    alt={selectedProduct?.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                    onLoad={() => setImageLoaded(true)}
                    opacity={imageLoaded ? 1 : 0}
                    transition="opacity 0.3s"
                    borderRadius="lg"
                  />
                </Box>
              </Flex>
            </Box>

            {/* Product Details Section */}
            <Box p={{ base: 6, md: 8, lg: 10 }}>
              <VStack align="stretch" gap={{ base: 4, md: 6 }} h="100%">
                {/* Product Name */}
                <Box>
                  <Heading
                    as="h1"
                    size={{ base: "xl", md: "2xl", lg: "3xl" }}
                    color="gray.900"
                    fontWeight="800"
                    lineHeight="shorter"
                    bgGradient="to-r"
                    gradientFrom="gray.900"
                    gradientTo="gray.700"
                    bgClip="text"
                  >
                    {selectedProduct?.name}
                  </Heading>

                  {/* Rating */}
                  <Flex align="center" gap={2} mt={2}>
                    <Flex gap={1}>
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={16}
                          fill={i < 4 ? "#fbbf24" : "none"}
                          color="#fbbf24"
                        />
                      ))}
                    </Flex>
                    <Text fontSize="sm" color="gray.600">
                      (128 reviews)
                    </Text>
                  </Flex>
                </Box>

                {/* Price */}
                <Box
                  bg="purple.50"
                  p={{ base: 3, md: 4 }}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="purple.200"
                >
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Price
                  </Text>
                  <Text
                    fontSize={{ base: "3xl", md: "4xl" }}
                    fontWeight="bold"
                    bgGradient="to-r"
                    gradientFrom="purple.600"
                    gradientTo="blue.500"
                    bgClip="text"
                  >
                    ${selectedProduct?.price}
                  </Text>
                </Box>

                <Separator />

                {/* Description */}
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.700"
                    mb={2}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Description
                  </Text>
                  <Text
                    color="gray.700"
                    lineHeight="relaxed"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {selectedProduct?.description ||
                      "No description available."}
                  </Text>
                </Box>

                {/* Features */}
                <Grid
                  templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
                  gap={3}
                  py={4}
                >
                  <Flex
                    align="center"
                    gap={3}
                    p={3}
                    bg="blue.50"
                    borderRadius="lg"
                  >
                    <Box color="blue.600">
                      <FiTruck size={20} />
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.600">
                        Free Shipping
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.800"
                      >
                        On orders $50+
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    align="center"
                    gap={3}
                    p={3}
                    bg="green.50"
                    borderRadius="lg"
                  >
                    <Box color="green.600">
                      <FiShield size={20} />
                    </Box>
                    <Box>
                      <Text fontSize="xs" color="gray.600">
                        Secure Payment
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.800"
                      >
                        100% Protected
                      </Text>
                    </Box>
                  </Flex>
                </Grid>

                <Separator />

                {/* Quantity and Cart Section */}
                {inStock ? (
                  <Stack gap={4}>
                    {/* Quantity Selector */}
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color="gray.700"
                        mb={3}
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Quantity
                      </Text>
                      <Flex
                        align="center"
                        gap={3}
                        bg="gray.50"
                        p={2}
                        borderRadius="xl"
                        w="fit-content"
                        border="2px solid"
                        borderColor="gray.200"
                      >
                        <IconButton
                          onClick={handleDecreaseQty}
                          disabled={quantity <= 1}
                          variant="solid"
                          colorPalette="purple"
                          size={{ base: "sm", md: "md" }}
                          aria-label="Decrease quantity"
                          _hover={{
                            transform: "scale(1.1)",
                          }}
                          transition="all 0.2s"
                        >
                          <FiMinus />
                        </IconButton>
                        <Text
                          fontSize={{ base: "xl", md: "2xl" }}
                          fontWeight="bold"
                          minW={{ base: "50px", md: "60px" }}
                          textAlign="center"
                          color="gray.900"
                        >
                          {quantity}
                        </Text>
                        <IconButton
                          onClick={handleIncreaseQty}
                          disabled={quantity >= selectedProduct?.stock}
                          variant="solid"
                          colorPalette="purple"
                          size={{ base: "sm", md: "md" }}
                          aria-label="Increase quantity"
                          _hover={{
                            transform: "scale(1.1)",
                          }}
                          transition="all 0.2s"
                        >
                          <FiPlus />
                        </IconButton>
                      </Flex>
                      <Text fontSize="xs" color="gray.600" mt={2}>
                        Maximum {selectedProduct?.stock} items available
                      </Text>
                    </Box>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      w="full"
                      size={{ base: "lg", md: "xl" }}
                      bgGradient="to-r"
                      gradientFrom={isAdded ? "green.500" : "purple.500"}
                      gradientTo={isAdded ? "green.600" : "blue.500"}
                      color="white"
                      leftIcon={isAdded ? <FiCheck /> : <FiShoppingCart />}
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "xl",
                      }}
                      transition="all 0.2s"
                      fontWeight="600"
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      {isAdded ? "Added to Cart" : "Add to Cart"}
                    </Button>

                    {/* View Cart Button */}
                    {isAdded && (
                      <Link to="/cart" style={{ width: "100%" }}>
                        <Button
                          w="full"
                          variant="outline"
                          colorPalette="purple"
                          size={{ base: "lg", md: "xl" }}
                          _hover={{
                            bg: "purple.50",
                            transform: "translateY(-2px)",
                          }}
                          transition="all 0.2s"
                        >
                          View Cart ({items.length} items)
                        </Button>
                      </Link>
                    )}
                  </Stack>
                ) : (
                  <Box
                    p={4}
                    bg="red.50"
                    border="2px solid"
                    borderColor="red.200"
                    borderRadius="xl"
                  >
                    <Flex align="center" gap={3}>
                      <AlertCircle size={24} color="#dc2626" />
                      <Box>
                        <Text
                          color="red.700"
                          fontWeight="bold"
                          fontSize={{ base: "sm", md: "md" }}
                        >
                          Out of Stock
                        </Text>
                        <Text color="red.600" fontSize="sm">
                          This product is currently unavailable. Check back
                          later!
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                )}

                {/* Mobile Action Buttons */}
                <Flex gap={2} display={{ base: "flex", md: "none" }} mt={4}>
                  <Button
                    flex={1}
                    variant="outline"
                    colorPalette="gray"
                    leftIcon={<Heart size={18} />}
                  >
                    Wishlist
                  </Button>
                  <Button
                    flex={1}
                    variant="outline"
                    colorPalette="gray"
                    leftIcon={<Share2 size={18} />}
                  >
                    Share
                  </Button>
                </Flex>
              </VStack>
            </Box>
          </Grid>
        </Box>

        {/* Additional Information Section */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={{ base: 4, md: 6 }}
          mt={{ base: 6, md: 8 }}
        >
          <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Flex align="center" gap={3} mb={3}>
              <Box bg="purple.100" p={3} borderRadius="lg">
                <FiPackage size={24} color="#7c3aed" />
              </Box>
              <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
                Easy Returns
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600">
              30-day return policy for your peace of mind
            </Text>
          </Box>

          <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Flex align="center" gap={3} mb={3}>
              <Box bg="blue.100" p={3} borderRadius="lg">
                <FiTruck size={24} color="#3b82f6" />
              </Box>
              <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
                Fast Delivery
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600">
              Express shipping available on all orders
            </Text>
          </Box>

          <Box
            bg="white"
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <Flex align="center" gap={3} mb={3}>
              <Box bg="green.100" p={3} borderRadius="lg">
                <FiShield size={24} color="#22c55e" />
              </Box>
              <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }}>
                Warranty
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.600">
              1-year manufacturer warranty included
            </Text>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}

export default ProductDetail;
