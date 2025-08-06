# E-commerce Backend API

A comprehensive Node.js/Express backend system that powers an e-commerce platform with Point of Sale (POS) capabilities, integrated AI agent support, and advanced features like market trend analysis and automated reporting.

## 🚀 Overview

This backend serves as the core API for an e-commerce platform, providing robust functionality for product management, order processing, customer relationship management, and business intelligence. It's designed as a demonstration backend that integrates seamlessly with AI agents for automated business operations.

## ✨ Key Features

### 🛍️ Product Management
- **Product Catalog**: Complete product lifecycle management with categories
- **Inventory Control**: Real-time stock tracking and management
- **Product Performance**: AI-powered analytics and performance monitoring
- **Barcode Generation**: Automatic unique barcode generation
- **Image Management**: Cloudinary integration for product images

### 📦 Order Management
- **Order Processing**: Complete order lifecycle from creation to completion
- **POS Integration**: Point of sale system with receipt generation
- **Invoice Generation**: Automatic PDF invoice creation and email delivery
- **Order Tracking**: Real-time order status updates
- **Payment Processing**: Cash handling with change calculation

### 👥 Customer Management
- **Customer Database**: Comprehensive customer information storage
- **Purchase History**: Complete transaction history tracking
- **Customer Analytics**: Purchase behavior analysis
- **Contact Management**: Phone and email communication tracking

### 👨‍💼 User & Employee Management
- **Role-Based Access**: Admin, employee, and customer roles
- **Authentication**: JWT-based authentication system
- **Employee Management**: Staff account creation and management
- **Access Control**: Permission-based feature access

### 📊 Business Intelligence
- **Market Trends**: Real-time market trend analysis using SerpAPI
- **Performance Analytics**: Product and business performance metrics
- **Automated Reporting**: Scheduled report generation
- **Data Insights**: AI-powered business insights

### 🤖 AI Integration
- **AI Agent Support**: Direct integration with AI agents for automation
- **Intelligent Analytics**: AI-powered product and market analysis
- **Automated Decisions**: AI-assisted approval workflows
- **Recommendation Engine**: Product recommendation system

### 🔧 Advanced Features
- **Email System**: Automated email notifications and marketing
- **File Management**: Upload and storage for product images and documents
- **Approval Workflows**: Multi-level approval processes
- **Audit Logging**: Comprehensive activity tracking
- **API Documentation**: Swagger/OpenAPI documentation

## 📋 Prerequisites

