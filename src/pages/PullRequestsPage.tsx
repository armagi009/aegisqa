import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PRStatusBadge } from '@/components/PRStatusBadge';
import { ScoreDonutChart } from '@/components/ScoreDonutChart';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import type { PullRequest, PRStatus } from '@/lib/types';
export function PullRequestsPage() {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/pull-requests');
        if (!response.ok) {
          throw new Error('Failed to fetch pull requests');
        }
        const data = await response.json();
        setPullRequests(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPullRequests();
  }, []);
  const filteredPRs = useMemo(() => {
    return pullRequests
      .filter(pr => pr.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(pr => statusFilter === 'all' || pr.status === statusFilter);
  }, [pullRequests, searchTerm, statusFilter]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display tracking-tight">Pull Requests</h1>
          <p className="text-muted-foreground mt-1">Review, analyze, and manage all intercepted pull requests.</p>
        </header>
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search pull requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Merged">Merged</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2 mt-1" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell className="flex justify-end"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  filteredPRs.map((pr) => (
                    <TableRow key={pr.id}>
                      <TableCell>
                        <Link to={`/pull-requests/${pr.id}`} className="font-medium hover:underline">
                          {pr.title}
                        </Link>
                        <div className="text-sm text-muted-foreground">{pr.repo}</div>
                      </TableCell>
                      <TableCell><PRStatusBadge status={pr.status as PRStatus} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={pr.authorAvatar} alt={pr.author} />
                            <AvatarFallback>{pr.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{pr.author}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}</TableCell>
                      <TableCell className="flex justify-end">
                        {pr.status !== 'Pending' ? <ScoreDonutChart score={pr.score} /> : <span className="text-muted-foreground">-</span>}
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
  );
}