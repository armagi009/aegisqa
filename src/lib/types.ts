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
export type RepositoryProvider = 'GitHub' | 'GitLab' | 'Bitbucket';
export interface Repository {
  id: string;
  name: string;
  provider: RepositoryProvider;
}
export interface QualityGates {
  autoMerge: number;
  humanReview: number;
  autoBlock: number;
}