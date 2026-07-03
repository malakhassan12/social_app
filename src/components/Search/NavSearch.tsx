import { Search } from "lucide-react";
import SearchDrawer from "../Drawer/SearchDrawer";

const NavSearch = () => {
  return (
    <div >
      <SearchDrawer>
        <div className="relative cursor-pointer">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <div className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-400 dark:text-gray-500">
            Search...
          </div>
        </div>
      </SearchDrawer>
    </div>
  );
};

export default NavSearch;