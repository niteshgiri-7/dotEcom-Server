# dotEcom-Server Backend

An e-commerce backend API built with Node.js, TypeScript, Express, and MongoDB. Features Firebase authentication, image upload capabilities, payment integration, and admin dashboard analytics.

## 📚 API Documentation

API documentation is available [here](https://dot-ecom-server.vercel.app/api/v1/docs)

In Local you can see the docs at `/api/v1/docs`

## 🚀 Features

- **Authentication & Authorization**
  - Firebase Authentication integration
  - Role-based access control (Admin/User)
  - Token-based authentication with refresh capabilities

- **Product Management**
  - CRUD operations for products
  - Image upload with Cloudinary integration
  - Category management
  - Stock tracking
  - Advanced filtering and search capabilities

- **Order System**
  - Order creation and management
  - Order status tracking
  - Order cancellation
  - Stock updates on order placement/cancellation

- **Payment Integration**
  - Khalti payment gateway integration
  - Secure payment processing
  - Payment verification via lookup api

- **User Management**
  - Admin can view all users
  - Single admin functionality
  - Order history and status tracking

- **Admin Dashboard Analytics**
  - Sales analytics
  - Inventory statistics
  - User demographics
  - Revenue tracking
  - Order status distribution
  - and more stats of last 6 months

- **Caching**
  - Efficient caching system using Node-Cache
  - Implements cache invalidation strategies
  - Improved response times

## 🔒 Security Features

- Firebase Authentication
- Request validation
- Secure file upload
- Protected routes
- Role-based access control
- Secure payment processing
- 🔥 HTTP-only cookies

## 🛠️ Technical Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Firebase Admin SDK
- **File Storage**: Cloudinary
- **Payment Gateway**: Khalti
- **Caching**: Node-Cache
- **File Upload**: Multer

## 📋 Prerequisites

- Firebase Admin Account
- Cloudinary Account
- Khalti Merchant Account

## 🔧 Environment Variables

Create a `.env` file in the root directory:
   
   ```bash
PORT=8080
LOCAL_DB_URL=your_mongodb_local_url
PRODUCTION_DB_URL=your_mongodb_production_url
DOMAIN=your_frontend_domain
DOMAIN2=(optional)
CLOUDINARY_CLOUDNAME=your_cloudinary_cloudname
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_service_account_key
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_URL=https://khalti.com/api/v2
   ```


## 🚀 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/niteshgiri-7/dotEcom-Server.git
cd dotEcom-Server
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```



## 📦 Project Structure

```bash
src/
├── config/ # Configuration files
├── controllers/ # Route controllers
├── middlewares/ # Custom middlewares
├── models/ # Database models
├── routes/ # API routes
├── types/ # TypeScript types/interfaces
├── utils/ # Utility functions
└── app.ts # Application entry point

```



