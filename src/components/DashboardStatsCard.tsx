import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeType?: 'increase' | 'decrease';
}
export function DashboardStatsCard({ title, value, icon, change, changeType }: DashboardStatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && changeType && (
          <p className="text-xs text-muted-foreground flex items-center">
            {changeType === 'increase' ? (
              <ArrowUp className="h-4 w-4 text-success mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-danger mr-1" />
            )}
            {change}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}