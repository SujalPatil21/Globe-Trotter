# GlobeTrotter

GlobeTrotter is a full-stack travel planning and destination discovery platform designed to help users plan, organize, explore, and share trips from one place.

The application combines itinerary planning, destination recommendations, budget tracking, seasonal travel guidance, and community experiences into a single travel workspace.

---

## What GlobeTrotter Does

GlobeTrotter supports the complete travel-planning workflow:

```text
Discover a destination
        ↓
Create a trip
        ↓
Set dates + budget + interests
        ↓
Add destinations
        ↓
Get place / food recommendations
        ↓
Build day-by-day itinerary
        ↓
View seasonal travel conditions
        ↓
Track expenses and budget
        ↓
Share / publish the trip
        ↓
Discover community experiences
        ↓
Use another user's trip as your own editable copy
```

---

## Core Features

### Destination Discovery

Explore destinations dynamically from the backend city dataset.

Each destination can display:

- Destination imagery
- City and state
- Destination information
- Recommended places
- Food recommendations
- Community experiences

The frontend uses a shared image-resolution system so destination cards can display destination-specific imagery.

### Trip Planning

Users can create trips with:

- Trip name
- Start date
- End date
- Budget limit
- Budget tier
- Travel interests
- Description

Supported budget tiers:

```text
Budget
Mid-Range
Luxury
```

Supported travel interests:

```text
Heritage
Nature
Adventure
Food
Religious
Shopping
```

---

## Trip Workspace

Every trip has a dedicated workspace with four primary sections:

```text
Overview
Itinerary
Budget
Timeline
```

### Overview

Provides a read-only summary of the trip:

- Duration
- Number of destinations
- Budget
- Interests
- Destination cards
- Planned activities
- Typical seasonal conditions

### Itinerary

The main trip-building surface.

Users can:

- Add destinations
- Add places
- Add food/restaurants
- Add activities
- Assign dates
- Add custom activities
- View destination recommendations
- Build the trip day by day

### Budget

Tracks:

- Budget limit
- Total spent
- Remaining budget
- Average spending per day
- Category breakdown
- Manual expenses
- Reference budget estimates

Categories include:

```text
Activities
Transport
Accommodation
Meals
Other
```

### Timeline

Provides a chronological view of the planned trip and destinations.

---

# Recommendation Engine

GlobeTrotter includes a deterministic recommendation engine for travel planning.

Recommendations can include:

- Places
- Food / restaurants
- Activities

Recommendations use trip context such as:

- Destination
- Travel interests
- Budget tier
- Trip dates
- Category

Example:

```text
Trip Interests:
Heritage + Food

Destination:
Mumbai

        ↓

Recommended:
Gateway of India
Bademiya
Siddhivinayak Temple
...
```

The recommendation engine assists planning while keeping the final choice with the user.

---

# Typical Seasonal Conditions

GlobeTrotter provides typical seasonal travel guidance for destinations.

This is reference information, not live weather.

The feature uses:

```text
TripStop
   ↓
city_id
   ↓
travel start date
   ↓
travel month
   ↓
seasonal conditions API
   ↓
Seasonal Conditions Card
```

The backend uses static reference data for supported destinations.

API:

```http
GET /api/cities/{city_id}/seasonal-check?month={month}
```

Example response:

```json
{
  "season": "Monsoon",
  "typical_conditions": "Warm, humid and frequently rainy",
  "suitability": "moderate",
  "travel_tip": "Carry rain protection and allow extra travel time during heavy showers."
}
```

For destinations without seasonal reference data, the application uses a graceful fallback instead of blocking trip planning.

---

# Community Experiences

Users can publish trips as public community experiences.

The community workflow is:

```text
Create Trip
    ↓
Build Itinerary
    ↓
Publish to Community
    ↓
Other users discover it
    ↓
View Experience
    ↓
Like
    ↓
Use This Trip
    ↓
New editable trip copy
```

A published experience can expose:

- Trip title
- Creator
- Destinations
- Duration
- Itinerary
- Activities
- Food / restaurants
- Budget/reference information
- Interests
- Likes
- Uses

### Use This Trip

Use This Trip creates a new trip owned by the current user.

The original trip remains unchanged.

The copy operation preserves applicable planning data while excluding private information such as the original owner's ownership and actual expenses.

---

# Public Travel Profiles

GlobeTrotter supports public travel profiles for community creators.

Public profile route:

```text
/profile/:username
```

A public travel profile can display:

- Avatar
- Username
- Full name
- Bio
- Published experience count
- Published experiences
- Share Profile
- Use This Trip

Community creator attribution links back to the creator's public travel profile.

The private profile page remains separate:

```text
/profile
```

and is used for account/profile settings.

---

# Authentication

The authentication flow includes:

