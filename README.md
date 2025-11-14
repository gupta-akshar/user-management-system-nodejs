# 🧠 SQL User Management Project

A Node.js + Express + MySQL project for managing users with live username checking, password verification, and CRUD functionality — built using EJS templates and a clean file structure.

---

## 🚀 Features

- ✅ Add new users with live username availability check (AJAX)
- 🧾 Email duplication check before inserting
- ✏️ Edit existing users
- ❌ Secure delete option (asks for password)
- 💡 Validation for email, username, and password
- 🎨 Separate CSS & JS files for each page
- 🗃 MySQL integration

---

## 📂 Folder Structure

```

user-management-system-nodejs/
│
├── node_modules/
│
├── public/
│   ├── css/
│   │   ├── home.css
│   │   ├── users.css
│   │   ├── new.css
│   │   ├── edit.css
│   │   ├── delete.css
│   │
│   ├── js/
│       ├── home.js
│       ├── users.js
│       ├── new.js
│       ├── edit.js
│       ├── delete.js
│
├── views/
│   ├── home.ejs
│   ├── users.ejs
│   ├── new.ejs
│   ├── edit.ejs
│   ├── delete.ejs
│
├── schema.sql
├── app.env
├── index.js
├── package.json
├── package-lock.json
├── README.md


```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/gupta-akshar/user-management-system-nodejs.git
cd "SQL Project"
```


---

### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Configure Database
```
mysql -u root -p < schema.sql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
```

### 4️⃣ Start the Server
```
node index.js
```
### 🧩 Notes
```
Ensure app.use(express.static('public')) is added in your index.js

Reference your CSS/JS files in .ejs files like this:

<link rel="stylesheet" href="/css/new.css">
<script src="/js/new.js" defer></script>


Make sure MySQL service is running before starting the app.
```

| Component | Technology           |
| --------- | -------------------- |
| Backend   | Node.js, Express.js  |
| Frontend  | EJS, CSS, JavaScript |
| Database  | MySQL                |
| Tools     | Nodemon, dotenv      |



👨‍💻 Author

Akshar Gupta
B.Tech CSE | MERN Developer
📧 akshargupta2006@gmail.com
