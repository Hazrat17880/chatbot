"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react"; // ✅ Import NextAuth
import toast from 'react-hot-toast';
import {
  Bot,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  UserPlus,
  Phone,
  Globe,
  Clock,
} from "lucide-react";

// Types
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  phoneNumber: string;
  country: string;
  timezone: string;
  referralCode: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  phoneNumber?: string;
  country?: string;
  timezone?: string;
  terms?: string;
}

interface ApiError {
  field?: string;
  message: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ Get session from NextAuth
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phoneNumber: "",
    country: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referralCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // ✅ Handle Google session - redirect when authenticated
  // useEffect(() => {
  //   if (status === 'authenticated' && session?.user) {
  //     // User is authenticated with Google
  //     // The callback route will handle JWT generation and redirect
  //     toast.success('Successfully signed up with Google! 🎉');
  //     router.push('/dashboard');
  //   }
  // }, [status, session, router]);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    const { password } = formData;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = "Password must contain uppercase and lowercase letters";
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Username (optional but validate if provided)
    if (formData.username && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Terms
    if (!agreedToTerms) {
      newErrors.terms = "You must accept the Terms of Service";
    }

    setErrors(newErrors);
    setApiError(null);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Updated Google Signup Handler
const handleGoogleSignup = async () => {
  setIsLoading(true);

  try {
    await signIn("google", {
      callbackUrl: "/chat?login=success",
    });
  } catch (error) {
    console.error("Google signup error:", error);
    toast.error("Failed to sign up with Google. Please try again.");
    setIsLoading(false);
  }
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validate form first
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0] as string);
      }
      return;
    }

    // Check terms
    if (!agreedToTerms) {
      toast.error('Please accept the Terms of Service');
      return;
    }

    if (!agreedToPrivacy) {
      toast.error('Please accept the Privacy Policy');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...');
    setIsLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          username: formData.username || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          country: formData.country || undefined,
          timezone: formData.timezone,
          referralCode: formData.referralCode || undefined,
          termsAccepted: agreedToTerms,
          privacyPolicyAccepted: agreedToPrivacy,
        }),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        // Handle validation errors from API
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors: FormErrors = {};
          data.errors.forEach((err: ApiError) => {
            if (err.field === 'firstName') fieldErrors.firstName = err.message;
            else if (err.field === 'lastName') fieldErrors.lastName = err.message;
            else if (err.field === 'email') fieldErrors.email = err.message;
            else if (err.field === 'password') fieldErrors.password = err.message;
            else if (err.field === 'username') fieldErrors.username = err.message;
            else if (err.field === 'termsAccepted') fieldErrors.terms = err.message;
            else {
              toast.error(err.message);
            }
          });
          setErrors(fieldErrors);
          
          const firstError = Object.values(fieldErrors).find(Boolean);
          if (firstError) {
            toast.error(firstError as string);
          }
          return;
        }
        
        toast.error(data.message || "Registration failed");
        setApiError(data.message || "Registration failed");
        return;
      }

      // ✅ Success! Show success toast
      toast.success('🎉 Account created successfully!', {
        duration: 4000,
        icon: '👏',
      });

      // Show verification email toast
      toast.success('📧 Please check your email for verification code', {
        duration: 5000,
      });

      // Redirect to verification page after 2 seconds
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
      
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
      setApiError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setApiError(null);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-orange-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-white">
                Chat<span className="text-purple-600">AI</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Create Your Account
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Join thousands of users and start chatting smarter
            </p>
          </div>

          {/* ✅ Google Signup Button */}
          <div className="mb-6">
            <button
              onClick={handleGoogleSignup}
              disabled={isLoading || status === 'loading'}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                    Sign up with Google
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400">
                Or sign up with email
              </span>
            </div>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 dark:text-red-300">{apiError}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border ${
                      errors.firstName
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-200 dark:border-zinc-700"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500`}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border ${
                      errors.lastName
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-200 dark:border-zinc-700"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500`}
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border ${
                    errors.email
                      ? "border-red-500 dark:border-red-500"
                      : "border-zinc-200 dark:border-zinc-700"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/50 transition-all text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Rest of your form fields... */}
            {/* Username, Phone, Country, Timezone, Password, Confirm Password, Referral Code, Terms */}

            {/* ... keep all your existing form fields here ... */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Features Badge */}
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                AI-Powered
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Free Forever
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-green-500" />
                Secure
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}