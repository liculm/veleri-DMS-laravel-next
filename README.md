# Laravel and Next.js Playground

This repository contains a Laravel backend and a Next.js frontend. Follow the instructions below to set up the project.

## Prerequisites

- PHP >= 7.4
- Composer
- Node.js >= 12.x
- npm or yarn
- MySQL or any other supported database

## Backend Setup (Laravel)

1. **Clone the repository:**
    ```bash
    git clone https://github.com/liculm/veleri-DMS-laravel-next.git
    cd veleri-DMS-laravel-next
    ```

2. **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

3. **Install dependencies:**
    ```bash
    composer install
    ```

4. **Configure your database in the `.env` file:**
    ```dotenv
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

5. **Run database migrations:**
    ```bash
    php artisan migrate
    ```

6. **Start the development server:**
    ```bash
    php artisan serve
    ```

## Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

## Additional Information

- The Laravel backend runs on `http://localhost:8000`.
- The Next.js frontend runs on `http://localhost:3000`.
- Ensure both servers are running simultaneously for the application to work correctly.
