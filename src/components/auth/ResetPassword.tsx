import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPassword } from "../../hook/usePasswordHandler";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const { resetPassword, loading } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ---------------- GUARD RAIL ---------------- */
  if (!email || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid or expired link
          </h2>
          <p className="text-sm text-gray-600">
            The password reset link is missing or invalid. Please request a new one.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-(--journal-500) hover:bg-(--journal-600) text-white px-4 py-2 rounded-xl"
          >
            Request New Link
          </button>
        </div>
      </main>
    );
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });

      toast.success("Password reset successful");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Password reset failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <main className="min-h-full py-4 md:py-0 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back
        </button>

        <div>
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <p className="text-base text-gray-500 mt-2">
            Set a new password for
            <span className="block font-medium text-gray-800">{email}</span>
          </p>
        </div>

        <div className="space-y-3">
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-(--journal-500)"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-(--journal-500)"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-xl text-white transition
            bg-(--journal-500)
            ${!loading && "hover:bg-(--journal-600)"}
            disabled:opacity-70`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </main>
  );
};

export default ResetPassword;
