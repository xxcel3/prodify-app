# Prodify

Prodify is a full-stack productivity web app designed to help users organize their lives in one place. It features AI-powered note-taking, a to-do list with priority tracking, and a calendar for managing events — all wrapped in a cozy, responsive interface.

Originally developed as part of a university project following Agile development using a Kanban board ([see forked github](https://github.com/xxcel3/CreativeHub)), but I explaned the app after the course. New features such as AI note summarization and enhanced UI/UX were added to enhance user experience and functionality.

## 🚀 Live Site

You can try Prodify here:  (https://prodify-w3rb.onrender.com)

## 🛠 Tech Stack

**Frontend**  
- React  
- React Router DOM  
- Axios  
- CSS (custom styles)  
- Font Awesome for icons

**Backend**  
- Django REST Framework  
- PostgreSQL  
- Groq / AI API (for note summarization)

**Deployment**  
- Hosted on using render connecting frontend, backend and database.
- PostgreSQL via Render Managed DB

**Testing**  
- Django’s built-in test framework (APITestCase) for backend endpoints

## ✨ Features

- 📝 **AI-Powered Notes**: Create and summarize notes using AI.
- ✅ **To-Do List**: Track tasks with due dates and priorities.
- 📅 **Calendar**: Add and delete events with custom dates and times.
- 🔐 **User Authentication**: Register, log in, and securely manage settings.
- ⚙️ **User Settings**: Update account info with real-time password strength validation.
- 🌐 **Responsive Design**: Optimized layout for both desktop and mobile.
- 🔁 **Persistent Login**: Token-based login for seamless return experience.
