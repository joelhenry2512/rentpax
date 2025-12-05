# AI Features Setup Guide
## RentPax - AI-Powered Investment Analysis

This guide will help you set up and use the AI features in RentPax, powered by Anthropic's Claude AI.

---

## 🤖 AI Features Overview

RentPax includes two powerful AI features:

### 1. **AI Investment Advisor**
- Analyzes property financials and market conditions
- Provides personalized investment recommendations (Score 1-10)
- Identifies strengths, risks, and opportunities
- Offers actionable suggestions for better ROI
- Predicts returns for 5, 10, and 30-year horizons

### 2. **AI Chat Assistant**
- Real-time Q&A about the property
- Explains financial concepts in plain English
- Provides investment strategy advice
- Understands context from your portfolio
- Available as a floating chat button on every property analysis

---

## 📋 Prerequisites

1. **RentPax Application** - Running locally or deployed to Vercel
2. **Anthropic API Key** - Free tier available at [console.anthropic.com](https://console.anthropic.com)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in (free account available)
3. Navigate to **API Keys** in the dashboard
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-api...`)

**Free Tier**: $5 in free credits when you sign up
- Approximately 150-200 property analyses
- Perfect for testing and personal use

### Step 2: Add API Key to Environment Variables

#### For Local Development:

Create or update your `.env.local` file:

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api-your-key-here
```

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-api-your-key-here`
   - **Environments**: Production, Preview, Development
4. Click **Save**
5. **Important**: Redeploy your application for changes to take effect

### Step 3: Restart Your Application

#### Local Development:
```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

#### Vercel:
```bash
# Trigger a new deployment
git commit -m "Add AI features" --allow-empty
git push origin main
```

### Step 4: Test the AI Features

1. Analyze any property in RentPax
2. Scroll down to see the **AI Investment Advisor** section
3. Click **Get AI Analysis** button
4. Wait 3-5 seconds for AI to analyze the property
5. See personalized recommendations!

For the **AI Chat Assistant**:
1. Look for the purple chat bubble in the bottom-right corner
2. Click to open the chat
3. Ask questions like:
   - "Is this a good rental property for a beginner?"
   - "What are the main risks with this investment?"
   - "How does the cash flow compare to market averages?"

---

## 💰 Pricing

### Anthropic Claude Pricing (as of 2024):

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Cost per Analysis |
|-------|----------------------|----------------------|-------------------|
| Claude 3.5 Sonnet | $3.00 | $15.00 | ~$0.02-0.04 |

**Real-world costs**:
- **Investment Advisor**: ~$0.02-0.03 per property analysis
- **Chat Assistant**: ~$0.01-0.02 per message exchange
- **100 property analyses**: ~$3-4 total
- **Free tier credit**: $5 = ~150-200 analyses

**Cost optimization tips**:
- The first analysis is the most expensive
- Follow-up chat messages are cheaper (shared context)
- Use AI strategically on properties you're seriously considering

---

## 🎯 How to Use AI Features Effectively

### AI Investment Advisor

**When to use**:
- You've found a property you're seriously considering
- You want a second opinion on the deal
- You're new to investing and need guidance
- You want to identify risks you might have missed

**Best practices**:
1. Review the financial metrics first (cap rate, cash flow)
2. Click "Get AI Analysis" for personalized recommendations
3. Read the AI's reasoning carefully
4. Use the suggestions to negotiate or improve the deal
5. Compare AI scores across multiple properties

**Understanding the score**:
- **8-10**: Strong Buy - Excellent investment opportunity
- **6-7**: Buy - Good fundamentals, positive outlook
- **4-5**: Hold - Marginal returns, be cautious
- **2-3**: Pass - Poor returns or significant risks
- **1**: Avoid - Major red flags

### AI Chat Assistant

**Suggested questions**:

**For beginners**:
- "Is this a good rental property for a beginner?"
- "What does cap rate mean in simple terms?"
- "How much should I budget for maintenance?"
- "What are the biggest risks I should worry about?"

**For experienced investors**:
- "How does this compare to the 1% rule?"
- "Should I consider a 15-year mortgage instead?"
- "What's the break-even occupancy rate?"
- "How sensitive is cash flow to rent decreases?"

**Strategy questions**:
- "Should I negotiate the price? By how much?"
- "Is this better for cash flow or appreciation?"
- "What improvements would boost ROI the most?"
- "How long should I hold this property?"

**Best practices**:
1. Be specific in your questions
2. Ask follow-up questions for clarification
3. Reference specific metrics ("Why is the cap rate 6.2%?")
4. Use the chat to learn and understand concepts
5. Don't rely solely on AI - verify important details

---

## 🔧 Troubleshooting

### "AI service not configured" error

**Problem**: API key not set or incorrect

**Solution**:
1. Verify your `ANTHROPIC_API_KEY` is set in environment variables
2. Check there are no extra spaces or quotes in the key
3. Restart your development server or redeploy to Vercel
4. Check the key is valid at [console.anthropic.com](https://console.anthropic.com)

### AI responses are slow or timeout

**Problem**: Network issues or API rate limits

**Solutions**:
- Check your internet connection
- Verify you haven't exceeded API rate limits
- Try again in a few seconds
- For production: Implement retry logic (already included)

### "Rate limit exceeded" error

**Problem**: Too many requests in a short time

**Solutions**:
- Wait 60 seconds and try again
- Upgrade to Anthropic's paid tier for higher limits
- Implement caching for repeated property analyses

### AI recommendations seem incorrect

**Problem**: AI misunderstanding data or context

**Solutions**:
- Verify all property data is accurate
- Check that financial calculations are correct
- Remember AI provides opinions, not guarantees
- Use AI as a tool, not the sole decision maker
- Report consistently poor recommendations to improve prompts

---

## 📊 What the AI Analyzes

### Investment Advisor considers:

1. **Cash Flow Analysis**
   - Monthly cash flow vs. market benchmarks
   - Positive vs. negative cash flow impact
   - Sustainability of current cash flow

2. **Return Metrics**
   - Cap rate (target: 6%+)
   - Cash-on-Cash return (target: 8%+)
   - Comparison to market averages

3. **Financial Structure**
   - Down payment percentage
   - Loan terms and interest rates
   - Total interest paid over loan life

4. **Risk Factors**
   - Negative cash flow risks
   - Market volatility
   - Property-specific concerns
   - Tenant and vacancy risks

5. **Opportunity Analysis**
   - Appreciation potential
   - Rent growth trends
   - Value-add opportunities
   - Negotiation leverage

6. **Market Context**
   - Location quality (derived from data)
   - Property type demand
   - Comparative investment alternatives

### Chat Assistant provides:

1. **Educational Support**
   - Explains financial terms
   - Teaches investment concepts
   - Provides context and examples

2. **Strategic Advice**
   - Investment strategy recommendations
   - Deal structure optimization
   - Risk mitigation tactics

3. **Property-Specific Analysis**
   - Detailed metric breakdowns
   - Scenario comparisons
   - Custom calculations

4. **Personalized Guidance**
   - Tailored to your experience level
   - Considers your specific property
   - Remembers conversation context

---

## 🔒 Privacy & Security

### Data Security:

- **API Communication**: All requests encrypted via HTTPS
- **Data Storage**: Conversation history stored locally in browser (not saved to database)
- **API Keys**: Never exposed to client-side code
- **Third-party**: Anthropic processes requests but doesn't train on your data (per their policy)

### What's sent to Anthropic:

**Investment Advisor**:
- Property address
- Financial metrics (price, rent, cash flow, etc.)
- Property details (beds, baths, sqft)

**Chat Assistant**:
- Your questions
- Property context (same as above)
- Conversation history (for context)

**NOT sent**:
- User account information
- Portfolio data (unless explicitly mentioned in chat)
- Other properties you've analyzed

### Best Practices:

1. Don't include sensitive personal information in chat
2. Don't share your API key publicly
3. Rotate your API key if compromised
4. Review Anthropic's privacy policy for details

---

## 🚀 Advanced Configuration

### Customizing AI Behavior

You can modify AI prompts in `/src/services/ai.ts`:

```typescript
// Adjust temperature for creativity vs. consistency
temperature: 0.3  // Lower = more consistent, Higher = more creative

// Adjust max tokens for longer responses
max_tokens: 2000  // Higher = longer responses (more expensive)

// Change model for different capabilities
model: 'claude-3-5-sonnet-20241022'  // Latest model
```

### Adding More AI Features

The AI service is extensible. You can add:

1. **Property Comparison AI**
   ```typescript
   export async function compareProperties(
     property1: PropertyData,
     property2: PropertyData
   ): Promise<ComparisonResult>
   ```

2. **Market Trend Predictor**
   ```typescript
   export async function predictMarketTrends(
     location: string,
     historicalData: MarketData[]
   ): Promise<TrendPrediction>
   ```

3. **Risk Assessment AI**
   ```typescript
   export async function assessRisks(
     propertyData: PropertyData
   ): Promise<RiskReport>
   ```

See the [TECHNICAL_IMPLEMENTATION_DOCUMENTATION.md](./TECHNICAL_IMPLEMENTATION_DOCUMENTATION.md) for architecture details.

---

## 📚 Academic Context (ECE 574)

### Why AI Integration is Valuable:

1. **Novel Contribution**: Demonstrates practical application of LLM technology in real estate domain
2. **Software Architecture**: Shows integration of external AI services with microservices
3. **User Experience**: Enhances traditional analysis with intelligent recommendations
4. **Technical Depth**: Implements prompt engineering, API integration, error handling

### Technical Highlights for Your Project:

- **Design Pattern**: Strategy pattern for AI model selection
- **API Integration**: RESTful API design with Anthropic SDK
- **Error Handling**: Graceful degradation when AI unavailable
- **Performance**: Async processing with loading states
- **Security**: Environment variable management for API keys

### Documentation Sections to Include:

1. **AI Architecture Diagram** - Show how AI integrates with existing system
2. **Prompt Engineering** - Explain how prompts are structured for optimal results
3. **Performance Analysis** - Measure API response times and costs
4. **User Testing** - Gather feedback on AI recommendation quality
5. **Future Enhancements** - Discuss potential ML/AI improvements

---

## 🎓 Learning Resources

### Understanding Claude AI:
- [Anthropic Documentation](https://docs.anthropic.com)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Claude API Reference](https://docs.anthropic.com/claude/reference)

### Real Estate Investment AI:
- Use AI to learn about cap rates, cash flow, ROI
- Ask the chat assistant to explain concepts
- Compare AI recommendations with human experts

### Software Engineering:
- Study the AI service layer (`/src/services/ai.ts`)
- Review API route implementations
- Understand async/await patterns in TypeScript

---

## 🆘 Support

### Issues & Questions:

1. **Check this guide first** - Most common issues are covered
2. **Review code comments** - Implementation details in `/src/services/ai.ts`
3. **Test with simple questions** - Verify basic functionality first
4. **Check API key** - Most issues are authentication-related

### Useful Commands:

```bash
# Check if API key is set (local)
echo $ANTHROPIC_API_KEY

# Test API key directly
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":10,"messages":[{"role":"user","content":"Hello"}]}'

# View server logs (local)
npm run dev

# View Vercel logs (production)
vercel logs [deployment-url]
```

---

## 🎉 Success!

You now have AI-powered investment analysis in RentPax!

**Next Steps**:
1. Analyze several properties to see AI recommendations
2. Compare AI scores across different deals
3. Use the chat assistant to learn investment concepts
4. Document your findings for your ECE 574 project

**Tips for ECE 574 Project**:
- Take screenshots of AI recommendations
- Document how AI improves user decision-making
- Measure response times and accuracy
- Discuss ethical considerations of AI in investing
- Propose future enhancements (ML-based price predictions, sentiment analysis, etc.)

---

**Version**: 1.0
**Last Updated**: December 5, 2024
**Powered by**: Anthropic Claude 3.5 Sonnet
