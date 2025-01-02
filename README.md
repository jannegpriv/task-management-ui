# Task Management UI

A React-based frontend for the Task Management application. This service provides the user interface for managing tasks.

## Architecture

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Container Registry**: GitHub Container Registry (ghcr.io)
- **CI/CD**: GitHub Actions
- **Deployment**: Kubernetes via [task-management-k8s](https://github.com/jannegpriv/task-management-k8s)

## Local Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/jannegpriv/task-management-ui.git
cd task-management-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Using Docker

Build and run the application using Docker:
```bash
docker build -t task-management-ui .
docker run -p 80:80 task-management-ui
```

## Features

- Create, read, update, and delete tasks
- Modern, responsive user interface
- Real-time updates
- Error handling and loading states

## Deployment

This service is deployed using GitHub Actions and Kubernetes:

1. Changes pushed to main trigger the CI/CD pipeline
2. The pipeline:
   - Runs linting and type checks
   - Builds the application
   - Creates a Docker image
   - Pushes to GitHub Container Registry
   - Tags with both `latest` and git version tag (if present)

### Release Process

To create a new release:

1. Tag the commit:
```bash
git tag -a v1.1.0 -m "Description of changes"
git push origin v1.1.0
```

2. GitHub Actions will automatically:
   - Build the Docker image
   - Tag it as `ghcr.io/jannegpriv/task-management-ui:v1.1.0`
   - Push to the registry

3. Update the Kubernetes manifests in [task-management-k8s](https://github.com/jannegpriv/task-management-k8s) to use the new version.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests

## Related Repositories

- [task-management](https://github.com/jannegpriv/task-management) - Backend Flask API
- [task-management-k8s](https://github.com/jannegpriv/task-management-k8s) - Kubernetes manifests
