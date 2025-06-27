# Clarity - ADHD-Friendly Project Management for Developers

> **Track your project completion and see what that translates to in productivity, revenue, and progress.**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Clarity is a specialized project management webapp designed specifically for developers with ADHD. It centralizes and simplifies project tracking by organizing projects into three main categories: **Work** (regular job projects), **Clients** (client projects with budget tracking), and **Personal** (startup ideas and side projects).

## 🎯 What Makes Clarity Special

### For Developers with ADHD
- **Quick Actions**: One-click project creation for instant capture
- **Visual Progress**: Clear progress bars and status indicators
- **Analytics Focus**: See completion rates and productivity trends
- **Minimal Distractions**: Clean, focused interface
- **Cross-Project Todos**: Unified task management across all projects

### Core Features
- ✅ **Project Management**: Full CRUD operations with categories
- ✅ **Analytics Dashboard**: Real-time completion tracking and revenue insights
- ✅ **Quick Creation**: Templates for Work, Client, and Personal projects
- ✅ **Progress Tracking**: Visual progress bars and status management
- ✅ **Todo System**: Cross-project task management with priorities
- ✅ **Responsive Design**: Works perfectly on desktop and mobile
- ✅ **URL Sharing**: Share your dashboard state via URL
- ✅ **Email Reports**: On-demand project status reports

## 🚀 Live Demo

**Try Clarity right now:** [https://clarity.fbien.com/](https://clarity.fbien.com/)

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI**: [shadcn/ui](https://ui.shadcn.com/) components with [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [@farajabien/slug-store](https://www.npmjs.com/package/@farajabien/slug-store) for URL persistence
- **Type Safety**: Full [TypeScript](https://www.typescriptlang.org/) implementation
- **Styling**: Tailwind CSS with custom design system
- **Package Manager**: [pnpm](https://pnpm.io/) for fast, efficient dependency management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farajabien/clarity.git
   cd clarity
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How to Use

### Quick Start
1. **Create Your First Project**: Click any of the "New Project" buttons
2. **Track Progress**: Update project status and progress as you work
3. **View Analytics**: See your completion rates and productivity trends
4. **Manage Todos**: Add cross-project tasks and track their completion

### Project Categories
- **Work Projects**: Regular job tasks, landing pages, internal tools
- **Client Projects**: Freelance work with budget and payment tracking
- **Personal Projects**: Startup ideas, side projects, learning projects

### Analytics Insights
- **Completion Rate**: Percentage of projects completed successfully
- **Revenue Tracking**: Total earnings from client projects
- **Productivity Trends**: Projects completed per time period
- **Time to Completion**: Average days per project

## 🎯 Success Metrics

Clarity helps you track:

### Primary KPIs
- **Project Completion Rate**: Track % of projects completed on time
- **Revenue Tracking**: Monitor client project revenue
- **Productivity Trends**: Measure projects completed per time period
- **Time to Completion**: Average time from start to finish

### Secondary Metrics
- **Project Type Distribution**: Balance between work/client/personal
- **Todo Completion Rate**: Cross-project task efficiency
- **Revenue per Project Type**: Client project profitability

## 🔧 Development

### Project Structure
```
clarity/
├── app/
│   ├── actions/          # Server actions for data operations
│   ├── api/             # API routes for data sync
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main landing page
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── ClarityDashboard.tsx  # Main dashboard component
│   └── DebugPanel.tsx   # Development debug panel
├── lib/
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   └── data/            # Sample data and templates
└── docs/                # Documentation
```

### Key Files
- `app/actions/projects.ts` - Core project management logic
- `lib/hooks/useProjects.ts` - React hooks for state management
- `components/ClarityDashboard.tsx` - Main dashboard UI
- `app/page.tsx` - Landing page

## 🚀 Features Roadmap

### ✅ Completed (v1.0)
- [x] Core project management with 3 categories
- [x] Unified todos board with cross-project visibility
- [x] Analytics dashboard with real-time metrics
- [x] URL-based state sharing and persistence
- [x] Email reports and data export
- [x] Responsive design and accessibility

### 🚧 Planned (v1.1)
- [ ] User authentication and multi-user support
- [ ] Database integration (Supabase/PostgreSQL)
- [ ] Advanced filtering and search
- [ ] Project templates and workflows
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

### 🔮 Future (v2.0)
- [ ] AI-powered project suggestions
- [ ] Time tracking integration
- [ ] Calendar integration
- [ ] Advanced analytics and insights
- [ ] API for third-party integrations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- We use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code formatting
- All code must pass TypeScript compilation
- Follow the existing code style and patterns

## 📚 Documentation

- [Project Requirements](./docs/PROJECT_REQUIREMENTS.md) - Detailed feature specifications
- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md) - Technical implementation details
- [Slug Store Guide](./docs/SLUG_STORE_GUIDE.md) - State management documentation
- [Slug Store v3.1 Features](./docs/SLUG_STORE_V3_1_FEATURES.md) - Advanced features showcase

## 🐛 Issues & Support

If you find a bug or have a feature request, please [open an issue](../../issues) on GitHub.

For support or questions:
- 📧 Email: [hello@fbien.com]
- 🐦 Twitter: [@farajabien]
- 💬 Discord: [Join our community]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [@farajabien/slug-store](https://www.npmjs.com/package/@farajabien/slug-store) for state persistence
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
- The ADHD developer community for inspiration and feedback

---

**🎉 Ready to boost your productivity?** Start tracking your project completion with Clarity today!

**Built with ❤️ for developers with ADHD**