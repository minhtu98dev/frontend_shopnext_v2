"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useCartStore, type ShippingAddress } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { createOrder } from "@/services/orderService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CartSummary from "../features/cart/CartSummary";

type FormInputs = ShippingAddress & {
  email?: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const {
    items,
    shippingAddress,
    paymentMethod,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
  } = useCartStore();
  const { user } = useAuthStore();

  const defaultValues = {
    fullName: user?.name || shippingAddress.fullName || "",
    address: shippingAddress.address || "",
    city: shippingAddress.city || "",
    phoneNumber: shippingAddress.phoneNumber || "",
    email: user?.email || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ defaultValues });

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    saveShippingAddress({
      fullName: data.fullName,
      address: data.address,
      city: data.city,
      phoneNumber: data.phoneNumber,
    });

    const shippingPrice = subtotal > 0 ? 30000 : 0;
    const totalAmount = subtotal + shippingPrice;

    try {
      const orderItems = items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const baseOrderData = {
        items: orderItems,
        shippingAddress: data,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        taxPrice: 0,
        totalAmount,
      };

      const finalOrderData = user
        ? { ...baseOrderData, user: user._id }
        : {
            ...baseOrderData,
            guestDetails: { email: data.email!, fullName: data.fullName },
          };

      const newOrder = await createOrder(finalOrderData);

      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push(`/order/${newOrder._id}`);
    } catch (error: unknown) {
      let errorMessage = "Đã có lỗi xảy ra khi đặt hàng.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isClient && items.length === 0) {
      router.push("/product");
    }
  }, [isClient, items, router]);

  if (!isClient) {
    return <p className="text-center p-8">Đang tải trang thanh toán...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Thanh toán</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột Form Nhập liệu */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin liên hệ và Giao hàng
              </h2>
              <div className="space-y-4">
                {user ? (
                  <div className="space-y-2 bg-gray-100 p-4 rounded-md">
                    <p>
                      <strong>Khách hàng:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Vui lòng nhập email",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Định dạng email không hợp lệ",
                        },
                      })}
                      className="w-full border rounded p-2"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
                <hr className="my-4" />
                <div>
                  <label htmlFor="fullName" className="block mb-1 font-medium">
                    Họ và tên người nhận
                  </label>
                  <input
                    id="fullName"
                    {...register("fullName", {
                      required: "Vui lòng nhập họ tên",
                    })}
                    className="w-full border rounded p-2"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="block mb-1 font-medium">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    id="address"
                    {...register("address", {
                      required: "Vui lòng nhập địa chỉ",
                    })}
                    className="w-full border rounded p-2"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1 font-medium">
                    Thành phố
                  </label>
                  <input
                    id="city"
                    {...register("city", {
                      required: "Vui lòng nhập thành phố",
                    })}
                    className="w-full border rounded p-2"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-1 font-medium"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Vui lòng nhập số điện thoại",
                    })}
                    className="w-full border rounded p-2"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Phương thức thanh toán
              </h2>
              <div className="space-y-2">
                <div>
                  <input
                    type="radio"
                    id="cash"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => savePaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="cash">Thanh toán khi nhận hàng (COD)</label>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary subtotal={subtotal} />
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
