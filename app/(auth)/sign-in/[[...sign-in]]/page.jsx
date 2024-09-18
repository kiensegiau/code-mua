import { SignIn } from "@clerk/nextjs";
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md hide-clerk-footer">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h1>
        <SignIn
          className="hide-clerk-footer"
          appearance={{
            elements: {
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",footer: 'hidden',
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "hidden",
              dividerRow: "hidden",
              formFieldLabel: "text-gray-700",
              formFieldInput:
                "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
              footerActionLink: "text-indigo-600 hover:text-indigo-800",
            },
            variables: {
              colorPrimary: "#4F46E5",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
          localization={{
            signIn: {
              start: {
                title: "Đăng nhập vào tài khoản",
                subtitle: "để tiếp tục sử dụng TubeGuruji",
                emailPlaceholder: "Địa chỉ email",
                passwordPlaceholder: "Mật khẩu",
                emailInputLabel: "Địa chỉ email",
                passwordInputLabel: "Mật khẩu",
                submitButton: "Đăng nhập",
              },
            },
          }}
        />
        <div className="mt-4 text-center">
          <Link href="/sign-up" className="text-sm text-indigo-600 hover:text-indigo-800">
            Chưa có tài khoản? Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
