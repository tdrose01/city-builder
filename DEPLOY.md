# Deployment Instructions

## Manual Deployment to Netlify

1. **Locate the Build Folder**:
   The production build is located at:
   `c:/city-slacker/web/dist`

2. **Upload to Netlify**:
   - Go to [app.netlify.com](https://app.netlify.com).
   - Drag and drop the `dist` folder into the deployment area.
   - Wait for the "Published" status.

3. **Verify**:
   - Check the live URL provided by Netlify.
   - Confirm the scroll animation works smoothly.

## Automation Note
For continuous deployment, connect this repository to Netlify via Git and set the build command to `npm run build` and publish directory to `dist`.
