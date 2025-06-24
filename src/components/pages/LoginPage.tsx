"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

// Import các thành phần của Firebase
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Định nghĩa kiểu dữ liệu cho form
type FormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login, firebaseLogin } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  // --- HÀM XỬ LÝ ĐĂNG NHẬP BẰNG EMAIL/PASSWORD (ĐÃ HOÀN THIỆN) ---
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    toast.promise(login(data), {
      loading: "Đang đăng nhập...",
      success: () => {
        router.push("/");
        return "Đăng nhập thành công!";
      },
      error: (err) => {
        if (err instanceof Error) {
          return err.message;
        }
        return "Email hoặc mật khẩu không chính xác.";
      },
    });
  };

  // --- HÀM XỬ LÝ ĐĂNG NHẬP BẰNG GOOGLE ---
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await toast.promise(firebaseLogin(idToken), {
        loading: "Đang xác thực...",
        success: "Đăng nhập thành công!",
        error: (err) =>
          err instanceof Error ? err.message : "Xác thực thất bại.",
      });
      router.push("/");
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      toast.error("Đăng nhập với Google thất bại.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        {/* --- FORM ĐĂNG NHẬP EMAIL/PASSWORD (ĐÃ HOÀN THIỆN) --- */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập</h1>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Vui lòng nhập email" })}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Vui lòng nhập mật khẩu" })}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </button>
            <Link href="/forgot-password">
              <span className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Quên mật khẩu?
              </span>
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Chưa có tài khoản?{" "}
            <Link href="/register">
              <span className="font-bold text-blue-500 hover:text-blue-800">
                Đăng ký ngay
              </span>
            </Link>
          </p>
        </form>

        {/* --- GIAO DIỆN ĐĂNG NHẬP VỚI GOOGLE --- */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.386,36.426,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Đăng nhập với Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