```text
Login
Register
OTP Verification
Forgot Password
Reset Password
Logout
```

The frontend uses the backend authentication APIs while maintaining authentication state for protected application routes.

---

# Destination Image System

Destination imagery is handled through a shared resolver rather than separate image logic for every page.

Typical flow:

```text
Backend city data
       ↓
city + state
       ↓
resolveCityImage(...)
       ↓
destination-specific image
       ↓
UI card
```

Images can be used across:

- Dashboard
- Destination discovery
- Trip destinations
- Upcoming trips
- Community experiences

The resolver supports destination-specific assets and graceful fallback behavior.

---

# Architecture

GlobeTrotter follows a conventional full-stack architecture.

```text
React + Vite
     |
     | HTTP / JSON
     v
FastAPI Backend
     |
     v
PostgreSQL
```

The backend provides authentication, city/master data, trips, recommendations, seasonal conditions, community experiences, and public profiles.

The new frontend is the primary user interface.

---

# Tech Stack

## Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- Lucide icons / existing project icon system
- CSS / component-based styling

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic

## Database

- PostgreSQL

## Development

- Node.js
- npm
- Python virtual environment

---

# Getting Started

## Prerequisites

Install:

- Python 3.12+
- Node.js
- npm
- PostgreSQL

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd GlobeTrotter
```

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment.

Example using uv:

```bash
uv venv --python 3.12
```

Activate on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables according to the backend configuration.

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

## 3. Frontend Setup

Navigate to the primary frontend:

```bash
cd "new frontend"
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# API Areas

### Authentication

```text
/auth/*
```

### Cities / Master Data

```text
/api/cities
/api/cities/{city_id}
/api/cities/{city_id}/seasonal-check
```

### Trips

Trip creation, trip settings, destinations, itinerary, budget, and timeline APIs.

### Recommendations

Destination-aware recommendation endpoints for places, food, and activities.

### Community

```text
/api/community/experiences
/api/community/experiences/{experience_id}
/api/community/experiences/{experience_id}/like
/api/community/experiences/{experience_id}/copy
```

### Public Profiles

```text
/api/users/{username}
```

---

# Development Verification

A basic verification flow is:

```text
Register
    ↓
Verify OTP
    ↓
Login
    ↓
Open Dashboard
    ↓
Explore destinations
    ↓
Create a trip
    ↓
Add a destination
    ↓
Add recommended places / food / activities
    ↓
Check seasonal conditions
    ↓
Review itinerary
    ↓
Add expenses
    ↓
Check budget
    ↓
Review timeline
    ↓
Publish trip
    ↓
Open Community
    ↓
Open creator profile
    ↓
Use This Trip
    ↓
Verify a new editable trip is created
```

For a production/demo build:

```bash
npm run build
```

---

# Privacy Model

Public travel content is separated from private account information.

Public-facing areas should not expose:

- Passwords
- Private account information
- Private expenses
- Internal ownership/security information

A Community Experience becomes public only after the owner explicitly publishes it.

---

# Design System

The new frontend follows a unified travel-editorial visual direction.

The Landing Page, Sign In, and Sign Up pages act as the primary design references for the rest of the application.

The same visual language extends to:

- Dashboard
- Destination discovery
- Trip workspace
- Itinerary
- Budget
- Timeline
- Community
- Public profiles

Design principles include:

- Strong editorial headings
- Clean neutral surfaces
- Travel-focused imagery
- Consistent buttons
- Consistent cards
- Controlled spacing
- Responsive layouts
- Minimal visual noise

---

# Product Principles

### Plan

Give users the tools to create a complete trip.

### Explore

Help users discover destinations, places, and food.

### Personalize

Recommendations use trip context without removing user control.

### Organize

Keep itinerary, budget, and timeline connected.

### Share

Let users publish useful travel experiences.

### Reuse

Allow other travelers to use published trips as editable starting points.

---

# Current Scope

The current application focuses on:

- Travel planning
- Destination discovery
- Recommendations
- Itinerary management
- Budget management
- Seasonal travel guidance
- Community experiences
- Public travel profiles
- Trip cloning

The following are intentionally not part of the current scope:

- Messaging
- Real-time collaboration
- Complex social networking
- Comments
- Followers/Following
- Custom social groups
- Real-time weather APIs

---

# Contributing

1. Create a feature branch.
2. Make focused changes.
3. Keep frontend and backend contracts consistent.
4. Avoid unnecessary dependencies.
5. Run the relevant build/tests.
6. Open a pull request with a clear description.

Example:

```bash
git checkout -b feature/your-feature
```

---

# License

Add the project's chosen license here.

---

# GlobeTrotter

Plan. Explore. Experience.

A travel planning platform built to turn destination ideas into organized, personalized journeys.
