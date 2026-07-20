import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      // Login and receive JWT
      const response = await loginService(formData);

      // Store token and fetch current user
      await login(response.access_token);

      // Since AuthContext updates asynchronously,
      // fetch the user again directly from the backend.
      const { getCurrentUser } = await import("../../services/auth");
      const currentUser = await getCurrentUser();

      alert("Login successful!");

      switch (currentUser.role) {
        case "CUSTOMER":
          navigate("/dashboard/customer");
          break;

        case "SHOWROOM":
          navigate("/dashboard/showroom");
          break;

        case "ADMIN":
          navigate("/dashboard/admin");
          break;

        default:
          navigate("/");
      }
    } catch (err: any) {
      if (Array.isArray(err.response?.data?.detail)) {
        setError(err.response.data.detail[0].msg);
      } else {
        setError(
          err.response?.data?.detail ||
            "Invalid email or password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-slate-500 mb-8">
          Login to your SmartRent AI account.
        </p>

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="border w-full p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border w-full p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <p className="mt-6 text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}