# Gym Tracker

A Next.js application for tracking gym workouts and progress, integrated with the unified backend.

## Features

- **Dashboard**: View your workout statistics, activity charts, and muscle group distribution
- **Log Workouts**: Record exercises with sets, reps, and weight
- **Exercise Management**: Create custom exercises with muscle group percentages
- **Authentication**: Secure login with Supabase
- **Dark Mode**: Full dark mode support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js with react-chartjs-2
- **Authentication**: Supabase
- **Backend**: FastAPI (unified backend)

## Setup

### 1. Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Database Migration

Make sure the unified backend database migration has been run:

```bash
cd ../unified_backend/db_migrations
# Run the gym_tracker migration
```

### 4. Start the Application

From the project root, use the unified start script:

```bash
cd ..
./run_local.sh
# Select option 3 (Gym Tracker)
```

Or run directly:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Application Structure

```
gym_tracker/
├── app/
│   ├── dashboard/          # Dashboard with stats and charts
│   ├── log-workout/        # Workout logging page
│   ├── login/              # Authentication page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (redirects to dashboard)
│   └── providers.tsx       # Context providers
├── components/
│   ├── AuthGuard.tsx       # Protected route wrapper
│   ├── Loader.tsx          # Loading spinner
│   ├── Navbar.tsx          # Mobile navigation
│   ├── Sidebar.tsx         # Desktop navigation
│   └── ThemeToggle.tsx     # Dark mode toggle
├── contexts/
│   ├── AuthContext.tsx     # Authentication state
│   └── ThemeContext.tsx    # Theme state
├── lib/
│   ├── apis.ts             # API client
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── middleware.ts           # Next.js middleware
```

## API Endpoints

The app communicates with these backend endpoints:

### Exercises
- `GET /api/gym-tracker/exercises` - List all exercises
- `POST /api/gym-tracker/exercises` - Create new exercise
- `GET /api/gym-tracker/exercises/{id}` - Get exercise details
- `PUT /api/gym-tracker/exercises/{id}` - Update exercise
- `DELETE /api/gym-tracker/exercises/{id}` - Delete exercise

### Activities
- `GET /api/gym-tracker/activities` - List user's activities
- `POST /api/gym-tracker/activities` - Log new activity
- `GET /api/gym-tracker/activities/{id}` - Get activity details
- `PUT /api/gym-tracker/activities/{id}` - Update activity
- `DELETE /api/gym-tracker/activities/{id}` - Delete activity
- `GET /api/gym-tracker/activities/dashboard/stats` - Get dashboard statistics

## Database Schema

### exercises table
- `id` - UUID (primary key)
- `name` - VARCHAR (unique)
- `muscles_trained` - JSONB (e.g., `{"chest": 60, "triceps": 30}`)
- `created_at` - TIMESTAMPTZ
- `updated_at` - TIMESTAMPTZ

### gym_activity table
- `id` - UUID (primary key)
- `user_id` - VARCHAR (foreign key to users)
- `exercise_id` - UUID (foreign key to exercises)
- `sets` - INTEGER
- `reps` - INTEGER
- `weight` - FLOAT (nullable for bodyweight exercises)
- `created_at` - TIMESTAMPTZ
- `updated_at` - TIMESTAMPTZ

## Usage

### Logging a Workout

1. Navigate to "Log Workout" from the sidebar
2. Select an existing exercise or create a new one
3. Enter sets, reps, and weight (optional for calisthenics)
4. Click "Log Workout"

### Creating an Exercise

1. Go to "Log Workout"
2. Click "+ Create New Exercise"
3. Enter exercise name
4. Add muscle groups and set percentages (must total 100%)
5. Click "Create Exercise"

### Viewing Progress

1. Navigate to "Dashboard"
2. View your monthly stats, most trained muscle, and total weight lifted
3. Check the line chart for daily activity trends
4. Review the bar chart for muscle group distribution

## Features to Add (Future)

- Exercise history and PR tracking
- Workout templates and routines
- Rest timer between sets
- Exercise notes and form tips
- Progress photos
- Export workout data
- Social features (share workouts)
- Advanced analytics (volume, intensity, frequency)

## Development

### Build for Production

```bash
pnpm build
```

### Run Production Build

```bash
pnpm start
```

### Linting

```bash
pnpm lint
```

## License

Part of the Dradic Technologies project.
