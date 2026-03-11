# Real-Time Collaborative Notes

A **Notion-style real-time collaboration application** where multiple users can edit notes simultaneously with live updates, presence indicators, and autosave.

This project demonstrates modern **full-stack architecture**, real-time systems using **WebSockets**, and scalable application design using **React, Next.js, NestJS, and MongoDB**.

---

## 🚀 Live Demo

**Frontend (Vercel)**
👉 https://YOUR_VERCEL_LINK

---

## 🧠 Overview

Real-Time Collaborative Notes is a full-stack web application that allows multiple users to work on the same document simultaneously.

The system uses **WebSockets (Socket.io)** to synchronize document changes between clients in real time. It also tracks active users in a document and automatically saves updates to the database.

The goal of this project is to demonstrate:

* Real-time application architecture
* WebSocket-based collaboration
* Full-stack TypeScript development
* Scalable backend design
* Modern React patterns

This project is suitable for demonstrating **system design and realtime state synchronization**.

---

## ✨ Features

### 📝 Collaborative Editing

Multiple users can edit the same note simultaneously and see updates in real time.

### 👥 Presence Indicators

Shows which users are currently viewing or editing the note.

### ⚡ Real-Time Updates

Changes made by one user instantly appear on other users' screens.

### 💾 Autosave

Notes automatically save every few seconds to prevent data loss.

### 🧠 Cursor Tracking *(optional advanced feature)*

Displays cursor positions of other collaborators inside the editor.

### 📂 Notes Management

Users can create, edit, update, and delete notes.

### 🔄 Realtime Sync via WebSockets

The application uses **Socket.io rooms** to synchronize note updates between connected users.

---

## 🏗 Architecture

This project uses a **monorepo architecture**.

```
realtime-collab-notes
│
├── apps
│   ├── web      # Next.js frontend
│   └── api      # NestJS backend
│
├── packages
│   └── types    # shared TypeScript types
│
└── docker
```

---

## 🧩 Tech Stack

### Frontend

* React
* Next.js (App Router)
* TypeScript
* TailwindCSS
* React Query
* Socket.io Client

### Backend

* NestJS
* Socket.io
* MongoDB
* Mongoose

### Infrastructure

* Vercel (Frontend)
* Docker (Backend deployment)
* MongoDB Atlas (Database)

---

## 🔄 Real-Time Collaboration Flow

1. User opens a note
2. Client connects to the WebSocket server
3. Client joins a **note room**
4. When a user edits content:

```
Client -> emit "edit-note"
Server -> broadcast update
Other clients -> update editor
```

This ensures **instant synchronization between all connected users**.

---

## 🖥 Local Development

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR_GITHUB/realtime-collab-notes.git

cd realtime-collab-notes
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Start MongoDB

Using Docker:

```
docker run -d -p 27017:27017 --name realtime-notes mongo
```

---

### 4️⃣ Setup Environment Variables

Create `.env` inside the backend:

```
MONGO_URI=mongodb://localhost:27017/realtime-notes
PORT=3001
```

---

### 5️⃣ Start Development Servers

```
npm run dev
```

This runs both:

* Next.js frontend
* NestJS backend

---

### Deployment 

```
docker build -t real-time-collab-api .
docker run -p 3000:3000 -e REDIS_URL=redis://host.docker.internal:6379 real-time-collab-api
```
---

## 🧪 Example Usage

1. Open the application
2. Create a new note
3. Open the same note in another browser window
4. Start typing
5. Watch updates appear in **real-time**

---

## 📡 WebSocket Events

### Client → Server

```
join-note
leave-note
edit-note
cursor-position
```

### Server → Client

```
presence-update
note-updated
cursor-update
```

---

## ⚙️ Scaling Considerations

For production scaling the system can be extended with:

* Redis adapter for Socket.io
* Horizontal backend scaling
* Optimistic UI updates
* CRDT-based document synchronization
* Conflict resolution strategies

---

## 📈 Future Improvements

Possible enhancements include:

* Rich text editor (TipTap)
* Authentication (JWT)
* Version history
* Comments & mentions
* Collaborative cursors
* Operational transforms / CRDT support

---

## 👨‍💻 Author

**Francis Albores**

Startup founder and software engineer building scalable platforms and real-time systems.

GitHub:
https://github.com/YOUR_GITHUB

---

## 📜 License

MIT License


