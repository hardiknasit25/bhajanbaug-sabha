import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AUTH_TOKEN } from "~/constant/constant";
import { setCookie } from "~/utils/cookie";
import { getExpiryFromToken } from "~/utils/jwt";
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

    if (password !== `yuva_sabha@${mobile.slice(-4)}`) {
      setError("Invalid mobile or password");
      return;
    }

    console.log("Login Request:", { mobile, password });

    // ----------------------------
    // MOCK API CALL (replace later)
    // ----------------------------
    const mockResponse = {
      success: true,
      authToken: "SAMPLE_AUTH_TOKEN_123",
    };

    if (mockResponse.success) {
      const expiry = getExpiryFromToken(mockResponse.authToken);
      const maxAge =
        expiry && expiry > Date.now()
          ? Math.floor((expiry - Date.now()) / 1000)
          : 60 * 60 * 24;
      setCookie(AUTH_TOKEN, mockResponse.authToken, {
        path: "/", // cookie available across the site
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
        secure: false, // only over HTTPS
        sameSite: "strict", // CSRF protection or use lax
      });
      console.log("AuthToken saved:", mockResponse.authToken);
      navigate("/");
    } else {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="relative h-dvh w-full flex flex-col gap-4 justify-end items-center pb-24 px-4">
      {/* Background Image */}
      <img
        src="/images/background-maharaj.png"
        alt="background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Error Message */}
      {error && (
        <div className="z-20 text-red-500 text-sm bg-white/90 px-2 py-1 rounded-full">
          {error}
        </div>
      )}

      {/* Mobile Number Input */}
      <div className="w-full h-12 z-20 flex justify-start items-center px-4 gap-3 bg-primaryColor rounded-full text-white">
        <span className="text-white border-r border-white pr-3 text-base">
          +91
        </span>
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

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 text-white"
        >
          {showPassword ? (
            <EyeOff size={20} className="text-white/80" />
          ) : (
            <Eye size={20} className="text-white/80" />
          )}
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
