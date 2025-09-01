⚽ Player Hub – Full-Stack Web Application
Player Hub is a responsive full-stack web application built with a modern, decoupled client-server architecture. It provides a seamless platform for users to register as players, browse a searchable list of all registered players, watch embedded YouTube videos, and connect through a functional contact form.

✨ Features
🎬 YouTube Video Gallery – Grid of video thumbnails with a clean, responsive modal player.

📝 Player Registration – Form with validation for details like name, age, email, team, and position.

📊 Dynamic Player Listing – Searchable, filterable player table with real-time updates.

📩 Functional Contact Form – Integrated with EmailJS to send inquiries without a mail server.

🏗 Client–Server Architecture – Frontend and backend separated for scalability and maintainability.

🛠 Tech Stack
🔹 Frontend (Client)
HTML5, CSS3 (modern features, custom properties)

Vanilla JavaScript (ES6+ modules)

live-server for local development

🔹 Backend (Server)
Node.js

Express.js

SQLite3 (lightweight database)

cors – Handle cross-origin requests

dotenv – Manage environment variables

🚀 Getting Started
Follow these steps to set up Player Hub locally.

✅ Prerequisites
Node.js (with npm) installed on your machine.

⚡ Installation & Setup
1. Clone the repository
git clone [https://github.com/your-username/player-hub.git](https://github.com/your-username/player-hub.git)
cd player-hub

2. Setup the Backend
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create env file
cp .env.example .env

# Start server
npm start

The backend will be available at http://localhost:3000.

3. Setup the Frontend (in a new terminal)
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start client server
npm start

The frontend will be available at http://localhost:8080.

⚙️ Configuration
Contact Form (EmailJS)
To enable the contact form:

Create a free account at EmailJS.com.

Set up an Email Service and Template in your dashboard.

Replace placeholders in client/src/js/main.js with your credentials:

const SERVICE_ID = 'YOUR_SERVICE_ID';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

📂 Project Structure
player-hub/
├── client/          # Frontend application (UI)
│   ├── public/
│   └── src/
│       ├── css/
│       └── js/
│
└── server/          # Backend application (API & Database)
    ├── config/
    ├── controllers/
    ├── routes/
    └── index.js

This monorepo structure allows independent development, deployment, and scaling of the frontend and backend.

📜 License
Distributed under the MIT License. See LICENSE for more information.

🙌 Contributing
Contributions are welcome! 🎉

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📧 Contact
For inquiries, reach out via the contact form in the application.