# My Pet Asteroids Project

This project consists of two parts: a backend API (`my-pet-asteroids-api`) and a frontend React application (`my-pet-asteroids-app`).

## Prerequisites

- Node.js version 22.9
- npm (usually comes with Node.js)

To check your Node.js version, run:

```
node --version
```

If you don't have the correct version, you can use a version manager like nvm to install and use Node.js 22.9.

## Backend API (my-pet-asteroids-api)

The backend API is built with Node.js and runs on port 4000.

### Setup and Running the API

1. Navigate to the API directory:

   ```
   cd my-pet-asteroids-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the API server:
   ```
   npm run dev
   ```

The API will be available at `http://localhost:4000`.

## Frontend React App (my-pet-asteroids-app)

The frontend is a React application bootstrapped with Create React App and runs on port 3000.

### Setup and Running the App

1. Navigate to the app directory:

   ```
   cd my-pet-asteroids-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The app will be available at `http://localhost:3000`.

## Running Both API and App

To run both the API and the app simultaneously:

1. Open two terminal windows.
2. In the first terminal, navigate to `my-pet-asteroids-api` and run:
   ```
   npm run dev
   ```
3. In the second terminal, navigate to `my-pet-asteroids-app` and run:
   ```
   npm start
   ```

Now you have both the API running on port 4000 and the app running on port 3000.

## Cypress Testing

To run Cypress tests, use the following commands:

### Open Cypress Test Runner

```
npm run cypress:open
```

This command opens the Cypress Test Runner, allowing you to select and run tests interactively.

### Run Cypress Tests Headlessly

```
npm run cypress:run
```

This command runs all Cypress tests headlessly in the command line.

### SQL QUERY CHALLENGE

Suppose you have a database with three tables:

- "users",
- "orders",
- "products"

The "users" table contains

- columns id,
- name,
- email.

The "orders" table contains

- columns id,
- user_id,
- product_id,
- quantity,
- created_at.

The "products" table contains

- columns id,
- name,
  -price,
- category.

Write a single SQL query that returns a list of all users who have made at least 3 orders in the "Electronics" category and have spent more than $1000 on those orders, sorted by the total amount they have spent in descending order. The output should include the user's name, email, and the total amount they have spent on "Electronics" orders.

```sql
WITH user_spending AS (
    SELECT
        o.user_id,
        SUM(p.price * o.quantity) AS total_spent,
        COUNT(DISTINCT o.id) AS order_count
    FROM
        orders o
    INNER JOIN
        products p ON o.product_id = p.id
    WHERE
        p.category = 'Electronics'
    GROUP BY
        o.user_id
    HAVING
        COUNT(DISTINCT o.id) >= 3
        AND SUM(p.price * o.quantity) > 1000
)
SELECT
    u.name,
    u.email,
    us.total_spent
FROM
    user_spending us
INNER JOIN
    users u ON u.id = us.user_id
ORDER BY
    us.total_spent DESC;
```
