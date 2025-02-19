# KittyCare Google OAuth Authentication

This repository contains a solution for the KittyCare take-home challenge. The solution integrates Google OAuth 2.0 into an existing project that previously used OTP authentication. Users can now log in using their Google accounts, and upon successful authentication, their profile (name, email, and profile picture) is displayed. A Logout button allows users to sign out.

## Project Overview

- **Frontend:**  
  A React (TypeScript) application that implements a custom Google login button following the Figma design. After a successful Google sign-in, the user's profile information is displayed on a protected profile page.

- **Backend:**  
  A Node.js + Express application that provides an OAuth authentication route. It verifies the Google ID token, decodes the user data, and issues a JWT. The JWT is then used for further authentication and session management.

## Environment

- **Google OAuth Setup**
  The solution uses Google's OAuth endpoints. You must create the .env file following the example to be able to use it. (Frontend and Backend)

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [pnpm](https://pnpm.io/) (preferred package manager)

## Setup Instructions

## Environment Variable Setup for Google OAuth Credentials

To properly configure your application for Google OAuth, you'll need to set up your environment variables in a `.env` file for both the backend and frontend. Below are the steps and examples.

### Obtaining Your Google OAuth Credentials

1. **Create or Select a Project:**

   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.

2. **Enable OAuth and Create Credentials:**
   - Navigate to **APIs & Services** → **Credentials**.
   - Click **Create Credentials** and select **OAuth 2.0 Client IDs**.
   - Configure the following:
     - **Authorized JavaScript Origins:**  
       For local development, add:  
       `http://localhost:3000`
     - **Authorized Redirect URIs:**  
       (If using a callback URL in your application) e.g.,  
       `http://localhost:3000/auth/callback`
   - Copy the generated **Client ID**.

### For the Backend

Create a `.env` file in your backend root directory and include the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
FRONTEND_URL=http://localhost:3000
```

### 1. Backend Setup

1. **Navigate to the backend directory:**

````bash
cd kittycare_backend
pnpm install
create .env following .env-example
pnpm run dev```
````

## 2. Frontend Setup

### Navigate to the frontend directory:

```bash
cd kittycare_frontend
pnpm install
create .env following .env-example
pnpm run dev
```

The frontend should be accessible at a URL such as http://localhost:5173 (or as defined by the Vite configuration).

## Testing the Implementation

Once the application is running, you can manually verify that everything works as expected. Here’s a checklist and some tips for testing both the frontend and backend aspects of the Google OAuth integration:

### 1. End-to-End Flow

- **Navigate to the Login Page:**  
  Open the browser and go to the URL where the frontend is running (for example, [http://localhost:5173](http://localhost:5173)). You should see the login page with a Google sign-in button.

- **Initiate Google Sign-In:**  
  Click the Google sign-in button. This should trigger the Google OAuth flow and redirect you to the Google sign-in popup or window.

- **Complete the Google Sign-In Process:**  
  Select or enter the Google account credentials. On successful authentication, you should be redirected back to the application.

- **Verify Profile Data:**  
  After successful login, the backend should verify the Google ID token and send back a JWT along with the user data. The frontend should use this data to display the profile page showing the name, email, and profile picture.

- **Logout Functionality:**  
  On the profile page, click the Logout button. Verify that you are signed out and redirected back to the login page (or appropriate route), and that any stored tokens are cleared.

### 2. Token Management

- **LocalStorage Verification:**  
  After a successful login, check the browser’s localStorage:

  - Ensure that the token, expiration timestamp, and profile photo (if provided) are stored.
  - Confirm that the expiration timestamp is a valid numeric value (provided by the backend).

- **Session Persistence:**  
  Refresh the profile page to ensure that the authentication persists correctly and the user remains logged in until the token expires.

### 3. Cross-Origin and Redirect Testing

- **CORS and Redirects:**  
  Make sure that the frontend and backend are communicating correctly. Verify that:
  - the backend’s CORS settings allow requests from the frontend domain.
