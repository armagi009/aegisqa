import { DurableObject } from 'cloudflare:workers';
import type { SessionInfo } from './types';
import type { Env } from './core-utils';
import { dashboardStats, mockPullRequests, mockRepositories, mockQualityGates } from './data';
import type { PullRequest, DashboardStats, PRStatus, Repository, QualityGates, Evaluation, AgentName } from './data';
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
export class AppController extends DurableObject<Env> {
  private sessions = new Map<string, SessionInfo>();
  private pullRequests: PullRequest[] = [];
  private dashboardStats: DashboardStats | null = null;
  private repositories: Repository[] = [];
  private qualityGates: QualityGates | null = null;
  private loaded = false;
  constructor(public ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      const storedSessions = await this.ctx.storage.get<Record<string, SessionInfo>>('sessions') || {};
      this.sessions = new Map(Object.entries(storedSessions));
      if (this.pullRequests.length === 0) this.pullRequests = JSON.parse(JSON.stringify(mockPullRequests));
      if (!this.dashboardStats) this.dashboardStats = { ...dashboardStats };
      if (this.repositories.length === 0) this.repositories = JSON.parse(JSON.stringify(mockRepositories));
      if (!this.qualityGates) this.qualityGates = { ...mockQualityGates };
      this.loaded = true;
      const currentAlarm = await this.ctx.storage.getAlarm();
      if (currentAlarm === null) {
        const fiveMinutes = 5 * 60 * 1000;
        this.ctx.storage.setAlarm(Date.now() + fiveMinutes);
      }
    }
  }
  async alarm() {
    await this.ensureLoaded();
    this.simulateNewPREntry();
    const fiveMinutes = 5 * 60 * 1000;
    this.ctx.storage.setAlarm(Date.now() + fiveMinutes);
  }
  private simulateNewPREntry() {
    const authors = [
      { name: 'Chris Pine', avatar: 'https://i.pravatar.cc/150?u=chris' },
      { name: 'Jordan Walke', avatar: 'https://i.pravatar.cc/150?u=jordan' },
      { name: 'Linus Torvalds', avatar: 'https://i.pravatar.cc/150?u=linus' },
    ];
    const repos = ['aegis-qa/frontend', 'aegis-qa/backend', 'aegis-qa/infra'];
    const titles = [
      'feat: Integrate real-time notifications',
      'fix: Address memory leak in data processor',
      'refactor: Simplify state management logic',
      'chore: Upgrade dependencies to latest versions'
    ];
    const randomAuthor = authors[randomBetween(0, authors.length - 1)];
    const newPR: PullRequest = {
      id: `pr-${crypto.randomUUID()}`,
      title: titles[randomBetween(0, titles.length - 1)],
      repo: repos[randomBetween(0, repos.length - 1)],
      author: randomAuthor.name,
      authorAvatar: randomAuthor.avatar,
      status: 'Pending',
      score: 0,
      createdAt: new Date().toISOString(),
      evaluations: [],
    };
    this.pullRequests.unshift(newPR);
  }
  async evaluatePullRequest(id: string): Promise<PullRequest | null> {
    await this.ensureLoaded();
    const prIndex = this.pullRequests.findIndex(pr => pr.id === id);
    if (prIndex === -1 || this.pullRequests[prIndex].status !== 'Pending') {
      return null;
    }
    const pr = this.pullRequests[prIndex];
    const overallScore = randomBetween(40, 98);
    const agents: AgentName[] = ['Correctness', 'Architecture', 'Security', 'Performance', 'Maintainability'];
    const evaluations: Evaluation[] = agents.map(agent => ({
      agent,
      score: Math.min(99, randomBetween(Math.max(0, overallScore - 15), Math.min(100, overallScore + 15))),
      summary: 'Evaluation complete',
      details: `The ${agent} agent analysis is complete with a score of ${this.pullRequests[prIndex].score}.`,
    }));
    pr.score = overallScore;
    pr.evaluations = evaluations;
    pr.status = 'Review';
    if (this.dashboardStats) {
      this.dashboardStats.prsProcessed++;
    }
    return pr;
  }
  private async persistSessions(): Promise<void> {
    await this.ctx.storage.put('sessions', Object.fromEntries(this.sessions));
  }
  async getDashboardStats(): Promise<DashboardStats | null> {
    await this.ensureLoaded();
    return this.dashboardStats;
  }
  async getPullRequests(): Promise<PullRequest[]> {
    await this.ensureLoaded();
    return this.pullRequests;
  }
  async getPullRequestById(id: string): Promise<PullRequest | undefined> {
    await this.ensureLoaded();
    return this.pullRequests.find(pr => pr.id === id);
  }
  async updatePullRequestStatus(id: string, status: PRStatus): Promise<PullRequest | null> {
    await this.ensureLoaded();
    const prIndex = this.pullRequests.findIndex(pr => pr.id === id);
    if (prIndex > -1) {
      this.pullRequests[prIndex].status = status;
      return this.pullRequests[prIndex];
    }
    return null;
  }
  async getRepositories(): Promise<Repository[]> {
    await this.ensureLoaded();
    return this.repositories;
  }
  async addRepository(repo: Repository): Promise<Repository> {
    await this.ensureLoaded();
    this.repositories.push(repo);
    return repo;
  }
  async removeRepository(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const initialLength = this.repositories.length;
    this.repositories = this.repositories.filter(repo => repo.id !== id);
    return this.repositories.length < initialLength;
  }
  async getQualityGates(): Promise<QualityGates | null> {
    await this.ensureLoaded();
    return this.qualityGates;
  }
  async updateQualityGates(gates: QualityGates): Promise<QualityGates> {
    await this.ensureLoaded();
    this.qualityGates = { ...this.qualityGates, ...gates };
    return this.qualityGates;
  }
  async addSession(sessionId: string, title?: string): Promise<void> {
    await this.ensureLoaded();
    const now = Date.now();
    this.sessions.set(sessionId, {
      id: sessionId,
      title: title || `Chat ${new Date(now).toLocaleDateString()}`,
      createdAt: now,
      lastActive: now
    });
    await this.persistSessions();
  }
  async removeSession(sessionId: string): Promise<boolean> {
    await this.ensureLoaded();
    const deleted = this.sessions.delete(sessionId);
    if (deleted) await this.persistSessions();
    return deleted;
  }
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActive = Date.now();
      await this.persistSessions();
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    await this.ensureLoaded();
    const session = this.sessions.get(sessionId);
    if (session) {
      session.title = title;
      await this.persistSessions();
      return true;
    }
    return false;
  }
  async listSessions(): Promise<SessionInfo[]> {
    await this.ensureLoaded();
    return Array.from(this.sessions.values()).sort((a, b) => b.lastActive - a.lastActive);
  }
  async getSessionCount(): Promise<number> {
    await this.ensureLoaded();
    return this.sessions.size;
  }
  async getSession(sessionId: string): Promise<SessionInfo | null> {
    await this.ensureLoaded();
    return this.sessions.get(sessionId) || null;
  }
  async clearAllSessions(): Promise<number> {
    await this.ensureLoaded();
    const count = this.sessions.size;
    this.sessions.clear();
    await this.persistSessions();
    return count;
  }
}