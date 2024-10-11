// components/Layout.tsx
import Header from '@/components/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Header />
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
