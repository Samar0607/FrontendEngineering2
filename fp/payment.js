let cart = JSON.parse(localStorage.getItem("paymentCart")) || [];
const paymentTable = document.getElementById("payment-table");
const paymentForm = document.getElementById("paymentForm");
const paymentStatus = document.getElementById("payment-status");

function renderPaymentTable() {
  paymentTable.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-3 flex items-center gap-3">
        <img src="${item.img}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
        <span>${item.name}</span>
      </td>
      <td class="py-3">${item.size}</td>
      <td class="py-3">${item.qty}</td>
      <td class="py-3 font-semibold">₹${item.price * item.qty}</td>
    `;
    paymentTable.appendChild(row);
    total += item.price * item.qty;
  });

  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td colspan="3" class="py-3 font-bold text-right">Total</td>
    <td class="py-3 font-bold text-blue-600">₹${total}</td>
  `;
  paymentTable.appendChild(totalRow);
}

paymentForm.addEventListener("submit", e => {
  e.preventDefault();
  paymentStatus.classList.remove("hidden");

  // Save orders to order history
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  localStorage.setItem("orders", JSON.stringify(orders.concat(cart)));

  // Clear cart and paymentCart
  localStorage.removeItem("paymentCart");
  window.setTimeout(() => window.location.href="index.html", 3000);
});

renderPaymentTable();
