# URL Shortener API

A RESTful URL shortening API built with **Node.js, Express.js, and SQLite**. The API allows users to create shortened URLs, manage existing URLs, track usage statistics, and redirect short codes to their original destinations.

## Features

- Create a shortened URL with a randomly generated short code
- Retrieve information about a shortened URL
- Update the destination of an existing short URL
- Delete a shortened URL
- Redirect short URLs to their original destinations
- Track the number of times a short URL has been accessed
- Retrieve access statistics
- Validate submitted URLs
- Handle invalid requests and missing short codes
- Prevent duplicate short codes using database constraints and retry logic

## Tech Stack

- **Node.js**
- **Express.js**
- **SQLite**
- **JavaScript**

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/shorten` | Create a new shortened URL |
| `GET` | `/shorten/:shortcode` | Retrieve information about a shortened URL |
| `PUT` | `/shorten/:shortcode` | Update the destination URL |
| `DELETE` | `/shorten/:shortcode` | Delete a shortened URL |
| `GET` | `/shorten/:shortcode/stats` | Retrieve access statistics |
| `GET` | `/:shortcode` | Redirect to the original URL |

## Example

### Create a Short URL

**Request**

```http
POST /shorten
Content-Type: application/json
```

```json
{
  "url": "https://www.google.com"
}
```

**Response**

```json
{
  "id": 1,
  "url": "https://www.google.com",
  "shortCode": "aB3xK9",
  "createdAt": "2026-10-07T17:00:00.000Z",
  "updatedAt": "2026-10-07T17:00:00.000Z"
}
```

The generated short code can then be used by visiting:

```text
http://localhost:3000/aB3xK9
```

The API redirects the user to the original URL and increments the URL's access count.

## Project Structure

```text
url_shortener/
├── routes/
│   ├── shorten.js
│   └── redirect.js
├── utils/
│   └── generateShortCode.js
├── database.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/wassiuu/url_shortener.git
cd url_shortener
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The API will be available at:

```text
http://localhost:3000
```

## Error Handling

The API uses standard HTTP status codes, including:

- `201 Created` — short URL created successfully
- `200 OK` — request completed successfully
- `204 No Content` — short URL deleted successfully
- `400 Bad Request` — missing or invalid URL
- `404 Not Found` — short code does not exist
- `500 Internal Server Error` — unexpected database or server error

## What I Learned

This project was built to practice backend development fundamentals, including:

- Building REST APIs with Express
- Designing API routes and HTTP responses
- Working with SQLite from Node.js
- Writing parameterized SQL queries
- Performing CRUD operations
- Handling asynchronous database callbacks
- Validating user input
- Implementing HTTP redirects
- Tracking URL access statistics
- Handling unique database constraints and short-code collisions
- Organizing an Express application using routers and utility modules