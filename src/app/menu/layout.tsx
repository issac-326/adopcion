// components/Layout.tsx
import Header from '@/components/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Header />
      <main className="flex-1 overflow-auto w-full">
        <div className=" relative bg-white border my-2 mx-4 min-h-screen rounded-xl shadow-[0_3px_6px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.1),0_20px_30px_rgba(0,0,0,0.05)]
">

          {children}

        </div>
      </main>
    </div>
  );
};
 
export default Layout;
