
import { useState } from 'react';
import { Interaction } from './types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone, Mail, FileText, Calendar, Filter } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface InteractionsListProps {
  interactions: Interaction[];
}

export function InteractionsList({ interactions }: InteractionsListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  const filteredInteractions = filter 
    ? interactions.filter(i => i.type === filter) 
    : interactions;

  const getIcon = (type: string) => {
    switch(type) {
      case 'Meeting': return <MessageSquare size={16} />;
      case 'Call': return <Phone size={16} />;
      case 'Email': return <Mail size={16} />;
      case 'Note': return <FileText size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch(sentiment) {
      case 'Positive': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Negative': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Neutral': 
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex mb-4 overflow-x-auto pb-2 gap-2">
        <Button 
          variant={filter === null ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter(null)}
          className="whitespace-nowrap"
        >
          All
        </Button>
        
        <Button 
          variant={filter === 'Meeting' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('Meeting')}
          className="whitespace-nowrap"
        >
          <MessageSquare size={14} className="mr-2" />
          Meetings
        </Button>
        
        <Button 
          variant={filter === 'Call' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('Call')}
          className="whitespace-nowrap"
        >
          <Phone size={14} className="mr-2" />
          Calls
        </Button>
        
        <Button 
          variant={filter === 'Email' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('Email')}
          className="whitespace-nowrap"
        >
          <Mail size={14} className="mr-2" />
          Emails
        </Button>
        
        <Button 
          variant={filter === 'Note' ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter('Note')}
          className="whitespace-nowrap"
        >
          <FileText size={14} className="mr-2" />
          Notes
        </Button>
      </div>

      {filteredInteractions.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No interactions found</h3>
          <p className="text-muted-foreground">
            {filter ? `No ${filter.toLowerCase()} interactions recorded yet.` : 'No interactions have been recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInteractions.map((interaction) => (
            <Card key={interaction.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start">
                  <div className={`p-4 flex items-center justify-center ${
                    interaction.type === 'Meeting' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    interaction.type === 'Call' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    interaction.type === 'Email' ? 'bg-amber-100 dark:bg-amber-900/20' :
                    'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    {getIcon(interaction.type)}
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">{interaction.type}</span>
                        {interaction.sentiment && (
                          <Badge className={`ml-2 ${getSentimentColor(interaction.sentiment)}`}>
                            {interaction.sentiment}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(interaction.date).toLocaleDateString()} at {new Date(interaction.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm">{interaction.summary}</p>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        By {interaction.employee}
                      </div>
                      
                      {interaction.followupDate && (
                        <div className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
                          <Calendar size={12} className="mr-1" />
                          Follow-up on {new Date(interaction.followupDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
