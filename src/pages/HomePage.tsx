import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GitPullRequest, Shield, CheckCircle, TrendingUp } from 'lucide-react';
import { DashboardStatsCard } from '@/components/DashboardStatsCard';
import { PRStatusBadge } from '@/components/PRStatusBadge';
import { ScoreDonutChart } from '@/components/ScoreDonutChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import type { DashboardStats, PullRequest } from '@/lib/types';
const chartData = [
  { name: 'Week 1', score: 82 },
  { name: 'Week 2', score: 85 },
  { name: 'Week 3', score: 81 },
  { name: 'Week 4', score: 88 },
  { name: 'This Week', score: 87 },
];
export function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPRs, setRecentPRs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, prsRes] = await Promise.all([
          fetch('/api/dashboard-stats'),
          fetch('/api/pull-requests')
        ]);
        if (!statsRes.ok || !prsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const statsData = await statsRes.json();
        const prsData = await prsRes.json();
        setStats(statsData.data);
        setRecentPRs(prsData.data.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's a summary of your QA activities.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {loading || !stats ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <DashboardStatsCard title="PRs Processed" value={stats.prsProcessed} icon={<GitPullRequest className="h-5 w-5 text-muted-foreground" />} change={5.2} changeType="increase" />
              <DashboardStatsCard title="Average Score" value={stats.avgScore} icon={<Shield className="h-5 w-5 text-muted-foreground" />} change={1.5} changeType="increase" />
              <DashboardStatsCard title="Pass Rate" value={`${stats.passRate}%`} icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />} change={2.1} changeType="decrease" />
              <DashboardStatsCard title="Review Rate" value={`${stats.reviewRate}%`} icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} />
            </>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Weekly Average Score</CardTitle>
              <CardDescription>A look at the average quality score over the last 5 weeks.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer>
                <RechartsBarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Pull Requests</CardTitle>
                <CardDescription>The latest PRs being evaluated.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/pull-requests">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PR</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell className="flex justify-end"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    recentPRs.map((pr) => (
                      <TableRow key={pr.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={pr.authorAvatar} alt={pr.author} />
                              <AvatarFallback>{pr.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <Link to={`/pull-requests/${pr.id}`} className="font-medium hover:underline leading-tight block">
                                {pr.title}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {pr.repo} &middot; {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><PRStatusBadge status={pr.status} /></TableCell>
                        <TableCell className="text-right">
                          {pr.status !== 'Pending' ? <ScoreDonutChart score={pr.score} size={32} /> : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}