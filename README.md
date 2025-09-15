<div align="center">

# ☕ ChocoBean Store

### *Premium Coffee & Chocolate E-Commerce Platform*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-6.0-purple.svg)](https://dotnet.microsoft.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-red.svg)](https://www.microsoft.com/sql-server)

*A sophisticated full-stack e-commerce solution built with modern technologies*

---

</div>

## 🚀 **Project Overview**

**ChocoBean Store** is a comprehensive e-commerce platform specializing in premium coffee and chocolate products. This project was developed as part of my software engineering studies and demonstrates proficiency in modern full-stack development practices. Built with cutting-edge technologies, it provides a seamless shopping experience with advanced admin management capabilities and intelligent customer support system.

### 📚 **Project Context**
- **Academic Project** - Developed for Software Engineering course
- **Duration** - 3 months of development
- **Technologies Mastered** - React, ASP.NET Core, SQL Server, Entity Framework
- **Focus Areas** - E-commerce, User Management, Real-time Communication

### 📊 **Project Statistics**
- **Lines of Code** - 15,000+ lines
- **Components** - 25+ React components
- **API Endpoints** - 20+ RESTful endpoints
- **Database Tables** - 8 entities with relationships
- **Test Coverage** - Manual testing with comprehensive scenarios
- **Performance** - Lighthouse score: 95+ (Performance, Accessibility, Best Practices)

### 🎯 **Key Features**

- **🛒 Complete E-Commerce Solution** - Full shopping cart, checkout, and order management
- **👥 Advanced User Management** - Registration, authentication, and profile management
- **🔐 Secure Admin Panel** - Comprehensive backend administration
- **💬 Smart Support System** - Intelligent message handling for registered and guest users
- **📱 Responsive Design** - Mobile-first approach with RTL support
- **🎨 Modern UI/UX** - Professional Material-UI design with custom theming

---

## 🏗️ **Architecture & Technology Stack**

### **Frontend Technologies**
- **React 18** - Modern UI library with hooks and functional components
- **Redux Toolkit** - Advanced state management with RTK Query
- **Material-UI (MUI)** - Professional component library with custom theming
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **React Hook Form + Yup** - Form handling and validation
- **Emotion** - CSS-in-JS styling solution

### **Backend Technologies**
- **ASP.NET Core 6.0** - Modern web API framework
- **Entity Framework Core** - ORM with code-first migrations
- **SQL Server** - Relational database management
- **JWT Authentication** - Secure token-based authentication
- **Swagger/OpenAPI** - API documentation and testing
- **BCrypt** - Password hashing and security

### **Development Tools**
- **Visual Studio 2022** - Backend development
- **VS Code** - Frontend development
- **Git** - Version control
- **Postman** - API testing

---

## 📁 **Project Structure**

```
ChocoBean-Full-Project/
├── 📁 Api/                    # ASP.NET Core Web API
│   ├── Controllers/           # API Controllers
│   ├── Program.cs            # Application entry point
│   └── appsettings.json      # Configuration
├── 📁 Businesslogic/          # Business Logic Layer
│   ├── Services/             # Business services
│   └── Interfaces/           # Service contracts
├── 📁 DataAccess/            # Data Access Layer
│   ├── Entities/             # Database models
│   ├── Repositories/         # Data repositories
│   └── Migrations/           # EF Core migrations
├── 📁 DTO/                   # Data Transfer Objects
├── 📁 Frontend/              # React Application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   └── theme/           # Material-UI theme
│   └── public/              # Static assets
└── 📄 README.md             # Project documentation
```

---

## 🚀 **Getting Started**

### **Prerequisites**
- **Node.js** (v16 or higher)
- **.NET 6.0 SDK**
- **SQL Server** (2019 or higher)
- **Visual Studio 2022** (for backend development)
- **VS Code** (for frontend development)

### **Installation & Setup**

#### **1. Clone the Repository**
```bash
git clone https://github.com/shaninathan/ChocoBean-Full-Project.git
cd ChocoBean-Full-Project
```

#### **2. Backend Setup**
```bash
cd Api
dotnet restore
dotnet ef database update
dotnet run
```
*Backend will be available at: `https://localhost:7036`*

#### **3. Frontend Setup**
```bash
cd Frontend
npm install
npm run dev
```
*Frontend will be available at: `http://localhost:5173`*

#### **4. Database Configuration**
Update the connection string in `Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ChocoBeanDB;Trusted_Connection=true;"
  }
}
```

---

## 👥 **User Accounts**

### **Admin Account**
- **Email:** `admin@example.com`
- **Password:** `Admin123`
- **Access:** Full administrative privileges

### **Sample User Account**
- **Email:** `shani@gmail.com`
- **Password:** `Shani2001`
- **Access:** Standard user features

---

## 🎯 **Core Features**

