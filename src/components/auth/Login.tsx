import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../hook/useLogin";
import LoadingScreen from "../ui/LoadingScreen";
import { useAppSelector } from "../../lib/store/store";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useLogin();
  const { error } = useAppSelector((state) => state.auth);
  // Controlled inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleOnLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      if (data) {
        // handle the tutorial
        localStorage.removeItem("tutorialCompleted");
        navigate("/dashboard/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  // ✅ Centralized loading view
  if (authLoading) return <LoadingScreen />;
  return (
    <main className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-1 text-gray-800 text-center">
        Author Login
      </h2>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Sign in to access your account
      </p>

      <form onSubmit={handleOnLogin} className="flex flex-col gap-5">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 focus:border-(--journal-500) rounded-lg px-4 py-2 outline-none transition"
          placeholder="Enter E-Mail"
          type="email"
          required
        />

        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 focus:border-(--journal-500) rounded-lg px-4 py-2 outline-none transition pr-10 w-full"
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-6" />
            ) : (
              <Eye className="w-6" />
            )}
          </button>
        </div>

        <div className="flex justify-between mt-1 text-sm">
          <label className="flex gap-2 items-center text-gray-600">
            <input type="checkbox" className="accent-(--journal-500)" /> Remember Me
          </label>
          <Link
            to="/forget-password"
            className="text-(--journal-600) hover:underline cursor-pointer"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="bg-(--journal-500) hover:bg-(--journal-600) transition text-white w-full py-2 rounded-xl mt-4 font-medium"
        >
          Login
        </button>

        <button
          type="button"
          onClick={handleRegisterRedirect}
          className="border border-(--journal-500) text-(--journal-500) hover:bg-blue-50 transition w-full py-2 rounded-xl mt-3 font-medium"
        >
          Create a new account
        </button>
      </form>

      <div className="bg-red-50 text-xs text-gray-600 mt-6 p-3 rounded-lg border border-red-200">
        <span className="text-red-600 font-semibold">Note:</span> An editorial management system enables authors to submit papers and track status, reviews, acceptance, copyright, payments, and final submission in one platform.
      </div>
    </main>
  );
};

export default Login;
