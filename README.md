# Simple Auth App (ARC 2025)

Simple Auth App is a beginner-friendly academic portal authentication project built with HTML, CSS, and vanilla JavaScript.

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla ES6)
- Tailwind CSS (CDN)
- Chart.js (CDN)
- localStorage (browser-side data)

## Project Structure

```text
simple-auth-app/
|- index.html
|- login.html
|- register.html
|- forgot.html
|- profile.html
|- css/
|  |- style.css
|- js/
|  |- script.js
|- assets/
|  |- images/
|     |- logo.png
|     |- avatar-default.jpg
|     |- login-bg.png
```

## Authentication Flow

1. Register account first on `register.html`.
2. Login from `login.html`.
3. Successful login redirects to `profile.html`.
4. `profile.html` redirects to `login.html` if no active session.
5. Logout clears session and redirects to `login.html`.
6. Forgot password flow (`forgot.html`): verify username + email first, then set new password.

## localStorage Keys

- `authUsers`: Array of registered users.
- `loggedInUser`: Username of active login session.
- `studentProfiles`: Object map of student profile data per username.

## Current Features

- Register with duplicate username validation.
- Register stores username, email, and hashed password (SHA-256 via Web Crypto API).
- Login validates account and password.
- Legacy plaintext password users are migrated to hashed password on successful login.
- Forgot password with account verification by email.
- Student dashboard with GPA and attendance charts.
- Courses and registration status tables.
- Dynamic profile content loaded from localStorage.

## Notes

- This project intentionally has no backend/database.
- All data is client-side and can be cleared from browser storage.
- For learning/demo use only (not production-grade security).
