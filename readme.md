rozkvitay-backend

# Description

This is the rozkvitay-backend repository, which contains the server-side of the
"Rozkvitay" project.

# Installation

Before using the project, make sure you have Node.js and npm installed.

# Environment Variables

Make sure to set up the following environment variables before running the
server:

PORT: The port on which the server will listen for incoming requests.
PUBLIC_KEY: The public key for Liqpay integration. PRIVATE_KEY: The private key
for Liqpay integration. SENDGRID_API_KEY: The API key for SendGrid to send
emails. SENDGRID_EMAIL_FROM: The email address from which the server will send
emails.

# Dependencies

The project has the following dependencies:

express - version 4.17.1 morgan - version 1.10.0 cors - version 2.8.5
@sendgrid/mail - version ^7.7.0 base-64 - version ^1.0.0 cross-env - version
7.0.3 crypto - version ^1.0.1 dotenv - version ^16.0.3 jimp - version ^0.22.7
joi - version ^17.9.1 jsonwebtoken - version ^9.0.0 moment - version ^2.29.4
moment-timezone - version ^0.5.43 nanoid - version ^3.3.4 request - version
^2.88.2 sha1 - version ^1.1.1 utf8 - version ^3.0.0

# Routes

The project has the following routes:

/init - Initializes the server on Render. /keys - Retrieves payment data and
returns an encrypted link string to Liqpay. /status - Checks the payment status
from LiqPay and sends an email with the payment status.
