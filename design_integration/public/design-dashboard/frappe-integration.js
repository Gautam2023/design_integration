// Frappe Integration for Design Integration Dashboard
// This file provides real data integration with Frappe backend

class FrappeDashboardIntegration {
    constructor() {
        this.baseUrl = window.location.origin;
        this.csrfToken = this.getCSRFToken();
        this.currentUser = frappe.session.user;
        this.dashboardData = null;
    }

    getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
               frappe.csrf_token || 
               '';
    }

    async loadDashboardData(filters = {}) {
        try {
            this.showLoadingState();
            
            // Load statistics
            const stats = await this.loadStatistics();
            
            // Load design items
            const items = await this.loadDesignItems(filters);
            
            // Load activities
            const activities = await this.loadRecentActivities();
            
            // Load chart data
            const chartData = await this.loadChartData();
            
            this.dashboardData = {
                stats,
                items,
                activities,
                chartData
            };
            
            this.updateDashboard();
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showErrorState('Failed to load dashboard data');
        }
    }

    async loadStatistics() {
        try {
            const response = await frappe.call({
                method: 'design_integration.design_integration.doctype.design_request.design_request.get_dashboard_stats',
                args: {},
                callback: (r) => r.message
            });
            
            return response || {
                total_requests: 0,
                open_requests: 0,
                closed_requests: 0,
                my_requests: 0,
                total_items: 0,
                pending_items: 0,
                completed_items: 0,
                overdue_items: 0
            };
        } catch (error) {
            console.error('Failed to load statistics:', error);
            return this.getDefaultStats();
        }
    }

    async loadDesignItems(filters = {}) {
        try {
            const response = await frappe.call({
                method: 'design_integration.design_integration.doctype.design_request.design_request.get_all_design_items',
                args: { filters },
                callback: (r) => r.message
            });
            
            return response || [];
        } catch (error) {
            console.error('Failed to load design items:', error);
            return [];
        }
    }

    async loadRecentActivities(limit = 10) {
        try {
            // Get recent comments and status changes
            const activities = [];
            
            // Recent status changes from comments
            const statusChanges = await frappe.call({
                method: 'frappe.desk.doctype.comment.comment.get_comments',
                args: {
                    doctype: 'Design Request Item',
                    name: '',
                    limit: limit
                },
                callback: (r) => r.message
            });
            
            if (statusChanges) {
                statusChanges.forEach(comment => {
                    if (comment.content.includes('Status updated')) {
                        activities.push({
                            type: 'status_change',
                            message: comment.content,
                            timestamp: this.formatTimestamp(comment.creation),
                            icon: 'fas fa-arrow-up',
                            user: comment.owner
                        });
                    }
                });
            }
            
            // Recent completions
            const completions = await frappe.call({
                method: 'frappe.desk.doctype.design_request_item.design_request_item.get_recent_completions',
                args: { limit },
                callback: (r) => r.message
            });
            
            if (completions) {
                completions.forEach(item => {
                    activities.push({
                        type: 'completion',
                        message: `Item ${item.item_code} completed successfully`,
                        timestamp: this.formatTimestamp(item.modified),
                        icon: 'fas fa-check',
                        user: item.modified_by
                    });
                });
            }
            
            return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
            
        } catch (error) {
            console.error('Failed to load activities:', error);
            return [];
        }
    }

    async loadChartData() {
        try {
            // Status distribution
            const statusData = await frappe.call({
                method: 'frappe.desk.doctype.design_request_item.design_request_item.get_status_distribution',
                args: {},
                callback: (r) => r.message
            });
            
            // Priority distribution
            const priorityData = await frappe.call({
                method: 'frappe.desk.doctype.design_request.design_request.get_priority_distribution',
                args: {},
                callback: (r) => r.message
            });
            
            // Weekly progress
            const weeklyProgress = await frappe.call({
                method: 'frappe.desk.doctype.design_request_item.design_request_item.get_weekly_progress',
                args: {},
                callback: (r) => r.message
            });
            
            return {
                status: statusData || [],
                priority: priorityData || [],
                weeklyProgress: weeklyProgress || []
            };
        } catch (error) {
            console.error('Failed to load chart data:', error);
            return this.getDefaultChartData();
        }
    }

    updateDashboard() {
        if (!this.dashboardData) return;
        
        this.updateStatistics();
        this.updateCharts();
        this.updateItemsList();
        this.updateActivitiesList();
    }

    updateStatistics() {
        const stats = this.dashboardData.stats;
        if (!stats) return;
        
        // Update stat cards
        const elements = {
            'total-items': stats.total_items || 0,
            'pending-items': stats.pending_items || 0,
            'completed-items': stats.completed_items || 0,
            'overdue-items': stats.overdue_items || 0
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    updateCharts() {
        const chartData = this.dashboardData.chartData;
        if (!chartData) return;
        
        // Update status chart
        if (window.charts && window.charts.statusChart) {
            const statusChart = window.charts.statusChart;
            statusChart.data.labels = chartData.status.map(item => item.label);
            statusChart.data.datasets[0].data = chartData.status.map(item => item.value);
            statusChart.update();
        }
        
        // Update priority chart
        if (window.charts && window.charts.priorityChart) {
            const priorityChart = window.charts.priorityChart;
            priorityChart.data.datasets[0].data = [
                chartData.priority.find(p => p.label === 'Low')?.value || 0,
                chartData.priority.find(p => p.label === 'Medium')?.value || 0,
                chartData.priority.find(p => p.label === 'High')?.value || 0
            ];
            priorityChart.update();
        }
        
        // Update progress chart
        if (window.charts && window.charts.progressChart) {
            const progressChart = window.charts.progressChart;
            progressChart.data.labels = chartData.weeklyProgress.map(item => item.week);
            progressChart.data.datasets[0].data = chartData.weeklyProgress.map(item => item.completed);
            progressChart.update();
        }
    }

    updateItemsList() {
        const items = this.dashboardData.items;
        const container = document.getElementById('items-list');
        
        if (!container) return;
        
        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h4>No items found</h4>
                    <p>Try adjusting your filters or create new design items.</p>
                </div>
            `;
            return;
        }

        let html = '';
        items.forEach(item => {
            const statusColor = this.getStatusColor(item.design_status);
            const priorityColor = this.getPriorityColor(item.priority);
            const overdueClass = item.is_overdue ? 'border-danger' : '';
            
            html += `
                <div class="list-item ${overdueClass}">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <strong>${item.item_code || 'N/A'}</strong><br>
                            <small class="text-muted">${item.item_name || 'N/A'}</small>
                        </div>
                        <div class="col-md-2">
                            <span class="status-badge badge bg-${statusColor}">${item.design_status || 'Pending'}</span>
                            ${item.is_overdue ? '<br><small class="text-danger">Overdue</small>' : ''}
                        </div>
                        <div class="col-md-2">
                            <span class="priority-badge badge bg-${priorityColor}">${item.priority || 'Medium'}</span>
                        </div>
                        <div class="col-md-2">
                            <strong>${item.customer_name || 'N/A'}</strong><br>
                            <small class="text-muted">${item.sales_order || 'N/A'}</small>
                        </div>
                        <div class="col-md-2">
                            <small class="text-muted">
                                Created: ${this.formatDate(item.request_date)}<br>
                                Expected: ${this.formatDate(item.expected_completion)}
                            </small>
                        </div>
                        <div class="col-md-2 text-end">
                            ${this.createActionButtons(item)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    updateActivitiesList() {
        const activities = this.dashboardData.activities;
        const container = document.getElementById('activities-list');
        
        if (!container) return;
        
        if (!activities || activities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h4>No activities found</h4>
                    <p>Activities will appear here as they occur.</p>
                </div>
            `;
            return;
        }

        let html = '';
        activities.forEach(activity => {
            const iconColor = this.getActivityIconColor(activity.type);
            
            html += `
                <div class="list-item">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <i class="${activity.icon} text-${iconColor}" style="font-size: 1.2rem;"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="fw-medium">${activity.message}</div>
                            <small class="text-muted">
                                ${activity.timestamp} by ${activity.user || 'System'}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    createActionButtons(item) {
        const buttons = [];
        
        // Add status update buttons based on current status
        const nextStatuses = this.getNextStatuses(item.design_status);
        nextStatuses.forEach(status => {
            buttons.push(`
                <button class="btn btn-outline-primary btn-sm btn-custom me-1 mb-1" 
                        onclick="frappeIntegration.updateItemStatus('${item.item_id}', '${status}')">
                    ${status}
                </button>
            `);
        });
        
        // Add complete button
        buttons.push(`
            <button class="btn btn-outline-success btn-sm btn-custom me-1 mb-1" 
                    onclick="frappeIntegration.updateItemStatus('${item.item_id}', 'Completed')">
                Complete
            </button>
        `);
        
        return buttons.join('');
    }

    getNextStatuses(currentStatus) {
        const statusFlow = {
            'Pending': ['Approval Drawing', 'Design'],
            'Approval Drawing': ['Send for Approval', 'Design'],
            'Send for Approval': ['Design', 'Modelling'],
            'Design': ['Modelling', 'Production Drawing'],
            'Modelling': ['Production Drawing', 'SKU Generation'],
            'Production Drawing': ['SKU Generation', 'BOM'],
            'SKU Generation': ['BOM', 'Nesting'],
            'BOM': ['Nesting', 'Completed'],
            'Nesting': ['Completed']
        };
        return statusFlow[currentStatus] || [];
    }

    getStatusColor(status) {
        const colors = {
            'Pending': 'warning',
            'Approval Drawing': 'info',
            'Send for Approval': 'primary',
            'Design': 'primary',
            'Modelling': 'info',
            'Production Drawing': 'warning',
            'SKU Generation': 'info',
            'BOM': 'success',
            'Nesting': 'dark',
            'Completed': 'success',
            'Cancelled': 'danger'
        };
        return colors[status] || 'secondary';
    }

    getPriorityColor(priority) {
        const colors = {
            'Low': 'success',
            'Medium': 'warning',
            'High': 'danger'
        };
        return colors[priority] || 'warning';
    }

    getActivityIconColor(type) {
        const colors = {
            'status_change': 'primary',
            'completion': 'success',
            'assignment': 'info',
            'comment': 'warning',
            'creation': 'success'
        };
        return colors[type] || 'secondary';
    }

    async updateItemStatus(itemId, newStatus) {
        try {
            const response = await frappe.call({
                method: 'design_integration.design_integration.doctype.design_request_item.design_request_item.update_design_status',
                args: {
                    item_id: itemId,
                    new_status: newStatus
                },
                callback: (r) => r.message
            });
            
            if (response && response.success) {
                frappe.show_alert({
                    message: 'Item status updated successfully',
                    indicator: 'green'
                });
                
                // Refresh dashboard data
                this.loadDashboardData();
            } else {
                frappe.show_alert({
                    message: 'Failed to update item status',
                    indicator: 'red'
                });
            }
        } catch (error) {
            console.error('Failed to update item status:', error);
            frappe.show_alert({
                message: 'Failed to update item status',
                indicator: 'red'
            });
        }
    }

    showLoadingState() {
        const containers = ['items-list', 'activities-list'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <span class="ms-2">Loading data...</span>
                    </div>
                `;
            }
        });
    }

    showErrorState(message) {
        const containers = ['items-list', 'activities-list'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle text-danger"></i>
                        <h4>Error</h4>
                        <p>${message}</p>
                        <button class="btn btn-primary" onclick="frappeIntegration.loadDashboardData()">
                            <i class="fas fa-redo me-2"></i>Retry
                        </button>
                    </div>
                `;
            }
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    }

    getDefaultStats() {
        return {
            total_requests: 0,
            open_requests: 0,
            closed_requests: 0,
            my_requests: 0,
            total_items: 0,
            pending_items: 0,
            completed_items: 0,
            overdue_items: 0
        };
    }

    getDefaultChartData() {
        return {
            status: [],
            priority: [],
            weeklyProgress: []
        };
    }

    // Export functionality
    async exportData(format = 'csv') {
        try {
            const items = this.dashboardData?.items || [];
            if (items.length === 0) {
                frappe.show_alert('No data to export', 'red');
                return;
            }
            
            if (format === 'csv') {
                this.exportToCSV(items);
            } else if (format === 'json') {
                this.exportToJSON(items);
            }
        } catch (error) {
            console.error('Export failed:', error);
            frappe.show_alert('Export failed', 'red');
        }
    }

    exportToCSV(items) {
        const headers = ['ID', 'Name', 'Status', 'Priority', 'Customer', 'Sales Order', 'Assigned To', 'Created Date', 'Expected Completion'];
        const csvContent = [
            headers.join(','),
            ...items.map(item => [
                item.item_code || '',
                item.item_name || '',
                item.design_status || '',
                item.priority || '',
                item.customer_name || '',
                item.sales_order || '',
                item.assigned_to || '',
                item.request_date || '',
                item.expected_completion || ''
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `design_items_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    exportToJSON(items) {
        const dataStr = JSON.stringify(items, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `design_items_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}

// Initialize Frappe integration when document is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof frappe !== 'undefined') {
        window.frappeIntegration = new FrappeDashboardIntegration();
        
        // Override the mock data loading with real Frappe data
        if (window.loadDashboardData) {
            window.loadDashboardData = () => window.frappeIntegration.loadDashboardData();
        }
        
        // Load real data
        window.frappeIntegration.loadDashboardData();
    }
});

// Global functions for external access
window.frappeIntegration = window.frappeIntegration || null;
