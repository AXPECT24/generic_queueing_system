frappe.listview_settings["Queue"] = {
    add_fields: [
        "queue_status",
        "fetched_queue_counter"
    ],
    filters: [
        ["date_queued", "=", frappe.datetime.nowdate()],
        ["queue_status", "=", "Queue"],
    ],
};