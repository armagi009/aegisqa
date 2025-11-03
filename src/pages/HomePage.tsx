import { Link } from 'react-router-dom';
import { BarChart, CheckCircle, GitPullRequest, Shield, TrendingUp } from 'lucide-react';
import { dashboardStats, mockPullRequests } from '@/lib/mockData';
import { DashboardStatsCard } from '@/components/DashboardStatsCard';
import { PRStatusBadge } from '@/components/PRStatusBadge';
import { ScoreDonutChart } from '@/components/ScoreDonutChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
const chartData = [
  { name: 'Week 1', score: 82 },
  { name: 'Week 2', score: 85 },
  { name: 'Week 3', score: 81 },
  { name: 'Week 4', score: 88 },
  { name: 'This Week', score: 87 },
];
export function HomePage() {
  const recentPRs = mockPullRequests.slice(0, 5);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's a summary of your QA activities.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <DashboardStatsCard
            title="PRs Processed"
            value={dashboardStats.prsProcessed}
            icon={<GitPullRequest className="h-5 w-5 text-muted-foreground" />}
            change={5.2}
            changeType="increase"
          />
          <DashboardStatsCard
            title="Average Score"
            value={dashboardStats.avgScore}
            icon={<Shield className="h-5 w-5 text-muted-foreground" />}
            change={1.5}
            changeType="increase"
          />
          <DashboardStatsCard
            title="Pass Rate"
            value={`${dashboardStats.passRate}%`}
            icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />}
            change={2.1}
            changeType="decrease"
          />
          <DashboardStatsCard
            title="Review Rate"
            value={`${dashboardStats.reviewRate}%`}
            icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
          />
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
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis domain={[70, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
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
                  {recentPRs.map((pr) => (
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
                      <TableCell>
                        <PRStatusBadge status={pr.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {pr.status !== 'Pending' ? <ScoreDonutChart score={pr.score} size={32} /> : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}