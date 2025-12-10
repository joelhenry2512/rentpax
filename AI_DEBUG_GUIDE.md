# Quick Debug Guide for AI Features

## Error: "Failed to generate investment recommendation"

This error usually means one of these issues:

### 1. Missing API Key (Most Common)

**Check if API key is set:**

Local Development:
```bash
# In your terminal, check if the key exists
echo $OPENAI_API_KEY
# Should show: sk-proj-... or sk-...
```

Vercel Production:
1. Go to your Vercel dashboard
2. Settings → Environment Variables
3. Look for `OPENAI_API_KEY`
4. If missing, add it and REDEPLOY

**Solution**: Add your OpenAI API key to environment variables

### 2. Invalid API Key

**Symptoms**: Error mentions "API key" or "authentication"

**Solution**:
1. Get a new key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Make sure you copy the FULL key (starts with `sk-proj-` or `sk-`)
3. No extra spaces or quotes

### 3. Quota Exceeded

**Symptoms**: Error mentions "quota" or "insufficient_quota"

**Solution**:
1. Check your usage at [platform.openai.com/usage](https://platform.openai.com/usage)
2. Add payment method at [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
3. New accounts get $5 free credit for 3 months

### 4. Rate Limit

**Symptoms**: Error mentions "rate_limit"

**Solution**: Wait 60 seconds and try again

### 5. Check Browser Console

Open browser dev tools (F12) and look at:
1. **Console tab** - Look for detailed error messages
2. **Network tab** - Check the `/api/ai/investment-advisor` request
   - Status: Should be 200
   - Response: Check for error details

## Testing Your Setup

### Test 1: Check Environment Variable

```bash
# Local
echo $OPENAI_API_KEY

# Should show your key, not empty
```

### Test 2: Test API Key Directly

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'

# Should return a JSON response, not an error
```

### Test 3: Check Vercel Logs

```bash
# If deployed to Vercel
vercel logs

# Look for errors mentioning OpenAI or API key
```

## Common Fixes

### Fix 1: Add API Key to Vercel

```bash
# Using Vercel CLI
vercel env add OPENAI_API_KEY

# Paste your key when prompted
# Then redeploy:
vercel --prod
```

### Fix 2: Restart Local Dev Server

```bash
# Stop the server (Ctrl+C)
# Make sure .env.local has:
echo "OPENAI_API_KEY=sk-proj-your-key-here" > .env.local

# Restart
npm run dev
```

### Fix 3: Clear Node Modules (if nothing else works)

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Still Not Working?

1. **Check the actual error message** in browser console (F12)
2. **Check Vercel logs** if deployed
3. **Verify your API key works** with the curl test above
4. **Make sure you redeployed** after adding the environment variable

## Quick Checklist

- [ ] OpenAI account created at platform.openai.com
- [ ] API key generated (starts with `sk-proj-` or `sk-`)
- [ ] API key added to environment variables (local or Vercel)
- [ ] Application restarted/redeployed after adding key
- [ ] No extra spaces or quotes in the API key
- [ ] Free credits available (check platform.openai.com/usage)
- [ ] Browser console shows actual error message

---

**Most likely issue**: Missing or invalid OPENAI_API_KEY

**Quick fix**:
1. Get key from platform.openai.com/api-keys
2. Add to Vercel environment variables
3. Redeploy
