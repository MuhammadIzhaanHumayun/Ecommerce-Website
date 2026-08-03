"use client";

export default function Login() {
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login failed");
        return;
      }

      // Login successful
      alert("Login successful!");
      console.log("User data:", result.user);
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container">
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin} method="post">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
