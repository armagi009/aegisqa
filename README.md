# AegisQA

**The Datadog for the agent era—a multi-agent platform to test, validate, and monitor autonomous agent-generated code before it reaches production.**

[cloudflarebutton]

AegisQA is a sophisticated, enterprise-grade Quality Assurance platform designed for the era of autonomous coding. It acts as a critical validation layer, intercepting AI-generated pull requests from services like GitHub, GitLab, and Bitbucket before they reach production. The platform utilizes a cluster of specialized AI agents to evaluate the incoming code against multiple criteria: correctness, architectural compliance, security vulnerabilities, performance, and maintainability. Each pull request is assigned a quantitative risk score, which automates the development workflow by auto-merging high-quality code, flagging moderate-risk code for human review, and blocking high-risk submissions.

The core of the application is a rich, interactive dashboard that provides engineers and managers with at-a-glance insights into their AI development pipeline, detailed drill-downs for each PR, and configurable quality gates. AegisQA empowers organizations to leverage the speed of AI-driven development with the confidence of rigorous, automated quality control.

## Key Features

-   **Interception Layer**: Hooks into GitHub, GitLab, and Bitbucket to capture every agent-generated pull request.
-   **Multi-Agent Evaluation**: A cluster of specialized AI agents evaluates code for correctness, architectural compliance, security, performance, and maintainability.
-   **Automated Testing**: Generates and runs test cases in an isolated environment based on the code's intent.
-   **Quantitative Risk Scoring**: Assigns a 0-100 quality score to each PR to automate workflows.
-   **Configurable Quality Gates**: Set custom thresholds for auto-merging, requiring human review, or blocking PRs.
-   **Interactive Dashboard**: Provides a high-level overview of QA activities, key metrics, and a feed of recent evaluations.
-   **Continuous Learning**: Improves evaluation models based on which PRs pass or fail human review over time.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui
-   **State Management**: Zustand
-   **Animations**: Framer Motion
-   **Charting**: Recharts
-   **Backend**: Cloudflare Workers, Hono
-   **Persistence**: Cloudflare Durable Objects (via Cloudflare Agents SDK)

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aegis-qa
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project and add your Cloudflare AI Gateway credentials. You can find these in your Cloudflare dashboard.

    ```ini
    # .dev.vars
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```

4.  **Run the development server:**
    ```bash
    bun run dev
    ```

The application will be available at `http://localhost:3000`.

## Development

The project is structured into two main parts: the frontend application and the backend worker.

-   **`src/`**: Contains the React frontend application.
    -   `src/pages/`: Main views of the application.
    -   `src/components/`: Reusable UI components.
    -   `src/lib/`: Utility functions and client-side API services.
-   **`worker/`**: Contains the Cloudflare Worker backend logic.
    -   `worker/index.ts`: The entry point for the worker.
    -   `worker/userRoutes.ts`: Defines the API routes for the application.
    -   `worker/agent.ts`: The core `ChatAgent` Durable Object implementation.

## Deployment

This project is designed for easy deployment to Cloudflare's global network.

1.  **Login to Wrangler:**
    Authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Configure Production Secrets:**
    Set your environment variables as secrets for the production deployment.
    ```bash
    wrangler secret put CF_AI_BASE_URL
    wrangler secret put CF_AI_API_KEY
    ```

3.  **Deploy the application:**
    Run the deploy script to build and publish your application.
    ```bash
    bun run deploy
    ```

Your application will be deployed to the URL provided by Wrangler.

---

Or deploy directly from your GitHub repository:

[cloudflarebutton]