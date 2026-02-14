# 🤖 Groqy Agent - AI-Powered Agency Management Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nodeblackboxs-projects/v0-groqy-agent-bk)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/tAPipdTp0Ka)
[![Powered by Groq](https://img.shields.io/badge/Powered%20by-Groq-orange?style=for-the-badge)](https://groq.com)

> **A next-generation AI agency management platform that combines human and AI team members to streamline workflows, automate tasks, and boost productivity.**

## 🌟 Overview

Groqy Agent is an intelligent agency management dashboard that seamlessly integrates AI agents with human team members. Built with Next.js 16 and powered by Groq's ultra-fast LLM inference, it provides a comprehensive platform for managing teams, workflows, tasks, and analytics in a unified interface.

### Key Features

- 🤝 **Hybrid Teams**: Manage both human and AI team members in a single platform
- 🚀 **AI Agent Creation**: Build custom AI agents with specific roles and capabilities
- 📊 **Real-time Analytics**: Monitor team performance, task completion, and agent status
- 🔄 **Workflow Automation**: Design and execute complex workflows with visual tools
- 📅 **Smart Planning**: AI-powered task generation and weekly planning
- 🎯 **Kanban Boards**: Organize tasks with drag-and-drop interfaces
- 📈 **Performance Tracking**: Track metrics for both human and AI team members
- 🔍 **Vector Search**: Powered by Qdrant for intelligent data retrieval
- 🌐 **Web Search**: Integrated Exa search capabilities

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI/ML**: Groq API (ultra-fast LLM inference)
- **Vector Database**: Qdrant Cloud
- **Search**: Exa API
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: React Context API

### Project Structure

```
groqy-agent-onboard/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── dashboard/           # Dashboard components
│   │   ├── admin-view.tsx
│   │   ├── agent-creation-flow.tsx
│   │   ├── agent-system.tsx
│   │   ├── analytics-view.tsx
│   │   ├── command-center.tsx
│   │   ├── kanban-board.tsx
│   │   ├── task-generator-agent.tsx
│   │   ├── team-management.tsx
│   │   ├── workflow-designer.tsx
│   │   └── ...
│   └── ui/                  # Reusable UI components (shadcn/ui)
├── context/
│   └── agency-context.tsx   # Global state management
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
└── utils/                   # Helper utilities

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or compatible runtime
- pnpm (recommended) or npm
- Groq API key ([Get one here](https://console.groq.com/keys))
- Qdrant Cloud account ([Sign up](https://cloud.qdrant.io))
- Exa API key ([Get one here](https://exa.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/groqy-agent-onboard.git
   cd groqy-agent-onboard
   ```

2. **Install dependencies**
   ```bash
   npx pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory (already configured):
   ```env
   # Groq API Configuration
   GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key

   # Qdrant Vector Database Configuration
   QDRANT_URL=your_qdrant_cluster_url
   QDRANT_API_KEY=your_qdrant_api_key

   # Exa Search API Configuration
   EXA_API_KEY=your_exa_api_key

   # Team Configuration
   TEAM_ID=your_team_id
   TEAM_RATE_LIMIT=10
   ```

4. **Run the development server**
   ```bash
   npx pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Dashboard Views

1. **Command Center**: Main dashboard with overview of all activities
2. **Team Management**: Manage human and AI team members
3. **Tasks**: Kanban-style task management
4. **Workflows**: Design and execute automated workflows
5. **Analytics**: Performance metrics and insights
6. **Weekly Planner**: AI-assisted weekly planning
7. **Admin**: System configuration and settings

### Creating AI Agents

1. Navigate to the **Agent Creation** flow
2. Define agent properties:
   - Name and role
   - Capabilities and skills
   - Model selection (Groq models)
   - Tool access permissions
3. Configure agent behavior and constraints
4. Deploy and monitor agent performance

### Task Generation

The AI Task Generator can automatically create tasks based on:
- Project requirements
- Team capacity
- Historical data
- Priority levels

## 🔧 API Integration

### Groq API

The platform uses Groq's ultra-fast LLM inference for:
- Agent reasoning and decision-making
- Natural language task generation
- Workflow automation
- Content creation

**Supported Models**:
- `openai/gpt-oss-120b` - High-performance reasoning
- `llama-3.3-70b-versatile` - Versatile general-purpose
- `llama-3.1-8b-instant` - Fast responses

### Qdrant Vector Database

Used for:
- Semantic search across tasks and documents
- Agent memory and context retrieval
- Knowledge base management

### Exa Search

Integrated for:
- Web search capabilities
- Real-time information retrieval
- Research and data gathering

## 🛠️ Development

### Available Scripts

```bash
# Development server
npx pnpm dev

# Production build
npx pnpm build

# Start production server
npx pnpm start

# Lint code
npx pnpm lint
```

### Adding New Features

1. Create components in `components/dashboard/`
2. Add routes in `app/` directory
3. Update context in `context/agency-context.tsx`
4. Integrate with Groq API for AI features

## 🔐 Security Best Practices

- ✅ API keys stored in environment variables
- ✅ Never commit `.env.local` to version control
- ✅ Use server-side API routes for sensitive operations
- ✅ Implement rate limiting for API calls
- ✅ Validate and sanitize all user inputs

## 📊 Performance

- **Groq Inference**: Sub-second response times
- **Turbopack**: Fast development builds with Next.js 16
- **Code Splitting**: Automatic optimization
- **Image Optimization**: Built-in Next.js image optimization

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Live Demo**: [https://vercel.com/nodeblackboxs-projects/v0-groqy-agent-bk](https://vercel.com/nodeblackboxs-projects/v0-groqy-agent-bk)
- **v0 Chat**: [https://v0.app/chat/tAPipdTp0Ka](https://v0.app/chat/tAPipdTp0Ka)
- **Groq Console**: [https://console.groq.com](https://console.groq.com)
- **Qdrant Cloud**: [https://cloud.qdrant.io](https://cloud.qdrant.io)

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Check the [Groq documentation](https://console.groq.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs)

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) by Vercel
- Powered by [Groq](https://groq.com) for ultra-fast AI inference
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Vector search by [Qdrant](https://qdrant.tech)

---

**Made with ❤️ by the Groqy Agent team**