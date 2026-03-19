import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hook/useRegister";
import LoadingScreen from "../ui/LoadingScreen";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "../../lib/store/store";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, data, loading, error } = useRegister();
  const { active } = useAppSelector(s => s.journal)
  const [prefix, handlePrefix] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ---------------------------------
     Field-level validation
  --------------------------------- */
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Name is required";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address";
        return "";

      case "phone":
        if (!value.trim()) return "Mobile number is required";
        if (value.length<10 || 15<value.length)
          return "Enter a valid 10-digit mobile number";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8)
          return "Password must be at least 8 characters";
        return "";

      case "password_confirmation":
        if (!value) return "Please confirm your password";
        if (value !== formData.password)
          return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const handleNumberChange = (value:string)=>{
    handlePrefix(value)
    setFormData(prev=> ({...prev, phone:prefix}))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };


  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };


  const validateForm = (): boolean => {
    const fields = Object.keys(formData) as (keyof typeof formData)[];
    for (const field of fields) {
      const error = validateField(field, formData[field]);
      if (error) {
        toast.error(error);
        return false;
      }
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!active) return
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        user_type: "W",
        journal_id: active.id,
        phone: formData.phone,
      });

      if (res?.status === "success") {
        toast.success("Account created successfully");
        navigate("/dashboard/profile");
      } else {
        toast.error(error);
      }
    } catch {
      toast.error(error);
    }
  };

  if (loading) return <LoadingScreen />;

  const handleRedirectLogin = () => navigate("/");

  const inputClass = (name: string) =>
    `border rounded-lg px-4 py-2 w-full ${errors[name] ? "border-red-500" : "border-gray-200"
    }`;

  return (
    <form
      onSubmit={handleRegister}
      className="bg-white shadow-md rounded-xl p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-1">Author Registration</h2>
      <p className="text-sm text-gray-500 mb-8">
        Register to access your account
      </p>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("name")}
            placeholder="Enter Name"
          />
          {touched.name && errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("email")}
            placeholder="Enter E-Mail"
          />
          {touched.email && errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <PhoneInput          
            country="us"
            value={prefix}
            onChange={handleNumberChange}
            onBlur={handleBlur}
            inputClass="min-w-full min-h-10"
            placeholder="Enter Mobile No"
          />

          {/* <input
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClass("phone")}
            placeholder="Enter Mobile No"
          /> */}
        </div>

        {touched.phone && errors.phone && (
          <p className="text-xs text-red-500 flex-1">{errors.phone}</p>
        )}

        {/* Password */}
        <div className="relative">
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            type={showPassword ? "text" : "password"}
            className={`${inputClass("password")} pr-10 w-full`}
            placeholder="Enter Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <input
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            onBlur={handleBlur}
            type={showConfirm ? "text" : "password"}
            className={`${inputClass("password_confirmation")} pr-10 w-full`}
            placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {touched.password_confirmation &&
          errors.password_confirmation && (
            <p className="text-xs text-red-500">
              {errors.password_confirmation}
            </p>
          )}
      </div>

      <label className="flex gap-2 items-center text-sm my-3">
        <input type="checkbox" required /> I confirm the details entered are
        valid for notifications
      </label>

      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
      {data && (
        <p className="text-green-600 text-sm text-center mt-2">
          {data.message}
        </p>
      )}

      <button
        type="submit"
        className="bg-(--journal-500) hover:bg-(--journal-600) text-white w-full py-2 rounded-xl mt-2"
      >
        Create New Account
      </button>

      <button
        type="button"
        onClick={handleRedirectLogin}
        className="border border-(--journal-500) text-(--journal-500) w-full py-2 rounded-xl mt-3 hover:bg-(--journal-50)"
      >
        Login
      </button>
    </form>
  );
};

export default Register;
