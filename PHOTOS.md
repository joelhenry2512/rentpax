# Property Photos Configuration Guide

## How Photos Work in RentPax

Photos are displayed for each analyzed property using a multi-tier fallback system:

### Photo Sources (Priority Order)

#### 1. RentCast API Photos (Best Quality)
- **Source**: RentCast API `photoUrl`, `images`, or `photos` fields
- **Quality**: Actual property photos
- **Cost**: Included with RentCast API subscription
- **Setup**: Just add `RENTCAST_API_KEY` to environment variables

#### 2. Mapbox Satellite View (Good Alternative)
- **Source**: Mapbox Static Images API
- **Quality**: Aerial/satellite view of property location
- **Cost**: Free tier: 50,000 requests/month
- **Setup**: Add `NEXT_PUBLIC_MAPBOX_TOKEN` to environment variables

#### 3. Unsplash Generic House Photos (Fallback)
- **Source**: Unsplash free photo service
- **Quality**: Generic house photos (not specific to property)
- **Cost**: Free, no API key needed
- **Setup**: Works automatically (current default)

#### 4. Google Street View (Optional Premium)
- **Source**: Google Maps Static Street View API
- **Quality**: Street-level property photos
- **Cost**: Paid (see pricing below)
- **Setup**: Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## Current Setup (No Configuration Needed)

**Photos work immediately** using Unsplash generic house images. Every property will show a random professional house photo.

**What you see now:**
- ✅ Photos display on every analyzed property
- ✅ Different random photos each time
- ✅ No API keys required
- ⚠️ Not property-specific (generic house images)

---

## Option 1: Get Property-Specific Photos (Recommended)

### Use RentCast API Photos

RentCast includes property photos in their API response. To enable:

