# Deployment Instructions

## Netlify CLI Deployment (No GitHub Required)

1. **Install Netlify CLI**:
   `npm install -g netlify-cli`

2. **Authenticate**:
   - `netlify login`
   - Or set a token if you cannot open a browser:
     `NETLIFY_AUTH_TOKEN=your-token`

3. **Build**:
   - `npm --prefix web ci`
   - `npm --prefix web run build`

4. **Deploy**:
   - Draft URL: `netlify deploy --dir web/dist`
   - Production URL: `netlify deploy --dir web/dist --prod`

## Manual Deployment to Netlify

1. **Locate the Build Folder**:
   The production build is located at:
   `web/dist`

2. **Upload to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com).
   - Drag and drop the `dist` folder into the deployment area.
   - Wait for the "Published" status.

3. **Verify**:
   - Check the live URL provided by Netlify.
   - Confirm the scroll animation works smoothly.

## Automation Note
For continuous deployment, connect this repository to Netlify via Git and set the build command to `npm run build` and publish directory to `dist`.
