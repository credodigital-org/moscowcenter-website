# Appointment email handoff

## What this update does

After the visitor fills the existing home or Contact appointment form and presses its booking button:

- On desktop/laptop, it opens Gmail Compose in a new tab with the recipient, subject, and formatted appointment details filled in.
- On a phone/tablet, it opens the device's default email app with the same details filled in.
- The visitor checks the draft and presses **Send**. The website does not claim the email was sent, and it does not store the booking in Django, Render, or another service.
- If Gmail or the device email app does not open, the page provides Gmail, Outlook, and copy-details fallbacks.

The default booking recipient in this corrected package is **info@moscowcenter.ae**. If the site's existing Admin → Site-wide → Contact details → **Booking e-mail** value has already been saved, make sure that setting also says `info@moscowcenter.ae`; it takes precedence over the default. The separate public-facing **Email address** setting controls the contact card and is not the booking recipient.

## Apply and publish

1. Extract the ZIP over the project root (for example `C:\moscow-center`) and replace the matching files.
2. In Command Prompt, run:

   ```cmd
   cd /d C:\moscow-center\frontend
   node scripts/test-booking-mail.mjs
   npm run build
   ```

3. Commit and push, then deploy the frontend through Vercel. No new booking endpoint or environment variable is required.
4. Try both appointment forms on a desktop and on a phone. Confirm the desktop opens Gmail Compose in a new tab; confirm mobile opens its email app. Check the recipient is `info@moscowcenter.ae`, review the subject/body, and send a test message you control.

Gmail must be accessible and signed in on desktop for its compose page to open directly. If the browser blocks the new tab, use the Gmail/Outlook fallback shown beneath the form. Mobile mail handoff depends on the phone having an email app configured. The website cannot verify actual delivery because the visitor sends the email from their own account.
