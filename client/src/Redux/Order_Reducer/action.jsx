export const Order_Action_Type = {
  ORDER_CREATED:"ORDER_CREATED",
  ORDER_STATUS_UPDATED:"ORDER_STATUS_UPDATED",
  ORDER_DELETED:"ORDER_DELETED",
}

// 🧠 Action Creator for status update
export const updateOrderStatus = (orderId, status) => ({
  type: Order_Action_Type.ORDER_STATUS_UPDATED,
  payload: { orderId, status },
});

export const deleteOrder = (orderId) => ({
  type: Order_Action_Type.ORDER_DELETED,
  payload: orderId,
});