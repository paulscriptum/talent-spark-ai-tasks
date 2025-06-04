# EmailJS Setup Guide for Contact Sales Form

## Overview
The contact sales form uses EmailJS to send emails directly from the frontend. This guide will help you set up EmailJS to receive contact form submissions.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: {{subject}}

New Enterprise Sales Inquiry

Company: {{company_name}}
Email: {{from_email}}
Message:
{{message}}

---
This email was sent from the testask contact form.
Reply to: {{reply_to}}
```

4. Save the template and note down your **Template ID**

### 4. Get Public Key
1. Go to "Account" > "General"
2. Find your **Public Key** in the API Keys section

### 5. Update Environment Variables
Update your `.env` file with your EmailJS credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
VITE_EMAILJS_TO_EMAIL=your-email@example.com
```

## Testing

1. Start your development server: `npm run dev`
2. Go to the landing page
3. Scroll to the Enterprise pricing card
4. Click "Contact Sales"
5. Fill out the form and submit

## Fallback Behavior

If EmailJS is not configured (default placeholder values), the form will:
- Log the submission data to the browser console
- Show a success message to the user
- Allow you to see form submissions during development

## Production Deployment

Make sure to:
1. Set the correct environment variables in your hosting platform
2. Verify EmailJS quotas (free tier has limits)
3. Test the email delivery in production

## Template Variables

The email template receives these variables:
- `{{from_email}}` - User's email address
- `{{company_name}}` - Company name
- `{{message}}` - User's message/request
- `{{reply_to}}` - User's email (for easy replies)
- `{{subject}}` - Email subject line

## Troubleshooting

- Check browser console for errors
- Verify environment variables are loaded correctly
- Test EmailJS service connection in their dashboard
- Ensure email template is published and active
- Check spam folder for test emails 