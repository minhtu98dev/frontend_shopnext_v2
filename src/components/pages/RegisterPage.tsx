"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { registerAndLogin } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await registerAndLogin(data);
      toast.success("Đăng ký thành công!");
      router.push("/"); // Chuyển về trang chủ
    } catch (error: unknown) {
      let errorMessage = "Email này có thể đã được sử dụng.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            Đăng ký tài khoản
          </h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Họ và tên
            </label>
            <input
              id="name"
              {...register("name", { required: "Vui lòng nhập họ tên" })}
              className="w-full border rounded p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
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
              className="w-full border rounded p-2"
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
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              className="w-full border rounded p-2"
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
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Đã có tài khoản?{" "}
            <Link href="/login">
              <span className="font-bold text-blue-500 hover:text-blue-800">
                Đăng nhập
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
