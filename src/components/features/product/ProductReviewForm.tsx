// Tạo file mới tại: src/components/features/product/ProductReviewForm.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { createProductReview } from "@/services/productService";

interface ProductReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void; // Callback để báo cho component cha làm mới dữ liệu
}

type FormInputs = {
  comment: string;
};

// Component nhỏ để người dùng chọn sao
const StarRatingInput = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (rating: number) => void;
}) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-3xl transition-colors ${
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300 hover:text-yellow-300"
          }`}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function ProductReviewForm({
  productId,
  onReviewSubmitted,
}: ProductReviewFormProps) {
  const [rating, setRating] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá.");
      return;
    }

    const reviewData = { ...data, rating };

    await toast.promise(createProductReview(productId, reviewData), {
      loading: "Đang gửi đánh giá...",
      success: (res) => {
        reset();
        setRating(0);
        onReviewSubmitted();
        return res.message || "Gửi đánh giá thành công!";
      },
      error: (err) =>
        err instanceof Error ? err.message : "Gửi đánh giá thất bại.",
    });
  };

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-xl font-bold mb-4">Viết đánh giá của bạn</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Đánh giá của bạn</label>
          <StarRatingInput rating={rating} setRating={setRating} />
        </div>
        <div>
          <label htmlFor="comment" className="block font-medium mb-1">
            Bình luận
          </label>
          <textarea
            id="comment"
            {...register("comment", {
              required: "Vui lòng nhập bình luận của bạn.",
            })}
            rows={4}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Sản phẩm này thật tuyệt vời..."
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
}
