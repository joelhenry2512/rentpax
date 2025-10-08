# 🏠 RentPax - Real Estate Investment Analysis Platform

**Live Demo:** https://rentpaxmvpplus.vercel.app

A comprehensive full-stack real estate investment analysis platform that provides instant property valuations, rent estimates, cash flow analysis, and affordability calculations for real estate investors.

## ✨ Features

### 🔍 **Property Analysis**
- **Instant Property Valuation** - Get AVM (Automated Valuation Model) estimates
- **Rent Estimates** - Accurate rental income projections
- **Cash Flow Analysis** - Monthly/yearly cash flow calculations
- **Affordability Analysis** - DTI-based affordability assessment
- **ROI Metrics** - Cap rate, cash-on-cash return, and more

### 🏘️ **Comparable Properties**
- **Real Comps Data** - Live comparable properties from RentCast API
- **Interactive Selection** - Choose which comps to include in analysis
- **Distance-based Filtering** - Comps sorted by proximity to subject property

### 📊 **Advanced Analytics**
- **Interactive Charts** - Cash flow, ROI, and expense breakdown visualizations
- **Scenario Comparison** - Compare different down payment scenarios
- **Customizable Assumptions** - Adjust vacancy, maintenance, and management rates
- **Export Capabilities** - PDF and CSV export of analysis results

### 👤 **User Management**
- **User Authentication** - Secure sign-up and login system
- **Portfolio Management** - Save and manage multiple properties
- **Income Tracking** - Save annual income for personalized affordability analysis
- **Session Management** - Persistent user sessions

### 🗺️ **Smart Address Input**
- **Nationwide Autocomplete** - Works for all US addresses
- **Real-time Suggestions** - Powered by OpenStreetMap Nominatim API
- **RentCast Integration** - Seamless property data retrieval

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Railway)
- **Authentication:** NextAuth.js (Credentials Provider)
- **APIs:** RentCast (Property Data), OpenStreetMap (Address Autocomplete)
- **Charts:** Recharts
- **Export:** React-PDF, PapaParse
- **Deployment:** Vercel

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/joelhenry2512/rentpax.git
cd rentpax

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your API keys to .env.local:
RENTCAST_API_KEY=your_rentcast_api_key
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Set up the database
npx prisma migrate dev --name init
npx prisma generate

# Start the development server
npm run dev
```

## 🔧 Environment Variables

```env
# Required
RENTCAST_API_KEY=your_rentcast_api_key_here
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

## 📱 Usage

1. **Enter Property Address** - Use the smart autocomplete for any US address
2. **Set Your Income** - Enter annual income for personalized affordability analysis
3. **Adjust Assumptions** - Customize vacancy, maintenance, and management rates
4. **Analyze Results** - View comprehensive financial metrics and charts
5. **Save to Portfolio** - Create an account to save properties for future reference
6. **Export Analysis** - Download PDF or CSV reports

## 🎯 Key Metrics Calculated

- **PITI** (Principal, Interest, Taxes, Insurance)
- **Cash Flow** (Monthly and Annual)
- **Cap Rate** (Net Operating Income / Property Value)
- **Cash-on-Cash Return** (Annual Cash Flow / Cash Invested)
- **Affordability Status** (Based on 28% DTI rule)
- **Break-even Rent** (Minimum rent needed to cover expenses)

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **JWT Sessions** - Secure session management
- **Input Validation** - Zod schema validation for all API endpoints
- **SQL Injection Protection** - Prisma ORM with parameterized queries

## 📈 Performance Optimizations

- **Server-side Rendering** - Fast initial page loads
- **API Route Optimization** - Efficient data fetching
- **Database Indexing** - Optimized queries with Prisma
- **CDN Deployment** - Global edge caching with Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **RentCast API** - Property valuation and rental data
- **OpenStreetMap** - Address autocomplete services
- **Next.js Team** - Amazing React framework
- **Vercel** - Seamless deployment platform

---

**Built with ❤️ for real estate investors**
