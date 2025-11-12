document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    // Validation regex
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Client-side validation
    if (!nameRegex.test(name)) {
      alert("❌ Name must be at least 3 characters long and contain only letters and spaces.");
      nameInput.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      alert("❌ Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("❌ Password must be at least 8 characters long and contain both letters and numbers.");
      passwordInput.focus();
      return;
    }

    try {
      // Check if user already exists
      const checkRes = await fetch(`http://localhost:3000/users?email=${email}`);
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) {
        alert("⚠️ An account with this email already exists.");
        return;
      }

      // Create new user
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("Signup failed.");

      const newUser = await res.json();

      // Save user to localStorage and dispatch login event
      localStorage.setItem("user", JSON.stringify(newUser));
      
      window.dispatchEvent(new Event("userLoggedIn"));

      alert(`🎉 Welcome to Stellar Soles, ${newUser.name}!`);
      window.location.href = "index.html";
    } catch (error) {
      console.error(error);
      alert("⚠️ Could not sign up. Make sure JSON Server is running.");
    }
  });
});
