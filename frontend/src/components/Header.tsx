import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  disabled?: boolean;
}

const Header = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  disabled,
}: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="relative p-4 border-b shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 pl-4">
          <img
            src="/src/assets/company-icon.svg"
            alt="Company Logo"
            className=""
          />
          {/*<h1 className="text-2xl font-bold">BookIt</h1>*/}
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search experiences..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              disabled={disabled}
            />
          </div>
          <Button
            style={{
              backgroundColor: "#FFD643",
              color: "#161616",
              borderRadius: "8px",
            }}
            onClick={onSearch}
            disabled={disabled}
          >
            Search
          </Button>
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            disabled={disabled}
          >
            {isSearchOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {isSearchOpen && (
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search experiences..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              disabled={disabled}
            />
          </div>
          <Button
            className="w-full mt-2"
            style={{
              backgroundColor: "#FFD643",
              color: "#161616",
              borderRadius: "8px",
            }}
            onClick={onSearch}
            disabled={disabled}
          >
            Search
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
