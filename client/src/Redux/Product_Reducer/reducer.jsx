const InitialState = {
  item: [],
  IsError: null,
  IsLoading: false,
  selectedProduct: null,
}

export const reducer = (currentState = InitialState, action) => {
  const { type, payload } = action
  switch (type) {
    case 'GET_REQUEST':
      return {
        ...currentState,
        IsError: null,
        IsLoading: true,
      }
    case 'GET_REQUEST_BY_ID':
      return {
        ...currentState,
        selectedProduct: null,
        IsError: null,
        IsLoading: true,
      }
    case 'GET_SUCCESS':
      return {
        ...currentState,
        item: payload,
        IsError: null,
        IsLoading: false,
      }
    case 'GET_SUCCESS_BY_ID':
      return {
        ...currentState,
        selectedProduct: { ...payload, quantity: payload.quantity || 1 },
        IsLoading: false,
        IsError: null,
      }
    case 'GET_FAILURE':
      return {
        ...currentState,
        IsError: payload ?? true,
        IsLoading: false,
      }
    case 'GET_FAILURE_BY_ID':
      return {
        ...currentState,
        selectedProduct: null,
        IsError: payload ?? true,
        IsLoading: false,
      }

    case 'UPDATE_PRODUCT_STOCK':
      return {
        ...currentState,
        item: currentState.item.map((product) =>
          product._id === payload._id
            ? { ...product, stock: payload.stock }
            : product
        ),
        selectedProduct:
          currentState.selectedProduct?._id === payload._id
            ? { ...currentState.selectedProduct, stock: payload.stock }
            : currentState.selectedProduct,
      }

    default:
      return currentState
  }
}