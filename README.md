

```markdown
# Bookie Books

Bookie Books is a simple book management application that enables users to create, read, update, and delete (CRUD) book entries. It features user authentication and email notifications.

## Features
- User authentication (sign up, login, token-based session management)
- CRUD operations for books
- Input validation
- Email notifications

## Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Nodemailer

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or hosted)
- Valid SMTP server for email notifications (optional)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shubechavan/bookie-books.git
   cd bookie-books
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following:
   ```plaintext
   MONGO_URI=mongodb://<username>:<password>@localhost:27017/bookie
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Usage
- **Sign Up**: Create a new user account.
- **Login**: Authenticate and receive a JWT token.
- **Manage Books**: 
  - **Create**: Add new books.
  - **Read**: Retrieve all books.
  - **Update**: Edit book details.
  - **Delete**: Remove books.

## API Endpoints
| Method | Endpoint               | Description                           |
|--------|------------------------|---------------------------------------|
| POST   | `/api/users`           | Create a new user                     |
| POST   | `/api/users/login`     | Login user and receive JWT token      |
| GET    | `/api/books`           | Retrieve all books                    |
| POST   | `/api/books`           | Create a new book                     |
| PUT    | `/api/books/:id`       | Update book details                   |
| DELETE | `/api/books/:id`       | Delete a book                         |

## Testing
Use Postman or Insomnia to test API endpoints. Include the JWT token in the Authorization header for protected routes.

## Contributing
Contributions are welcome! Open an issue or submit a pull request.

## License
Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)
```

### Instructions for Use:
- You can copy this markdown and paste it directly into your `README.md` file.
- Adjust the sections as needed to reflect your project's specifics or additional information you may want to include.

Let me know if you need further changes or additional details!
