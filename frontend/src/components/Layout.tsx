import type { ReactNode } from "react";
import Header from "./Header";
import { Toaster } from "./ui/sonner";

interface LayoutProps {
  children: ReactNode;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearch?: () => void;
  searchDisabled?: boolean;
}

const Layout = ({
  children,
  searchQuery,
  setSearchQuery,
  onSearch,
  searchDisabled,
}: LayoutProps) => {
  return (
    <div>
      <Header
        searchQuery={searchQuery || ""}
        setSearchQuery={setSearchQuery || (() => {})}
        onSearch={onSearch || (() => {})}
        disabled={searchDisabled}
      />
      <main className="py-8 px-8 sm:px-16 ">{children}</main>
      <Toaster />
    </div>
  );
};

export default Layout;
