document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("You must login first!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;

  const orderHistoryContainer = document.getElementById("orderHistory");

  // Fetch orders from JSON server
  let orders = [];
  try {
    const resOrders = await fetch("http://localhost:3000/orders");
    orders = await resOrders.json();
  } catch (err) {
    console.error("Failed to load orders:", err);
  }

  const userOrders = orders.filter(order => order.userId === user.id);

  if (userOrders.length === 0) {
    orderHistoryContainer.innerHTML = "<p class='text-gray-600'>You have no orders yet.</p>";
  } else {
    userOrders.forEach((order, index) => {
      const orderDiv = document.createElement("div");
      orderDiv.className = "border p-3 rounded bg-gray-50";

      orderDiv.innerHTML = `
        <p><strong>Order #${order.id}</strong></p>
        <ul class="list-disc pl-5">
          ${order.items.map(item => `<li>${item.name} - Size: ${item.size} - Qty: ${item.qty}</li>`).join("")}
        </ul>
        <button class="mt-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 exchange-btn" data-orderid="${order.id}">
          Request Exchange
        </button>
      `;

      orderHistoryContainer.appendChild(orderDiv);
    });

    // Add click listeners to exchange buttons
    document.querySelectorAll(".exchange-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const orderId = btn.dataset.orderid;
        window.location.href = `exchange.html?orderId=${orderId}`;
      });
    });
  }

  // Fetch exchange requests from JSON server
  let exchanges = [];
  try {
    const resEx = await fetch("http://localhost:3000/exchanges");
    exchanges = await resEx.json();
  } catch (err) {
    console.error("Failed to load exchanges:", err);
  }

  const userExchanges = exchanges.filter(ex => ex.userId === user.id);
  if (userExchanges.length > 0) {
    const exchangeTitle = document.createElement("h3");
    exchangeTitle.className = "text-lg font-semibold mt-6";
    exchangeTitle.textContent = "Exchange Requests";
    orderHistoryContainer.appendChild(exchangeTitle);

    userExchanges.forEach(ex => {
      const exDiv = document.createElement("div");
      exDiv.className = "border p-3 rounded bg-gray-100 mt-2";
      exDiv.innerHTML = `
        <p><strong>Exchange ID:</strong> ${ex.id}</p>
        <p><strong>Order ID:</strong> ${ex.orderId}</p>
        <p><strong>Item:</strong> ${ex.itemName}</p>
        <p><strong>Reason:</strong> ${ex.reason}</p>
        <p><strong>Status:</strong> ${ex.status}</p>
      `;
      orderHistoryContainer.appendChild(exDiv);
    });
  }
});
