# NodeJS Project Setup for Macintosh

1. Download and install Node.js version 22.1.0: [Node.js Download](https://nodejs.org/en/download)

2. Open a terminal window and clone the DSE Challenge project:
   ```bash
   git clone https://github.com/markstephenburnham/OAuth-Data-Example
(If prompted to install developer tools to use git, please do so.)

3. Change directory into the dse directory:

   ```bash
   cd OAuth-Data-Example

4. Run the following command to install the required packages:

   ```bash
   npm install

5. Set the following environment variables:

   ```bash
   export C_CLIENT_ID=<your finch clientid>
   export C_REDIRECT_URL=http://localhost:3000/auth
   export C_CLIENT_SECRET=<your client secret>

6. Start the application:

   ```bash
   npm start

7. Point a browser to http://localhost:3000








