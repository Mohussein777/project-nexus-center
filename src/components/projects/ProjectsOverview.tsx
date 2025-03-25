
import { useState } from 'react';
import { Search, Plus, Filter, ArrowUpDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function ProjectsOverview() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 1,
      name: 'Al Hamra Tower',
      client: 'Al Hamra Real Estate',
      status: 'In Progress',
      progress: 65,
      deadline: 'Aug 15, 2023',
      team: 8,
      priority: 'High',
      tag: 'Commercial'
    },
    {
      id: 2,
      name: 'Marina Residence',
      client: 'Gulf Developers',
      status: 'At Risk',
      progress: 45,
      deadline: 'Jul 30, 2023',
      team: 6,
      priority: 'Medium',
      tag: 'Residential'
    },
    {
      id: 3,
      name: 'Tech Park',
      client: 'Ministry of Technology',
      status: 'On Track',
      progress: 72,
      deadline: 'Oct 10, 2023',
      team: 12,
      priority: 'High',
      tag: 'Government'
    },
    {
      id: 4,
      name: 'Gulf Heights',
      client: 'Al Madina Group',
      status: 'Delayed',
      progress: 35,
      deadline: 'Jun 20, 2023',
      team: 9,
      priority: 'Urgent',
      tag: 'Mixed Use'
    },
    {
      id: 5,
      name: 'Central Hospital',
      client: 'Ministry of Health',
      status: 'On Track',
      progress: 85,
      deadline: 'Sep 5, 2023',
      team: 15,
      priority: 'High',
      tag: 'Healthcare'
    },
    {
      id: 6,
      name: 'Sunset Mall',
      client: 'Retail Ventures',
      status: 'On Hold',
      progress: 25,
      deadline: 'N/A',
      team: 4,
      priority: 'Low',
      tag: 'Retail'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Delayed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'On Hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 dark:text-red-400';
      case 'High': return 'text-orange-600 dark:text-orange-400';
      case 'Medium': return 'text-blue-600 dark:text-blue-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        
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
      </div>

      <div className="glass-card dark:glass-card-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">All Projects (6)</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {projects.map(project => (
              <div key={project.id} className="border border-border rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          project.status === 'On Track' || project.status === 'Completed' 
                            ? 'bg-green-500' 
                            : project.status === 'At Risk' 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        }`} 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Deadline</p>
                      <p className="font-medium flex items-center">
                        <Clock size={14} className="mr-1" />
                        {project.deadline}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Team</p>
                      <p className="font-medium">{project.team} members</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Priority</p>
                      <p className={`font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{project.tag}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-border px-4 py-2 bg-gray-50 dark:bg-gray-800 flex justify-between">
                  <button className="text-sm text-primary hover:underline">Details</button>
                  <button className="text-sm text-primary hover:underline">Tasks</button>
                  <button className="text-sm text-primary hover:underline">Files</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>Project</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Deadline</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Team</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.tag}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{project.client}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-full max-w-[100px] h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            project.status === 'On Track' || project.status === 'Completed' 
                              ? 'bg-green-500' 
                              : project.status === 'At Risk' 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`} 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{project.deadline}</td>
                    <td className="px-4 py-3 text-sm">{project.team} members</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button className="text-primary hover:underline">Edit</button>
                        <button className="text-primary hover:underline">Tasks</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
