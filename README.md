# Clown - A Fun Social Media Platform Project

**Visit App** [**Here**](https://clownapp.fun)  

Clown is a cool social media platform **built as a side project for fun and learning**. It mimics popular social media features like posts, likes, comments, and real-time chat, offering a hands-on way to explore full-stack development, AI integrations, and modern deployment practices. Built with cutting-edge technologies, Clown serves as a playground for experimenting with scalable architectures, authentication systems, and real-time communication. While it’s not a production-ready platform, it’s a great way to understand how social media platforms work under the hood.

---

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

### Backend
- **Node.js**: A JavaScript runtime for building scalable server-side applications.
- **Express.js**: A web application framework for Node.js.

### Database
- **MongoDB**: A NoSQL database for storing unstructured data like posts, comments, and user profiles.
- **PostgreSQL**: A relational database for structured data like user relationships and authentication details.

### Authentication
- **JWT (JSON Web Tokens)**: Secure token-based authentication.
- **HTTP-only Cookies**: Enhanced security for storing authentication tokens.
- **Email Verification**: OTP-based email verification using **SendGrid**.

### AI Integration
- **Image Captioning**: Powered by **Salesforce/blip-image-captioning-base**.
- **Caption Generation**: Enhanced by **mistralai/Mistral-7B-Instruct-v0.3**.

### Deployment
- **AWS EC2**: Cloud hosting for the application.
- **Docker Compose**: Containerization for seamless deployment.
- **Nginx**: Reverse proxy and load balancer.
- **GitHub Actions**: CI/CD pipeline for automated deployments.

---

## Features

### Authentication System
- Secure **login and registration** with JWT tokens and HTTP-only cookies.
- **Email verification** via OTP using SendGrid.

### Home Feed
- Displays posts from followed users, sorted by most recent.


### Posts
- Create posts with an image.
- Generate captions automatically using AI or add a manual description.

### Real-Time Chat
- A basic live chat system where users can message each other in real time.
- Only users you follow appear in your chat list.
- *Note: More advanced chat features are planned for future updates.*

### Follow/Unfollow
- Easily follow or unfollow other users.

### User Search
- Search for users by **username** or **name**.

### Likes
- Like and unlike posts.

### Comments
- Add comments to posts.

### Profile Page
- View and edit your profile (name, profile picture, bio, gender, etc.).
- View other users' profiles and their posts.

---

## Installation and Setup

### Prerequisites
- Node.js and npm installed.
- Docker and Docker Compose installed.
- MongoDB and PostgreSQL databases set up.
- AWS EC2 instance configured (optional for local development).
- Different API keys mentioned in the .env files.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Avngrstark62/Clown.git
   ```

2. Create a `.env` file in the `backend` folder with the following variables:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=jwt_secret_key
   JWT_EXPIRES=7d
   PORT=8000
   CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
   CLOUDINARY_API_KEY=cloudinary_api_key
   CLOUDINARY_API_SECRET=cloudinary_api_secret
   DATABASE_URL=your_postgres_database_url
   AI_SERVICE_URL=http://ai-service:8001
   SENDGRID_API_KEY=your_api_key
   SENDGRID_FROM_EMAIL=your_email
   ```

3. Create a `.env` file in the `ai-service` folder with the following variable:
   ```env
   HUGGINGFACE_TOKEN=your_hugging_face_token
   ```

4. Run the application using Docker Compose:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

5. Access the application at `http://localhost:8000` (or your configured domain).

---

## Future Enhancements
- **Advanced Chat Features**: Better UI, typing indicator, unread messages indicator.
- **Notifications**: Real-time notifications for new messages, likes, comments, and new followers.
- **Explore Page**: Discover new posts and users based on interests.

---

## Limitations 
- Clown is currently deployed on an **AWS EC2 t3.micro instance**, which is a low-resource instance suitable for small-scale testing and development. As a result, it cannot handle a large number of users or high traffic.  
- The AI features (image captioning and caption generation) rely on external APIs and models, which may introduce latency or limitations based on usage.  
- The real-time chat system is basic and lacks advanced features like typing indicators, or read receipts.  
- The platform is optimized for learning and experimentation, not for production use or scalability.  

---

## License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/Avngrstark62/Clown/blob/main/LICENSE) file for details.

---

## Contact
For any questions, feedback, or just to chat about the project, feel free to reach out:
- **Email:** thakurabhijeetsingh79@gmail.com
- **LinkedIn:** [Abhijeet Singh Thakur](https://www.linkedin.com/in/abhijeet-singh-thakur-8869a532b/) 
- **GitHub:** [Avngrstark62](https://github.com/Avngrstark62)

---

Thank you for checking out Clown! This project was created as a fun side activity to explore modern web development and AI integrations. Feel free to contribute, fork, or use it as a learning resource. 🎉
