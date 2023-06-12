<img
src="https://github.com/caiquetorres/course-platform/assets/56696506/96d85fa1-fbf9-4f16-897c-38aa12b313dd"
alt="Logo"
height="80"
/>

<a><img src="https://badgen.net/badge/rust/1.0.0/56D7CC?label=" alt="Rust" /></a>

<a><img src="https://badgen.net/badge/nodejs/18.12.1/blue" alt="Node" /></a>

# 🧐 Installation

Follow these steps to install and set up the application:

Clone the repository:

```sh
git clone "https://github.com/caiquetorres/course-platform.git"
```

Install the dependencies:

> You can use either Yarn or npm to install the project dependencies. Choose one of the following options:

Using Yarn:

```sh
yarn install
```

Using npm:

```sh
npm install
```

# 😎 Running the application

To get started, you'll need to set up your database. The Course Platform Backend is designed to work with Postgres, and it provides a convenient `docker-compose` file to create a simple local database for testing and debugging purposes.

Run the following command to start the database container:

```sh
docker compose up -d postgres
```

If you prefer to use an existing Postgres instance or a different database solution, you can update the database configuration in the .env file located in the project's root directory. Modify the relevant environment variables such as `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DATABASE` according to your database setup.

Make sure to save the changes in the .env file and restart the application for the new configuration to take effect.

Depending on your package manager preference, you can use either Yarn or npm to start the application. Choose one of the following options:

- Using Yarn:

```sh
yarn start
```

- Using npm:

```sh
npm start
```

The application will start running, and you should see log messages indicating that the server has started successfully.

Once the server is up and running, you can access the application through `http://localhost:3000`.
