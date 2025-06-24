import { getProducts } from "@/services/productService";
import ProductPage from "@/components/pages/ProductPage";
import CategoryFilter from "@/components/features/product/CategoryFilter";

/**
 * Interface định nghĩa các search params mà trang này có thể nhận.
 * Giúp code an toàn và dễ hiểu hơn khi làm việc với TypeScript.
 */
interface ProductRouteProps {
  searchParams?: {
    category?: string;
    keyword?: string;
  };
}

/**
 * Đây là Server Component chính cho trang sản phẩm.
 * Nó chịu trách nhiệm:
 * 1. Đọc `category` và `keyword` từ URL.
 * 2. Lấy danh sách tất cả các category duy nhất để hiển thị bộ lọc.
 * 3. Lấy danh sách sản phẩm đã được lọc/tìm kiếm.
 * 4. Hiển thị tiêu đề động và truyền dữ liệu vào các component con.
 */
export default async function Product({ searchParams }: ProductRouteProps) {
  // Lấy category và keyword từ URL một cách an toàn
  const currentCategory = searchParams?.category;
  const currentKeyword = searchParams?.keyword;

  /**
   * Hàm để lấy ra danh sách các category duy nhất từ tất cả sản phẩm.
   * Việc này đảm bảo bộ lọc category luôn hiển thị đầy đủ,
   * không bị ảnh hưởng bởi việc lọc hay tìm kiếm hiện tại.
   */
  const getUniqueCategories = async () => {
    try {
      // Luôn gọi getProducts() không có tham số để lấy TẤT CẢ sản phẩm
      const allProducts = await getProducts();
      if (!allProducts) return [];
      const categories = allProducts.map((p) => p.category);
      return [...new Set(categories)]; // Dùng Set để loại bỏ các category trùng lặp
    } catch (error) {
      console.error("Không thể lấy danh sách category:", error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  };

  // Sử dụng Promise.all để thực hiện việc lấy danh sách category
  // và lấy danh sách sản phẩm đã lọc một cách đồng thời, giúp tăng hiệu năng.
  const [categories, filteredProducts] = await Promise.all([
    getUniqueCategories(),
    getProducts(currentCategory, currentKeyword), // Truyền cả category và keyword vào service
  ]);

  // Tạo tiêu đề trang một cách linh động để phản ánh trạng thái hiện tại
  const pageTitle = currentKeyword
    ? `Kết quả tìm kiếm cho "${currentKeyword}"`
    : currentCategory
    ? `Sản phẩm trong "${currentCategory}"`
    : "Tất cả sản phẩm";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{pageTitle}</h1>

      {/* Component bộ lọc theo category */}
      <CategoryFilter categories={categories} />

      {/* Component hiển thị danh sách sản phẩm đã được lọc */}
      <div className="mt-8">
        <ProductPage products={filteredProducts} />
      </div>
    </div>
  );
}
