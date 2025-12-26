# Design Integration App

A comprehensive Frappe/ERPNext application for managing design workflows, requests, and project integration.

## Features

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

## Troubleshooting

### Common Issues

1. **Dashboard Not Loading**:
   - Clear browser cache
   - Run `bench clear-cache`
   - Check browser console for errors

2. **Permission Errors**:
   - Verify user roles
   - Check doctype permissions
   - Ensure proper role assignments

3. **Data Not Displaying**:
   - Verify database connections
   - Check for data in Design Request tables
   - Review error logs

### Debug Mode
Enable debug mode in `hooks.py`:
```python
# Add to hooks.py for debugging
app_include_js = [
    "/assets/design_integration/js/debug.js"
]
```

## Development

### Code Structure
```
design_integration/
├── design_integration/
│   ├── doctype/
│   │   ├── design_request/
│   │   ├── design_request_item/
│   │   └── design_items_dashboard/
│   ├── templates/
│   │   └── pages/
│   │       └── design-items-dashboard.html
│   ├── public/
│   │   └── js/
│   ├── config/
│   │   └── desktop.py
│   └── hooks.py
└── README.md
```

### Adding New Features
1. **Create doctype** if needed
2. **Add Python controller** methods
3. **Update templates** for UI changes
4. **Test thoroughly** with different user roles
5. **Document changes** in README

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This app is licensed under the MIT License. See `license.txt` for details.

## Support

For support and questions:
- **Email**: rejithr1995@gmail.com
- **Issues**: Create GitHub issues for bugs
- **Documentation**: Check this README and inline code comments

## Changelog

### Version 2.0.0 (Current)
- ✨ **Complete dashboard redesign** with modern UI
- 🎨 **Beautiful, responsive design** following Frappe standards
- 🔧 **Fixed critical dashboard functionality** issues
- 📱 **Mobile-friendly interface** with responsive design
- 🚀 **Performance improvements** and optimization
- 🛡️ **Better error handling** and user feedback
- 📊 **Enhanced statistics** and real-time updates

### Version 1.0.0
- Initial release with basic functionality
- Design request management
- Basic dashboard implementation

---

**Built with ❤️ for the Frappe/ERPNext community**
