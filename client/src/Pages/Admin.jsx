import React, { useState, useEffect } from "react";
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
  Input,
  Table,
  IconButton,
  Container,
  Stack,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
} from "../components/ui/dialog.jsx";
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "../components/ui/menu";
import { Toaster, toaster } from "../components/ui/toaster";
import {
  Package,
  Calendar,
  ShoppingBag,
  CheckCircle,
  Truck,
  PackageCheck,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { updateOrderStatus } from "../Redux/Order_Reducer/action.jsx";
import { useDispatch } from "react-redux";

const API_BASE_URL = "https://slyvarae-ecomm.onrender.com/api/v1";

function Admin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Order } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user?.role !== "admin" && user?.role !== "Admin") {
      toaster.error({
        title: "Access Denied",
        description: "You don't have permission to access this page",
      });
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsRes = await axios.get(`${API_BASE_URL}/Products?limit=100`);
      const productsData = productsRes.data?.data || [];
      setProducts(productsData);

      // Calculate stats
      const totalOrders = Order.length;
      const totalRevenue = Order.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const totalProducts = productsData.length;
      const uniqueUsers = new Set(Order.map((o) => o.userId)).size;

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers: uniqueUsers,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toaster.error({
        title: "Error",
        description: "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      processing: { label: "Processing", color: "blue", icon: Clock },
      shipped: { label: "Shipped", color: "purple", icon: Truck },
      delivered: { label: "Delivered", color: "green", icon: PackageCheck },
      cancelled: { label: "Cancelled", color: "red", icon: Package },
    };
    return configs[status] || configs.processing;
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      dispatch(updateOrderStatus(orderId, newStatus));

      toaster.success({
        title: "Order Updated",
        description: `Order #${orderId} marked as ${newStatus}`,
      });

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
      toaster.error({
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/Products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toaster.success({
        title: "Product Deleted",
        description: "Product has been removed successfully",
      });
    } catch (error) {
      toaster.error({
        title: "Error",
        description: "Failed to delete product",
        message: error,
      });
    }
  };

  const filteredOrders = Order.filter((el) => {
    if (statusFilter === "all") return true;
    return el.status === statusFilter;
  });

  const recentOrders = [...Order]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <Center minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
        <Stack align="center" gap={4}>
          <Spinner size="xl" color="white" thickness="4px" />
          <Text color="white" fontSize="lg" fontWeight="medium">
            Loading dashboard...
          </Text>
        </Stack>
      </Center>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Box
      bg="white"
      p={{ base: 4, sm: 5, md: 6 }}
      borderRadius="2xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        w="100px"
        h="100px"
        bg={`${color}.50`}
        borderRadius="full"
        opacity="0.5"
      />
      <Flex justify="space-between" align="start" mb={3} position="relative">
        <Box>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="gray.600" mb={1} fontWeight="medium">
            {title}
          </Text>
          <Heading size={{ base: "xl", sm: "2xl" }} fontWeight="bold" color="gray.800">
            {value}
          </Heading>
        </Box>
        <Box
          bg={`${color}.100`}
          p={{ base: 2, sm: 3 }}
          borderRadius="xl"
          boxShadow="sm"
        >
          <Icon size={24} color={`var(--chakra-colors-${color}-600)`} />
        </Box>
      </Flex>
      <Flex align="center" gap={1}>
        <TrendingUp size={14} color="#10B981" />
        <Text fontSize="xs" color="green.600" fontWeight="medium">
          {trend}
        </Text>
      </Flex>
    </Box>
  );

  return (
    <Box minH="100vh" bg="linear-gradient(to bottom, #f8fafc, #e2e8f0)">
      <Toaster />
      
      {/* Enhanced Header with Gradient */}
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        position="sticky"
        top="0"
        zIndex="100"
      >
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <Box
                bg="white"
                p={2}
                borderRadius="lg"
                boxShadow="md"
                display={{ base: "none", md: "block" }}
              >
                <ShoppingBag size={24} color="#667eea" />
              </Box>
              <Box>
                <Heading
                  size={{ base: "md", sm: "lg", md: "xl" }}
                  color="white"
                  fontWeight="bold"
                >
                  Admin Dashboard
                </Heading>
                <Text color="whiteAlpha.900" fontSize={{ base: "xs", sm: "sm" }} display={{ base: "none", sm: "block" }}>
                  Manage your store efficiently
                </Text>
              </Box>
            </Flex>

            {/* Desktop Actions */}
            <Flex gap={2} display={{ base: "none", md: "flex" }}>
              <Button
                leftIcon={<RefreshCw size={18} />}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={fetchDashboardData}
                size={{ base: "sm", md: "md" }}
              >
                Refresh
              </Button>
              <Button
                leftIcon={<Plus size={18} />}
                bg="white"
                color="purple.600"
                _hover={{ bg: "whiteAlpha.900" }}
                onClick={() => navigate("/admin/products/new")}
                boxShadow="md"
                size={{ base: "sm", md: "md" }}
              >
                Add Product
              </Button>
            </Flex>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </Flex>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <Stack mt={4} gap={2} display={{ base: "flex", md: "none" }}>
              <Button
                leftIcon={<RefreshCw size={18} />}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={fetchDashboardData}
                size="sm"
                w="full"
              >
                Refresh
              </Button>
              <Button
                leftIcon={<Plus size={18} />}
                bg="white"
                color="purple.600"
                _hover={{ bg: "whiteAlpha.900" }}
                onClick={() => navigate("/admin/products/new")}
                size="sm"
                w="full"
              >
                Add Product
              </Button>
            </Stack>
          )}
        </Container>
      </Box>

      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 6, md: 8 }}>
        {/* Enhanced Stats Cards */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={{ base: 4, sm: 5, md: 6 }}
          mb={{ base: 6, md: 8 }}
        >
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBag}
            color="blue"
            trend="+12% from last month"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="green"
            trend="+8% from last month"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="purple"
            trend="+5 new this week"
          />
          <StatCard
            title="Customers"
            value={stats.totalCustomers}
            icon={Users}
            color="orange"
            trend="+3 new today"
          />
        </Grid>

        {/* Enhanced Tabs with Pills Design */}
        <Flex
          gap={2}
          mb={6}
          overflowX="auto"
          pb={2}
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {[
            { key: "overview", label: "Overview" },
            { key: "orders", label: "Orders" },
            { key: "products", label: "Products" },
          ].map((tab) => (
            <Button
              key={tab.key}
              size={{ base: "sm", md: "md" }}
              variant={activeTab === tab.key ? "solid" : "ghost"}
              bg={activeTab === tab.key ? "purple.600" : "white"}
              color={activeTab === tab.key ? "white" : "gray.700"}
              _hover={{
                bg: activeTab === tab.key ? "purple.700" : "gray.100",
              }}
              onClick={() => setActiveTab(tab.key)}
              borderRadius="full"
              fontWeight="medium"
              px={{ base: 4, md: 6 }}
              boxShadow={activeTab === tab.key ? "md" : "sm"}
              transition="all 0.2s"
            >
              {tab.label}
            </Button>
          ))}
        </Flex>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <Box>
            <Heading size={{ base: "md", md: "lg" }} mb={4} color="gray.800">
              Recent Orders
            </Heading>
            <Box
              bg="white"
              borderRadius="2xl"
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              overflow="hidden"
            >
              {/* Desktop Table */}
              <Box display={{ base: "none", lg: "block" }}>
                <Table.Root variant="line" size="sm">
                  <Table.Header>
                    <Table.Row bg="gray.50">
                      <Table.ColumnHeader fontWeight="bold">Order ID</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Customer</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Date</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Status</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Total</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                          <Table.Row key={order.id} _hover={{ bg: "gray.50" }}>
                            <Table.Cell fontWeight="medium">{order.id}</Table.Cell>
                            <Table.Cell>{order.shippingAddress?.fullName || "N/A"}</Table.Cell>
                            <Table.Cell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell>
                              <Badge colorPalette={statusConfig.color} size="sm" borderRadius="full">
                                {statusConfig.label}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell fontWeight="bold" color="green.600">
                              ${order.totalAmount.toFixed(2)}
                            </Table.Cell>
                            <Table.Cell>
                              <IconButton
                                size="sm"
                                variant="ghost"
                                colorPalette="purple"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderModalOpen(true);
                                }}
                              >
                                <Eye size={16} />
                              </IconButton>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })
                    ) : (
                      <Table.Row>
                        <Table.Cell colSpan={6} textAlign="center" py={8}>
                          <Text color="gray.500">No orders yet</Text>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Mobile Cards */}
              <Stack gap={3} p={4} display={{ base: "flex", lg: "none" }}>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <Box
                        key={order.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="xl"
                        borderColor="gray.200"
                        _hover={{ borderColor: "purple.300", boxShadow: "md" }}
                        transition="all 0.2s"
                      >
                        <Flex justify="space-between" align="start" mb={3}>
                          <Box>
                            <Text fontSize="xs" color="gray.500">Order ID</Text>
                            <Text fontWeight="bold" fontSize="sm">{order.id}</Text>
                          </Box>
                          <Badge colorPalette={statusConfig.color} size="sm" borderRadius="full">
                            {statusConfig.label}
                          </Badge>
                        </Flex>
                        <Text fontSize="sm" mb={2}>{order.shippingAddress?.fullName || "N/A"}</Text>
                        <Flex justify="space-between" align="center">
                          <Text fontSize="xs" color="gray.500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Text>
                          <Flex gap={2} align="center">
                            <Text fontWeight="bold" color="green.600">
                              ${order.totalAmount.toFixed(2)}
                            </Text>
                            <IconButton
                              size="xs"
                              variant="ghost"
                              colorPalette="purple"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderModalOpen(true);
                              }}
                            >
                              <Eye size={14} />
                            </IconButton>
                          </Flex>
                        </Flex>
                      </Box>
                    );
                  })
                ) : (
                  <Center py={8}>
                    <Text color="gray.500">No orders yet</Text>
                  </Center>
                )}
              </Stack>
            </Box>
          </Box>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <Box>
            <Flex
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              mb={4}
              flexDir={{ base: "column", md: "row" }}
              gap={3}
            >
              <Heading size={{ base: "md", md: "lg" }} color="gray.800">
                All Orders
              </Heading>
              <Flex
                gap={2}
                overflowX="auto"
                pb={{ base: 2, md: 0 }}
                css={{
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                {["all", "processing", "shipped", "delivered"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? "solid" : "ghost"}
                    bg={statusFilter === status ? "purple.600" : "white"}
                    color={statusFilter === status ? "white" : "gray.700"}
                    _hover={{
                      bg: statusFilter === status ? "purple.700" : "gray.100",
                    }}
                    onClick={() => setStatusFilter(status)}
                    borderRadius="full"
                    minW="max-content"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </Flex>
            </Flex>

            <Box
              bg="white"
              borderRadius="2xl"
              boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              overflow="hidden"
            >
              {/* Desktop Table */}
              <Box display={{ base: "none", lg: "block" }} overflowX="auto">
                <Table.Root variant="line" size="sm">
                  <Table.Header>
                    <Table.Row bg="gray.50">
                      <Table.ColumnHeader fontWeight="bold">Order ID</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Customer</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Items</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Date</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Status</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Total</Table.ColumnHeader>
                      <Table.ColumnHeader fontWeight="bold">Actions</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                          <Table.Row key={order.id} _hover={{ bg: "gray.50" }}>
                            <Table.Cell fontWeight="medium">{order.id}</Table.Cell>
                            <Table.Cell>
                              {order.shippingAddress?.fullName || "N/A"}
                              <br />
                              <Text fontSize="xs" color="gray.500">
                                {order.shippingAddress?.email || ""}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>{order.items?.length || 0} items</Table.Cell>
                            <Table.Cell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell>
                              <MenuRoot>
                                <MenuTrigger asChild>
                                  <Button
                                    size="xs"
                                    colorPalette={statusConfig.color}
                                    variant="subtle"
                                    borderRadius="full"
                                  >
                                    {statusConfig.label}
                                  </Button>
                                </MenuTrigger>
                                <MenuContent>
                                  <MenuItem
                                    value="processing"
                                    onClick={() =>
                                      handleUpdateOrderStatus(order.id, "processing")
                                    }
                                  >
                                    Processing
                                  </MenuItem>
                                  <MenuItem
                                    value="shipped"
                                    onClick={() =>
                                      handleUpdateOrderStatus(order.id, "shipped")
                                    }
                                  >
                                    Shipped
                                  </MenuItem>
                                  <MenuItem
                                    value="delivered"
                                    onClick={() =>
                                      handleUpdateOrderStatus(order.id, "delivered")
                                    }
                                  >
                                    Delivered
                                  </MenuItem>
                                  <MenuItem
                                    value="cancelled"
                                    onClick={() =>
                                      handleUpdateOrderStatus(order.id, "cancelled")
                                    }
                                  >
                                    Cancelled
                                  </MenuItem>
                                </MenuContent>
                              </MenuRoot>
                            </Table.Cell>
                            <Table.Cell fontWeight="bold" color="green.600">
                              ${order.totalAmount.toFixed(2)}
                            </Table.Cell>
                            <Table.Cell>
                              <IconButton
                                size="sm"
                                variant="ghost"
                                colorPalette="purple"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderModalOpen(true);
                                }}
                              >
                                <Eye size={16} />
                              </IconButton>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })
                    ) : (
                      <Table.Row>
                        <Table.Cell colSpan={7} textAlign="center" py={8}>
                          <Text color="gray.500">No orders found</Text>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>

              {/* Mobile Cards */}
              <Stack gap={3} p={4} display={{ base: "flex", lg: "none" }}>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    return (
                      <Box
                        key={order.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="xl"
                        borderColor="gray.200"
                        _hover={{ borderColor: "purple.300", boxShadow: "md" }}
                        transition="all 0.2s"
                      >
                        <Flex justify="space-between" align="start" mb={3}>
                          <Box flex="1">
                            <Text fontSize="xs" color="gray.500">Order ID</Text>
                            <Text fontWeight="bold" fontSize="sm" mb={1}>{order.id}</Text>
                            <Text fontSize="sm">{order.shippingAddress?.fullName || "N/A"}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {order.shippingAddress?.email || ""}
                            </Text>
                          </Box>
                          <MenuRoot>
                            <MenuTrigger asChild>
                              <Button
                                size="xs"
                                colorPalette={statusConfig.color}
                                variant="subtle"
                                borderRadius="full"
                              >
                                {statusConfig.label}
                              </Button>
                            </MenuTrigger>
                            <MenuContent>
                              <MenuItem
                                value="processing"
                                onClick={() =>
                                  handleUpdateOrderStatus(order.id, "processing")
                                }
                              >
                                Processing
                              </MenuItem>
                              <MenuItem
                                value="shipped"
                                onClick={() =>
                                  handleUpdateOrderStatus(order.id, "shipped")
                                }
                              >
                                Shipped
                              </MenuItem>
                              <MenuItem
                                value="delivered"
                                onClick={() =>
                                  handleUpdateOrderStatus(order.id, "delivered")
                                }
                              >
                                Delivered
                              </MenuItem>
                              <MenuItem
                                value="cancelled"
                                onClick={() =>
                                  handleUpdateOrderStatus(order.id, "cancelled")
                                }
                              >
                                Cancelled
                              </MenuItem>
                            </MenuContent>
                          </MenuRoot>
                        </Flex>
                        <Flex justify="space-between" align="center" mt={3} pt={3} borderTop="1px" borderColor="gray.200">
                          <Box>
                            <Text fontSize="xs" color="gray.500">
                              {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                            </Text>
                          </Box>
                          <Flex gap={2} align="center">
                            <Text fontWeight="bold" color="green.600">
                              ${order.totalAmount.toFixed(2)}
                            </Text>
                            <IconButton
                              size="xs"
                              variant="ghost"
                              colorPalette="purple"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderModalOpen(true);
                              }}
                            >
                              <Eye size={14} />
                            </IconButton>
                          </Flex>
                        </Flex>
                      </Box>
                    );
                  })
                ) : (
                  <Center py={8}>
                    <Text color="gray.500">No orders found</Text>
                  </Center>
                )}
              </Stack>
            </Box>
          </Box>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <Box>
            <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={3}>
              <Heading size={{ base: "md", md: "lg" }} color="gray.800">
                All Products
              </Heading>
              <Button
                leftIcon={<Plus size={18} />}
                bg="purple.600"
                color="white"
                _hover={{ bg: "purple.700" }}
                onClick={() => navigate("/admin/products/new")}
                size={{ base: "sm", md: "md" }}
                borderRadius="full"
                boxShadow="md"
              >
                Add Product
              </Button>
            </Flex>

            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={{ base: 4, sm: 5, md: 6 }}
            >
              {products.map((product) => (
                <Box
                  key={product._id}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  overflow="hidden"
                  transition="all 0.3s cubic-bezier(0.4, 0,0.2, 1)"
                  _hover={{
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <Box h={{ base: "180px", sm: "200px" }} bg="gray.100" position="relative" overflow="hidden">
                    <img
                      src={product.image || "https://via.placeholder.com/300"}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <Box
                      position="absolute"
                      top="2"
                      right="2"
                      bg="white"
                      px={2}
                      py={1}
                      borderRadius="full"
                      boxShadow="md"
                    >
                      <Badge colorPalette="purple" size="sm" borderRadius="full">
                        {product.category}
                      </Badge>
                    </Box>
                  </Box>
                  <Box p={{ base: 3, sm: 4 }}>
                    <Heading
                      size={{ base: "xs", sm: "sm" }}
                      mb={2}
                      noOfLines={1}
                      color="gray.800"
                    >
                      {product.name}
                    </Heading>
                    <Text
                      fontSize={{ base: "xs", sm: "sm" }}
                      color="gray.600"
                      mb={3}
                      noOfLines={2}
                      minH={{ base: "32px", sm: "40px" }}
                    >
                      {product.description}
                    </Text>
                    <Flex justify="space-between" align="center" mb={3}>
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: "lg", sm: "xl" }}
                        color="green.600"
                      >
                        ${product.price}
                      </Text>
                    </Flex>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        flex={1}
                        variant="outline"
                        colorPalette="purple"
                        borderRadius="full"
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                        _hover={{ bg: "purple.50" }}
                      >
                        <Edit size={14} style={{ marginRight: 4 }} />
                        Edit
                      </Button>
                      <IconButton
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        borderRadius="full"
                        onClick={() => handleDeleteProduct(product._id)}
                        _hover={{ bg: "red.50" }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </Grid>

            {products.length === 0 && (
              <Center
                bg="white"
                p={{ base: 8, md: 12 }}
                borderRadius="2xl"
                boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              >
                <Stack align="center" gap={3}>
                  <Box
                    bg="purple.100"
                    p={4}
                    borderRadius="full"
                  >
                    <Package size={48} color="#9333ea" />
                  </Box>
                  <Heading size={{ base: "sm", md: "md" }} color="gray.700">
                    No products found
                  </Heading>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Start by adding your first product
                  </Text>
                  <Button
                    leftIcon={<Plus size={18} />}
                    bg="purple.600"
                    color="white"
                    _hover={{ bg: "purple.700" }}
                    onClick={() => navigate("/admin/products/new")}
                    mt={2}
                    borderRadius="full"
                  >
                    Add Product
                  </Button>
                </Stack>
              </Center>
            )}
          </Box>
        )}
      </Container>

      {/* Enhanced Order Details Modal */}
      <DialogRoot
        open={isOrderModalOpen}
        onOpenChange={(e) => setIsOrderModalOpen(e.open)}
        size={{ base: "full", md: "lg" }}
      >
        <DialogContent borderRadius={{ base: "0", md: "2xl" }} mx={{ base: 0, md: 4 }}>
          <DialogHeader bg="purple.600" color="white" p={{ base: 4, md: 6 }} borderTopRadius={{ base: "0", md: "2xl" }}>
            <DialogTitle fontSize={{ base: "lg", md: "xl" }}>
              Order Details - #{selectedOrder?.id}
            </DialogTitle>
            <DialogCloseTrigger color="white" />
          </DialogHeader>
          <DialogBody p={{ base: 4, md: 6 }}>
            {selectedOrder && (
              <Stack gap={4}>
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4}>
                  <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text fontSize="xs" color="gray.600" mb={2} fontWeight="medium">
                      Customer
                    </Text>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mb={1}>
                      {selectedOrder.shippingAddress?.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {selectedOrder.shippingAddress?.email}
                    </Text>
                  </Box>
                  <Box
                    p={4}
                    bg="gray.50"
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Text fontSize="xs" color="gray.600" mb={2} fontWeight="medium">
                      Date
                    </Text>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Box>
                </Grid>

                <Box
                  p={4}
                  bg="purple.50"
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="purple.200"
                >
                  <Text fontWeight="bold" mb={3} color="purple.900">
                    Order Items
                  </Text>
                  <Stack gap={2}>
                    {selectedOrder.items?.map((item, idx) => (
                      <Flex
                        key={idx}
                        justify="space-between"
                        align="center"
                        p={3}
                        bg="white"
                        borderRadius="lg"
                      >
                        <Box flex="1">
                          <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium">
                            {item.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Quantity: {item.quantity}
                          </Text>
                        </Box>
                        <Text fontWeight="bold" color="green.600" fontSize={{ base: "sm", md: "md" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </Flex>
                    ))}
                  </Stack>
                </Box>

                <Box
                  p={4}
                  bg="blue.50"
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="blue.200"
                >
                  <Text fontWeight="bold" mb={3} color="blue.900">
                    Shipping Address
                  </Text>
                  <Stack gap={2} fontSize={{ base: "sm", md: "md" }}>
                    <Text>
                      <strong>Address:</strong> {selectedOrder.shippingAddress?.address}
                    </Text>
                    <Text>
                      <strong>City:</strong> {selectedOrder.shippingAddress?.city},{" "}
                      {selectedOrder.shippingAddress?.state}{" "}
                      {selectedOrder.shippingAddress?.zipCode}
                    </Text>
                    <Text>
                      <strong>Phone:</strong> 📞 {selectedOrder.shippingAddress?.phone}
                    </Text>
                  </Stack>
                </Box>

                <Box
                  p={4}
                  bg="green.50"
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor="green.300"
                >
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="green.900">
                      Total Amount
                    </Text>
                    <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }} color="green.600">
                      ${selectedOrder.totalAmount.toFixed(2)}
                    </Text>
                  </Flex>
                </Box>
              </Stack>
            )}
          </DialogBody>
          <DialogFooter p={{ base: 4, md: 6 }} bg="gray.50">
            <Button
              onClick={() => setIsOrderModalOpen(false)}
              colorPalette="purple"
              w={{ base: "full", sm: "auto" }}
              borderRadius="full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}

export default Admin;