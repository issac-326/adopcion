// components/Layout.tsx
import Header from '@/components/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Header />
      <main className="flex-1 overflow-auto w-full">
        <div className=" relative bg-white border my-2 mx-4 px-4 pb-4 min-h-screen rounded-xl shadow-[0_4px_8px_rgba(0,0,255,0.2),0_2px_4px_rgba(0,0,0,0.1)]">

          {children}

        </div>
      </main>
    </div>
  );
};

export default Layout;
