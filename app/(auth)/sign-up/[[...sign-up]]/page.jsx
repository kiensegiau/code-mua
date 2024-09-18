import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md hide-clerk-footer">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng ký TubeGuruji
        </h1>
        <SignUp
          className="hide-clerk-footer"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
              card: 'shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'hidden',
              dividerRow: 'hidden',
              formFieldLabel: 'text-gray-700',
              formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
              footerActionLink: 'text-indigo-600 hover:text-indigo-800',
              footer: 'hidden',
            },
            variables: {
              colorPrimary: '#4F46E5',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
          localization={{
            signUp: {
              start: {
                title: "Tạo tài khoản",
                subtitle: "để bắt đầu sử dụng TubeGuruji",
                emailPlaceholder: "Địa chỉ email",
                passwordPlaceholder: "Mật khẩu",
                emailInputLabel: "Địa chỉ email",
                passwordInputLabel: "Mật khẩu",
                submitButton: "Đăng ký",
                footerActionLink: "Đã có tài khoản? Đăng nhập",
              },
            },
          }}
        />
      </div>
    </div>
  );
}