document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    // 🧩 Client-side validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email.value.trim())) {
      alert("❌ Please enter a valid email address.");
      email.focus();
      return;
    }

    if (!passwordRegex.test(password.value.trim())) {
      alert("❌ Password must be at least 8 characters long and contain both letters and numbers.");
      password.focus();
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/users?email=${email.value.trim()}&password=${password.value.trim()}`);
      const users = await res.json();

      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("userLoggedIn"));
        alert(`✅ Welcome back, ${user.name}!`);
        window.location.href = "index.html";
      } else {
        alert("⚠️ Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error. Please make sure JSON Server is running on port 3000.");
    }
  });
});
