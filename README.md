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
3. Create .env file from template:
```bash
cp .env_template .env
```

4. Configure environment variables in .env:
```bash
# Development mode
NEXT_PUBLIC_DEV_MODE=true

# AWS Configuration (for local development)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# DynamoDB Tables
DYNAMODB_ORDER_TABLE_NAME=Johnys-orders
DYNAMODB_MENU_TABLE_NAME=restaurant_menu

# SSM Parameter Store
PATH_PREFIX=/terrys-american-dining
```

5. Setup SSM parameters:
```bash
# Set parameter path variable
export PATH_PREFIX=/sushi-dynasty  # Should match PATH_PREFIX in .env

# Create SSM parameters
aws ssm put-parameter --name "$NEXT_PUBLIC_PATH_PREFIX/restaurant_name" --value "Terry's American Dining" --type "String"
aws ssm put-parameter --name "$NEXT_PUBLIC_PATH_PREFIX/restaurant_description" --value "Terry's American Dining provides amazing American cuisine" --type "String"
aws ssm put-parameter --name "$NEXT_PUBLIC_PATH_PREFIX/restaurant_address" --value "123 Main St" --type "String"
aws ssm put-parameter --name "$NEXT_PUBLIC_PATH_PREFIX/restaurant_hours" --value "9AM-10PM" --type "String"
aws ssm put-parameter --name "$NEXT_PUBLIC_PATH_PREFIX/restaurant_email" --value "testing@johndining.com" --type "String"
aws ssm put-parameter --name "$NEXT_PUBLIC_PATH_PREFIX/restaurant_support_phone" --value "+1234567890" --type "String"
aws ssm put-parameter --name "$NEXT_PUBLIC_PATH_PREFIX/phone_agent_instruction" --value "If a customer wish to reserve table, your goal is to gather necessary information from callers in a friendly and efficient manner like follows: 1. Ask for their name. 2. Ask for number of the people who will be dining. 3. Request their preferred date and time for the appointment. 4. Confirm all details with the caller, including the date and time of the appointment." --type "String"
```

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to:
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

### Tech Stack
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

## Production Deployment

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Deployment Options

1. **Vercel (Recommended)**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically build and deploy your application
   - Set up environment variables in Vercel dashboard
   ```bash
   # Deploy to Vercel
   vercel
   ```

2. **Traditional Server**
   - Install Node.js on your server
   - Clone the repository
   - Install dependencies: `npm install`
   - Build: `npm run build`
   - Start: `npm start`
   - Use process manager (PM2) for reliability:
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start the application
   pm2 start npm --name "restaurant-app" -- start
   
   # Monitor the application
   pm2 monitor
   ```

3. **Docker Deployment**
   - Build the Docker image:
   ```bash
   docker build -t restaurant-app .
   ```
   - Run the container:
   ```bash
   docker run -p 3000:3000 restaurant-app
   ```

### Production Considerations

1. **Environment Variables and AWS Configuration**
   - Set up proper environment variables for production
   - Configure NEXT_PUBLIC_PATH_PREFIX for your production environment
   - In AWS Fargate, the application will use IAM roles instead of access keys
   - Ensure IAM roles have proper permissions for SSM Parameter Store:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "ssm:GetParameter",
             "ssm:PutParameter"
           ],
           "Resource": "arn:aws:ssm:*:*:parameter/terrys-american-dining/*"
         }
       ]
     }
     ```
   - Use different parameter paths for different environments (e.g., /prod/restaurant-name, /staging/restaurant-name)
   - Store sensitive information securely in SSM Parameter Store
   - Use different API endpoints for production

2. **Security**
   - Change the default admin password (`1234`)
   - Implement proper authentication system
   - Set up SSL/TLS certificates
   - Configure security headers

3. **Performance**
   - Enable caching
   - Optimize images and assets
   - Monitor application performance
   - Set up error tracking

4. **Backup**
   - Implement regular database backups
   - Store backups securely
   - Test backup restoration process

## Security Note

The current admin password (`1234`) is temporary and should be changed in a production environment. In a real deployment:
- Implement proper authentication and security measures
- Use environment variables for sensitive information
- Set up SSL/TLS certificates
- Configure security headers
- Regularly update dependencies
- Monitor for security vulnerabilities
