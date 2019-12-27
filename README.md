# Kosmos Builder Server

This is a simple API for the Kosmos Builder script to call to get the package information from GitHub and GitLab. All requests will cached for 1 hour to prevent spamming calls to either services. It also supports providing credentials to GitHub to increase the number of calls you can make.

## How to Run

Because this project is written in TypeScript the API needs to be built before running. If you just want to run it locally you can simple run:

```
npm run start
```

If you are looking to run this in a production environment then you can run the following command to build it:

```
npm run build
```

Once it's built the file you will want to run the `index.js` file in the `dist` folder.
