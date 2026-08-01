import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../hook/usePasswordHandler";
import { useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useForgotPassword();

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    try {
      await forgotPassword({ email });
      setSubmittedEmail(email);
      toast.success("Password reset instructions sent");
      form.reset();
    } catch (err) {
      //->console.log(err)
      toast.error("Failed to send password reset link");
    }
  };

  /* ---------------- SUCCESS STATE ---------------- */
  if (submittedEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center space-y-5">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
            ✓
          </div>

          <h2 className="text-xl font-semibold">
            Check your email
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            We’ve sent password reset instructions to  
            <span className="block font-medium text-gray-800 mt-1">
              {submittedEmail}
            </span>
          </p>

          <p className="text-xs text-gray-500">
            If you don’t see the email, please check your spam folder.
          </p>

          <button
            onClick={() => setSubmittedEmail(null)}
            className="w-full bg-(--journal-500) hover:bg-(--journal-600) text-white py-2.5 rounded-xl transition"
          >
            Change Email
          </button>

          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-700 underline-offset-4 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  /* ---------------- FORM STATE ---------------- */
  return (
    <main className="min-h-full py-4 md:py-0  flex items-center justify-center px-4">
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
          <h2 className="text-xl font-semibold">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your registered email to receive reset instructions.
          </p>
        </div>

        <input
          name="email"
          type="email"
          required
          placeholder="Enter your email address"
          className="border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-(--journal-500)"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-xl text-white transition
            bg-(--journal-500)
            ${!loading && "hover:bg-(--journal-600)"}
            disabled:opacity-70`}
        >
          {loading ? "Sending..." : "Send Password Reset Link"}
        </button>
      </form>
    </main>
  );
};

export default ForgotPassword;
