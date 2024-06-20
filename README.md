# NodeJS Project Setup for Macintosh

1. Download and install Node.js version 22.1.0: [Node.js Download](https://nodejs.org/en/download)

2. Open a terminal window and clone the DSE Challenge project:
   ```bash
   git clone https://github.com/markstephenburnham/dse.git
(If prompted to install developer tools to use git, please do so.)

Change directory into the dse directory:

bash
Copy code
cd dse
Run the following command to install the required packages:

bash
Copy code
npm install
Set the following environment variables:

bash
Copy code
export C_CLIENT_ID=<your finch clientid>
export C_REDIRECT_URL=http://localhost:3000/auth
export C_CLIENT_SECRET=<your client secret>
Start the application:

bash
Copy code
npm start
Point a browser to http://localhost:3000

css
Copy code

This Markdown text includes code blocks and links to provide a clear, formatted setup guide for your Node.js project.







