import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Action_Type } from '../../Redux/Cart_Reducer/action.jsx'
import { Order_Action_Type } from '../../Redux/Order_Reducer/action.jsx'
import { useNavigate, Link } from 'react-router'

import {
  Box,
  Heading,
  Text,
  Field,
  Input,
  Flex,
  Button,
  Grid,
  GridItem,
  Portal,
  Stack,
  Badge,
  Separator,
} from '@chakra-ui/react'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
} from '../../components/ui/dialog'

import {
  CheckCircle,
  Sparkles,
  CreditCard,
  MapPin,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react'
import { toaster } from '../../components/ui/toaster.jsx'

const CHECKOUT_FORM_ID = 'checkout-shipping-form'

const trimFormData = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, String(value).trim()])
  )

const parseUnitPrice = (item) => {
  const raw = item?.price ?? item?.product?.price ?? 0
  const value = typeof raw === 'string' ? parseFloat(raw) : Number(raw)
  return Number.isFinite(value) ? value : 0
}

const computeOrderTotals = (cartItems) => {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + parseUnitPrice(item) * (item.quantity || 1),
    0
  )
  const tax = subtotal * 0.1
  const shippingFee = subtotal > 50 ? 0 : 10
  const total = subtotal + tax + shippingFee
  return { subtotal, tax, shipping: shippingFee, total }
}

const InitialState = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
}

