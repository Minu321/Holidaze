# Holidaze Front-End Application

Holidaze is a booking application that provides both customer-facing and admin-facing functionality. This project is built to integrate with the  Noroff Holidaze API and enables users to browse, book, and manage holiday venues.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [Future Improvements](#future-improvements)


## Description

This front-end project for Holidaze is designed to provide users with an intuitive interface for managing holiday bookings. It includes functionality for customers to browse and book venues, as well as tools for venue managers to register, manage, and review bookings for their venues.

## Features

### Customer-Facing Features:

- **View all Venues:** Users can browse a list of venues available for booking.
- **Search Venues:** Search for specific venues using keywords.
- **View Venue Details:** Detailed page for each venue, including photos, descriptions, amenities, and a calendar displaying available dates.
- **Register as a Customer:** Users with a `stud.noroff.no` email address can register as customers.
- **Create Bookings:** Registered customers can book available dates for venues.
- **View Bookings:** Customers can view their upcoming bookings.

### Admin/Manager Features:

- **Register as a Venue Manager:** Users with a `stud.noroff.no` email address can register as venue managers.
- **Create Venues:** Venue managers can create new venues with all relevant details.
- **Update Venues:** Managers can edit venue information.
- **Delete Venues:** Managers can delete venues they manage.
- **Manage Bookings:** Venue managers can view bookings for their venues.

### General Features:

- **Authentication:** JWT-based login and logout functionality.
- **User Profile Management:** Registered users can update their profile.

## Technologies Used

This project is built with the following technologies:

- **React** Js Framework
- **Vite** Bundler
- **Tailwind CSS** CSS Framework


## Installation

Follow these steps to set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/holidaze.git
   cd holidaze
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an `.env` file in the project root and configure the following environment variables:

   ```env
   VITE_API_URL=<Your Holidaze API Base URL>
   VITE_API_KEY=<Your API Key>
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## Usage

- **Customer Access:**

  - Register as a customer using a `stud.noroff.no` email address.
  - Browse venues, view venue details, and make bookings.
  - View upcoming bookings in your profile.

- **Venue Manager Access:**

  - Register as a venue manager using a `stud.noroff.no` email address.
  - Create and manage your venues via the admin dashboard.
  - Review and manage bookings for your venues.

## Authentication

The application uses JSON Web Tokens (JWT) for authentication and authorization. When a user logs in, a JWT access token is stored securely to manage authenticated API requests. Additionally, an API key is required to communicate with the Holidaze API.


## Future Improvements

- Add advanced filters for venue search (e.g., location, price range, amenities).
- Enhance user profile management with additional customization options.
- Add unit and integration tests to ensure code quality.


Thank you for checking out Holidaze! If you have any questions or encounter issues, feel free to open an issue or contribute to the project.

