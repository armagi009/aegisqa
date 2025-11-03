import { CheckCircle, XCircle, AlertTriangle, GitMerge, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PRStatus } from '@/lib/mockData';
interface PRStatusBadgeProps {
  status: PRStatus;
  className?: string;
}
const statusConfig = {
  Merged: {
    icon: GitMerge,
    label: 'Merged',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  },
  Review: {
    icon: AlertTriangle,
    label: 'Review',
    className: 'bg-warning/20 text-warning-foreground',
  },
  Blocked: {
    icon: XCircle,
    label: 'Blocked',
    className: 'bg-danger/20 text-danger-foreground',
  },
  Pending: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-secondary text-secondary-foreground',
  },
};
export function PRStatusBadge({ status, className }: PRStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border-0',
        config.className,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </Badge>
  );
}