function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(InitialState)

  const { subtotal, tax, shipping, total } = computeOrderTotals(items)
  const canPlaceOrder =
    items.length > 0 && !isOrderPlaced && !isSubmitting

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isOrderPlaced) {
      return
    }

    if (items.length === 0) {
      toaster.error({
        title: 'Cart is empty',
        description: 'Add items to your cart before placing an order.',
      })
      return
    }

    const shippingFields = trimFormData(formData)
    const requiredFields = [
      'fullName',
      'email',
      'address',
      'city',
      'state',
      'zipCode',
      'phone',
    ]
    const missing = requiredFields.filter((field) => !shippingFields[field])

    if (missing.length > 0) {
      toaster.error({
        title: 'Shipping information required',
        description: 'Please complete all required shipping fields.',
      })
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(shippingFields.email)) {
      toaster.error({
        title: 'Invalid email',
        description: 'Enter a valid email address.',
      })
      return
    }

    const totals = computeOrderTotals(items)

    setIsSubmitting(true)

    const order = {
      id: Date.now().toString(),
      userId: user?._id || 'guest',
      status: 'processing',
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      totalAmount: totals.total,
      shippingAddress: {
        fullName: shippingFields.fullName,
        email: shippingFields.email,
        phone: shippingFields.phone,
        address: shippingFields.address,
        city: shippingFields.city,
        state: shippingFields.state,
        zipCode: shippingFields.zipCode,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: Order_Action_Type.ORDER_CREATED, payload: order })

    setOrderSuccess({
      total: totals.total,
      email: shippingFields.email,
    })
    setIsOrderPlaced(true)
    setFormData(InitialState)
    dispatch({ type: Action_Type.CLEAR_CART })
    setIsSubmitting(false)
  }

  const closeSuccessModal = () => {
    setIsOrderPlaced(false)
    setOrderSuccess(null)
  }

  const handleCloseModal = () => {
    closeSuccessModal()
  }

  return (
    <Box minH="100vh" py={{ base: 4, md: 8 }} bg="gray.50">
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        {/* Header Section */}
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          mb={{ base: 6, md: 8 }}
          gap={4}
        >
          <Box>
            <Heading
              size={{ base: 'xl', md: '2xl', lg: '3xl' }}
              fontWeight="bold"
              bgGradient="to-r"
              gradientFrom="purple.600"
              gradientTo="blue.500"
              bgClip="text"
            >
              Checkout
            </Heading>
            <Text color="gray.600" mt={2} fontSize={{ base: 'sm', md: 'md' }}>
              Complete your purchase
            </Text>
          </Box>

          <Button
            display={{ base: 'flex', md: 'none' }}
            variant="outline"
            colorPalette="purple"
            size="sm"
            onClick={() => navigate('/cart')}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back to Cart
          </Button>
        </Flex>

        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 400px' }}
          gap={{ base: 6, md: 8 }}
        >
          {/* Left Column - Forms */}
          <Stack gap={{ base: 4, md: 6 }}>
            {/* Shipping Information */}
            <Box
              bg="white"
              p={{ base: 4, md: 6 }}
              borderRadius="xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <Flex align="center" gap={2} mb={{ base: 4, md: 6 }}>
                <Box
                  bg="purple.100"
                  p={2}
                  borderRadius="lg"
                  display={{ base: 'none', sm: 'block' }}
                >
                  <MapPin size={20} color="#7c3aed" />
                </Box>
                <Heading size={{ base: 'md', md: 'lg' }} fontWeight="bold">
                  Shipping Information
                </Heading>
              </Flex>

              <Box
                as="form"
                id={CHECKOUT_FORM_ID}
                onSubmit={handleSubmit}
                noValidate
              >
              <Stack gap={{ base: 3, md: 4 }}>
                {/* Full Name & Email */}
                <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                  <Field.Root flex={1} required>
                    <Field.Label fontSize={{ base: 'sm', md: 'md' }}>
                      Full Name <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      size={{ base: 'md', md: 'lg' }}
                      required
                    />
                  </Field.Root>

                  <Field.Root flex={1} required>
                    <Field.Label fontSize={{ base: 'sm', md: 'md' }}>
                      Email <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      size={{ base: 'md', md: 'lg' }}
                      required
                    />

                  </Field.Root>
                </Flex>

                {/* Address */}
                <Field.Root required>
                  <Field.Label fontSize={{ base: 'sm', md: 'md' }}>
                    Address <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    size={{ base: 'md', md: 'lg' }}
                    required
                  />

                </Field.Root>

                {/* City & State */}
                <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                  <Field.Root flex={1} required>
                    <Field.Label fontSize={{ base: 'sm', md: 'md' }}>
                      City <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      size={{ base: 'md', md: 'lg' }}
                      required
                    />

                  </Field.Root>

                  <Field.Root flex={1} required>
                    <Field.Label fontSize={{ base: 'sm', md: 'md' }}>
                      State <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      size={{ base: 'md', md: 'lg' }}
                      required
                    />

                  </Field.Root>
                </Flex>

                {/* ZIP Code & Phone */}
                <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                  <Field.Root flex={1} required>
                    <Field.Label fontSize={{ base: 'sm', md: 'md' }}>
                      ZIP Code <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      size={{ base: 'md', md: 'lg' }}
                      required
                    />

                  </Field.Root>

                  <Field.Root flex={1} required>
                    <Field.Label fontSize={{ base: 'sm', md: 'md' }}>
                      Phone <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      size={{ base: 'md', md: 'lg' }}
                      required
                    />
                  </Field.Root>
                </Flex>
              </Stack>
              </Box>
            </Box>

            {/* Payment Method */}
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              p={{ base: 4, md: 6 }}
              border="1px solid"
              borderColor="gray.200"
            >
              <Flex align="center" gap={2} mb={4}>
                <Box
                  bg="blue.100"
                  p={2}
                  borderRadius="lg"
                  display={{ base: 'none', sm: 'block' }}
                >
                  <CreditCard size={20} color="#3b82f6" />
                </Box>
                <Heading size={{ base: 'md', md: 'lg' }} fontWeight="bold">
                  Payment Method
                </Heading>
              </Flex>

              <Box
                bg="blue.50"
                p={{ base: 3, md: 4 }}
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
              >
                <Flex align="center" gap={2}>
                  <Text fontSize={{ base: '2xl', md: '3xl' }}>💳</Text>
                  <Text color="blue.700" fontSize={{ base: 'sm', md: 'md' }}>
                    This is a demo checkout. No payment will be processed.
                  </Text>
                </Flex>
              </Box>
            </Box>

            {/* Mobile Place Order Button */}
            <Box display={{ base: 'block', lg: 'none' }}>
              <Button
                type="submit"
                form={CHECKOUT_FORM_ID}
                w="full"
                bgGradient="to-r"
                gradientFrom="purple.500"
                gradientTo="blue.500"
                color="white"
                size="lg"
                disabled={!canPlaceOrder}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
                transition="all 0.2s"
              >
                Place Order - ${total.toFixed(2)}
              </Button>
            </Box>
          </Stack>

          {/* Right Column - Order Summary */}
          <Box>
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              p={{ base: 4, md: 6 }}
              position={{ base: 'relative', lg: 'sticky' }}
              top={{ lg: '100px' }}
              border="1px solid"
              borderColor="gray.200"
            >
              <Flex align="center" gap={2} mb={{ base: 4, md: 6 }}>
                <Box
                  bg="green.100"
                  p={2}
                  borderRadius="lg"
                  display={{ base: 'none', sm: 'block' }}
                >
                  <ShoppingBag size={20} color="#22c55e" />
                </Box>
                <Heading size={{ base: 'md', md: 'lg' }} fontWeight="bold">
                  Order Summary
                </Heading>
              </Flex>

              {/* Cart Items */}
              {items.length > 0 ? (
                <Box mb={6} maxH="250px" overflowY="auto" pr={2}>
                  <Stack gap={3}>
                    {items.map((item) => (
                      <Flex
                        key={item._id}
                        justify="space-between"
                        align="center"
                        p={3}
                        bg="gray.50"
                        borderRadius="lg"
                        gap={3}
                      >
                        <Flex direction="column" flex={1} gap={1}>
                          <Text
                            fontSize={{ base: 'sm', md: 'md' }}
                            fontWeight="medium"
                            noOfLines={1}
                          >
                            {item.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Qty: {item.quantity}
                          </Text>
                        </Flex>
                        <Text
                          fontSize={{ base: 'sm', md: 'md' }}
                          fontWeight="bold"
                          color="purple.600"
                          whiteSpace="nowrap"
                        >
                          ${(parseUnitPrice(item) * item.quantity).toFixed(2)}
                        </Text>
                      </Flex>
                    ))}
                  </Stack>
                </Box>
              ) : (
                <Box
                  textAlign="center"
                  py={8}
                  color="gray.500"
                  fontSize="sm"
                  mb={6}
                >
                  Your cart is empty
                </Box>
              )}

              <Separator mb={4} />

              {/* Price Breakdown */}
              <Stack gap={3} mb={6}>
                <Flex justify="space-between" color="gray.700">
                  <Text fontSize={{ base: 'sm', md: 'md' }}>Subtotal</Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    ${subtotal.toFixed(2)}
                  </Text>
                </Flex>
                <Flex justify="space-between" color="gray.700">
                  <Text fontSize={{ base: 'sm', md: 'md' }}>Tax (10%)</Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    ${tax.toFixed(2)}
                  </Text>
                </Flex>
                <Flex justify="space-between" color="gray.700">
                  <Text fontSize={{ base: 'sm', md: 'md' }}>Shipping</Text>
                  <Text
                    fontWeight="semibold"
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    {shipping === 0 ? (
                      <Badge colorPalette="green" variant="solid" px={2}>
                        FREE
                      </Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </Text>
                </Flex>

                <Separator />

                <Flex justify="space-between" align="center">
                  <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                    Total
                  </Text>
                  <Text
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="bold"
                    bgGradient="to-r"
                    gradientFrom="green.500"
                    gradientTo="green.600"
                    bgClip="text"
                  >
                    ${total.toFixed(2)}
                  </Text>
                </Flex>
              </Stack>

              {/* Desktop Action Buttons */}
              <Stack gap={3} display={{ base: 'none', lg: 'flex' }}>
                <Button
                  type="submit"
                  form={CHECKOUT_FORM_ID}
                  w="full"
                  bgGradient="to-r"
                  gradientFrom="green.700"
                  gradientTo="green.600"
                  color="white"
                  size="lg"
                  disabled={!canPlaceOrder}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.2s"
                  fontWeight="600"
                >
                  Place Order
                </Button>

                <Link to="/product" style={{ textDecoration: 'none' }}>
                  <Button
                    w="full"
                    variant="outline"
                    colorPalette="purple"
                    size="md"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </Stack>

              {/* Security Badge */}
              <Flex
                mt={6}
                justify="center"
                align="center"
                gap={2}
                color="gray.500"
                fontSize="xs"
              >
                <Box
                  w="16px"
                  h="16px"
                  bg="green.500"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontSize="10px">
                    ✓
                  </Text>
                </Box>
                <Text>Secure checkout</Text>
              </Flex>
            </Box>
          </Box>
        </Grid>

        {/* Add padding for mobile fixed button */}
        <Box h={{ base: '20px', lg: '0' }} />
      </Box>

      {/* Success Modal */}
      <DialogRoot
        open={isOrderPlaced}
        onOpenChange={(e) => !e.open && handleCloseModal()}
        size={{ base: 'sm', md: 'md' }}
        placement="center"
      >
        <Portal>
          <DialogContent mx={{ base: 4, md: 0 }}>
            <DialogHeader>
              <DialogTitle>
                <Flex align="center" justify="center" gap={2}>
                  <CheckCircle size={28} color="green" />
                  <Text fontSize={{ base: 'lg', md: 'xl' }}>
                    Order Placed Successfully!
                  </Text>
                </Flex>
              </DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody>
              <Flex
                direction="column"
                align="center"
                gap={4}
                py={{ base: 4, md: 6 }}
              >
                {/* Sparkle Animation */}
                <Box position="relative">
                  <Box
                    animation="sparkle 1.5s ease-in-out infinite"
                    position="absolute"
                    top="-10px"
                    left="-10px"
                  >
                    <Sparkles size={24} color="#FFD700" />
                  </Box>
                  <Box
                    animation="sparkle 1.5s ease-in-out infinite 0.5s"
                    position="absolute"
                    top="-10px"
                    right="-10px"
                  >
                    <Sparkles size={24} color="#FFD700" />
                  </Box>
                  <Box
                    animation="sparkle 1.5s ease-in-out infinite 1s"
                    position="absolute"
                    bottom="-10px"
                    left="50%"
                    transform="translateX(-50%)"
                  >
                    <Sparkles size={24} color="#FFD700" />
                  </Box>

                  <CheckCircle
                    size={{ base: 60, md: 80 }}
                    color="#22c55e"
                    strokeWidth={2}
                  />
                </Box>

                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  textAlign="center"
                  fontWeight="medium"
                >
                  Thank you for your order!
                </Text>
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color="gray.600"
                  textAlign="center"
                  px={{ base: 2, md: 0 }}
                >
                  Your order has been successfully placed.
                  <br />
                  Order total:{' '}
                  <strong>${orderSuccess?.total?.toFixed(2) ?? '0.00'}</strong>
                </Text>
                {orderSuccess?.email && (
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    A confirmation email has been sent to {orderSuccess.email}
                  </Text>
                )}
              </Flex>
            </DialogBody>

            <DialogFooter>
              <Flex w="full" gap={3} direction={{ base: 'column', sm: 'row' }}>
                <Button
                  flex={1}
                  variant="outline"
                  onClick={() => {
                    closeSuccessModal()
                    navigate('/order')
                  }}
                  size={{ base: 'md', md: 'lg' }}
                >
                  View Orders
                </Button>
                <Button
                  flex={1}
                  bgGradient="to-r"
                  gradientFrom="purple.500"
                  gradientTo="blue.500"
                  color="white"
                  onClick={handleCloseModal}
                  size={{ base: 'md', md: 'lg' }}
                >
                  Continue Shopping
                </Button>
              </Flex>
            </DialogFooter>
          </DialogContent>
        </Portal>
      </DialogRoot>

      {/* Add sparkle animation styles */}
      <style>
        {`
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0.5) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: scale(1.2) rotate(180deg);
            }
          }
        `}
      </style>
    </Box>
  )
}

export default Checkout
