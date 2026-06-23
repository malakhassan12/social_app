import { Search } from 'lucide-react'

const NavSearch = () => {
  return (
      <div className="flex-1 max-w-md mx-4 ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-1.5 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
      </div>
  )
}

export default NavSearch
