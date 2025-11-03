export type PRStatus = 'Merged' | 'Review' | 'Blocked' | 'Pending';
export type AgentName = 'Correctness' | 'Architecture' | 'Security' | 'Performance' | 'Maintainability';
export interface Evaluation {
  agent: AgentName;
  score: number;
  summary: string;
  details: string;
}
export interface PullRequest {
  id: string;
  title: string;
  repo: string;
  author: string;
  authorAvatar: string;
  status: PRStatus;
  score: number;
  createdAt: string;
  evaluations: Evaluation[];
}
export interface DashboardStats {
  prsProcessed: number;
  avgScore: number;
  passRate: number;
  reviewRate: number;
}
export const dashboardStats: DashboardStats = {
  prsProcessed: 124,
  avgScore: 87,
  passRate: 76,
  reviewRate: 18,
};
export const mockPullRequests: PullRequest[] = [
  {
    id: 'pr-1',
    title: 'feat: Implement new caching layer for user sessions',
    repo: 'aegis-qa/frontend',
    author: 'Alex Johnson',
    authorAvatar: 'https://i.pravatar.cc/150?u=alex',
    status: 'Review',
    score: 88,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    evaluations: [
      { agent: 'Correctness', score: 95, summary: 'Logic is sound', details: 'The implementation correctly follows the specifications with no apparent logical errors. All edge cases seem to be handled.' },
      { agent: 'Architecture', score: 80, summary: 'Minor deviation', details: 'Introduces a new dependency not listed in AGENTS.md. Please document or refactor.' },
      { agent: 'Security', score: 90, summary: 'No major issues', details: 'No critical vulnerabilities found. Some low-risk issues with session token handling were identified.' },
      { agent: 'Performance', score: 85, summary: 'Good performance', details: 'The caching layer shows a significant improvement in response times for user session retrieval.' },
      { agent: 'Maintainability', score: 90, summary: 'Well-documented', details: 'Code is clean, well-commented, and easy to follow.' },
    ],
  },
  {
    id: 'pr-2',
    title: 'fix: Resolve issue with incorrect data aggregation',
    repo: 'aegis-qa/backend',
    author: 'Samantha Lee',
    authorAvatar: 'https://i.pravatar.cc/150?u=samantha',
    status: 'Merged',
    score: 94,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    evaluations: [
        { agent: 'Correctness', score: 98, summary: 'Fix is effective', details: 'The fix correctly addresses the data aggregation bug and passes all generated test cases.' },
        { agent: 'Architecture', score: 95, summary: 'Follows patterns', details: 'The changes adhere to the existing architectural patterns of the service.' },
        { agent: 'Security', score: 92, summary: 'No new risks', details: 'The changes do not introduce any new security vulnerabilities.' },
        { agent: 'Performance', score: 90, summary: 'No degradation', details: 'Performance metrics remain stable after the fix.' },
        { agent: 'Maintainability', score: 95, summary: 'Clean and clear', details: 'The code is straightforward and easy to understand.' },
    ],
  },
  {
    id: 'pr-3',
    title: 'refactor: Modernize authentication service',
    repo: 'aegis-qa/infra',
    author: 'Michael Chen',
    authorAvatar: 'https://i.pravatar.cc/150?u=michael',
    status: 'Blocked',
    score: 45,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    evaluations: [
        { agent: 'Correctness', score: 60, summary: 'Incomplete logic', details: 'The refactor is incomplete and fails several key authentication flows.' },
        { agent: 'Architecture', score: 50, summary: 'Major deviation', details: 'The proposed architecture deviates significantly from the established security protocols.' },
        { agent: 'Security', score: 20, summary: 'Critical vulnerability', details: 'A critical vulnerability related to password hashing was introduced. This PR cannot be merged.' },
        { agent: 'Performance', score: 70, summary: 'Acceptable', details: 'Performance is acceptable but not a significant improvement.' },
        { agent: 'Maintainability', score: 65, summary: 'Complex logic', details: 'The new logic is overly complex and difficult to follow.' },
    ],
  },
  {
    id: 'pr-4',
    title: 'docs: Update API documentation for v2 endpoints',
    repo: 'aegis-qa/docs',
    author: 'Emily White',
    authorAvatar: 'https://i.pravatar.cc/150?u=emily',
    status: 'Merged',
    score: 99,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    evaluations: [
        { agent: 'Correctness', score: 100, summary: 'Accurate', details: 'Documentation is accurate and reflects the v2 API endpoints perfectly.' },
        { agent: 'Architecture', score: 100, summary: 'N/A', details: 'Not applicable for documentation changes.' },
        { agent: 'Security', score: 100, summary: 'N/A', details: 'Not applicable for documentation changes.' },
        { agent: 'Performance', score: 100, summary: 'N/A', details: 'Not applicable for documentation changes.' },
        { agent: 'Maintainability', score: 98, summary: 'Clear and concise', details: 'The documentation is easy to read and understand.' },
    ],
  },
  {
    id: 'pr-5',
    title: 'feat: Add support for GitLab integration',
    repo: 'aegis-qa/backend',
    author: 'David Green',
    authorAvatar: 'https://i.pravatar.cc/150?u=david',
    status: 'Pending',
    score: 0,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    evaluations: [],
  },
];