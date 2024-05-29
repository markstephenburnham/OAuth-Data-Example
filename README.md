# NodeJS Project Setup on Macintosh

This guide will help you set up and run the project on a Macintosh.

## Prerequisites

- Node.js version 22.1.0

## Installation Steps

1. **Download and Install Node.js**

   Download Node.js version 22.1.0 from the official website:  
   [Node.js Download](https://nodejs.org/en/download)

2. **Clone the DSE Challenge Project**

   Open a terminal window and run the following command to clone the project:
   ```bash
   git clone https://github.com/markstephenburnham/dse.git
(If prompted to install developer tools to use git, please do so.)

Change directory to the cloned project:
   ```bash
   cd dse
Run the following command to install all necessary dependencies:

   ```bash
   npm install
Set the required environment variables by running the following commands:

   ```bash
   export C_CLIENT_ID=<your client id>
   export C_REDIRECT_URL=http://localhost:3000/auth
   export C_CLIENT_SECRET=<your client secret>
Run the following command to start the project:

   ```bash
   npm start
Point your browser to:
http://localhost:3000
