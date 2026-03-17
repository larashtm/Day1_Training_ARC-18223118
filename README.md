<div align="center">

<br />

```
 ███████╗██╗███╗   ███╗██████╗ ██╗     ███████╗     █████╗ ██╗   ██╗████████╗██╗  ██╗
 ██╔════╝██║████╗ ████║██╔══██╗██║     ██╔════╝    ██╔══██╗██║   ██║╚══██╔══╝██║  ██║
 ███████╗██║██╔████╔██║██████╔╝██║     █████╗      ███████║██║   ██║   ██║   ███████║
 ╚════██║██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝      ██╔══██║██║   ██║   ██║   ██╔══██║
 ███████║██║██║ ╚═╝ ██║██║     ███████╗███████╗    ██║  ██║╚██████╔╝   ██║   ██║  ██║
 ╚══════╝╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝    ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝
```

<br />

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

</div>

<br />

## Quick Start

No installation needed. Just clone and open in a browser.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/simple-auth-app.git

# 2. Navigate into the project
cd simple-auth-app

# 3. Open in browser
open index.html
# or just double-click index.html in your file manager
```

<br />

---

## Features

### Authentication
| Feature | Status | Notes |
|---|---|---|
| User Registration | ✅ | With duplicate username check |
| Email field on register | ✅ | Required for password recovery |
| SHA-256 Password Hashing | ✅ | Via Web Crypto API (no library needed) |
| Legacy password migration | ✅ | Plaintext → hashed on next login |
| Login with validation | ✅ | Username + hashed password match |
| Forgot Password flow | ✅ | Verify by username + email first |
| Session persistence | ✅ | Via `localStorage` |
| Auth guard on dashboard | ✅ | Redirects to login if no session |
| Logout | ✅ | Clears session from `localStorage` |

### Student Dashboard
| Feature | Status | Notes |
|---|---|---|
| Student Profile | ✅ | Dynamically loaded from `localStorage` |
| GPA per Semester (Line Chart) | ✅ | Rendered with Chart.js |
| Attendance Statistics (Pie Chart) | ✅ | Rendered with Chart.js |
| Semester Courses Table | ✅ | Course code, name, class, credits |
| Registration Status Table | ✅ | With Approved / Pending status badges |
| Responsive Layout | ✅ | Mobile-friendly sidebar + main content |
| Sticky Header & Sidebar Nav | ✅ | Smooth anchor-based navigation |

<br />

---

## Project Structure

```
simple-auth-app/
│
├── index.html          ← Landing page (entry point)
├── register.html       ← New account registration
├── login.html          ← User login
├── forgot.html         ← Password reset (verify → reset)
├── profile.html        ← Student academic dashboard (protected)
│
├── css/
│   └── style.css          ← Custom styles (message states)
│
├── js/
│   └── script.js          ← All auth logic + dashboard rendering
│
└── assets/
    └── images/
        ├── logo.png              ← App logo
        ├── avatar-default.jpg    ← Default student avatar
        └── login-bg.png          ← Auth pages background image
```

---

## Tech Stack

| Technology | Version | Usage |
|---|---|---|
| **HTML5** | — | Page structure & semantics |
| **CSS3** | — | Custom message styles |
| **JavaScript (ES6+)** | Vanilla | Auth logic, DOM manipulation, async/await |
| **Tailwind CSS** | CDN | All UI styling & layout |
| **Chart.js** | CDN | GPA line chart & attendance pie chart |
| **Web Crypto API** | Native browser | SHA-256 password hashing |
| **localStorage** | Native browser | Client-side data persistence |

> ⚠️ **No npm, no build step, no framework.** Everything runs directly in the browser.

<br />

---
