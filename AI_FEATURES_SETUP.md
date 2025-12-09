# AI Features Setup Guide
## RentPax - AI-Powered Investment Analysis

This guide will help you set up and use the AI features in RentPax, powered by OpenAI's GPT-4.

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
2. **OpenAI API Key** - Sign up at [platform.openai.com](https://platform.openai.com)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your OpenAI API Key

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** (top right menu)
4. Click **+ Create new secret key**
5. Give it a name (e.g., "RentPax")
6. Copy your API key (starts with `sk-proj-...` or `sk-...`)

**New Users**: $5 in free credits when you sign up (valid for 3 months)
- Approximately 100-150 property analyses with GPT-4o
- Perfect for testing and academic projects

### Step 2: Add API Key to Environment Variables

#### For Local Development:

Create or update your `.env.local` file:

```bash
# .env.local
OPENAI_API_KEY=sk-proj-your-key-here
```

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-your-key-here`
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

### OpenAI GPT-4 Pricing (as of December 2024):

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Cost per Analysis |
|-------|----------------------|----------------------|-------------------|
| GPT-4o | $2.50 | $10.00 | ~$0.03-0.05 |
| GPT-4o-mini | $0.15 | $0.60 | ~$0.002-0.005 |

**Real-world costs** (using GPT-4o):
- **Investment Advisor**: ~$0.03-0.05 per property analysis
- **Chat Assistant**: ~$0.01-0.02 per message exchange
- **100 property analyses**: ~$4-6 total
- **Free tier credit**: $5 = ~100-150 analyses

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
1. Verify your `OPENAI_API_KEY` is set in environment variables
2. Check there are no extra spaces or quotes in the key
3. Restart your development server or redeploy to Vercel
4. Check the key is valid at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### AI responses are slow or timeout

**Problem**: Network issues or API rate limits

**Solutions**:
- Check your internet connection
- Verify you haven't exceeded API rate limits (3,500 requests/min for GPT-4o)
- Try again in a few seconds
- For production: Implement retry logic (already included)

### "Rate limit exceeded" error

**Problem**: Too many requests in a short time

**Solutions**:
- Wait 60 seconds and try again
- OpenAI automatically increases limits as you use the API more
- Implement caching for repeated property analyses
- Check your usage at [platform.openai.com/usage](https://platform.openai.com/usage)

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
- **Third-party**: OpenAI processes requests. API data is not used for training by default (per their policy)

### What's sent to OpenAI:

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
4. Review OpenAI's privacy policy at [openai.com/policies](https://openai.com/policies)

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
model: 'gpt-4o'  // GPT-4 Optimized (recommended)
// model: 'gpt-4o-mini'  // Cheaper, faster alternative
// model: 'gpt-4-turbo'  // More capable but slower
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

### Understanding OpenAI GPT-4:
- [OpenAI Documentation](https://platform.openai.com/docs)
- [GPT-4 Guide](https://platform.openai.com/docs/guides/gpt)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

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
echo $OPENAI_API_KEY

# Test API key directly
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello"}],"max_tokens":10}'

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

**Version**: 2.0
**Last Updated**: December 5, 2024
**Powered by**: OpenAI GPT-4o
