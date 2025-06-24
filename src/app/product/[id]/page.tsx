import { getProductById } from "@/services/productService";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import { notFound } from "next/navigation";

// Props của page này sẽ chứa `params` với `id` của sản phẩm
interface PageProps {
  params: {
    id: string;
  };
}

// Đây là một Server Component `async` để fetch dữ liệu
export default async function Page({ params }: PageProps) {
  const { id } = params;

  // Gọi service để lấy dữ liệu sản phẩm trên server
  const product = await getProductById(id);

  // Quan trọng: Nếu API trả về null (không tìm thấy sản phẩm),
  // gọi hàm notFound() để hiển thị trang 404 của Next.js
  if (!product) {
    notFound();
  }

  // Nếu tìm thấy, render Client Component và truyền dữ liệu vào
  return <ProductDetailPage product={product} />;
}
