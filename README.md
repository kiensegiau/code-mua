# Khoahoc.live - Nền tảng học trực tuyến

## Cấu trúc thư mục

Dự án này sử dụng Next.js với App Router và đã được chuẩn hóa theo cấu trúc sau:

```
/
├── app/                      # Thư mục chính cho App Router
│   ├── api/                  # API routes cho App Router
│   ├── (router)/             # Các routes chính
│   ├── _components/          # Components dùng chung cho app router
│   ├── _hooks/               # React hooks dùng chung
│   ├── _context/             # React contexts
│   ├── _models/              # Định nghĩa models
│   ├── _providers/           # Providers cho React context
│   ├── _utils/               # Utilities và helpers 
│   ├── layout.js             # Root layout
│   └── page.js               # Trang chủ
├── components/               # Components UI dùng chung toàn ứng dụng
│   └── ui/                   # UI components (button, select, etc.)
├── lib/                      # Libraries và utilities dùng chung
│   ├── models/               # Định nghĩa models chung
│   ├── middleware/           # Middleware functions
│   └── api/                  # API utilities
├── public/                   # Static assets
└── tests/                    # Scripts kiểm thử
```

## Quy ước lập trình

1. **Components**
   - Đặt trong thư mục `app/_components/` cho App Router
   - Đặt trong thư mục `app/(router)/[route]/_components/` cho các components riêng của route
   - Đặt trong thư mục `components/` cho các components dùng chung toàn ứng dụng

2. **API Routes**
   - Sử dụng App Router API routes trong thư mục `app/api/`
   - Sử dụng cấu trúc: `app/api/[resource]/route.js` 

3. **Hooks & Context**
   - Đặt hooks dùng chung trong `app/_hooks/`
   - Đặt contexts trong `app/_context/`

4. **Models**
   - Đặt định nghĩa models trong `app/_models/` cho App Router
   - Đặt định nghĩa models dùng chung trong `lib/models/`

## Xử lý lỗi Client-side trong ứng dụng

### 1. ErrorBoundary

ErrorBoundary là component để bắt và xử lý lỗi React. Đã được thêm vào `app/layout.js` để bao bọc toàn bộ ứng dụng.

```jsx
// Sử dụng trong component cha
<ErrorBoundary>
  <ComponentCóThểGâyLỗi />
</ErrorBoundary>
```

### 2. ClientOnly component

Sử dụng để đảm bảo component chỉ render ở phía client, tránh lỗi hydration.

```jsx
import ClientOnly from "@/app/_components/ClientOnly";

// Sử dụng trực tiếp
<ClientOnly>
  <ComponentSửDụngWindowHoặcDocument />
</ClientOnly>

// Hoặc sử dụng HOC
import { withClientOnly } from "@/app/_components/ClientOnly";
const SafeComponent = withClientOnly(UnsafeComponent);
```

### 3. SafeHydration

Giải quyết lỗi hydration khi có sự khác biệt giữa server-side rendering và client-side rendering.

```jsx
import SafeHydration, { withSafeHydration, HydrationErrorBoundary } from "@/app/_components/SafeHydration";

// Sử dụng trực tiếp
<SafeHydration>
  <ComponentCóThểGâyLỗiHydration />
</SafeHydration>

// Hoặc sử dụng HOC
const SafeComponent = withSafeHydration(UnsafeComponent);

// Hoặc sử dụng HydrationErrorHandler để phát hiện và xử lý lỗi hydration
// (CHÚ Ý: Chỉ dùng khi đã có ErrorBoundary ở cấp cao hơn)
<HydrationErrorHandler message="Đang tải...">
  <ComponentCóThểGâyLỗiHydration />
</HydrationErrorHandler>
```

### 4. Truy cập dữ liệu an toàn

Sử dụng các utility function để tránh lỗi "Cannot read property X of undefined/null".

```jsx
import { safeProp, isSafeToRender, isSafeArray } from "@/app/_utils/safeDataAccess";

// Truy cập thuộc tính lồng nhau an toàn
const userName = safeProp(user, 'profile.name', 'Không có tên');

// Kiểm tra đối tượng có đủ thuộc tính không
if (isSafeToRender(course, ['id', 'title', 'lessons'])) {
  // Render component
}

// Kiểm tra mảng có an toàn để map không
if (isSafeArray(lessons)) {
  // Map lessons
}
```

### 5. useSafeData hook

Hook để fetch và xử lý dữ liệu API an toàn.

```jsx
import { useSafeData } from "@/app/_hooks/useSafeData";

function MyComponent() {
  const { 
    data, 
    isLoading, 
    error, 
    fetchData,
    getSafe,
    isSafeToMap,
    isValidData
  } = useSafeData(fetchApiFunction, {
    dependencies: [id],
    requiredFields: ['id', 'title', 'content']
  });

  // Truy cập dữ liệu an toàn
  const title = getSafe('title', 'Tiêu đề mặc định');

  // Kiểm tra mảng an toàn để map
  if (isSafeToMap('items')) {
    // Map items
  }

  return (
    {isLoading ? (
      <LoadingSkeleton />
    ) : error ? (
      <ErrorMessage message={error} />
    ) : !isValidData ? (
      <InvalidDataMessage />
    ) : (
      <SuccessContent data={data} />
    )}
  );
}
```

### 6. useClientSide hook

Các hooks để truy cập client-side APIs an toàn.

```jsx
import { useClientSide, useWindowSafe, useLocalStorage, useDocumentSafe } from "@/app/_hooks/useClientSide";

function MyComponent() {
  // Kiểm tra đang ở client-side
  const isClient = useClientSide();

  // Truy cập window an toàn
  const windowWidth = useWindowSafe(window => window.innerWidth);

  // Sử dụng localStorage an toàn
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  // Truy cập document an toàn
  const documentTitle = useDocumentSafe(doc => doc.title);

  return (
    <>
      {isClient ? (
        <ClientComponent />
      ) : (
        <ServerFallback />
      )}
    </>
  );
}
```

## Quy tắc chống lỗi client-side

1. **Luôn kiểm tra dữ liệu trước khi render**
   ```jsx
   {data && data.items && data.items.length > 0 && (
     <ComponentHiểnThị items={data.items} />
   )}
   ```

2. **Sử dụng đối tượng mặc định khi destructuring**
   ```jsx
   const { title = 'Mặc định', description = '', image = null } = data || {};
   ```

3. **Bọc code có thể gây lỗi trong try-catch**
   ```jsx
   try {
     // Code có thể gây lỗi
   } catch (error) {
     console.error(error);
     return <ErrorFallback message={error.message} />;
   }
   ```

4. **Không truy cập window/document trực tiếp ở component cấp cao**
   ```jsx
   // Sai
   const windowWidth = window.innerWidth; // Lỗi khi SSR

   // Đúng
   const [windowWidth, setWindowWidth] = useState(null);
   useEffect(() => {
     setWindowWidth(window.innerWidth);
   }, []);
   ```

5. **Lazy load các component nặng hoặc có thể gây lỗi**
   ```jsx
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     ssr: false,
     loading: () => <Loading />
   });
   ```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
#   c o d e - m u a 
 
 