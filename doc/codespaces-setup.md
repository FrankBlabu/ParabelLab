# GitHub Codespaces Setup and Development Workflow

## Overview

This document describes how to set up and develop the Parabola project in GitHub Codespaces. GitHub Codespaces provides a complete development environment in the cloud, allowing you to develop, build, and test the project entirely within your browser.

## Getting Started with Codespaces

### Creating a New Codespace

1. Navigate to the [Parabola repository](https://github.com/FrankBlabu/Parabola) on GitHub
2. Click the green **Code** button
3. Select the **Codespaces** tab
4. Click **Create codespace on main** (or your desired branch)

GitHub will create a new development environment with all necessary tools and extensions pre-configured. This typically takes 2-3 minutes for the first setup.

### Initial Setup

Once the Codespace is ready, it will automatically:

1. Install Node.js 20 (via the dev container image)
2. Clone the repository
3. Install all project dependencies via `npm install`
4. Configure VS Code extensions (ESLint, Prettier, Tailwind CSS, etc.)

You'll see a terminal showing the progress. Once complete, you're ready to develop!

## Development Workflow

### Starting the Development Server

To run the application in development mode:

```bash
npm run dev
```

This starts the Vite development server on `http://localhost:5173`. The Codespaces environment will automatically detect the port and provide a browser preview or notification.

### Running Checks

To verify code quality (linting and type checking):

```bash
npm run checks
```

Or individually:
- **Linting**: `npm run lint`
- **Type checking**: `npm run typecheck`

### Running Tests

To execute the test suite:

```bash
npm run test
```

To run tests in watch mode (automatically re-run on file changes):

```bash
npm run test -- --watch
```

To generate a coverage report:

```bash
npm run test -- --coverage
```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be placed in the `dist/` directory.

### Preview Production Build

To test the production build locally:

```bash
npm run preview
```

## VS Code Extensions

The development container automatically installs the following VS Code extensions for optimal development experience:

| Extension | Purpose |
|-----------|---------|
| **GitLens** | Enhanced Git integration and history navigation |
| **GitHub Copilot** | AI-powered code suggestions and completion |
| **ESLint** | Code quality and style checking |
| **Prettier** | Code formatting |
| **Tailwind CSS** | Tailwind CSS intellisense and class suggestions |
| **Vitest Explorer** | Test runner UI integration |

## Development Tips

### File Synchronization

Codespaces keeps your files in sync with the repository. Changes made in the browser editor are saved automatically.

### Terminal Usage

You can open a terminal directly in VS Code (or use the integrated terminal in Codespaces) to run commands. Multiple terminals can be open simultaneously.

### Git Workflow

Standard Git commands work as expected:

```bash
# Check status
git status

# Create a new branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/my-feature
```

### Debugging

Set breakpoints by clicking on line numbers in the editor. The application will pause execution at breakpoints, allowing you to inspect variables and step through code.

### Performance

Codespaces performance depends on your internet connection. For optimal experience:
- Work with modern browsers (Chrome, Firefox, Edge, Safari)
- Close unused tabs and terminal sessions
- Use the Codespaces CLI for better performance if available

## Troubleshooting

### Dependencies Not Installing

If `npm install` encounters issues:

```bash
# Clear npm cache
npm cache clean --force

# Remove lock files
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process on that port
lsof -ti :5173 | xargs kill -9

# Or run on a different port
npm run dev -- --port 3000
```

### VS Code Extensions Not Loading

Refresh VS Code by pressing `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) and typing "Reload Window".

### Container Issues

If the development container is corrupted:

1. Open the Codespaces menu
2. Click **Rebuild container**
3. Wait for the rebuild to complete

## Stopping and Resuming Codespaces

### Stopping a Codespace

Click your codespace name in the Codespaces menu and select **Stop codespace**. Your work is preserved.

### Resuming a Codespace

Click the codespace name in the Codespaces menu to resume. The environment will boot from your last state.

### Deleting a Codespace

If you no longer need a Codespace, click the menu next to its name and select **Delete**.

## Frequently Asked Questions

**Q: Can I use Codespaces offline?**  
A: No, Codespaces requires an internet connection as it runs in the cloud.

**Q: How much does Codespaces cost?**  
A: GitHub Codespaces provides free usage hours per month. See [GitHub Codespaces pricing](https://github.com/features/codespaces) for details.

**Q: Can I customize the development environment?**  
A: Yes, edit the `.devcontainer/devcontainer.json` file to customize the environment (extensions, settings, tools, etc.).

**Q: What's the difference between Codespaces and a local environment?**  
A: Codespaces runs in the cloud, making it accessible from any browser. Local development provides potentially better performance for resource-intensive tasks.

## Additional Resources

- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)
- [Dev Containers Specification](https://containers.dev/)
- [Project Planning Overview](./planning/00-overview.md)
- [Project Setup Guide](./planning/01-project-setup.md)
