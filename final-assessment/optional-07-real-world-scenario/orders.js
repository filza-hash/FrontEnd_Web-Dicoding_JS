// Gunakan fungsi di bawah ini untuk menghasilkan id yang unik
function generateUniqueId() {
  return `_${Math.random().toString(36).slice(2, 9)}`;
}

const orders = [];

function addOrder(customerName, items) {
  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  const order = {
    id: generateUniqueId(),
    customerName,
    items,
    totalPrice,
    status: 'Menunggu',
  };

  orders.push(order);
}

function updateOrderStatus(orderId, status) {
  const order = orders.find((item) => item.id === orderId);

  if (order) {
    order.status = status;
  }
}

function calculateTotalRevenue() {
  return orders
    .filter((order) => order.status === 'Selesai')
    .reduce((total, order) => total + order.totalPrice, 0);
}

function deleteOrder(id) {
  const index = orders.findIndex((order) => order.id === id);

  if (index !== -1) {
    orders.splice(index, 1);
  }
}

export { orders, addOrder, updateOrderStatus, calculateTotalRevenue, deleteOrder };
