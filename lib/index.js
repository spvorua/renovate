#!/usr/bin/env node

const logger = require('./logger');
const config = require('./config');

// Require main source
const renovate = require('./renovate');

// Initialize our promise chain
let p = Promise.resolve();

// Get global config
const globalConfig = config.getGlobalConfig();

// Queue up each repo/package combination
globalConfig.repositories.forEach((repo) => {
  repo.packageFiles.forEach((packageFile) => {
    const cascadedConfig = config.getCascadedConfig(repo, packageFile);
    p = p.then(() => renovate(repo.repository, packageFile.fileName, cascadedConfig));
  });
});
p.then(() => { // eslint-disable-line promise/always-return
  logger.info('Renovate finished');
})
.catch((error) => {
  logger.error(`Unexpected error: ${error}`);
});