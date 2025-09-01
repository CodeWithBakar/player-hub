Player Hub - Full-Stack Web Application
Player Hub is a responsive web application built with a modern, decoupled client-server architecture. It provides a platform for users to register as players, browse a searchable list of all registered players, view a gallery of embedded YouTube videos, and get in touch via a functional contact form.

Features
YouTube Video Gallery: Displays a grid of video thumbnails. Clicking a video opens it in a clean, responsive modal player.

Player Registration: A validation-enabled form to register new players with details like name, age, email, team, and position.

Dynamic Player Listing: A searchable and filterable table that displays all registered players from the database in real-time.

Functional Contact Form: A secure contact form integrated with EmailJS to send inquiries directly to an email address without a dedicated mail server.

Client-Server Architecture: A professional project structure that separates the frontend (client) from the backend (server) for better scalability and maintenance.

Tech Stack
This project is built with a focus on robust, fundamental web technologies.

Frontend (Client):

HTML5

CSS3 (with modern features like custom properties)

Vanilla JavaScript (ES6+ Modules)

live-server for development

Backend (Server):

Node.js

Express.js

SQLite3 (for the database)

cors for handling cross-origin requests

dotenv for environment variable management

Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (which includes npm) installed on your machine.

Installation & Setup
Clone the repository:

git clone [https://github.com/your-username/player-hub.git](https://github.com/your-username/player-hub.git)
cd player-hub

Setup the Backend Server:

# Navigate to the server directory
cd server

# Install NPM packages
npm install

# Create the environment file (copy from the example)
cp .env.example .env

# Start the server
npm start

The server will be running on http://localhost:3000.

Setup the Frontend Client (in a new terminal window):

# Navigate to the client directory from the root
cd client

# Install NPM packages
npm install

# Start the client development server
npm start

This command will automatically open your browser to http://localhost:8080.

Configuration
Contact Form (EmailJS)
To make the contact form functional, you need to sign up for a free account at EmailJS.com and get your credentials.

Create an Email Service and an Email Template in your EmailJS dashboard.

Open client/src/js/main.js.

Inside the initContactPage function, replace the placeholder values with your actual keys:

const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

Project Structure
The project uses a monorepo structure with two distinct applications:

player-hub/
├── client/     # Frontend application (UI)
└── server/     # Backend application (API & Database)

This separation allows for independent development, deployment, and scaling of the frontend and backend.

License
Distributed under the MIT License. See LICENSE for more information.