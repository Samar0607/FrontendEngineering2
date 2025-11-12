document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must login first!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;

  const orderHistoryContainer = document.getElementById("orderHistory");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const userOrders = orders.filter(order => order.userId === user.id);

  if (userOrders.length === 0) {
    orderHistoryContainer.innerHTML = "<p class='text-gray-600'>You have no orders yet.</p>";
  } else {
    userOrders.forEach((order, index) => {
      const orderDiv = document.createElement("div");
      orderDiv.className = "border p-3 rounded bg-gray-50";

      orderDiv.innerHTML = `
        <p><strong>Order #${index + 1}</strong></p>
        <ul class="list-disc pl-5">
          ${order.items.map(item => `<li>${item.name} - Size: ${item.size} - Qty: ${item.quantity}</li>`).join("")}
        </ul>
      `;
      orderHistoryContainer.appendChild(orderDiv);
    });
  }
});
