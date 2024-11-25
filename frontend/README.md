# Sales Training Frontend

A modern, responsive Next.js frontend for the Sales Training application with Auth0 authentication and role-based access control.

## Features

- Next.js 13+ with App Router
- Auth0 authentication integration
- Role-based access control (Admin, Teacher, Student)
- Responsive design with Tailwind CSS
- Modern UI components with DaisyUI
- Real-time progress tracking
- Interactive course management
- User dashboard with analytics

## Prerequisites

- Node.js 16+
- npm or yarn
- Auth0 account and credentials

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
Create a `.env.local` file with the following variables:
```
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
AUTH0_CLIENT_ID='your_client_id'
AUTH0_CLIENT_SECRET='your_client_secret'
```

## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   └── auth/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   └── DashboardLayout.tsx
│   ├── dashboard/
│   ├── courses/
│   ├── select-role/
│   └── layout.tsx
├── public/
├── styles/
├── middleware.ts
├── tailwind.config.ts
└── package.json
```

## Key Components

### Authentication
- Integrated Auth0 for secure authentication
- Role selection for new users
- Protected routes based on user roles
- Persistent sessions

### Navigation
- Role-based navigation menu
- Dynamic route protection
- Responsive design for mobile and desktop

### Dashboard
- Personalized user dashboard
- Progress tracking
- Course management (for Teachers/Admins)
- Analytics and reporting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Styling

- Tailwind CSS for utility-first styling
- DaisyUI for pre-built components
- Custom theme configuration in `tailwind.config.ts`

### Testing

- Jest for unit testing
- React Testing Library for component testing
- End-to-end testing with Cypress

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Security

- Auth0 for secure authentication
- Role-based access control
- Protected API routes
- Secure session management
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
