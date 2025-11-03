import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockPullRequests } from '@/lib/mockData';
import { PRStatusBadge } from '@/components/PRStatusBadge';
import { ScoreDonutChart } from '@/components/ScoreDonutChart';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
export function PullRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const filteredPRs = mockPullRequests
    .filter(pr => pr.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(pr => statusFilter === 'all' || pr.status === statusFilter);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display tracking-tight">Pull Requests</h1>
          <p className="text-muted-foreground mt-1">Review, analyze, and manage all intercepted pull requests.</p>
        </header>
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
                {filteredPRs.map((pr) => (
                  <TableRow key={pr.id}>
                    <TableCell>
                      <Link to={`/pull-requests/${pr.id}`} className="font-medium hover:underline">
                        {pr.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">{pr.repo}</div>
                    </TableCell>
                    <TableCell>
                      <PRStatusBadge status={pr.status} />
                    </TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}