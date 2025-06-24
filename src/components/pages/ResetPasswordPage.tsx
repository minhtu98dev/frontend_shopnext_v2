"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { resetPassword } from "@/services/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type FormInputs = {
  password: string;
  passwordConfirm: string;
};

export default function ResetPasswordPage({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await resetPassword(token, data.password);
      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      router.push("/login");
    } catch (error: unknown) {
      // Sửa lỗi 'any' ở đây
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
          <h1 className="text-2xl font-bold text-center mb-6">
            Đặt lại Mật khẩu
          </h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mật khẩu mới
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu mới",
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
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="passwordConfirm"
            >
              Xác nhận mật khẩu mới
            </label>
            <input
              id="passwordConfirm"
              type="password"
              {...register("passwordConfirm", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === watch("password") || "Mật khẩu không khớp",
              })}
              className="w-full border rounded p-2"
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-xs mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu mật khẩu mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
