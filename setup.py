from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in generic_queueing_system/__init__.py
from generic_queueing_system import __version__ as version

setup(
	name="generic_queueing_system",
	version=version,
	description="Generic Queueing System",
	author="dev_ash",
	author_email="gqs.test@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
