"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { forgotPassword } from "@/services/authService";
import toast from "react-hot-toast";
import Link from "next/link";

type FormInputs = {
  email: string;
};

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // <-- Đã thêm `errors`
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const result = await forgotPassword(data.email);
      toast.success(
        result.message ||
          "Nếu email tồn tại, bạn sẽ nhận được một link để reset mật khẩu."
      );
    } catch (error: unknown) {
      let errorMessage = "Đã có lỗi xảy ra.";
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
          <h1 className="text-2xl font-bold text-center mb-6">Quên Mật khẩu</h1>
          <p className="text-center text-gray-600 mb-6">
            Nhập email của bạn và chúng tôi sẽ gửi cho bạn một link để đặt lại
            mật khẩu.
          </p>
          <div className="mb-6">
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
            {/* Giờ đây `errors` đã tồn tại và code này sẽ hoạt động */}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi link Reset"}
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            <Link href="/login">
              <span className="font-bold text-blue-500 hover:text-blue-800">
                Quay lại Đăng nhập
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
