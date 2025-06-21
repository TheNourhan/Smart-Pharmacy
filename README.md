# Smart Pharmacy


## 🚀 Getting Started

### ✅ Prerequisites
- Node: 20.16.0
- npm 10.8.1
- MySql
- Git

### Setup Instructions

#### Manual Setup:
- 📁 Clone the Repository
```
https://github.com/TheNourhan/Smart-Pharmacy.git
cd Smart-Pharmacy
```

- 📦 Install Dependencies
```
npm install
```
- ⚙️ Setup Environment Variables
```
PORT=3000
DB_HOST=localhost
DB_USER=root
MYSQL_ROOT_PASSWORD=yourpassword
MYSQL_DATABASE=smart_pharmacy_db
JWT_SECRET=your_jwt_secret
```

- 🛠️ Setup the Database
1. Make sure your MySQL server is running.

2. Create the database manually or let TypeORM connect to it:
```
CREATE DATABASE smart_pharmacy_db;
```

- 🔨 Run the Development Server
```
npm run dev
```
> This runs nodemon with ts-node, automatically restarting on changes.

##### **Steps to Use Migration**:

- 🧱 A. Generate migration (after editing entities):
```
npm run migration:generate -- src/migrations/InitSchema -d src/data-source.ts
```

- ▶️ B. Run migration (apply to DB):

```
npm run migration:run
```

- ⏪ C. Revert the last migration:
```
npm run migration:revert
```

#### Docker Setup:
**Prerequisites:**
- Docker: 27.1.1
- Docker-compose: 1.29.2

1. Build and run containers:
```
docker-compose up --build
```
2. Access the app at `http://localhost:3000`