1. **Get RentCast API Key** (if you don't have one)
   - Sign up: https://developers.rentcast.io/
   - Free tier available with limited requests
   - Pricing: https://www.rentcast.io/pricing

2. **Add to Vercel Environment Variables**
   ```
   RENTCAST_API_KEY=your_api_key_here
   ```

3. **Redeploy**
   - Photos will automatically come from RentCast when available
   - Falls back to Unsplash if RentCast doesn't have photos

**Pros:**
- Actual property photos
- No additional cost (included with RentCast)
- Best user experience

**Cons:**
- Not all properties have photos
- Requires RentCast subscription

---

## Option 2: Satellite/Aerial View Photos

### Use Mapbox for Property Location Photos

Get free aerial/satellite images of property locations:

1. **Sign up for Mapbox**
   - Create account: https://www.mapbox.com/
   - Free tier: 50,000 requests/month

2. **Get Access Token**
   - Dashboard → Account → Access Tokens
   - Create a new public token

3. **Add to Vercel Environment Variables**
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
   ```

4. **Redeploy**
   - Properties will show satellite view when coordinates available

**Pros:**
- Free tier is generous
- Shows actual property location
- Works for most addresses

**Cons:**
- Not street-level photos
- Requires coordinates from RentCast
- May not be as visually appealing as house photos

---

## Option 3: Google Street View (Premium)

### Setup Google Street View API

For street-level photos of actual properties:

1. **Enable Google Maps Static API**
   - Go to: https://console.cloud.google.com/
   - Create project or select existing
   - Enable "Maps Static API"
   - Enable "Street View Static API"

2. **Get API Key**
   - APIs & Services → Credentials → Create API Key
   - Restrict key to your domain for security

3. **Add to Vercel Environment Variables**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your_key
   ```

4. **Update Code** (see below)

5. **Set up Billing**
   - $7 per 1,000 requests (after free $200 credit)
   - Free tier: $200/month credit (≈28,000 requests)

**Pros:**
- Street-level photos of actual properties
- Best quality and specificity
- Works for almost all addresses

**Cons:**
- Paid service (after free tier)
- Requires Google Cloud account
- Costs can add up with high traffic

---

## Implementation Examples

### Current Implementation (Unsplash - Already Working)

```typescript
// src/services/rentcast.ts - Already implemented!
const demoPhotoUrl = `https://source.unsplash.com/800x600/?house,residential&sig=${Date.now()}`;
```

### Add Google Street View (Optional)

To add Google Street View support, update `src/services/rentcast.ts`:

```typescript
// After checking RentCast photos and Mapbox
else if (address) {
  // Google Street View Static API
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (googleKey) {
    const encodedAddress = encodeURIComponent(address);
    photoUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodedAddress}&key=${googleKey}`;
  }
}
```

### Add Bing Maps (Free Alternative)

Bing Maps offers free static images:

```typescript
else if (address) {
  // Bing Maps Static API (free tier available)
  const bingKey = process.env.NEXT_PUBLIC_BING_MAPS_KEY;
  if (bingKey) {
    const encodedAddress = encodeURIComponent(address);
    photoUrl = `https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/${encodedAddress}/15?mapSize=600,400&key=${bingKey}`;
  }
}
```

---

## Photo Display Component

Photos are displayed in `src/components/PropertyPhotos.tsx`:

```typescript
<PropertyPhotos
  photoUrl={data.property.photoUrl}  // Photo URL from API
  address={data.address}             // Property address
  beds={data.property.beds}          // Bedroom count
  baths={data.property.baths}        // Bathroom count
  sqft={data.property.sqft}          // Square footage
/>
```

The component includes:
- Photo display with loading fallback
- Graceful error handling (shows placeholder if image fails)
- Property stats cards (beds, baths, sqft)
- Responsive design

---

## Testing Photos

### Test Current Setup (Unsplash)
1. Analyze any property
2. You'll see a generic house photo
3. Each analysis shows a different random photo

### Test with RentCast Photos
1. Add `RENTCAST_API_KEY` to Vercel
2. Redeploy
3. Analyze a property
4. Check browser dev tools → Network tab for photo URL
5. Should see RentCast photo or Unsplash fallback

### Test with Mapbox
1. Add `NEXT_PUBLIC_MAPBOX_TOKEN` to Vercel
2. Redeploy
3. Analyze a property
4. Should see aerial/satellite view if coordinates available

---

## Troubleshooting

### Photos Not Showing
**Problem**: PropertyPhotos component shows placeholder

**Solutions**:
1. Check browser console for errors
2. Verify photo URL in Network tab
3. Test photo URL directly in browser
4. Check CORS if using external images

### Wrong Photos Displaying
**Problem**: Photos don't match property

**Expected**: Unsplash shows generic houses (this is normal)

**To Fix**: Add RentCast API key or Google Street View

### CORS Errors
**Problem**: Browser blocks loading images

**Solution**:
```typescript
// In next.config.js
module.exports = {
  images: {
    domains: [
      'source.unsplash.com',
      'images.unsplash.com',
      'api.mapbox.com',
      'maps.googleapis.com',
      // Add RentCast photo domains
    ],
  },
}
```

### Images Loading Slowly
**Problem**: Large image files

**Solutions**:
1. Use Next.js Image component for optimization
2. Set appropriate image sizes in API calls
3. Implement lazy loading
4. Add loading skeletons

---

## Pricing Comparison

| Service | Free Tier | Paid Tier | Photo Quality | Setup Complexity |
|---------|-----------|-----------|---------------|------------------|
| **Unsplash** | ✅ Unlimited | N/A | Generic house photos | ⭐ Easy (No key needed) |
| **RentCast** | Limited | $49+/mo | Actual property photos | ⭐⭐ Medium (API key) |
| **Mapbox** | 50k/mo | $5 per 1k | Aerial/satellite | ⭐⭐ Medium (Token) |
| **Google Street View** | $200 credit | $7 per 1k | Street-level property | ⭐⭐⭐ Complex (Billing required) |
| **Bing Maps** | 125k/year | Varies | Map/aerial view | ⭐⭐ Medium (API key) |

---

## Recommendations

### For MVP / Testing
✅ **Use current Unsplash setup**
- No configuration needed
- Photos work immediately
- Good enough for demos

### For Production (No Budget)
✅ **Mapbox (Free Tier)**
- 50k requests/month is generous
- Shows actual property location
- Professional appearance

### For Production (Small Budget)
✅ **RentCast API**
- You probably already have it for property data
- Includes actual property photos
- Best user experience

### For Premium Product
✅ **Google Street View**
- Best quality
- Most accurate
- Worth the cost for serious users

---

## Next Steps

1. **Keep current setup** - Unsplash works great for now
2. **Add Mapbox** - Easy free upgrade when ready
3. **Get RentCast** - Best option if you subscribe
4. **Add Google later** - When you have budget and traffic

## Questions?

- Unsplash docs: https://unsplash.com/developers
- Mapbox docs: https://docs.mapbox.com/api/maps/static-images/
- Google Street View docs: https://developers.google.com/maps/documentation/streetview/overview
- RentCast docs: https://developers.rentcast.io/
