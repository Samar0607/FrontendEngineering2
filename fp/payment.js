document.addEventListener("DOMContentLoaded", () => {
  const paymentCart = JSON.parse(localStorage.getItem("paymentCart")) || [];
  const table = document.getElementById("payment-table");

  const user = JSON.parse(localStorage.getItem("user"));
  if(!user) { alert("Login first"); window.location.href="login.html"; return; }

  // Render payment items
  paymentCart.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4">${item.name}</td>
      <td class="py-2 px-4">${item.size}</td>
      <td class="py-2 px-4">${item.qty}</td>
      <td class="py-2 px-4">₹${item.price}</td>
    `;
    table.appendChild(row);
  });

  document.getElementById("paymentForm").addEventListener("submit", async e => {
    e.preventDefault();

    // Dummy payment validation
    const name = document.getElementById("name").value.trim();
    const card = document.getElementById("card").value.trim();
    const expiry = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value.trim();

    if(!name || !card || !expiry || !cvv) { alert("Fill all fields"); return; }

    // Generate order ID
    const orderId = `ORD-${Date.now()}`;

    const order = {
      id: orderId,
      userId: user.id,
      items: paymentCart.map(i => ({id: i.id, name: i.name, size: i.size, quantity: i.qty, price: i.price})),
      date: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
      if(!res.ok) throw new Error("Order failed");

      // Remove paid items from main cart
      let mainCart = JSON.parse(localStorage.getItem("cart")) || [];
      mainCart = mainCart.filter(mc => !paymentCart.find(pc => pc.id === mc.id && pc.size === mc.size));
      localStorage.setItem("cart", JSON.stringify(mainCart));

      // Clear paymentCart
      localStorage.removeItem("paymentCart");

      document.getElementById("payment-status").classList.remove("hidden");

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1500);

    } catch(err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  });
});
