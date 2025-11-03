import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster, toast } from 'sonner';
import { Github, Gitlab, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import type { Repository, QualityGates } from '@/lib/types';
const providerIcons = {
  GitHub: <Github className="h-6 w-6" />,
  GitLab: <Gitlab className="h-6 w-6" />,
  Bitbucket: <div className="text-2xl">B</div>, // Placeholder
};
export function SettingsPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [gates, setGates] = useState<QualityGates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [reposRes, gatesRes] = await Promise.all([
          fetch('/api/repositories'),
          fetch('/api/quality-gates'),
        ]);
        if (!reposRes.ok || !gatesRes.ok) {
          throw new Error('Failed to fetch settings data');
        }
        const reposData = await reposRes.json();
        const gatesData = await gatesRes.json();
        setRepos(reposData.data);
        setGates(gatesData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleAddRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newRepoUrl }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add repository');
      }
      const newRepo = await response.json();
      setRepos(prev => [...prev, newRepo.data]);
      setNewRepoUrl('');
      toast.success('Repository connected successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRemoveRepository = async (id: string) => {
    try {
      const response = await fetch(`/api/repositories/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to remove repository');
      }
      setRepos(prev => prev.filter(repo => repo.id !== id));
      toast.success('Repository disconnected.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  const handleGatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gates) return;
    const { id, value } = e.target;
    setGates({ ...gates, [id]: Number(value) });
  };
  const handleUpdateGates = async () => {
    if (!gates) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quality-gates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gates),
      });
      if (!response.ok) {
        throw new Error('Failed to update quality gates');
      }
      const updatedGates = await response.json();
      setGates(updatedGates.data);
      toast.success('Quality gates updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return <SettingsSkeleton />;
  }
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
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold font-display tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your repositories and quality gates.</p>
          </header>
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Repository Connections</CardTitle>
                <CardDescription>Connect and manage your code repositories from GitHub, GitLab, and Bitbucket.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {repos.map(repo => (
                    <div key={repo.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {providerIcons[repo.provider]}
                        <div>
                          <p className="font-semibold">{repo.name}</p>
                          <p className="text-sm text-muted-foreground">Connected via {repo.provider}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveRepository(repo.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddRepository} className="flex items-center gap-2">
                  <Input
                    placeholder="https://github.com/user/repo"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button type="submit" disabled={isSubmitting || !newRepoUrl.trim()}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Connect
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality Gates</CardTitle>
                <CardDescription>Define custom quality assurance rules and score thresholds for your repositories.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {gates && (
                  <div>
                    <h3 className="font-semibold mb-2">Score Thresholds</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="autoMerge">Auto-Merge Score</Label>
                        <Input id="autoMerge" type="number" value={gates.autoMerge} onChange={handleGatesChange} />
                        <p className="text-xs text-muted-foreground mt-1">PRs with a score above this will be merged automatically.</p>
                      </div>
                      <div>
                        <Label htmlFor="humanReview">Human Review Score</Label>
                        <Input id="humanReview" type="number" value={gates.humanReview} onChange={handleGatesChange} />
                        <p className="text-xs text-muted-foreground mt-1">PRs between this and auto-merge score will require review.</p>
                      </div>
                      <div>
                        <Label htmlFor="autoBlock">Auto-Block Score</Label>
                        <Input id="autoBlock" type="number" value={gates.autoBlock} onChange={handleGatesChange} />
                        <p className="text-xs text-muted-foreground mt-1">PRs with a score below this will be blocked.</p>
                      </div>
                    </div>
                    <Button className="mt-4" onClick={handleUpdateGates} disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Thresholds
                    </Button>
                  </div>
                )}
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Custom Rules</h3>
                  <p className="text-sm text-muted-foreground">Define project-specific rules in an `AGENTS.md` file in your repository root.</p>
                  <Button variant="outline" className="mt-2">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
function SettingsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10">
        <header className="mb-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80 mt-2" />
        </header>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-96 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96 mt-1" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}