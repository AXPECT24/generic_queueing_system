# Copyright (c) 2024, dev_ash and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import get_time

class QueueingSystem(Document):
    pass
	# def before_save(self):
	# 	self.disp_time()

	# def disp_time(self):
	# 	schedule = self.get("schedule")
		
	# 	for item in schedule:
	# 		from_time = item.from_time
	# 		to_time = item.to_time

	# 		disp_time = from_time + " - " + to_time

	# 		item.disp_time = disp_time
