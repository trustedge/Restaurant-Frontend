# Restaurant Management System

A comprehensive restaurant management system designed for restaurant kiosks, enabling efficient order management, menu customization, and restaurant settings administration.

## Features

### 1. Dashboard
- Real-time overview of restaurant operations
- Restaurant information display (name, description, hours, contact details)
- Order statistics with status counts (Placed, Preparing, Ready, Delivered, Cancelled)
- Clickable status cards for quick access to filtered orders

### 2. Order Management
- View and manage orders in real-time
- Filter orders by status
- Search functionality for orders, customers, and items
- Add/edit order notes
- Update order status
- Add items to existing orders
- Track order timestamps and customer information

### 3. Menu Management
- View and manage menu items
- Categorize menu items
- Search functionality
- Add/edit item details (name, price, description)

### 4. Settings
- Configure restaurant information:
  - Restaurant name
  - Description
  - Address
  - Operating hours
  - Contact information (email, phone)
  - Phone agent instructions

### 5. Access Control
- Two-level access system:
  - Employee mode (limited access)
  - Admin mode (full access, password protected)
- Temporary admin password: `1234`

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd RestaurantFrontEnd
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Basic Navigation
- Click the restaurant name/logo in the top left to return to the dashboard
- Use the sidebar for navigation between different sections
- Toggle sidebar expansion using the menu button

### Managing Orders
1. View all orders on the Orders page
2. Filter orders using the status dropdown or search bar
3. Click status cards on the dashboard for quick filtered views
4. Update order status using the dropdown in each order card
5. Add notes or items to orders as needed

### Accessing Admin Features
1. Click "Switch to Admin" in the sidebar
2. Enter the temporary password: `1234`
3. Access additional features like Settings

### Customizing Restaurant Settings
1. Switch to Admin mode
2. Navigate to Settings
3. Update restaurant information as needed
4. Changes are automatically saved and reflected throughout the app

## Development

The application is built with:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI Components

File structure:
```
app/
├── contexts/          # React contexts for state management
├── components/        # Reusable UI components
├── page.tsx          # Dashboard/Home page
├── layout.tsx        # Root layout
├── client-layout.tsx # Client-side layout with navigation
├── orders/          # Order management
├── menu/            # Menu management
└── settings/        # Restaurant settings
```

## Security Note

The current admin password (`1234`) is temporary and should be changed in a production environment. In a real deployment, implement proper authentication and security measures.
