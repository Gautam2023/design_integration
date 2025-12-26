from frappe import _

def get_data():
	return [
		{
			"module_name": "Design Integration",
			"color": "#2E8B57",
			"icon": "octicon octicon-pencil",
			"type": "module",
			"label": _("Design Integration")
		},
		{
			"module_name": "Design Integration",
			"color": "#2E8B57",
			"icon": "octicon octicon-tools",
			"type": "page",
			"label": _("Design Dashboard"),
			"link": "design-dashboard",
			"description": _("Design workflow management dashboard")
		},
		{
			"module_name": "Design Integration",
			"color": "#2E8B57", 
			"icon": "octicon octicon-tasklist",
			"type": "page",
			"label": _("Design Tasks"),
			"link": "design-tasks",
			"description": _("Manage design tasks and workflow")
		},
		{
			"module_name": "Design Integration",
			"color": "#2E8B57",
			"icon": "octicon octicon-graph",
			"type": "page", 
			"label": _("Design Items Dashboard"),
			"link": "design-items-dashboard",
			"description": _("Design items overview and management")
		}
	]
