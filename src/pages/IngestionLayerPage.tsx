import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  GitBranch,
  Bot,
  TestTube2,
  Gauge,
  Book,
  Workflow,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Wrench,
  Rocket,
} from 'lucide-react';
import { motion } from 'framer-motion';
const workflowSteps = [
  {
    icon: GitBranch,
    title: 'Interception Layer',
    description: 'Hooks into GitHub, GitLab, and Bitbucket via MCP to capture every agent-generated PR. Collects metadata: which agent, runtime, and intent.',
    color: 'text-sky-500',
  },
  {
    icon: Bot,
    title: 'Evaluation Agent Cluster',
    description: 'A team of specialized agents (powered by Claude Sonnet 4.5) analyzes the code from multiple angles.',
    color: 'text-purple-500',
    subItems: [
      { icon: Cpu, text: 'Correctness Agent' },
      { icon: Wrench, text: 'Architecture Agent' },
      { icon: ShieldCheck, text: 'Security Agent' },
      { icon: Rocket, text: 'Performance Agent' },
      { icon: Book, text: 'Maintainability Agent' },
    ],
  },
  {
    icon: TestTube2,
    title: 'Automated Testing Harness',
    description: 'Generates and runs test cases based on code intent, performs integration tests in an isolated environment, and conducts chaos testing.',
    color: 'text-amber-500',
  },
  {
    icon: Gauge,
    title: 'Risk Scoring',
    description: 'Each PR gets a 0-100 quality score, automating the workflow: auto-merge (>90), human review (60-90), or block (<60).',
    color: 'text-rose-500',
  },
  {
    icon: TrendingUp,
    title: 'Learning Loop',
    description: 'Tracks which agent-generated PRs pass or fail human review to improve evaluation prompts and build a company-specific quality model.',
    color: 'text-emerald-500',
  },
];
export function IngestionLayerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4"
          >
            <Workflow className="h-10 w-10" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">
            AegisQA Ingestion Workflow
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
            From code commit to production confidence, this is how our multi-agent platform ensures the quality of autonomous code.
          </p>
        </header>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-0.5 bg-border -z-10 hidden md:block" />
          <div className="space-y-12">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:order-2'}`}>
                  <Card className="overflow-hidden shadow-soft hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-start gap-4 bg-muted/50 p-6">
                      <div className={`p-3 rounded-full bg-background border`}>
                        <step.icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 text-muted-foreground">
                      <p>{step.description}</p>
                      {step.subItems && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {step.subItems.map(item => (
                            <Badge key={item.text} variant="secondary" className="font-normal">
                              <item.icon className="h-3 w-3 mr-1.5" />
                              {item.text}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="relative md:w-1/2">
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}