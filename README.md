# Renewable

## Overview

This project is a waste recycling website built using HTML and Bootstrap for the frontend, and Node.js with Express.js for the backend. The website connects to a MongoDB database to manage user registrations, products, orders, and more. The platform allows users to register, login, view products, and place orders for waste recycling.

## Features

- User registration and login
- Product listing and viewing
- Order placement and tracking
- File upload handling with Multer
- Session management
- Responsive design with Bootstrap

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- MongoDB database set up
- NPM installed for package management

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/omkarpawar201/Renewable.git
    cd Renewable
    ```

2. **Install the required packages:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    - Create a `.env` file in the root directory and add the following:
    ```plaintext
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    ```

4. **Set up the MongoDB database:**
    - Ensure you have a MongoDB database set up and running.
    - Replace `your_mongodb_connection_string` in the `.env` file with your actual MongoDB connection string.

## Usage

1. **Run the application:**
    ```sh
    npm start
    ```

2. **Open the website:**
    - Navigate to `http://localhost:3000` in your web browser.

## Code Structure

- `app.js`: Main application file that sets up the server and routes
- `public/`: Directory containing static files (HTML, CSS, JS)
- `templates/views/`: Directory containing view templates (EJS)
- `models/`: Directory containing MongoDB models
- `uploads/`: Directory for storing uploaded files
- `.env`: Environment variables configuration file

## Routes

- `/`: Home page
- `/about`: About page
- `/contact`: Contact us page
- `/login`: Login page
- `/register`: Registration page
- `/product`: Product listing page
- `/productv`: Product viewing page
- `/delivery`: Delivery page


## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [MongoDB](https://www.mongodb.com/)
- [Multer](https://github.com/expressjs/multer)
