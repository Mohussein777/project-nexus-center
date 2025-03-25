
import { SatisfactionMetric } from './types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface SatisfactionAnalysisProps {
  metrics: SatisfactionMetric;
}

export function SatisfactionAnalysis({ metrics }: SatisfactionAnalysisProps) {
  const sentimentData = [
    { name: 'Positive', value: metrics.sentimentBreakdown.positive },
    { name: 'Neutral', value: metrics.sentimentBreakdown.neutral },
    { name: 'Negative', value: metrics.sentimentBreakdown.negative },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Satisfaction Score Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ChartContainer 
                config={{
                  score: {
                    label: "Satisfaction Score",
                    theme: {
                      light: "#4f46e5",
                      dark: "#818cf8",
                    },
                  },
                }}
              >
                <LineChart
                  data={metrics.trends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 p-2 border rounded shadow-sm">
                            <p className="text-sm font-medium">
                              {new Date(payload[0].payload.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              Score: <span className="font-medium">{payload[0].value}</span>/10
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--color-score)" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sentiment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sentimentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 p-2 border rounded shadow-sm">
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm">
                              Value: <span className="font-medium">{payload[0].value}</span>/10
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#8884d8">
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Sentiment Analysis of Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-2">Key Insights:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                <span><strong>Positive feedback</strong> on project delivery and communication. Clients appreciated the timely updates and responsiveness of the team.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-2"></span>
                <span><strong>Areas for improvement</strong> include documentation quality and more detailed project planning at the early stages.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2"></span>
                <span><strong>Common requests</strong> include more frequent progress reports and more detailed breakdowns of work completed.</span>
              </li>
            </ul>
            
            <h4 className="font-medium mt-4 mb-2">Recommendations:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                <span>Implement weekly progress reports with visual indicators of completion percentage.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                <span>Schedule a follow-up meeting to discuss documentation needs and establish a new template.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-2"></span>
                <span>Assign a dedicated account manager to improve communication consistency.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
