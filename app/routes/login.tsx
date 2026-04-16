import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AUTH_TOKEN } from "~/constant/constant";
import axiosInstance from "~/interceptor/interceptor";
import sessionStorageService from "~/lib/sessionStorage";
import { setCookie } from "~/utils/cookie";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!mobile || mobile.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        mobile,
        password,
      });

      const responseData = response.data ?? {};
      const authToken = responseData.authToken || responseData.token || responseData.data?.token || responseData.data?.authToken || "";
      const isSuccessfulLogin = response.status === 200 && !!authToken;

      if (!isSuccessfulLogin) {
        setError(responseData?.message || "Login failed. Please check your credentials.");
        return;
      }

      sessionStorageService.setItem(AUTH_TOKEN, authToken);
      setCookie(AUTH_TOKEN, authToken, {
        path: "/",
        secure: false,
        sameSite: "strict",
      });
      console.log("AuthToken saved:", authToken);
      navigate("/");
    } catch (error: unknown) {
      const message = error && typeof error === "object" && "message" in error ? (error as Error).message : "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="relative h-dvh w-full flex flex-col gap-4 justify-end items-center pb-24 px-4">
      {/* Background Image */}
      <img src="/images/background-maharaj.png" alt="background" className="absolute inset-0 h-full w-full object-cover" />

      {/* Error Message */}
      {error && <div className="z-20 text-red-500 text-sm bg-white/90 px-2 py-1 rounded-full">{error}</div>}

      {/* Mobile Number Input */}
      <div className="w-full h-12 z-20 flex justify-start items-center px-4 gap-3 bg-primaryColor rounded-full text-white">
        <span className="text-white border-r border-white pr-3 text-base">+91</span>
        <input
          type="number"
          className="w-full outline-none bg-transparent font-normal text-base text-white placeholder:text-white/70"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div className="w-full h-12 z-20 flex items-center px-4 gap-2 bg-primaryColor rounded-full text-white relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full outline-none bg-transparent font-normal text-base text-white placeholder:text-white/70"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 text-white">
          {showPassword ? <EyeOff size={20} className="text-white/80" /> : <Eye size={20} className="text-white/80" />}
        </button>
      </div>

      {/* Next Button */}
      <button
        onClick={handleLogin}
        className="w-full z-20 h-12 flex justify-center items-center gap-2 px-4 bg-white rounded-full font-semibold text-textLightColor mt-8"
      >
        <span className="text-base uppercase tracking-wider">Next</span>
      </button>
    </div>
  );
}

export default Login;
