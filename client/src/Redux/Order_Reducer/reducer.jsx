const InitialState = {
  Order:[]
}

export const reducer = (currentState = InitialState, action) => {
  const {type, payload} = action

  switch(type){
     
    case "ORDER_CREATED": {
      const item = payload;
      // if not add the new item
      return {
        ...currentState,
        Order: [...currentState.Order, item],
      };
    }
  
     case "ORDER_STATUS_UPDATED": {
      const { orderId, status } = payload;
      return {
        ...currentState,
        Order: currentState.Order.map((order) =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        ),
      };
    }

    case "ORDER_DELETED":
      return {
        ...currentState,
        Order: currentState.Order.filter((order) => order.id !== payload),
      };

    default:
      return currentState;
  }
}