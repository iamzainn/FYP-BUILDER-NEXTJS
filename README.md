# BuilderAI Frontend

Frontend for the BuilderAI website builder application. This Next.js application allows users to create websites through a chat-based interface.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Environment Variables**
   Create or modify the `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Connecting to the Backend

This frontend is designed to work with the Express backend. Before starting the frontend, make sure to:

1. Start the backend server (located in the `backend` directory).
2. Ensure the backend is running on the port specified in the `NEXT_PUBLIC_API_URL` environment variable (default: 4000).
3. Make sure the MySQL database is set up and configured as specified in the backend README.

## Main Features

- **User Authentication**: Sign up, login, and email verification
- **Dashboard**: View and manage created websites
- **Website Builder**: Create websites using a chat-based interface
- **Preview**: Preview websites before publishing

## Project Structure

```
ai/
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── api/         # API Routes (deprecated, using Express backend instead)
│   │   ├── login/       # Login page
│   │   ├── signup/      # Signup page
│   │   ├── dashboard/   # Dashboard to manage websites
│   │   └── create-web/  # Website builder interface
│   ├── components/      # Reusable React components
│   ├── services/        # Service layer for API communication
│   │   └── apiService.ts # API communication with the backend
│   └── styles/         # CSS and styling files
├── public/             # Static assets
├── .env.local          # Environment variables
└── package.json        # Project dependencies
```

## API Communication

The frontend communicates with the backend through the `ApiService` utility class, which handles:

- Authentication (login, signup, verification)
- User profile management
- Website creation and management
- File uploads

## Development

- The frontend is built with Next.js and React
- Styling is done with Tailwind CSS
- API requests are handled through the Fetch API
- Authentication state is managed with cookies

## License

ISC
