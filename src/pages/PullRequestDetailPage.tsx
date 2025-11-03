import { useParams, Link } from 'react-router-dom';
import { mockPullRequests } from '@/lib/mockData';
import { PRStatusBadge } from '@/components/PRStatusBadge';
import { ScoreDonutChart } from '@/components/ScoreDonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Check, GitMerge, ThumbsDown, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
const agentColors = {
  Correctness: 'text-blue-500',
  Architecture: 'text-purple-500',
  Security: 'text-red-500',
  Performance: 'text-green-500',
  Maintainability: 'text-yellow-500',
};
export function PullRequestDetailPage() {
  const { id } = useParams();
  const pr = mockPullRequests.find((p) => p.id === id);
  if (!pr) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold">Pull Request Not Found</h2>
        <p className="text-muted-foreground">The requested pull request could not be found.</p>
        <Button asChild className="mt-4">
          <Link to="/pull-requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pull Requests
          </Link>
        </Button>
      </div>
    );
  }
  return (
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
              <CardHeader>
                <CardTitle>Evaluation Summary</CardTitle>
              </CardHeader>
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
                <p className="text-sm text-muted-foreground">
                  This score represents the overall quality and production-readiness of the code.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full bg-success hover:bg-success/90"><GitMerge className="mr-2 h-4 w-4" /> Approve & Merge</Button>
                  <Button variant="destructive" className="w-full"><ThumbsDown className="mr-2 h-4 w-4" /> Reject</Button>
                </div>
                <Button variant="secondary" className="w-full"><Check className="mr-2 h-4 w-4" /> Mark as Reviewed</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Author</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={pr.authorAvatar} alt={pr.author} />
                      <AvatarFallback>{pr.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{pr.author}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Repository</span>
                  <span>{pr.repo}</span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}