# Synq
A web-based chat application that enables users to register, log in, create groups, and communicate with friends in real time. The system supports multimedia messaging through integration with AWS S3 for secure and scalable file storage.
To ensure optimal performance, the application automatically archives daily messages using a scheduled cron job. The entire platform is deployed on AWS.

##  Features

-  User registration and login
-  Create and manage chat groups
-  Group admins can add members and assign admin roles
-  Real-time messaging with Socket.io
-  Multimedia messages (images) stored securely using **AWS S3**
-  Automated daily message archiving via cron job
-  Relational database schema (1-1, 1-many, many-many) using Sequelize + RDS
-  Sensitive data secured via environment variables

---

##  Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Real-Time | Socket.io, WebSockets |
| Database | MySQL (RDS), Sequelize ORM |
| Cloud Storage | AWS S3 |
| Deployment | AWS EC2 / Hosting |
| Security | JWT, bcrypt |

---

##  Getting Started

Follow the steps below to run Synq locally:

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/synq.git
cd synq
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create a `.env` file

Example template:

```env
PORT='3000'
JWT_SECRET_KEY='secretkey'
SIB_API_KEY='xxxxxxxxxxxxxxxxxxxxxxxx'

WEBSITE="http://localhost:3000"

BUCKET_NAME='your-bucket'
AWS_ACCESS_KEY_ID='xxxxxxxxxxxx'
AWS_SECRET_ACCESS_KEY='xxxxxxxxxxxx'

DATABASE_NAME='chat'
DATABASE_USERNAME='root'
DATABASE_PASSWORD='password'
DATABASE_DIALECT='mysql'
DATABASE_HOST='localhost'
```

### 4️⃣ Start the application

```bash
npm start
```

### 5️⃣ Access the app

Visit:

```
http://localhost:3000
```

---

## API Documentation

### Chat Routes

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| POST   | `chat/add-chat`   | Send a text chat                 |
| POST   | `chat/chat-Image` | Send image chat                  |
| GET    | `chat/get-chats`  | Fetch chats for a specific group |

### Group Routes

| Method | Endpoint                  | Description                               |
| ------ | ------------------------- | ----------------------------------------- |
| POST   | `group/create-group`      | Create a new group (admin only)           |
| GET    | `group/groups`            | Get all groups accessible by current user |
| GET    | `group/group`             | Get details of a specific group           |
| GET    | `group/get-group-members` | Fetch all members of a group              |

### Purchase Route

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `purchase/buy-premium` | Upgrade user to premium |

### User Routes

| Method | Endpoint         | Description                       |
| ------ | ---------------- | --------------------------------- |
| POST   | `user/add-user`  | User signup                       |
| POST   | `user/login`     | User login                        |
| GET    | `user/get-users` | Fetch all users                   |
| GET    | `user/get-user`  | Get current user details from JWT |

---

## System Behavior

* Group creator becomes **admin**
* Admin can add members and promote others to admin
* Daily message archiving reduces DB load
* Premium users get advanced features
* Multimedia stored in AWS S3 to reduce server storage usage

---

## Security

* Sensitive data stored in environment variables
* Passwords hashed before saving (bcrypt)
* JWT used for safe user authentication

---

## Database Schema Highlights

Designed using Sequelize ORM to support:

* One-to-One relationships
* One-to-Many relationships
* Many-to-Many relationships

Deployed on **AWS RDS** for scalability and high availability.

---




