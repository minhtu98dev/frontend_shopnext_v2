import ResetPasswordPage from "@/components/pages/ResetPasswordPage";
interface PageProps {
  params: { token: string };
}

export default function ResetPassword({ params }: PageProps) {
  // Lấy token từ URL và truyền vào component
  return <ResetPasswordPage token={params.token} />;
}
