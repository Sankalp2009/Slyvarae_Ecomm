import {
  Spinner,
  Heading,
  Text,
  Box,
  Flex,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { X } from "lucide-react";
const FilterSidebar = ({
  allCategories,
  categoriesLoading,
  filters,
  handleFilterChange,
  clearFilters,
  sortValue,
  priceRange,
  clearAll,
  onClose = null,
}) => (
  <Box>
    <Flex justify="space-between" align="center" mb={4}>
      <Heading size={{ base: "sm", md: "md" }}>Filters</Heading>
      {onClose && (
        <IconButton
          display={{ base: "flex", lg: "none" }}
          size="sm"
          variant="ghost"
          onClick={onClose}
        >
          <X size={20} />
        </IconButton>
      )}
    </Flex>

    {/* Category Filter */}
    <Box mb={6}>
      <Text fontWeight="bold" fontSize="sm" mb={3} color="gray.700">
        Categories
      </Text>

      {categoriesLoading ? (
        <Flex align="center" gap={2}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.500">
            Loading...
          </Text>
        </Flex>
      ) : allCategories.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          No categories available
        </Text>
      ) : (
        <Box maxH="300px" overflowY="auto" pr={2}>
          {allCategories.map((category) => (
            <Flex
              key={category}
              align="center"
              gap={2}
              mb={2}
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.50" }}
            >
              <input
                type="checkbox"
                id={`filter-${category}`}
                checked={filters.includes(category)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleFilterChange(category);
                }}
                style={{
                  cursor: "pointer",
                  width: "16px",
                  height: "16px",
                }}
              />
              <Text
                as="label"
                htmlFor={`filter-${category}`}
                cursor="pointer"
                fontSize="sm"
                flex={1}
              >
                {category}
              </Text>
            </Flex>
          ))}
        </Box>
      )}

      {filters.length > 0 && (
        <Button
          size="sm"
          colorPalette="red"
          variant="outline"
          w="100%"
          mt={3}
          onClick={clearFilters}
        >
          Clear Categories
        </Button>
      )}
    </Box>

    {/* Clear All Button */}
    {(filters.length > 0 ||
      sortValue ||
      priceRange[0] > 0 ||
      priceRange[1] < 10000) && (
      <Button
        colorPalette="red"
        variant="solid"
        w="100%"
        onClick={() => {
          clearAll();
          if (onClose) onClose();
        }}
      >
        Clear All Filters
      </Button>
    )}
  </Box>
);

export default FilterSidebar