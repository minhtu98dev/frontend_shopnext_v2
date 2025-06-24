"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getMyOrders } from "@/services/orderService";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
// Link và các thành phần form không còn cần thiết nên đã được xóa

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore(); // Chỉ cần lấy `user`
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect để lấy dữ liệu và bảo vệ route
  useEffect(() => {
    // Nếu không có user, chuyển về trang login
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const userOrders = await getMyOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử đơn hàng:", error);
        toast.error("Không thể tải lịch sử đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]); // Bỏ các dependency không cần thiết

  // Hiển thị trạng thái tải trong khi chờ user và orders
  if (isLoading || !user) {
    return <p className="text-center p-8">Đang tải trang cá nhân...</p>;
  }

  // Giao diện chính để hiển thị
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trang cá nhân</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột Thông tin tài khoản */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold border-b pb-3">
              Thông tin tài khoản
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Khách hàng:</span>
                <span className="font-semibold text-gray-800">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-gray-800">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng số đơn hàng:</span>
                <span className="font-bold text-lg text-blue-600">
                  {orders.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột lịch sử đơn hàng */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h2>
            <div className="space-y-4">
              {isLoading ? (
                <p>Đang tải đơn hàng...</p>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="border p-4 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3 pb-3 border-b">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Mã ĐH:{" "}
                          <span className="text-blue-600">
                            #{order._id.substring(0, 7)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Ngày đặt:{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            order.isDelivered
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          {order.isDelivered ? "Đã giao hàng" : "Đang xử lý"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600 mb-2">
                        Các sản phẩm đã đặt:
                      </h4>
                      <ul className="space-y-1 pl-2">
                        {order.items.map((item) => (
                          <li
                            key={item.product}
                            className="text-sm text-gray-800 flex justify-between"
                          >
                            <span>- {item.name}</span>
                            <span className="font-medium text-gray-600">
                              Số lượng: {item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p>Bạn chưa có đơn hàng nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
