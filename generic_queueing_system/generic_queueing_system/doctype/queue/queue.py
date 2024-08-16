# Copyright (c) 2024, dev_ash and contributors
# For license information, please see license.txt

import frappe
import random, string
from frappe.model.document import Document
from frappe.utils import get_time, getdate
from datetime import datetime

class Queue(Document):
	def before_insert(self):
		user_prefix = self.queue_number
		prefix = user_prefix.upper()
		random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
		self.name = f"{prefix}-{random_string}"

		date = datetime.now()
		self.date_queued = getdate(date)
			
@frappe.whitelist()
def validate_session(queue):
	max_session = frappe.db.get_value("Queueing System", queue, "session_limit")
	configurable_date = datetime.now()
	date = getdate(configurable_date)

	if max_session:
		session_count = frappe.db.count(
			"Queue",
			{
				"queueing_system": ("=", queue),
				"date_queued": ("=", date),
				"queue_status": ("=", "Serve")
			})
		
		if session_count >= max_session:
			frappe.throw(f"Currently serving {max_session} people. Please close a transaction first before proceeding.")
		else:
			return max_session

@frappe.whitelist()
def update_counter(queue):
	queueing_system = frappe.get_doc("Queueing System", queue)

	if queueing_system:
		counter = queueing_system.queue_counter
		queueing_system.queue_counter = counter + 1
		queueing_system.save()
	else:
		frappe.throw("Cannot find Queueing System. Please try or update your system.")
	
	return queueing_system.queue_counter

@frappe.whitelist()
def on_change(docname, status):
	doc = frappe.get_doc("Queue", docname)

	if doc.queue_status == status:
		frappe.throw(f"Appointment already {status}")
	else:
		doc.queue_status = status
		doc.save()
	return doc.queue_status

@frappe.whitelist()
def validate_schedule():
	days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
	configurable_date = datetime.now()
	date = getdate(configurable_date)
	day_check = date.weekday()
	time = get_time(configurable_date)

	configurable_time = time.strftime("%H:%M:%S")

	return days[day_check], configurable_time