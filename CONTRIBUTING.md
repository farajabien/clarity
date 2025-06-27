# Contributing to Clarity

Thank you for your interest in contributing to Clarity! This document provides guidelines and information for contributors.

## 🎯 What We're Building

Clarity is an ADHD-friendly project management tool designed specifically for developers. We focus on:

- **Simplicity**: Minimal distractions, clear interfaces
- **Speed**: Quick actions and instant feedback
- **Visual Progress**: Clear indicators of completion and productivity
- **Cross-Project Management**: Unified view of all work

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended package manager)
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/farajabien/clarity.git
   cd clarity
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Development Guidelines

### Code Style

- **TypeScript**: All code must be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled by Prettier
- **Naming**: Use descriptive names for variables, functions, and components

### Component Guidelines

- **shadcn/ui**: Use shadcn/ui components when possible
- **Props**: Use TypeScript interfaces for component props
- **Styling**: Use Tailwind CSS classes
- **Accessibility**: Ensure components are accessible (ARIA labels, keyboard navigation)

### State Management

- **slug-store**: Use the existing slug-store setup for state persistence
- **Hooks**: Create custom hooks for reusable logic
- **Types**: Define proper TypeScript types for all data structures

### Testing

- **Manual Testing**: Test all features manually before submitting
- **Cross-browser**: Test in Chrome, Firefox, and Safari
- **Mobile**: Ensure responsive design works on mobile devices
- **Accessibility**: Test with screen readers and keyboard navigation

## 🐛 Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for solutions
3. **Test in the latest version** of the app

### Issue Template

When creating an issue, please include:

- **Description**: Clear description of the problem
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser, OS, device information
- **Screenshots**: If applicable

## 🔧 Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-todo-filters`
- `fix/progress-bar-calculation`
- `docs/update-readme`

### Commit Messages

Follow conventional commit format:
- `feat: add todo filtering functionality`
- `fix: resolve progress bar calculation bug`
- `docs: update installation instructions`
- `style: improve button hover states`

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Test thoroughly** before submitting
4. **Update documentation** if needed
5. **Create a pull request** with a clear description

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing
- [ ] Mobile responsiveness checked
- [ ] Accessibility verified

## Screenshots
Add screenshots if UI changes were made
```

## 🎨 Design Guidelines

### ADHD-Friendly Design Principles

- **Minimal Distractions**: Clean, focused interfaces
- **Clear Visual Hierarchy**: Important information stands out
- **Quick Actions**: One-click operations where possible
- **Progress Indicators**: Visual feedback for all actions
- **Consistent Patterns**: Predictable interactions

### Color Usage

- **Primary**: Blue for main actions and navigation
- **Success**: Green for completed items
- **Warning**: Orange for pending/urgent items
- **Error**: Red for errors and overdue items
- **Neutral**: Gray for secondary information

### Typography

- **Headings**: Clear hierarchy with proper contrast
- **Body Text**: Readable font sizes and line spacing
- **Labels**: Clear, descriptive labels for all inputs

## 📚 Documentation

### Code Documentation

- **Comments**: Add comments for complex logic
- **JSDoc**: Use JSDoc for function documentation
- **README**: Keep README updated with new features

### User Documentation

- **Screenshots**: Include screenshots for new features
- **Examples**: Provide usage examples
- **Troubleshooting**: Document common issues and solutions

## 🚀 Deployment

### Before Merging

- [ ] All tests pass
- [ ] Code review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Performance acceptable

### Release Process

1. **Version bump** in `package.json`
2. **Update changelog** with new features/fixes
3. **Create release** on GitHub
4. **Deploy** to production

## 🤝 Community Guidelines

### Be Respectful

- **Constructive Feedback**: Provide helpful, constructive feedback
- **Inclusive Language**: Use inclusive language in all communications
- **Patience**: Be patient with new contributors

### Communication

- **Clear Communication**: Be clear and specific in your communication
- **Ask Questions**: Don't hesitate to ask for clarification
- **Share Knowledge**: Help others learn and grow

## 📞 Getting Help

If you need help:

- **GitHub Issues**: Create an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check the docs folder for detailed guides

## 🙏 Recognition

Contributors will be recognized in:

- **README**: List of contributors
- **Release Notes**: Credit for significant contributions
- **GitHub**: Contributor statistics and profile

---

Thank you for contributing to Clarity! Your work helps make project management better for developers with ADHD. 🎉 