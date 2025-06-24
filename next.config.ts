/** @type {import('next').NextConfig} */
const nextConfig = {
  // Thêm cấu hình images ở đây
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn ảnh từ host này
      },
      // Bạn có thể thêm các host khác ở đây nếu cần
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-host.com',
      // },
    ],
  },
};

export default nextConfig;