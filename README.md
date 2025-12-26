# Design Integration App

### 🎯 Design Request Management
- Create and manage design requests linked to Sales Orders
- Track design items through various stages
- Automated workflow management
- Role-based permissions and assignments

### 📊 Design Items Dashboard
- **Real-time dashboard** with beautiful, responsive design
- **Statistics cards** showing total, pending, completed, and overdue items
- **Advanced filtering** by status, customer, sales order, and assigned user
- **Status management** with workflow progression
- **Mobile-friendly interface** following Frappe design standards

### 🔄 Workflow Stages
1. **Pending** → Initial state
2. **Approval Drawing** → Creating approval drawings
3. **Send for Approval** → Submitting for review
4. **Design** → Active design work
5. **Modelling** → 3D modeling phase
6. **Production Drawing** → Creating production drawings
7. **SKU Generation** → Generating product codes
8. **BOM** → Bill of Materials creation
9. **Nesting** → Material optimization
10. **Completed** → Final state

### 👥 Role-Based Access
- **Design Manager**: Full access to all features
- **Design User**: Create and update design requests
- **Project Manager**: View and manage project-related requests
- **Project User**: Read-only access to assigned projects

## Installation

1. **Install the app**:
   ```bash
   bench get-app design_integration
   bench install-app design_integration
   ```

2. **Build assets**:
   ```bash
   bench build
   ```

3. **Clear cache**:
   ```bash
   bench --site all clear-cache
   ```

## Usage

### Accessing the Dashboard

1. **Navigate to**: `/design-items-dashboard`
2. **Or use the menu**: Design Integration → Design Items Dashboard

### Dashboard Features

#### 📈 Statistics Overview
- **Total Items**: Count of all design items
- **Pending Items**: Items not yet completed
- **Completed Items**: Successfully finished items
- **Overdue Items**: Items past expected completion date

#### 🔍 Advanced Filtering
- **Item Status**: Filter by current workflow stage
- **Project Status**: Open or closed projects
- **Customer**: Search by customer name
- **Sales Order**: Filter by specific sales order
- **Assigned To**: Filter by assigned user

#### ⚡ Quick Actions
- **Status Updates**: Click action buttons to progress items
- **Real-time Refresh**: Automatic data updates
- **Bulk Operations**: Manage multiple items efficiently

### Creating Design Requests

1. **From Sales Order**:
   - Navigate to Sales Order
   - Click "Create Design Request"
   - Fill in design requirements
   - Assign to design team

2. **Manual Creation**:
   - Go to Design Integration → Design Request → New
   - Enter project details
   - Add design items
   - Set priorities and deadlines

## Technical Architecture

### Frontend
- **Template-based pages** following Frappe standards
- **Responsive design** with Bootstrap 4
- **Modern JavaScript** with ES6+ features
- **CSS animations** and hover effects

### Backend
- **Python controllers** with proper error handling
- **Database optimization** with efficient queries
- **Role-based permissions** and security
- **Audit logging** for all status changes

### Database Schema
- **Design Request**: Main request document
- **Design Request Item**: Individual design items
- **Design Items Dashboard**: Dashboard configuration
- **Design Stage Transition**: Workflow management

## Configuration

### Custom Fields
The app automatically creates custom fields for:
- Sales Order integration
- Project linking
- Customer information
- Priority management

### Permissions
Default roles and permissions are set up for:
- System Manager
- Design Manager
- Design User
- Project Manager
- Project User

## Customization

### Adding New Workflow Stages
1. Update the `getNextStatuses()` function in the dashboard template
2. Add new status options to filter dropdowns
3. Update status color mappings
4. Modify database queries if needed

### Custom Dashboard Widgets
1. Extend the `get_dashboard_charts()` method
2. Add new chart types and data sources
3. Update the frontend to display new widgets

### Integration with Other Apps
The app is designed to integrate with:
- **ERPNext**: Sales Orders, Projects, Customers
- **Frappe**: User management, permissions, workflows
- **Custom Apps**: Extensible architecture for additional features


5. Submit a pull request

## License

This app is licensed under the MIT License. See `license.txt` for details.

