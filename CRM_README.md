# Cirrus CRM Platform

A scalable multi-role **Customer Relationship Management (CRM)** system built with **React, Django, and PostgreSQL**, designed for sales and admin workflows. This project was developed as part of the Summer 2025 internship program at **CirrusLabs**.

## Features

### Core Capabilities
- **Multi-Role System**: Distinct role-based access for **Admins**, **Sales Reps**, and **Managers**.  
- **Secure Authentication**: Role-based access control with JWT.  
- **CRM Dashboard**: Intuitive UI aligned to **Figma** prototypes.  
- **Deal Management**: Create, update, and track deals across pipelines.  
- **Speech-to-Text Integration**: Google Speech-to-Text API for **voice-driven deal creation**.  
- **Predictive Analytics**: GPT-4 powered **AI deal assistant** for lead scoring and sales insights.  
- **Audit Logging**: Tracks user actions for accountability.  

### Technical Stack
- **Frontend**: React.js + CSS  
- **Backend**: Django REST Framework 
- **Database**: PostgreSQL (via Docker for local testing) 
- **AI Integration**: GPT-4 (OpenAI API) 
- **Speech Integration**: Google Cloud Speech-to-Text API  

---

## Getting Started

### Prerequisites
- **Node.js 18+**
- **Python**
- **Google Cloud API key** (Speech-to-Text)
- **OpenAI API key** (Predictive analytics)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cirrus-crm
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   - Copy `.env.example` to `.env` in both `frontend` and `backend` folders.
   - Add:
     ```env
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cirrus_crm
     OPENAI_API_KEY=your_openai_key
     GOOGLE_API_KEY=your_google_key
     ```

6. Run backend server:
   ```bash
   python manage.py runserver
   ```

7. Run frontend server:
   ```bash
   npm start
   ```

8. Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Next Steps

Future development will focus on:  
- **User Functionality**: Profile customization, notifications, and collaboration features.  
- **Advanced Analytics**: More granular insights using GPT-4 (e.g., churn prediction, upsell suggestions).  
- **Production Deployment**: CI/CD pipeline, cloud hosting (AWS/GCP), and monitoring.  
- **Mobile Support**: Responsive and mobile-first enhancements.  
- **Enhanced Security**: 2FA, audit compliance, and encryption at rest.  

---

## Contributors

- **Aarib Siddiqui** – Team Lead
- **Ayaan Shekhani** – Sub Team Lead  
- **Mafaaz Siddiqui** – Engineer  
- **Rayhaan Mohammed** – Business Analyst  
- **Kasim Rizvi** – Tester 
- **Special Thanks**: Sarthak (mentor), Carlos (technical guidance)
