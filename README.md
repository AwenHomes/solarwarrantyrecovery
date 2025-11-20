# Solar Warranty Recovery Landing Page

A professional landing page designed to test demand for solar warranty recovery services targeting homeowners with orphaned solar installations.

## Features

- Clean, professional design optimized for conversions
- Mobile-responsive layout
- Lead capture form with validation
- Local storage of leads for testing
- Easy integration with backend services
- FAQ section to address common concerns
- Social proof and statistics

## Quick Start

### Local Testing

1. Open `index.html` in your web browser
2. The page will work immediately without any server
3. Form submissions are saved to browser localStorage
4. To view captured leads, open browser console and type: `exportLeads()`

### Viewing Captured Leads

While testing locally, leads are stored in your browser's localStorage. To export them:

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Type: `exportLeads()`
4. A CSV file will download with all captured leads

## Integrating with Real Backend

The current setup saves leads locally. For production, you'll want to send leads to a real backend. Here are several options:

### Option 1: Formspree (Easiest - No Coding)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form and get your form ID
3. In `script.js`, uncomment the Formspree section and add your form ID
4. Leads will be emailed to you

### Option 2: Google Sheets (Free)

1. Create a Google Sheet
2. Go to Extensions > Apps Script
3. Add this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name,
    data.email,
    data.phone,
    data.state,
    data.installer,
    data.issue
  ]);
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}
```

4. Deploy as web app
5. Copy the URL and update `script.js`

### Option 3: Email Service (Mailchimp, SendGrid, etc.)

Integrate with your preferred email marketing platform API.

### Option 4: Your Own Backend

Create an API endpoint and update the `submitToBackend` function in `script.js`.

## Deployment Options

### Option 1: Netlify (Recommended - Free)

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your folder
3. Done! You'll get a free HTTPS URL
4. Can add custom domain

### Option 2: Vercel (Free)

1. Create account at [vercel.com](https://vercel.com)
2. Import project from Git or upload
3. Automatic HTTPS and custom domain support

### Option 3: GitHub Pages (Free)

1. Create a GitHub repository
2. Upload these files
3. Enable GitHub Pages in settings
4. Access at `yourusername.github.io/repo-name`

### Option 4: Traditional Web Hosting

Upload all files to any web hosting service via FTP.

## Customization

### Updating Content

Edit `index.html` to:
- Change company name
- Update statistics
- Modify FAQ questions
- Adjust copy and messaging

### Changing Colors

Edit `styles.css` at the top (`:root` section):
- `--primary-color`: Main blue color
- `--secondary-color`: Orange accent color
- `--dark-color`: Dark text color

### Adding Analytics

Add Google Analytics or other tracking:

1. Add tracking code before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

2. Replace `GA_MEASUREMENT_ID` with your actual ID

### Adding Facebook Pixel

Add before `</head>` in `index.html`:

```html
<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## Testing Your Landing Page

### A/B Testing Ideas

1. Different headlines
2. Different call-to-action button text
3. Different form lengths (shorter vs longer)
4. Different pricing information disclosure
5. Video vs no video

### Key Metrics to Track

- Page views
- Form submission rate (conversion rate)
- Sources of traffic
- Geographic location of visitors
- Device types (mobile vs desktop)

### Recommended Tools

- Google Analytics (traffic analysis)
- Hotjar (heatmaps and session recordings)
- Google Search Console (SEO)
- Facebook Ads / Google Ads (paid traffic testing)

## Next Steps

1. **Deploy the page** using one of the options above
2. **Set up lead collection** using Formspree, Google Sheets, or your preferred method
3. **Add analytics** to track visitors and conversions
4. **Drive traffic** to test demand:
   - Google Ads targeting solar-related keywords
   - Facebook Ads targeting homeowners with solar panels
   - SEO optimization
   - Social media posts in solar homeowner groups
5. **Monitor results** for 2-4 weeks
6. **Analyze data**:
   - How many leads did you get?
   - What was your conversion rate?
   - What was your cost per lead?
   - Does the economics make sense for your business model?

## Support

For questions or issues with this landing page, check:
- HTML/CSS/JS syntax
- Browser console for errors
- Network tab for API calls

## License

This is a custom-built landing page for your business. Modify as needed.
