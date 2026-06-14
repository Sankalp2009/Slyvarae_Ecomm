import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  Grid,
  Badge,
  Spinner,
  Center,
  Separator,
} from "@chakra-ui/react";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "../../components/ui/accordion";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  CheckCircle,
  Truck,
  ArrowLeft,
  PackageCheck,
  Clock,
  CircleDashed
} from "lucide-react";


import { useSelector } from "react-redux";

const getOrderDisplayTotal = (order) => {
  if (
    typeof order.subtotal === "number" &&
    typeof order.tax === "number" &&
    typeof order.shipping === "number"
  ) {
    return order.subtotal + order.tax + order.shipping;
  }

  if (Array.isArray(order.items) && order.items.length > 0) {
    const subtotal = order.items.reduce(
      (acc, item) =>
        acc + (Number(item.price) || 0) * (item.quantity || 1),
      0
    );
    const tax = subtotal * 0.1;
    const shipping = subtotal > 50 ? 0 : 10;
    return subtotal + tax + shipping;
  }

  return typeof order.totalAmount === "number" ? order.totalAmount : 0;
};

function Order() {
  const navigate = useNavigate();
  
  const { Order } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  const myOrders = useMemo(
    () => Order.filter((order) => order.userId === user?._id),
    [Order, user?._id]
  );

  const { items } = useSelector((state) => state.cart);
  
  const CartCount = items.length;
  
  const [filter, setFilter] = useState("all");

  
  // eslint-disable-next-line no-unused-vars
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending",
        color: "orange",
        icon: CircleDashed,
        description: "Your order is pending",
      },
      processing: {
        label: "Processing",
        color: "blue",
        icon: Clock,
        description: "Your order is being prepared",
      },
      shipped: {
        label: "Shipped",
        color: "purple",
        icon: Truck,
        description: "Your order is on the way",
      },
      delivered: {
        label: "Delivered",
        color: "green",
        icon: PackageCheck,
        description: "Order delivered successfully",
      },
      cancelled: {
        label: "Cancelled",
        color: "red",
        icon: Package,
        description: "Order was cancelled",
      },
    };
    return configs[status] || configs.processing;
  };

  const filterData = myOrders.filter((el) => {
    if (filter === "all") return true;
    return el.status === filter;
  });

  const orderCounts = {
    all: myOrders.length,
    pending: myOrders.filter((o) => o.status === "pending").length,
    processing: myOrders.filter((o) => o.status === "processing").length,
    shipped: myOrders.filter((o) => o.status === "shipped").length,
    delivered: myOrders.filter((o) => o.status === "delivered").length,
  };

  if (myOrders.length === 0) {
    return (
      <Flex minH="80vh" justify="center" align="center" textAlign="center" px={4}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          p={{ base: 6, md: 8 }}
          gap={5}
          maxW="500px"
          w="100%"
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
        >
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={6}
            borderRadius="full"
            boxShadow="0 8px 20px rgba(102, 126, 234, 0.3)"
          >
            <Package size={48} color="white" strokeWidth={1.5} />
          </Box>
          
          <Heading 
            size={{ base: "xl", md: "2xl" }} 
            bgGradient="to-r"
            gradientFrom="purple.600"
            gradientTo="blue.500"
            bgClip="text"
          >
            No orders yet
          </Heading>
          
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            Looks like you haven't Placed any Order yet.
          </Text>
          
          <Button
            onClick={() => navigate("/")}
            bgGradient="to-r"
            gradientFrom="purple.500"
            gradientTo="blue.500"
            color="white"
            size={{ base: "md", md: "lg" }}
            w={{ base: "full", sm: "auto" }}
            px={8}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
            leftIcon={<ArrowLeft size={18} />}
          >
            Start Shopping
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" py={8} bgColor="#f0f2f7">
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
          <Box>
            <Heading size="3xl" fontWeight="bold" mb={2}>
              My Orders
            </Heading>
            <Text color="gray.600">
              Track and manage your orders
            </Text>
          </Box>
          <Button
            colorPalette="blue"
            onClick={() => navigate("/product")}
            leftIcon={<ShoppingBag size={18} />}
          >
            Continue Shopping
          </Button>
        </Flex>

        {/* Filter Tabs */}
        <Flex
          gap={3}
          mb={6}
          overflowX="auto"
          pb={2}
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {[
            { key: "all", label: "All Orders" },
            { key: "pending", label: "Pending" },
            { key: "processing", label: "Processing" },
            { key: "shipped", label: "Shipped" },
            { key: "delivered", label: "Delivered" },
          ].map((tab) => (
            <Button
              key={tab.key}
              size="sm"
              variant={filter === tab.key ? "solid" : "outline"}
              colorPalette={filter === tab.key ? "blue" : "gray"}
              onClick={() => setFilter(tab.key)}
              minW="fit-content"
            >
              {tab.label} ({orderCounts[tab.key]})
            </Button>
          ))}
        </Flex>

        {/* Orders List */}
        {filterData.length === 0 ? (
          <Center
            bg="white"
            borderRadius="lg"
            p={12}
            flexDirection="column"
            gap={4}
          >
            <Package size={64} color="#9CA3AF" />
            <Heading size="lg" color="gray.600">
              No orders found
            </Heading>
            <Text color="gray.500" textAlign="center">
              {filter === "all"
                ? "You haven't placed any orders yet"
                : `No ${filter} orders at the moment`}
            </Text>
            <Button colorPalette="blue" onClick={() => navigate("/product")} mt={4}>
              Start Shopping
            </Button>
          </Center>
        ) : (
          <Box spaceY={4}>
            {filterData.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Box
                  key={order.id}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="md"
                  overflow="hidden"
                  _hover={{ boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  {/* Order Header */}
                  <Flex
                    justify="space-between"
                    align="center"
                    p={6}
                    bg="gray.50"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    flexWrap="wrap"
                    gap={4}
                  >
                    <Flex align="center" gap={4} flexWrap="wrap">
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>
                          Order ID
                        </Text>
                        <Text fontWeight="bold" fontSize="lg">
                          {order.id}
                        </Text>
                      </Box>
                      <Separator orientation="vertical" h="40px" display={{ base: "none", md: "block" }} />
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>
                          Date
                        </Text>
                        <Flex align="center" gap={1}>
                          <Calendar size={16} />
                          <Text fontWeight="medium">
                            {new Date().toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </Text>
                        </Flex>
                      </Box>
                      <Separator orientation="vertical" h="40px" display={{ base: "none", md: "block" }} />
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>
                          Total
                        </Text>
                        <Text fontWeight="bold" fontSize="lg" color="green.600">
                          ${getOrderDisplayTotal(order).toFixed(2)}
                        </Text>
                      </Box>
                    </Flex>

                    <Badge
                      colorPalette={statusConfig.color}
                      px={4}
                      py={2}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <StatusIcon size={16} />
                      {statusConfig.label}
                    </Badge>
                  </Flex>

                  {/* Order Details */}
                  <AccordionRoot collapsible>
                    <AccordionItem value={order.id}>
                      <AccordionItemTrigger p={6} cursor="pointer">
                        <Flex align="center" gap={2} flex={1}>
                          <Package size={20} color="#6B7280" />
                          <Text fontWeight="medium">
                            {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                          </Text>
                        </Flex>
                      </AccordionItemTrigger>

                      <AccordionItemContent>
                        <Box px={6} pb={6}>
                          {/* Items List */}
                          <Box mb={6}>
                            <Heading size="sm" mb={4} color="gray.700">
                              Order Items
                            </Heading>
                            <Box spaceY={3}>
                              {order.items.map((item) => (
                                <Flex
                                  key={item.productId}
                                  gap={4}
                                  p={3}
                                  bg="gray.50"
                                  borderRadius="md"
                                  align="center"
                                >
                                  <Box
                                    w="60px"
                                    h="60px"
                                    borderRadius="md"
                                    overflow="hidden"
                                    bg="gray.200"
                                    flexShrink={0}
                                  >
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  </Box>
                                  <Box flex={1}>
                                    <Text fontWeight="medium" mb={1}>
                                      {item.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                      Quantity: {item.quantity}
                                    </Text>
                                  </Box>
                                  <Text fontWeight="bold" color="gray.900">
                                    ${Math.floor((item.price * item.quantity).toFixed(2))}
                                  </Text>
                                </Flex>
                              ))}
                            </Box>
                          </Box>

                          <Grid
                            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                            gap={6}
                          >
                            {/* Shipping Address */}
                            <Box>
                              <Heading size="sm" mb={3} color="gray.700">
                                Shipping Address
                              </Heading>
                              <Box
                                p={4}
                                bg="blue.50"
                                borderRadius="md"
                                border="1px solid"
                                borderColor="blue.200"
                              >
                                <Flex align="start" gap={2} mb={2}>
                                  <MapPin size={18} color="#3B82F6" />
                                  <Box>
                                    <Text fontWeight="bold" mb={1}>
                                      {order.shippingAddress.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.700">
                                      {order.shippingAddress.address}
                                    </Text>
                                    <Text fontSize="sm" color="gray.700">
                                      {order.shippingAddress.city},{" "}
                                      {order.shippingAddress.state}{" "}
                                      {order.shippingAddress.zipCode}
                                    </Text>
                                    <Text fontSize="sm" color="gray.700" mt={2}>
                                      📞 {order.shippingAddress.phone}
                                    </Text>
                                  </Box>
                                </Flex>
                              </Box>
                            </Box>

                            {/* Order Status & Tracking */}
                            <Box>
                              <Heading size="sm" mb={3} color="gray.700">
                                Order Status
                              </Heading>
                              <Box
                                p={4}
                                bg={`${statusConfig.color}.50`}
                                borderRadius="md"
                                border="1px solid"
                                borderColor={`${statusConfig.color}.200`}
                              >
                                <Flex align="center" gap={2} mb={2}>
                                  <StatusIcon size={20} color={`${statusConfig.color}.600`} />
                                  <Text fontWeight="bold" color={`${statusConfig.color}.900`}>
                                    {statusConfig.label}
                                  </Text>
                                </Flex>
                                <Text fontSize="sm" color="gray.700" mb={3}>
                                  {statusConfig.description}
                                </Text>
                                {/* {order.tracking && (
                                  <Box>
                                    <Text fontSize="xs" color="gray.600" mb={1}>
                                      Tracking Number:
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      fontWeight="bold"
                                      color="gray.900"
                                      fontFamily="mono"
                                    >
                                      {order.id}
                                    </Text>
                                  </Box>
                                )} */}
                              </Box>
                            </Box>
                          </Grid>

                          {/* Action Buttons */}
                          <Flex gap={3} mt={6} flexWrap="wrap">
                            {order.status === "delivered" && (
                              <Button
                                colorPalette="blue"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/products`)}
                              >
                                Buy Again
                              </Button>
                            )}
                            {/* {order.tracking && (
                              <Button
                                colorPalette="green"
                                variant="outline"
                                size="sm"
                                onClick={() => alert(`Tracking: ${order.tracking}`)}
                              >
                                Track Order
                              </Button>
                            )} */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alert("Download invoice")}
                            >
                              Download Invoice
                            </Button>
                          </Flex>
                        </Box>
                      </AccordionItemContent>
                    </AccordionItem>
                  </AccordionRoot>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Order;