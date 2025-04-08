
import { supabase } from "@/integrations/supabase/client";
import { SatisfactionMetric } from "@/components/clients/types";
import { Database } from "@/integrations/supabase/types";

export type DbSatisfactionMetric = Database['public']['Tables']['satisfaction_metrics']['Row'];

// Get client satisfaction metrics
export const getClientSatisfactionMetrics = async (clientId: number): Promise<SatisfactionMetric | null> => {
  // Get overall score (latest metric)
  const { data: latestMetric, error: latestError } = await supabase
    .from('satisfaction_metrics')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (latestError && latestError.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error(`Error fetching latest satisfaction metric for client ${clientId}:`, latestError);
    return null;
  }

  // Get all metrics for trend data
  const { data: allMetrics, error: trendsError } = await supabase
    .from('satisfaction_metrics')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: true });

  if (trendsError) {
    console.error(`Error fetching satisfaction trends for client ${clientId}:`, trendsError);
    return null;
  }

  // Get sentiment breakdown from interactions
  const { data: interactions, error: sentimentError } = await supabase
    .from('interactions')
    .select('sentiment')
    .eq('client_id', clientId)
    .not('sentiment', 'is', null);

  if (sentimentError) {
    console.error(`Error fetching sentiment data for client ${clientId}:`, sentimentError);
    return null;
  }

  // Count sentiments
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  interactions?.forEach(interaction => {
    if (interaction.sentiment === 'Positive') sentimentCounts.positive++;
    else if (interaction.sentiment === 'Neutral') sentimentCounts.neutral++;
    else if (interaction.sentiment === 'Negative') sentimentCounts.negative++;
  });

  // If no metrics exist yet, return null or a default
  if (!latestMetric) return null;

  return {
    clientId,
    overallScore: latestMetric.overall_score,
    trends: (allMetrics || []).map(metric => ({
      date: metric.date,
      score: metric.overall_score,
    })),
    sentimentBreakdown: sentimentCounts,
  };
};
