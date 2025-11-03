import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
import type { PRStatus, Repository } from "./data";
/**
 * DO NOT MODIFY THIS FUNCTION. Only for your reference.
 */
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    // Use this API for conversations. **DO NOT MODIFY**
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId); // Get existing agent or create a new one if it doesn't exist, with sessionId as the name
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    const controller = (c: any) => getAppController(c.env);
    // AegisQA API Routes
    app.get('/api/dashboard-stats', async (c) => {
        const stats = await controller(c).getDashboardStats();
        return c.json({ success: true, data: stats });
    });
    app.get('/api/pull-requests', async (c) => {
        const prs = await controller(c).getPullRequests();
        return c.json({ success: true, data: prs });
    });
    app.get('/api/pull-requests/:id', async (c) => {
        const { id } = c.req.param();
        const pr = await controller(c).getPullRequestById(id);
        return pr ? c.json({ success: true, data: pr }) : c.json({ success: false, error: 'Pull request not found' }, 404);
    });
    app.patch('/api/pull-requests/:id/status', async (c) => {
        const { id } = c.req.param();
        const { status } = await c.req.json<{ status: PRStatus }>();
        if (!['Merged', 'Review', 'Blocked', 'Pending'].includes(status)) {
            return c.json({ success: false, error: 'Invalid status provided' }, 400);
        }
        const updatedPr = await controller(c).updatePullRequestStatus(id, status);
        return updatedPr ? c.json({ success: true, data: updatedPr }) : c.json({ success: false, error: 'Pull request not found' }, 404);
    });
    app.get('/api/repositories', async (c) => {
        const repos = await controller(c).getRepositories();
        return c.json({ success: true, data: repos });
    });
    app.post('/api/repositories', async (c) => {
        const { url } = await c.req.json<{ url: string }>();
        if (!url || !url.includes('/')) {
            return c.json({ success: false, error: 'Invalid repository URL' }, 400);
        }
        const name = url.split('/').slice(-2).join('/');
        const provider = url.includes('github') ? 'GitHub' : url.includes('gitlab') ? 'GitLab' : 'Bitbucket';
        const newRepo: Repository = { id: crypto.randomUUID(), name, provider };
        const addedRepo = await controller(c).addRepository(newRepo);
        return c.json({ success: true, data: addedRepo }, 201);
    });
    app.delete('/api/repositories/:id', async (c) => {
        const { id } = c.req.param();
        const success = await controller(c).removeRepository(id);
        return success ? c.json({ success: true }) : c.json({ success: false, error: 'Repository not found' }, 404);
    });
    app.get('/api/quality-gates', async (c) => {
        const gates = await controller(c).getQualityGates();
        return c.json({ success: true, data: gates });
    });
    app.patch('/api/quality-gates', async (c) => {
        const newGates = await c.req.json();
        const updatedGates = await controller(c).updateQualityGates(newGates);
        return c.json({ success: true, data: updatedGates });
    });
    // Session Management Routes
    app.get('/api/sessions', async (c) => {
        const sessions = await controller(c).listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.post('/api/sessions', async (c) => {
        const body = await c.req.json().catch(() => ({}));
        const { title, sessionId: providedSessionId, firstMessage } = body;
        const sessionId = providedSessionId || crypto.randomUUID();
        let sessionTitle = title;
        if (!sessionTitle) {
            const now = new Date();
            const dateTime = now.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            if (firstMessage && firstMessage.trim()) {
                const cleanMessage = firstMessage.trim().replace(/\s+/g, ' ');
                const truncated = cleanMessage.length > 40 ? cleanMessage.slice(0, 37) + '...' : cleanMessage;
                sessionTitle = `${truncated} • ${dateTime}`;
            } else {
                sessionTitle = `Chat ${dateTime}`;
            }
        }
        await registerSession(c.env, sessionId, sessionTitle);
        return c.json({ success: true, data: { sessionId, title: sessionTitle } });
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const deleted = await unregisterSession(c.env, sessionId);
        return deleted ? c.json({ success: true, data: { deleted: true } }) : c.json({ success: false, error: 'Session not found' }, 404);
    });
}