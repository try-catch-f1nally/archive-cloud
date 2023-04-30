const config = {
  mongodb: {
    url: `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT || 27017}`,
    databaseName: 'storage-api'
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  moduleSystem: 'commonjs',
  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false
};

module.exports = config;
