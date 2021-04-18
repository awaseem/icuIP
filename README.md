# icuIP 👀

Simple service to check valid IPs using firehol level 1 & level 2 banlists

- [icuIP 👀](#icuip-)
- [Getting Started](#getting-started)
- [Tests](#tests)
- [Styling](#styling)

# Getting Started

There are two ways to run this applications, if you have docker with docker-compose you can run the following command:

```
docker-compose up
```

If you have Node 14 (or use nvm, `nvm install`) installed, then you can install all the dependencies and then run the start script like the following:

```
# Install all deps
npm install

# Start Application
npm start
```

# Tests

To run the tests, make sure all your dependencies are installed correctly and then run the test script:

```
npm run test
```

If you want to run tests is "watch" mode, were it listens to file changes and run tests on your behalf, use the following command:

```
npm run test:watch
```

# Styling

This project uses ESLint for linting and prettier for auto formatting. If you use VSCode a recommended set of extensions will be prompted, install them for the best developer experience!

To validate linting run the following command:

```
npm run lint
```

To validate styling run the following command:

```
npm run prettier:check
```

or have prettier rewrite your files on your behalf, run the following command:

```
npm run prettier
```
