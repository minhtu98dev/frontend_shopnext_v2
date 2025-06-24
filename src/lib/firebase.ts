import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Đọc các keys từ file .env.local
console.log("API Key đang được sử dụng:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Khởi tạo Firebase App một cách an toàn
// Kiểm tra xem app đã được khởi tạo chưa để tránh lỗi khi hot-reloading trong môi trường dev
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Lấy và export instance của Firebase Authentication để dùng trong các component khác
export const auth = getAuth(app);

// Nếu bạn cần dùng Analytics, bạn cũng có thể export nó từ đây
// import { getAnalytics } from "firebase/analytics";
// export const analytics = getAnalytics(app);