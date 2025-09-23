# RentPax Setup Instructions

## Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** database
3. **RentCast API Key** (optional - app works with mock data)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rentpax"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   RENTCAST_API_KEY="your-rentcast-api-key-here" # Optional
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

### ✅ Completed Features

1. **Property Analysis**
   - Address input with RentCast API integration
   - Real-time finance calculations (PITI, cash flow, cap rate, CoC)
   - Customizable assumptions (vacancy, maintenance, management)

2. **Export Functionality**
   - CSV export of analysis results
   - PDF export (HTML-based, printable)

3. **Comparable Properties**
   - Real comps list from RentCast API
   - User-selectable comparables
   - Custom rent analysis

4. **Portfolio Management**
   - Save multiple properties
   - Portfolio overview with summary statistics
   - Property management (view, delete)

5. **Enhanced UI**
   - Beautiful charts and visualizations
   - Responsive design
   - Modern card-based layout

### 🚀 New Features Added

- **Charts & Visualizations**: Cash flow charts, ROI pie charts, expense breakdowns
- **Export Options**: CSV and PDF export functionality
- **Comps Selection**: Interactive comparable properties with custom rent analysis
- **Portfolio Page**: Complete property portfolio management
- **Enhanced Analysis**: Rich visual analysis with multiple chart types

## API Endpoints

- `POST /api/analyze` - Analyze property with finance calculations
- `GET/POST /api/profile` - User profile management
- `GET/POST /api/portfolio` - Portfolio management
- `GET/PUT/DELETE /api/portfolio/[id]` - Individual property operations

## Database Schema

The app uses Prisma with PostgreSQL and includes:
- **Users**: Authentication and user management
- **Profiles**: User financial information
- **Properties**: Saved property analyses

## Development

- **TypeScript**: Full type safety
- **TailwindCSS**: Utility-first styling
- **Recharts**: Data visualization
- **NextAuth**: Authentication
- **Prisma**: Database ORM

## Production Deployment

1. Set up production database
2. Configure environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Build the app: `npm run build`
5. Start production server: `npm start`

## Support

For issues or questions, please check the codebase or create an issue in the repository.
