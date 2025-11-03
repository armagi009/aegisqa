import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
export function SettingsPage() {
  return (
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
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-2xl"> G </div>
                  <div>
                    <p className="font-semibold">aegis-qa/frontend</p>
                    <p className="text-sm text-muted-foreground">Connected via GitHub</p>
                  </div>
                </div>
                <Button variant="destructive">Disconnect</Button>
              </div>
              <Button className="mt-4">Connect New Repository</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quality Gates</CardTitle>
              <CardDescription>Define custom quality assurance rules and score thresholds for your repositories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Score Thresholds</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="auto-merge">Auto-Merge Score</Label>
                    <Input id="auto-merge" type="number" defaultValue="90" />
                    <p className="text-xs text-muted-foreground mt-1">PRs with a score above this will be merged automatically.</p>
                  </div>
                  <div>
                    <Label htmlFor="human-review">Human Review Score</Label>
                    <Input id="human-review" type="number" defaultValue="60" />
                    <p className="text-xs text-muted-foreground mt-1">PRs between this and auto-merge score will require review.</p>
                  </div>
                  <div>
                    <Label htmlFor="auto-block">Auto-Block Score</Label>
                    <Input id="auto-block" type="number" defaultValue="59" />
                    <p className="text-xs text-muted-foreground mt-1">PRs with a score below this will be blocked.</p>
                  </div>
                </div>
              </div>
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
  );
}