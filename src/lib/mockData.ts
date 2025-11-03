export type PRStatus = "Review" | "Blocked" | "Merged" | "Pending";
export type AgentName = "Correctness" | "Architecture" | "Security" | "Performance" | "Maintainability";
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
export const dashboardStats = {
  prsProcessed: 142,
  avgScore: 87,
  passRate: 76,
  reviewRate: 18,
  blockRate: 6,
};
export const mockPullRequests: PullRequest[] = [
  {
    id: "pr-001",
    title: "feat: Implement new authentication flow",
    repo: "aegis-qa/frontend",
    author: "Alice Johnson",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    status: "Review",
    score: 82,
    createdAt: "2024-08-14T10:00:00Z",
    evaluations: [
      { agent: "Correctness", score: 90, summary: "Logic is sound, minor edge cases missed.", details: "The core logic for the authentication flow is correct. However, the handling for expired tokens could be more robust. Consider adding a specific check for token expiration before making API calls." },
      { agent: "Architecture", score: 85, summary: "Follows conventions, one service misplaced.", details: "The new components adhere to the established architectural patterns. The `TokenValidationService` should be moved from the `utils` folder to the dedicated `services` directory for better separation of concerns." },
      { agent: "Security", score: 70, summary: "Potential XSS vulnerability found.", details: "A potential cross-site scripting (XSS) vulnerability was identified in the user profile display component where user-provided input is rendered without proper sanitization. Use a library like DOMPurify or ensure React's automatic escaping is not being bypassed." },
      { agent: "Performance", score: 95, summary: "No performance regressions detected.", details: "The new authentication flow is efficient and does not introduce any noticeable performance overhead. Bundle size increase is minimal." },
      { agent: "Maintainability", score: 88, summary: "Code is well-documented.", details: "The code is clear and includes helpful comments. Adding JSDoc blocks to the main service functions would further improve long-term maintainability." },
    ],
  },
  {
    id: "pr-002",
    title: "fix: Resolve caching issue in user dashboard",
    repo: "aegis-qa/backend",
    author: "Bob Williams",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    status: "Merged",
    score: 94,
    createdAt: "2024-08-14T09:30:00Z",
    evaluations: [
        { agent: "Correctness", score: 98, summary: "Fix is effective and covers all cases.", details: "The fix correctly addresses the caching invalidation problem. All related test cases pass." },
        { agent: "Architecture", score: 95, summary: "Adheres to existing patterns.", details: "The changes are localized and respect the existing caching layer architecture." },
        { agent: "Security", score: 92, summary: "No security impact.", details: "The changes do not introduce any new security risks." },
        { agent: "Performance", score: 90, summary: "Slight improvement in cache hit ratio.", details: "The fix is expected to slightly improve performance by reducing stale cache hits." },
        { agent: "Maintainability", score: 95, summary: "Clear and concise change.", details: "The code is easy to understand and well-contained." },
    ],
  },
  {
    id: "pr-003",
    title: "refactor: Modernize API data fetching hooks",
    repo: "aegis-qa/frontend",
    author: "Charlie Brown",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    status: "Blocked",
    score: 55,
    createdAt: "2024-08-13T15:00:00Z",
    evaluations: [
        { agent: "Correctness", score: 60, summary: "Introduces breaking changes.", details: "The refactor changes the hook's return signature, which will break existing components that use it." },
        { agent: "Architecture", score: 40, summary: "Violates DRY principle.", details: "The new implementation duplicates logic that already exists in the core data service. The hook should wrap the service, not replicate it." },
        { agent: "Security", score: 70, summary: "No major issues, but error handling is weak.", details: "Error responses from the API are not properly handled and could expose sensitive information in development logs." },
        { agent: "Performance", score: 65, summary: "Unnecessary re-renders.", details: "The new hooks lack proper memoization, leading to excessive re-renders in consuming components." },
        { agent: "Maintainability", score: 45, summary: "Code is harder to follow.", details: "The refactored code is more complex than the original implementation without providing significant benefits." },
    ],
  },
  {
    id: "pr-004",
    title: "docs: Update README with new setup instructions",
    repo: "aegis-qa/docs",
    author: "Diana Prince",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
    status: "Merged",
    score: 99,
    createdAt: "2024-08-12T11:00:00Z",
    evaluations: [],
  },
  {
    id: "pr-005",
    title: "chore: Upgrade dependencies and resolve conflicts",
    repo: "aegis-qa/frontend",
    author: "Eve Adams",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026708d",
    status: "Pending",
    score: 0,
    createdAt: "2024-08-15T12:00:00Z",
    evaluations: [],
  },
];