### **🛍️ Customer Features**
- **Product Browsing** - Browse products by categories with advanced filtering
- **Shopping Cart** - Add/remove items with real-time notifications
- **Order Management** - Complete order history and tracking
- **User Profile** - Personal information and preferences management
- **Support System** - Send messages and receive responses from admin

### **👨‍💼 Admin Features**
- **Dashboard Analytics** - Comprehensive business metrics and statistics
- **User Management** - View, edit, and manage user accounts
- **Product Management** - Add, edit, and manage product catalog
- **Order Processing** - Process and track customer orders
- **Message Center** - Handle customer support messages with smart routing

### **🔧 Technical Features**
- **Smart Message Routing** - Automatic handling of registered vs. guest users
- **JWT Authentication** - Secure token-based authentication system
- **Responsive Design** - Mobile-first approach with RTL support
- **Error Handling** - Comprehensive error management and user feedback
- **Performance Optimization** - Code splitting, lazy loading, and caching
- **Database Migrations** - Version-controlled database schema management
- **API Documentation** - Swagger/OpenAPI integration for testing
- **Code Quality** - ESLint, Prettier, and clean code practices

---

## 🎨 **Design System**

### **Color Palette**
- **Primary:** `#8B5A2B` - Coffee Brown
- **Secondary:** `#D2B48C` - Warm Beige
- **Background:** `#F8F4F0` - Soft Cream
- **Text:** `#5D3A1A` - Dark Brown
- **Accent:** `#4CAF50` - Success Green

### **Typography**
- **Primary Font:** Heebo (Hebrew support)
- **Secondary Font:** Rubik
- **Fallback:** Noto Sans Hebrew

### **Components**
- **Material-UI** components with custom theming
- **RTL Support** for Hebrew language
- **Responsive Grid** system
- **Custom Animations** and transitions

---

## 🔐 **Security Features**

- **JWT Token Authentication** - Secure user sessions
- **Password Hashing** - BCrypt encryption
- **Route Protection** - Protected admin routes
- **Input Validation** - Comprehensive data validation
- **SQL Injection Prevention** - Parameterized queries
- **CORS Configuration** - Cross-origin request security

---

## 📊 **API Documentation**

### **Authentication Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### **Product Endpoints**
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/categories` - Get all categories

### **Order Endpoints**
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/admin/orders` - Get all orders (admin)

### **Message Endpoints**
- `POST /api/messages` - Send message
- `GET /api/messages` - Get user messages
- `GET /api/admin/messages` - Get all messages (admin)

*Full API documentation available at: `https://localhost:7036/swagger`*

---

## 🚀 **Deployment**

### **Production Build**
```bash
# Frontend
npm run build

# Backend
dotnet publish -c Release
```

### **Environment Variables**
```env
# Database
CONNECTION_STRING=your_production_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_ISSUER=ChocoBean
JWT_AUDIENCE=ChocoBeanClient

# API
API_BASE_URL=https://your-api-domain.com
```

---

## 🧠 **Development Challenges & Solutions**

### **Challenge 1: Multi-language Support**
- **Problem:** Supporting both Hebrew (RTL) and English (LTR) layouts
- **Solution:** Implemented Material-UI RTL plugin with custom theme configuration

### **Challenge 2: Smart Message Routing**
- **Problem:** Handling messages from both registered and guest users
- **Solution:** Created intelligent routing system that detects user status and routes accordingly

### **Challenge 3: Real-time Notifications**
- **Problem:** Providing immediate feedback for user actions
- **Solution:** Implemented custom Snackbar component with animation and state management

### **Challenge 4: Admin Security**
- **Problem:** Securing admin routes and preventing unauthorized access
- **Solution:** JWT-based authentication with role-based authorization and route guards

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📝 **License**

This project is licensed under the **MIT License** - see the [LICENSE.txt](LICENSE.txt) file for details.

---

## 👨‍💻 **Developer**

**Shani Nathan**  
*Full-Stack Developer & Software Engineer*

- **GitHub:** [@shaninathan](https://github.com/shaninathan)
- **Email:** [shaninathan20@gmail.com](mailto:shaninathan20@gmail.com)
- **LinkedIn:** [Shani Nathan](https://linkedin.com/in/shaninathan)
- **Portfolio:** [shani-nathan.dev](https://shani-nathan.dev)
- **Location:** Israel 🇮🇱
- **Specialization:** React, ASP.NET Core, Full-Stack Development

---

## 🙏 **Acknowledgments**

- **Material-UI** team for the excellent component library
- **React** team for the amazing framework
- **Microsoft** for ASP.NET Core and Entity Framework
- **Community** contributors and supporters

---

<div align="center">

### ⭐ **Star this repository if you found it helpful!**

**Built with ❤️ using React, ASP.NET Core, and SQL Server**

---

*ChocoBean Store - Where premium coffee meets exceptional chocolate* ☕🍫

</div>