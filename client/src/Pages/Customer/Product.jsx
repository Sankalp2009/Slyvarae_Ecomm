import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  IconButton,
  NativeSelect,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Grid3x3, List } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import FilterSidebar from "../../Component/FilterSidebar.jsx";
import ProductCard from "../../Component/ProductCard.jsx";
import { Toaster, toaster } from "../../components/ui/toaster.jsx";
import { Action_Type } from "../../Redux/Product_Reducer/action.jsx";

const API_BASE_URL = "https://slyvarae-ecomm.onrender.com/api/v1/Products";

const getCurrentPage = (value) => {
  const pageNum = Number(value);
  if (!pageNum || pageNum <= 0 || isNaN(pageNum)) return 1;
  return pageNum;
};

const buildQueryString = (page, filters, sortValue) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", 10);

  if (filters && filters.length > 0) {
    filters.forEach((category) => {
      params.append("category", category);
    });
  }

  if (sortValue) {
    params.append("sort", sortValue);
  }

  return params.toString();
};

function Product() {
  const dispatch = useDispatch();
  const { item, IsLoading } = useSelector((state) => state.product);
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [filters, setFilters] = useState(() => {
    const categoryParams = [];
    for (const [key, value] of searchParams.entries()) {
      if (key === "category") {
        categoryParams.push(value);
      }
    }
    return categoryParams;
  });

  const [page, setPage] = useState(() =>
    getCurrentPage(searchParams.get("page"))
  );

  const [sortValue, setSortValue] = useState(
    () => searchParams.get("sort") || ""
  );

  const [priceRange, setPriceRange] = useState(() => {
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 10000;
    return [minPrice, maxPrice];
  });

  const [viewMode, setViewMode] = useState("grid");

  // Fetch categories
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setCategoriesLoading(true);

        // Check cache first
        const cachedCategories = localStorage.getItem("productCategories");
        const cacheTimestamp = localStorage.getItem(
          "productCategoriesTimestamp"
        );
        const cacheExpiry = 15 * 60 * 1000; // 15 minutes

        // Use cache if it's fresh (less than 15 minutes old)
        if (
          cachedCategories &&
          cacheTimestamp &&
          Date.now() - parseInt(cacheTimestamp) < cacheExpiry
        ) {
          setAllCategories(JSON.parse(cachedCategories));
          setCategoriesLoading(false);
          return;
        }

        // Fetch from API if cache is stale or missing
        const response = await axios.get(`${API_BASE_URL}?limit=100`);

        if (response.data?.data) {
          const uniqueCategories = Array.from(
            new Set(
              response.data.data
                .map((product) => product.category)
                .filter(Boolean)
            )
          ).sort();

          setAllCategories(uniqueCategories);

          // Cache the categories
          localStorage.setItem(
            "productCategories",
            JSON.stringify(uniqueCategories)
          );
          localStorage.setItem(
            "productCategoriesTimestamp",
            Date.now().toString()
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAllCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  // Update URL
  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("page", page);

    if (filters.length > 0) {
      filters.forEach((filter) => {
        newParams.append("category", filter);
      });
    }

    if (sortValue) {
      newParams.set("sort", sortValue);
    }

    setSearchParams(newParams, { replace: true });
  }, [page, filters, sortValue, setSearchParams]);

  // Fetch products
  const LoadData = useCallback(async () => {
    try {
      dispatch({ type: Action_Type.GET_REQUEST });
      const queryString = buildQueryString(page, filters, sortValue);
      const url = `${API_BASE_URL}?${queryString}`;
      const response = await axios.get(url);

      dispatch({
        type: Action_Type.GET_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("❌ API Error:", error);
      dispatch({ type: Action_Type.GET_FAILURE });

      toaster.error({
        title: "Error loading products",
        description:
          error.response?.data?.message || "Failed to fetch products",
      });
    }
  }, [dispatch, filters, page, sortValue]);

  useEffect(() => {
    LoadData();
  }, [LoadData]);

  const handleFilterChange = (category) => {
    setFilters((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters([]);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    setPage(1);
  };

  const clearAll = () => {
    setFilters([]);
    setSortValue("");
    setPriceRange([0, 10000]);
    setPage(1);

    toaster.info({
      title: "All filters cleared",
    });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    const hasNext = item?.pagination?.hasNext;
    if (hasNext) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (IsLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={3} color="teal.600">
          Loading products...
        </Text>
      </Center>
    );
  }

  const pagination = item?.pagination || {};
  const products = item?.data || [];

  return (
    <Box w={{ base: "95%", md: "90%" }} m="auto" py={{ base: 4, md: 6 }}>
      <Toaster />

      <Flex gap={{ base: 0, lg: 6 }} direction={{ base: "column", lg: "row" }}>
        {/* DESKTOP SIDEBAR */}
        <Box display={{ base: "none", lg: "block" }}>
          <Box
            as="aside"
            border="1px solid"
            borderColor="gray.300"
            p={5}
            borderRadius="md"
            minW="280px"
            maxW="280px"
            h="fit-content"
            position="sticky"
            top="100px"
            bg="white"
            boxShadow="sm"
          >
            <FilterSidebar
              allCategories={allCategories}
              categoriesLoading={categoriesLoading}
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              sortValue={sortValue}
              priceRange={priceRange}
              clearAll={clearAll}
            />
          </Box>
        </Box>

        {/* MAIN CONTENT */}
        <Box flex={1} w="100%">
          <Flex direction="column" gap={{ base: 4, md: 6 }}>
            {/* TOP BAR */}
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "stretch", md: "center" }}
              gap={3}
              bg="gray.50"
              p={{ base: 3, md: 4 }}
              borderRadius="md"
            >
              {/* Active filters */}
              <Flex
                align="center"
                gap={2}
                flexWrap="wrap"
                flex={1}
                display={{
                  base: filters.length > 0 ? "flex" : "none",
                  md: "flex",
                }}
              >
                {filters.length > 0 && (
                  <>
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="bold"
                      color="gray.700"
                      display={{ base: "none", sm: "block" }}
                    >
                      Categories:
                    </Text>
                    {filters.map((filter) => (
                      <Badge
                        key={filter}
                        colorPalette="blue"
                        px={{ base: 2, md: 3 }}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        cursor="pointer"
                        onClick={() => handleFilterChange(filter)}
                      >
                        {filter}{" "}
                        <Box as="span" fontWeight="bold" ml={1}>
                          ✕
                        </Box>
                      </Badge>
                    ))}
                  </>
                )}
              </Flex>

              {/* Sort & View */}
              <Flex
                direction={{ base: "column", sm: "row" }}
                align={{ base: "stretch", sm: "center" }}
                gap={3}
                w={{ base: "100%", sm: "auto" }}
              >
                {/* Mobile Category Filter Select */}
                <Flex
                  align="center"
                  gap={2}
                  w={{ base: "100%", sm: "auto" }}
                  display={{ base: "flex", lg: "none" }}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.700"
                    whiteSpace="nowrap"
                    display={{ base: "none", sm: "block" }}
                  >
                    Category:
                  </Text>
                  <NativeSelect.Root size={{ base: "sm", md: "sm" }} w="100%">
                    <NativeSelect.Field
                      value={filters[0] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          // Clear existing filters and set new one
                          setFilters([value]);
                          setPage(1);
                        } else {
                          // Clear all filters
                          clearFilters();
                        }
                      }}
                    >
                      <option value="">All Categories</option>
                      {categoriesLoading ? (
                        <option disabled>Loading...</option>
                      ) : (
                        allCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                      )}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {filters.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={clearFilters}
                      px={2}
                    >
                      Clear
                    </Button>
                  )}
                </Flex>

                {/* Sort Dropdown */}
                <Flex align="center" gap={2} w={{ base: "100%", sm: "auto" }}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.700"
                    whiteSpace="nowrap"
                    display={{ base: "none", sm: "block" }}
                  >
                    Sort:
                  </Text>
                  <NativeSelect.Root size={{ base: "sm", md: "sm" }} w="100%">
                    <NativeSelect.Field
                      value={sortValue}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="">Default</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="-name">Name (Z-A)</option>
                      <option value="price">Price (Low to High)</option>
                      <option value="-price">Price (High to Low)</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Flex>

                {/* View Mode */}
                <Flex
                  gap={1}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  bg="white"
                  w={{ base: "100%", sm: "auto" }}
                  justify={{ base: "center", sm: "flex-start" }}
                >
                  <IconButton
                    size={{ base: "sm", md: "sm" }}
                    variant={viewMode === "grid" ? "solid" : "ghost"}
                    colorPalette={viewMode === "grid" ? "teal" : "gray"}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    flex={{ base: 1, sm: "auto" }}
                  >
                    <Grid3x3 size={18} />
                  </IconButton>
                  <IconButton
                    size={{ base: "sm", md: "sm" }}
                    variant={viewMode === "list" ? "solid" : "ghost"}
                    colorPalette={viewMode === "list" ? "teal" : "gray"}
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    flex={{ base: 1, sm: "auto" }}
                  >
                    <List size={18} />
                  </IconButton>
                </Flex>
              </Flex>
            </Flex>

            {/* Products count */}
            {pagination.totalProducts !== undefined && (
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.600"
                fontWeight="medium"
              >
                {pagination.totalProducts === 0 ? (
                  "No products found"
                ) : (
                  <>
                    Showing {(page - 1) * 10 + 1}-
                    {Math.min(page * 10, pagination.totalProducts)} of{" "}
                    {pagination.totalProducts} products
                  </>
                )}
              </Text>
            )}

            {/* Products Grid/List */}
            {products.length > 0 ? (
              viewMode === "grid" ? (
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                  }}
                  gap={{ base: 3, md: 4, lg: 6 }}
                >
                  {products.map((product) => (
                    <Box key={product._id || product.id}>
                      <ProductCard product={product} {...product} />
                    </Box>
                  ))}
                </Grid>
              ) : (
                <Flex direction="column" gap={{ base: 3, md: 4 }}>
                  {products.map((product) => (
                    <Box key={product._id || product.id}>
                      <ProductCard
                        product={product}
                        {...product}
                        isListView={true}
                      />
                    </Box>
                  ))}
                </Flex>
              )
            ) : (
              <Center minH="400px" flexDirection="column" gap={4} px={4}>
                <Text fontSize={{ base: "2xl", md: "3xl" }}>😕</Text>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color="gray.500"
                  fontWeight="medium"
                  textAlign="center"
                >
                  No products found
                </Text>
                {(filters.length > 0 ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 10000) && (
                  <>
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Try adjusting your filters or search terms
                    </Text>
                    <Button
                      colorPalette="blue"
                      onClick={clearAll}
                      size={{ base: "sm", md: "md" }}
                    >
                      Clear All Filters
                    </Button>
                  </>
                )}
              </Center>
            )}

            {/* PAGINATION */}
            {products.length > 0 && (
              <Flex
                direction={{ base: "column", sm: "row" }}
                justify="center"
                align="center"
                gap={{ base: 3, md: 4 }}
                mt={6}
              >
                <Button
                  variant="outline"
                  size={{ base: "sm", md: "md" }}
                  disabled={!pagination.hasPrev || page === 1}
                  onClick={handlePrevPage}
                  w={{ base: "100%", sm: "auto" }}
                  _hover={{
                    bgGradient: "to-r",
                    gradientFrom: "red.500",
                    gradientTo: "yellow.500",
                    color: "white",
                  }}
                >
                  ← Previous
                </Button>

                <Flex align="center" gap={2} px={4}>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold">
                    Page {pagination.currentPage || page}
                  </Text>
                  {pagination.totalPages && (
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">
                      of {pagination.totalPages}
                    </Text>
                  )}
                </Flex>

                <Button
                  variant="outline"
                  size={{ base: "sm", md: "md" }}
                  disabled={!pagination.hasNext}
                  onClick={handleNextPage}
                  w={{ base: "100%", sm: "auto" }}
                  _hover={{
                    bgGradient: "to-r",
                    gradientFrom: "red.500",
                    gradientTo: "yellow.500",
                    color: "white",
                  }}
                >
                  Next →
                </Button>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default Product;
