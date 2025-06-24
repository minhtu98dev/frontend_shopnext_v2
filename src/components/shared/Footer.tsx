import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="flex justify-between items-center">
        <p>
          &copy; {new Date().getFullYear()} My Awesome App. All Rights Reserved.
        </p>
        <p>Thông tin liên hệ | Chính sách | Điều khoản</p>
      </div>
    </footer>
  );
}
