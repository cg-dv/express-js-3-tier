# Express JS Site

This repository is home to a simple app built with the Express JS Node JS framework.  The Express JS app really is just a skeleton / dummy app used for the purpose of building infrastructure with Terraform / AWS to test an architecture.

This app sets up an AWS client via the AWS SDK, fetches a secret stored in AWS Secrets Manager (encrypted secret contains database hostname, database name, and login credentials), establishes a connection with the database using these credentials, and queries the database for all records in the database.  The response is a JSON object containing the database records.

Terraform config demonstrating use of this app located in [this repository](https://github.com/cg-dv/exp-3-tier-tf)
