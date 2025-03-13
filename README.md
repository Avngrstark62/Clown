# Clown - A Social Media Web App

Welcome to **Clown** — a social media platform inspired by Twitter and Instagram, built to connect users through posts, likes, and comments. Built using the **MERN stack**, Clown offers a simple yet feature-rich experience for users to interact and share content.

## 🚀 Live Demo
[Clown Live App](http://13.232.20.120)

## 🛠️ Tech Stack

- **Frontend:** React
- **Backend:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT with HTTP-only cookies
- **Deployment:** AWS EC2

## 📂 Features

- **Authentication System:** Login and registration with secure JWT tokens and cookie-based authentication.
- **Home Feed:** Displays posts from followed users, sorted with the most recent first.
- **Follow/Unfollow:** Easily follow and unfollow users.
- **User Search:** Search for other users by username.
- **Posts:** Create and delete posts.
- **Likes:** Like and unlike posts.
- **Comments:** Add comments to posts and delete your own comments.
- **Profile Page:** View and edit your own profile (update username, name, bio, and profile picture) or view others' profiles.

## 📂 Project Structure
```
├── backend                    # Express server
├── frontend                   # React app
├── .env                       # Environment variables
├── Dockerfile
├── README.md                 # Project documentation
```

## 🚀 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Avngrstark62/Clown.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file for your backend:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=jwt_secret_key
JWT_EXPIRES=7d
PORT=8000
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secrete
```

5. Run the development servers:
```bash
# Backend (http://localhost:8000)
npm run dev

# Frontend (http://localhost:5173)
npm start
```

## 🙌 Credits
This project was inspired by modern social media platforms and built as a personal learning project. Feel free to fork and modify it as needed!

## 📝 License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/Avngrstark62/Clown/blob/main/LICENSE) file for details.

## ✨ Contact Me

- **Email:** thakurabhijeetsingh79@gmail.com
- **LinkedIn:** [Abhijeet Singh Thakur](https://www.linkedin.com/in/abhijeet-singh-thakur-8869a532b/) 
- **GitHub:** [Avngrstark62](https://github.com/Avngrstark62)
