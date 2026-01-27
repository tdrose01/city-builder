# MVP Release Checklist (Web Only)

## Pre-Release
- Run `npm install` in `web` if dependencies changed.
- Update environment variables if needed (see `web/src/lib/supabase.js`).
- Review content and links for accuracy.
- Confirm analytics or tracking stubs (if any).

## Build
- Run `npm run build` in `c:\city-slacker\web`.
- Verify `c:\city-slacker\web\dist` was created.
- Check build output for errors or warnings.

## Deploy (Netlify Manual)
- Go to Netlify and drag-drop `c:\city-slacker\web\dist`.
- Wait for "Published" status.
- Open the live URL.

## Smoke Test
- Page loads on desktop and mobile.
- Board renders with dice in the center.
- Roll Dice animates the dice and moves the token.
- Doubles shows the badge and adds bonus dice.
- Free Dice tile shows a dice gain toast.
- Scroll/animations are smooth.

## Post-Release
- Capture live URL.
- Note any regressions for next patch.
