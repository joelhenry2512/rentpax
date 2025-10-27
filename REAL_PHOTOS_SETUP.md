# How to Get REAL Property Photos in RentPax

## 🎯 You Want Real Photos, Not Fake Ones - Here's How

Your app is now configured to show **REAL street-level photos** of properties using Google Street View API.

---

## 🚀 Quick Setup (10 Minutes)

### Step 1: Get Google Maps API Key

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **Create a Project** (or use existing)
   - Click "Select a project" → "New Project"
   - Name it "RentPax" or similar
   - Click "Create"

3. **Enable Street View Static API**
   - In the search bar, type "Street View Static API"
   - Click on it
   - Click **"Enable"**
   - Also enable **"Maps Static API"** (for backup)

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click **"Create Credentials"** → "API Key"
   - Copy the API key (looks like: `AIzaSyD...`)

5. **Restrict the API Key** (IMPORTANT for security)
   - Click "Edit API key"
   - Under "API restrictions":
     - Select "Restrict key"
     - Check: "Street View Static API" and "Maps Static API"
   - Under "Application restrictions":
     - Select "HTTP referrers"
     - Add your domains:
       - `*.vercel.app/*`
       - `yourdomain.com/*` (if you have one)
   - Click **"Save"**

### Step 2: Add API Key to Vercel

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Select Your Project** (rentpax)

3. **Go to Settings → Environment Variables**

4. **Add New Variable**
   ```
   Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   Value: [paste your API key from Step 1]
   ```

5. **Select Environments**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

6. **Click "Save"**

### Step 3: Redeploy

1. **Trigger Redeploy**
   - Go to "Deployments" tab
   - Click ⋯ on latest deployment
   - Click "Redeploy"
   - Wait 2-3 minutes

2. **Done!** 🎉

---

## 📸 What You'll Get

After setup, EVERY property will show:

✅ **REAL street-level photo** of the actual property address
✅ **Actual building** from Google Street View
✅ **Current appearance** (Google updates regularly)
✅ **Works for 99% of US addresses**

### Example URLs:
```
https://maps.googleapis.com/maps/api/streetview?size=800x600&location=1600+Amphitheatre+Parkway,Mountain+View,CA&key=YOUR_KEY
```

This shows the ACTUAL Google headquarters building!

---

## 💰 Pricing

### Google Street View Static API:
- **FREE Tier**: $200 credit per month
- **Cost**: $7 per 1,000 requests
- **What you get free**: ~28,000 property photos/month
- **For most users**: Stays 100% free

### Calculation:
- If 100 users analyze 5 properties/day = 15,000 requests/month = FREE
- Only pay if you exceed 28,000 photos/month

### Enable Billing:
1. Google Cloud Console → "Billing"
2. Add credit card (won't charge unless you exceed free tier)
3. Set budget alerts at $50, $100, $150

---

## 🔄 Fallback System

Your app has a smart photo priority:

### Priority 1: RentCast Photos
- If RentCast API returns photos → use those
- Actual property listing photos
- **Status**: Requires paid RentCast plan with photo access

### Priority 2: Google Street View ⭐ (CURRENT SETUP)
- Real street-level photos
- Works for almost all addresses
- **Status**: YOU ARE HERE - set this up!

### Priority 3: Mapbox Satellite
- Aerial view of property
- Free tier: 50,000 requests/month
- **Status**: Optional upgrade

### Priority 4: Unsplash Generic
- Professional house stock photos
- Not specific to property
- **Status**: Current fallback if no Google key

---

## 🧪 Test It Works

After deploying with Google API key:

1. **Visit your live site**
2. **Analyze any property**:
   - Try: "1600 Amphitheatre Parkway, Mountain View, CA"
   - Try: "350 5th Ave, New York, NY" (Empire State Building)
   - Try: "1 Apple Park Way, Cupertino, CA"

3. **Check the photo**:
   - Should show actual building from street view
   - Right-click photo → "Open in new tab"
   - URL should contain `maps.googleapis.com/maps/api/streetview`

4. **Console logs**:
   - Open DevTools → Console
   - Should see: "Using Google Street View for real property photo"

---

## 🛠️ Alternative Options

### Don't Want to Pay for Google?

**Option A: Use Mapbox Satellite (FREE)**
- Shows aerial view of property
- Free tier: 50,000 requests/month
- Setup: Get token at https://www.mapbox.com
- Add to Vercel: `NEXT_PUBLIC_MAPBOX_TOKEN=your_token`

**Option B: Upgrade RentCast Plan**
- Some RentCast plans include property photos
- Check if your plan has photo access
- Contact RentCast support

**Option C: Use Generic Photos (CURRENT)**
- Professional stock photos from Unsplash
- Free, no limits
- NOT specific to each property
- Already working

---

## 📊 Comparison

| Source | Type | Cost | Setup | Quality |
|--------|------|------|-------|---------|
| **Google Street View** | Real property | $7/1k (free 28k/mo) | 10 min | ⭐⭐⭐⭐⭐ Best |
| RentCast Photos | Real listing | Included in plan | If you have access | ⭐⭐⭐⭐⭐ Best |
| Mapbox Satellite | Aerial view | Free 50k/mo | 5 min | ⭐⭐⭐⭐ Good |
| Unsplash Stock | Generic | Free unlimited | None needed | ⭐⭐ OK |

---

## 🎯 Recommendation

**For REAL Property Photos:**
1. ✅ **Set up Google Street View** (follow steps above)
2. Cost: FREE for most users (28k photos/month)
3. Shows actual buildings from street level
4. Best user experience

**Alternative:**
- Contact RentCast to see if your plan includes property photos
- If yes, regenerate your API key and photos will work automatically

---

## 🐛 Troubleshooting

### Photos Still Not Showing

**Check 1: API Key Added**
```
Vercel → Settings → Environment Variables
Should see: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

**Check 2: Redeployed**
- Environment variables only work after redeploy
- Check deployment timestamp

**Check 3: API Enabled**
- Google Cloud Console
- "Street View Static API" should show "Enabled"

**Check 4: Billing Enabled**
- Even for free tier, must enable billing
- Won't charge within free tier

**Check 5: API Key Restrictions**
- Make sure your Vercel domain is allowed
- Check HTTP referrer restrictions

### Invalid API Key Error

- Regenerate key in Google Console
- Update in Vercel
- Redeploy

### Gray/Blank Images

- Address might not have Street View coverage
- Fallback to Unsplash will trigger automatically
- Normal behavior

---

## 📝 Summary

**Current Status**: Generic Unsplash photos (not property-specific)

**After Setup**: REAL street-level photos of actual properties

**Time to Setup**: 10 minutes

**Cost**: FREE for up to 28,000 photos/month

**Action**: Follow "Step 1" above to get started!

---

Need help? Check these resources:
- Google Street View API Docs: https://developers.google.com/maps/documentation/streetview
- Pricing Calculator: https://mapsplatform.google.com/pricing/
- Support: https://cloud.google.com/support

---

**Ready to see REAL photos? Start at Step 1 above! 🚀**
