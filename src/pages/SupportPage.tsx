import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { LifeBuoy, Mail, BookOpen } from 'lucide-react';
const faqs = [
  {
    question: "What is AegisQA?",
    answer: "AegisQA is a quality assurance platform for autonomous code. It intercepts AI-generated pull requests, evaluates them using a cluster of specialized AI agents, and provides a risk score to help you decide whether to merge, review, or block the code."
  },
  {
    question: "How do I connect a new repository?",
    answer: "Navigate to the Settings page from the sidebar. In the 'Repository Connections' section, you can enter the URL of your GitHub, GitLab, or Bitbucket repository and click 'Connect'."
  },
  {
    question: "How are the quality scores calculated?",
    answer: "The overall quality score is a weighted average of scores from multiple evaluation agents, including Correctness, Architecture, Security, Performance, and Maintainability. Each agent performs a specialized analysis of the code."
  },
  {
    question: "Can I customize the quality gates?",
    answer: "Yes. On the Settings page, you can define the score thresholds for automatically merging, blocking, or flagging a pull request for human review. These can be set globally or on a per-repository basis."
  }
];
export function SupportPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10">
        <header className="mb-8 text-center">
          <LifeBuoy className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold font-display tracking-tight mt-4">Support Center</h1>
          <p className="text-muted-foreground mt-1">We're here to help. Find answers to your questions below.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Can't find the answer you're looking for? Get in touch with our support team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" asChild>
                  <a href="mailto:support@aegisqa.com">
                    <Mail className="mr-2 h-4 w-4" /> Email Support
                  </a>
                </Button>
                <Button variant="secondary" className="w-full">
                  Open a Support Ticket
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Dive deeper into our features and API.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" /> Read Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}