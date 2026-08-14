"use client";
import Link from "next/link";

const Register = () => {
  const handleRegister = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const fullName = data.get("fullName");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    const gender = data.get("gender");
    try {
      if (password != confirmPassword) {
        return alert("Password doesn't match");
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password, gender }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "register failed");
        return;
      }

      // register successful
      alert("registration successful!");
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="container h-screen w-auto content-center justify-items-center bg-white">
      <div>
        <form
          onSubmit={handleRegister}
          className=" [&_input]:mb-3 [&_input]:outline-none [&_input]:px-2 [&_input]:border-2 [&_input]:border-white [&_input]:rounded [&_label]:font-bold   flex flex-col bg-violet-500 px-10 py-8 rounded-2xl w-[30vw]"
        >
          <h1 className="text-center text-3xl pb-5 font-bold text-white">
            Register
          </h1>
          <label htmlFor="fullname">Full Name</label>
          <input type="text" name="fullName" required />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" required />
          <label htmlFor="password">Password</label>
          <input type="password" name="password" required />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" name="confirmPassword" required />
          <label htmlFor="gender">Gender</label>
          <input type="text" name="gender" required />
          <button
            type="submit"
            className="rounded-2xl bg-fuchsia-600 py-1 text-white duration-200 hover:cursor-pointer hover:bg-fuchsia-500 mb-3"
          >
            Submit
          </button>
          <p>
            already have an account.{" "}
            <Link href="/login" className="text-fuchsia-400 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
