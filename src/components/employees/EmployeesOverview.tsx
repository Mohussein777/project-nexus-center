
import { useState } from 'react';
import { Search, Plus, Filter, Mail, Phone, Briefcase, Calendar } from 'lucide-react';

export function EmployeesOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const employees = [
    {
      id: 1,
      name: 'Ahmad Hassan',
      position: 'Senior Architect',
      email: 'ahmad.hassan@company.com',
      phone: '+971 50 123 4567',
      department: 'Architecture',
      joinDate: 'May 12, 2020',
      status: 'Active',
      avatar: 'AH',
      color: 'from-blue-500 to-cyan-500',
      projects: 4
    },
    {
      id: 2,
      name: 'Sarah Mohammed',
      position: 'Financial Manager',
      email: 'sarah.m@company.com',
      phone: '+971 50 234 5678',
      department: 'Finance',
      joinDate: 'Jan 8, 2019',
      status: 'Active',
      avatar: 'SM',
      color: 'from-purple-500 to-pink-500',
      projects: 0
    },
    {
      id: 3,
      name: 'Khalid Al-Otaibi',
      position: 'Project Manager',
      email: 'khalid.o@company.com',
      phone: '+966 55 345 6789',
      department: 'Project Management',
      joinDate: 'Oct 15, 2021',
      status: 'Active',
      avatar: 'KO',
      color: 'from-amber-500 to-orange-500',
      projects: 3
    },
    {
      id: 4,
      name: 'Fatima Rashid',
      position: 'Civil Engineer',
      email: 'fatima.r@company.com',
      phone: '+971 50 456 7890',
      department: 'Engineering',
      joinDate: 'Mar 22, 2020',
      status: 'Active',
      avatar: 'FR',
      color: 'from-green-500 to-emerald-500',
      projects: 2
    },
    {
      id: 5,
      name: 'Omar Al-Farsi',
      position: 'MEP Engineer',
      email: 'omar.f@company.com',
      phone: '+971 50 567 8901',
      department: 'Engineering',
      joinDate: 'Jul 3, 2022',
      status: 'Active',
      avatar: 'OF',
      color: 'from-red-500 to-pink-500',
      projects: 2
    },
    {
      id: 6,
      name: 'Layla Abdullah',
      position: 'HR Specialist',
      email: 'layla.a@company.com',
      phone: '+966 55 678 9012',
      department: 'Human Resources',
      joinDate: 'Feb 18, 2021',
      status: 'On Leave',
      avatar: 'LA',
      color: 'from-indigo-500 to-purple-500',
      projects: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search employees..."
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
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300">Employee Overview</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">Total: 28 employees across 5 departments</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center px-3">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">18</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Active</p>
          </div>
          <div className="text-center px-3 border-l border-blue-200 dark:border-blue-700">
            <p className="text-2xl font-bold text-orange-500 dark:text-orange-300">3</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">On Leave</p>
          </div>
          <div className="text-center px-3 border-l border-blue-200 dark:border-blue-700">
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">7</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Remote</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div key={employee.id} className="glass-card dark:glass-card-dark rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${employee.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {employee.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {employee.status}
                    </span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full px-2 py-0.5">
                      {employee.department}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail size={14} className="mr-2 text-muted-foreground" />
                  <a href={`mailto:${employee.email}`} className="text-primary hover:underline">{employee.email}</a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone size={14} className="mr-2 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={14} className="mr-2 text-muted-foreground" />
                  <span>Joined {employee.joinDate}</span>
                </div>
                {employee.projects > 0 && (
                  <div className="flex items-center text-sm">
                    <Briefcase size={14} className="mr-2 text-muted-foreground" />
                    <span>{employee.projects} Active Projects</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-border flex divide-x divide-border">
              <button className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Profile
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Schedule
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Tasks
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
