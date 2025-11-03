import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRStatusBadge } from '@/components/PRStatusBadge';
import { ScoreDonutChart } from '@/components/ScoreDonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Check, GitMerge, ThumbsDown, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { PullRequest, AgentName, PRStatus } from '@/lib/types';
import { Toaster, toast } from 'sonner';
const agentColors: Record<AgentName, string> = {
  Correctness: 'text-blue-500',
  Architecture: 'text-purple-500',
  Security: 'text-red-500',
  Performance: 'text-green-500',
  Maintainability: 'text-yellow-500',
};
export function PullRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pr, setPr] = useState<PullRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  useEffect(() => {
    if (!id) return;
    const fetchPullRequest = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/pull-requests/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Pull request not found');
          }
          throw new Error('Failed to fetch pull request details');
        }
        const data = await response.json();
        setPr(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPullRequest();
  }, [id]);
  const handleUpdateStatus = async (status: PRStatus) => {
    if (!pr) return;
    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/pull-requests/${pr.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update status to ${status}`);
      }
      const updatedPr = await response.json();
      setPr(updatedPr.data);
      toast.success(`Pull request status updated to "${status}"`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(message);
      setError(message);
    } finally {
      setIsActionLoading(false);
    }
  };
  if (loading) {
    return <LoadingSkeleton />;
  }
  if (error && !pr) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/pull-requests"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Pull Requests</Link>
        </Button>
      </div>
    );
  }
  if (!pr) {
    return null; // Should be handled by error state
  }
  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10">
          <Link to="/pull-requests" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Pull Requests
          </Link>
          <header className="mb-8">
            <h1 className="text-3xl font-bold font-display tracking-tight">{pr.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <PRStatusBadge status={pr.status} />
              <span>from <span className="font-semibold text-foreground">{pr.repo}</span></span>
              <span>by <span className="font-semibold text-foreground">{pr.author}</span></span>
              <span>on {format(new Date(pr.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader><CardTitle>Evaluation Summary</CardTitle></CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible defaultValue="item-0">
                    {pr.evaluations.map((evaluation, index) => (
                      <AccordionItem value={`item-${index}`} key={evaluation.agent}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-4 w-full">
                            <ScoreDonutChart score={evaluation.score} size={32} />
                            <span className={`font-semibold ${agentColors[evaluation.agent]}`}>{evaluation.agent} Agent</span>
                            <span className="text-muted-foreground ml-auto mr-4">{evaluation.summary}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="prose prose-sm dark:prose-invert max-w-none pl-12">
                          <p>{evaluation.details}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Overall Score</CardTitle>
                  <ScoreDonutChart score={pr.score} size={60} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">This score represents the overall quality and production-readiness of the code.</p>
                  <div className="flex gap-2">
                    <Button className="w-full bg-success hover:bg-success/90" onClick={() => handleUpdateStatus('Merged')} disabled={isActionLoading || pr.status === 'Merged'}>
                      {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitMerge className="mr-2 h-4 w-4" />} Approve & Merge
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => handleUpdateStatus('Blocked')} disabled={isActionLoading || pr.status === 'Blocked'}>
                      {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />} Reject
                    </Button>
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => handleUpdateStatus('Review')} disabled={isActionLoading || pr.status === 'Review'}>
                    {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Mark as Reviewed
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Author</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarImage src={pr.authorAvatar} alt={pr.author} /><AvatarFallback>{pr.author.charAt(0)}</AvatarFallback></Avatar>
                      <span>{pr.author}</span>
                    </div>
                  </div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Repository</span><span>{pr.repo}</span></div>
                  <Button variant="outline" className="w-full mt-2"><ExternalLink className="mr-2 h-4 w-4" /> View on GitHub</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10">
        <Skeleton className="h-5 w-48 mb-4" />
        <header className="mb-8">
          <Skeleton className="h-9 w-3/4 mb-2" />
          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-2"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-10 w-1/2" /></div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-full mt-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}