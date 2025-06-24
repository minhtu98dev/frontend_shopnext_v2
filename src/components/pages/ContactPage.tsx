import React from "react";

export default function ContactPage() {
  return (
    <main>
      <h1>Liên Hệ</h1>
      <p>Thông tin liên hệ của chúng tôi và form để khách hàng gửi tin nhắn.</p>
      <form>
        <div>
          <label htmlFor="name">Họ tên:</label>
          <input type="text" id="name" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" />
        </div>
        <div>
          <label htmlFor="message">Nội dung:</label>
          <textarea id="message"></textarea>
        </div>
        <button type="submit">Gửi</button>
      </form>
    </main>
  );
}
