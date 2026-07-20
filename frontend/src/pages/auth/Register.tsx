import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/auth";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
    cnic: "",
    driving_license: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      await register({
        ...formData,
        role: formData.role as "CUSTOMER" | "SHOWROOM" | "ADMIN",
      });

      alert("Registration successful!");

      navigate("/login");
    } catch (err: any) {
      if (Array.isArray(err.response?.data?.detail)) {
        setError(err.response.data.detail[0].msg);
      } else {
        setError(
          err.response?.data?.detail ||
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Create Your Account
        </h1>

        <p className="text-slate-500 mb-8">
          Join SmartRent AI and start renting smarter.
        </p>

        <div className="space-y-5">

          <input
            name="full_name"
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="cnic"
            type="text"
            placeholder="CNIC"
            value={formData.cnic}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="driving_license"
            type="text"
            placeholder="Driving License Number"
            value={formData.driving_license}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="CUSTOMER">
              Customer
            </option>

            <option value="SHOWROOM">
              Showroom Owner
            </option>
          </select>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl p-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </form>
    </div>
  );
}