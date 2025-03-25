
import { useState } from 'react';
import { Search, Plus, Filter, Phone, Mail, MapPin } from 'lucide-react';

export function ClientsOverview() {
  const [searchQuery, setSearchQuery] = useState('');

  const clients = [
    {
      id: 1,
      name: 'Al Hamra Real Estate',
      contact: 'Mohammed Al-Farsi',
      email: 'contact@alhamrarealestate.com',
      phone: '+971 4 123 4567',
      location: 'Dubai, UAE',
      projects: 3,
      status: 'Active',
      type: 'Corporate'
    },
    {
      id: 2,
      name: 'Gulf Developers',
      contact: 'Abdullah Al-Otaibi',
      email: 'info@gulfdevelopers.com',
      phone: '+966 12 345 6789',
      location: 'Riyadh, KSA',
      projects: 2,
      status: 'Active',
      type: 'Corporate'
    },
    {
      id: 3,
      name: 'Ministry of Technology',
      contact: 'Dr. Fahad Al-Saud',
      email: 'contact@mot.gov.sa',
      phone: '+966 11 234 5678',
      location: 'Riyadh, KSA',
      projects: 1,
      status: 'Active',
      type: 'Government'
    },
    {
      id: 4,
      name: 'Al Madina Group',
      contact: 'Saeed Al-Mansour',
      email: 'info@almadinagroup.com',
      phone: '+971 2 345 6789',
      location: 'Abu Dhabi, UAE',
      projects: 2,
      status: 'Active',
      type: 'Corporate'
    },
    {
      id: 5,
      name: 'Ministry of Health',
      contact: 'Dr. Layla Al-Faisal',
      email: 'projects@moh.gov.sa',
      phone: '+966 11 345 6789',
      location: 'Jeddah, KSA',
      projects: 1,
      status: 'Active',
      type: 'Government'
    },
    {
      id: 6,
      name: 'Retail Ventures',
      contact: 'Tariq Al-Qasimi',
      email: 'info@retailventures.ae',
      phone: '+971 4 987 6543',
      location: 'Dubai, UAE',
      projects: 1,
      status: 'Inactive',
      type: 'Corporate'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search clients..."
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
            <span>New Client</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="glass-card dark:glass-card-dark rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">{client.contact}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {client.status}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Mail size={14} className="mr-2 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone size={14} className="mr-2 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin size={14} className="mr-2 text-muted-foreground" />
                  <span>{client.location}</span>
                </div>
              </div>
              
              <div className="mt-4 text-sm">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full px-2.5 py-0.5">
                  {client.type}
                </span>
                <span className="ml-2 text-muted-foreground">
                  {client.projects} {client.projects === 1 ? 'Project' : 'Projects'}
                </span>
              </div>
            </div>
            
            <div className="border-t border-border flex divide-x divide-border">
              <button className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                View Profile
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Projects
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Invoices
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
