// Copyright (c) 2024, dev_ash and contributors
// For license information, please see license.txt

frappe.ui.form.on('Queue', {
	refresh: function(frm) {
		if (!frm.is_new()) {
			frm.set_df_property("queueing_system", "read_only", 1)
			frm.set_df_property("queue_number", "read_only", 1)
			frm.set_df_property("customer_name", "read_only", 1)
		}

		frappe.call({
			method: "generic_queueing_system.generic_queueing_system.doctype.queue.queue.validate_schedule",
			callback: (res) => {
				if (res) {
					let day = res.message[0]
					let time = res.message[1]

					frm.set_query("queueing_system", function() {
						return {
							"filters": [
								["Queue Schedule", day, "=", "1"],
								["Queue Schedule", "from_time", "<=", time],
								["Queue Schedule", "to_time", ">", time]
							]
						}
					})
				}
			}
		})

		if (frm.doc.queue_status !== "Closed" && frm.doc.queue_status !== "Cancelled") {
			frm.add_custom_button("Cancel Queue", () => {
				frappe.confirm("Are you sure you want to cancel this queue?", () => {
					frappe.call({
						method: "generic_queueing_system.generic_queueing_system.doctype.queue.queue.on_change",
						args: {
							docname: frm.doc.name,
							status: "Cancelled"
						}, callback: function (res) {
							if (res) {
								frm.doc.queue_status = res.message
								frm.refresh_field("queue_status");
							}
						}
					})
				}, () => {
					frappe.show_alert("process aborted")
				})
	
			})
		}
		
		if (frm.doc.queue_status === "Queue" || frm.doc.queue_status === "Missed") {
			frm.add_custom_button("Serve", () => {
				frappe.call({
					method: "generic_queueing_system.generic_queueing_system.doctype.queue.queue.validate_session",
					args: {
						queue: frm.doc.queueing_system
					}, callback: (r) => {
						if (r.message) {
							frm.set_value("queue_status", "Serve")
							frm.refresh_field("queue_status")
							frm.save()
						}
					}
				})
			})
		}

		if (frm.doc.queue_status === "Serve") {
			frm.add_custom_button("Close", () => {
				frm.set_value("queue_status", "Closed")
				frm.refresh_field("queue_status")
				frm.save()
			})

			frm.add_custom_button("Mark as Missed", () => {
				frm.set_value("queue_status", "Missed")
				frm.refresh_field("queue_status")
				frm.save()
			})
		}

	},

	queueing_system: function(frm) {
		frappe.db.get_value("Queueing System", frm.doc.queueing_system, "queue_counter").then(r => {
			let counter = r.message.queue_counter
			frm.set_value("fetched_queue_counter", counter)
			frm.refresh_field("fetched_queue_counter")
		})
	},

	after_save: function(frm) {
		frappe.call({
			method:"generic_queueing_system.generic_queueing_system.doctype.queue.queue.update_counter",
			args: {
				queue: frm.doc.queueing_system
			}, callback: function(res) {
				if (res) {
					refresh_field("fetched_queue_counter")
				}
			}
		})
	}
});