- Node.js 18.x or higher
- MongoDB 4.4 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Configuration](#environment-configuration))

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

### Required Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/ecommerce_db

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
COOKIE_SECRET=your_cookie_secret_here

# AI Agent Integration
AI_AGENT_URL=http://localhost:8000

# Email Configuration
EMAIL_USER=your_email@gmail.com
BREVO_API_KEY=your_brevo_api_key

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# External Services
SERPAPI_KEY=your_serpapi_key_for_market_trends

# Optional - Analytics & Caching
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

CLICKHOUSE_URL=your_clickhouse_url
CLICKHOUSE_PORT=8123
CLICKHOUSE_USERNAME=your_clickhouse_username
CLICKHOUSE_PASSWORD=your_clickhouse_password
```

### Environment Variable Details

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | ❌ No | `3000` |
| `MONGO_URI` | MongoDB connection string | ✅ Yes | - |
| `JWT_SECRET` | JWT signing secret | ✅ Yes | - |
| `COOKIE_SECRET` | Cookie encryption secret | ✅ Yes | - |
| `AI_AGENT_URL` | AI agents backend URL | ✅ Yes | `http://localhost:8000` |
| `EMAIL_USER` | Email service username | ❌ No | - |
| `BREVO_API_KEY` | Brevo email service API key | ❌ No | - |
| `CLOUDINARY_*` | Cloudinary image storage credentials | ❌ No | - |
| `SERPAPI_KEY` | SerpAPI key for market trends | ❌ No | - |
| `REDIS_*` | Redis caching configuration | ❌ No | - |
| `CLICKHOUSE_*` | ClickHouse analytics database | ❌ No | - |

## 🚀 How to Run

### Development Mode

```bash
# Start with nodemon (auto-restart on changes)
npm start

# Or run directly
node index.js
```

### Production Mode

```bash
# Set environment to production
NODE_ENV=production node index.js
```

### Using Docker

```bash
# Build the Docker image
docker build -t ecommerce-backend .

# Run the container
docker run -p 3000:3000 --env-file .env ecommerce-backend
```

### Database Seeding

```bash
# Populate database with sample data
npm run seed
```

This will create:
- Admin account (`username: admin, password: admin`)
- Sample products and categories
- Sample customers and orders
- Test data for development

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/api/health` (if implemented)

### Main API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/login/{token}` - Token-based login
- `POST /api/auth/ai-token` - AI agent token generation

#### Products
- `GET /api/products` - Get products with filtering/pagination
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/{id}/performance` - Get product performance analytics

#### Orders
- `GET /api/orders` - Get orders by customer phone
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}/status` - Update order status

#### Customers
- `GET /api/customers` - Get customers with filtering
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `GET /api/customers/{id}/activity` - Get customer activity

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category

#### Admin & Employee Management
- `GET /api/admin/employees` - Get all employees
- `POST /api/admin/employees` - Create new employee
- `PUT /api/admin/employees/{id}` - Update employee
- `DELETE /api/admin/employees/{id}` - Delete employee

#### Reports & Analytics
- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/products` - Product performance reports
- `GET /api/marketing-trends` - Market trend analysis

#### Approval System
- `GET /api/approval/requests` - Get approval requests
- `POST /api/approval/requests` - Create approval request
- `PUT /api/approval/requests/{id}` - Approve/reject request

## 🔧 Development

## 🔐 Authentication & Authorization

### JWT Authentication
- **Login**: Users authenticate with username/password
- **Token**: JWT tokens valid for 24 hours
- **Refresh**: Long-term tokens available for persistent sessions

### Role-Based Access Control
- **Admin**: Full system access
- **Employee**: Limited access to POS and inventory
- **Customer**: Read-only access to personal data

### Security Features
- Password hashing with bcrypt
- JWT token validation
- Role-based middleware protection
- Input validation and sanitization

## 📊 External Services

### Cloudinary (Image Management)
- Product image uploads
- Automatic image optimization
- CDN delivery

### SerpAPI (Market Trends)
- Google Trends data
- Market analysis
- Automated trend updates (daily cron job)

### Email Services
- Order confirmations
- Invoice delivery
- Marketing campaigns

### ClickHouse (Analytics)
- Activity logging
- Performance metrics
- Business intelligence

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MongoDB connection
   mongosh "your-mongo-uri"
   
   # Verify environment variables
   echo $MONGO_URI
   ```

2. **AI Agent Connection Failed**
   ```bash
   # Test AI agent connectivity
   curl http://localhost:8000/health-check
   
   # Check AI_AGENT_URL configuration
   echo $AI_AGENT_URL
   ```

3. **File Upload Issues**
   ```bash
   # Check Cloudinary configuration
   node -e "console.log(require('./utils/cloudinary'))"
   
   # Verify upload directory permissions
   ls -la uploads/
   ```

4. **Email Delivery Problems**
   ```bash
   # Test email configuration
   node -e "require('./utils/sendEmail')('test@example.com', 'Test', 'Test message')"
   ```

### Performance Optimization

- **Database Indexing**: Ensure proper indexes on frequently queried fields
- **Redis Caching**: Implement caching for frequently accessed data
- **Image Optimization**: Use Cloudinary transformations
- **Query Optimization**: Use MongoDB aggregation pipelines efficiently

## 🔄 Deployment

### Using Docker

```bash
# Build image
docker build -t ecommerce-backend .

# Run container
docker run -d \
  --name ecommerce-api \
  -p 3000:3000 \
  --env-file .env \
  ecommerce-backend
```

### Using Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:5.0
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:6.2-alpine

volumes:
  mongodb_data:
```