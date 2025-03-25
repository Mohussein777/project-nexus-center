
import { Search, Filter, Plus } from 'lucide-react';

interface ProjectsSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ProjectsSearchFilter({ searchQuery, setSearchQuery }: ProjectsSearchFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm w-60 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800"
        />
      </div>
      
      <button className="inline-flex items-center space-x-1 px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <Filter size={16} />
        <span>Filter</span>
      </button>
      
      <button className="inline-flex items-center space-x-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
        <Plus size={16} />
        <span>New Project</span>
      </button>
    </div>
  );
}
