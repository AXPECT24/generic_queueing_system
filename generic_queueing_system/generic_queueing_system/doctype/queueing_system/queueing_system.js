// Copyright (c) 2024, dev_ash and contributors
// For license information, please see license.txt

frappe.ui.form.on('Queueing System', {
	refresh: function(frm) {
		frm.add_custom_button("Create Queue Entry", () => {
			frappe.new_doc("Queue", 
				{
					queueing_system: frm.doc.name
				}
			)
		})

		frm.add_custom_button("Clear Counter", () => {
			frappe.confirm("Performing this task will clear the counter back to 1. Press yes to proceed.", () => {
				frm.set_value("queue_counter", 1)
				frm.refresh_field("queue_counter")
				frm.save()

				frappe.show_alert("Queue counter has been refreshed.")
			}, () => {
				frappe.show_alert("Process aborted.")
			})
			
		})
	}
});
