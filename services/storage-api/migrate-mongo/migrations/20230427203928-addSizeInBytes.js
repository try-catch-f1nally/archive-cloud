const path = require('node:path');
const fs = require('node:fs/promises');

module.exports = {
  async up(db) {
    const collection = db.collection('archives');
    const documents = await collection.find().toArray();
    for (const document of documents) {
      const archivePath = path.join('archives', document.userId, document.name);
      const sizeInBytes = (await fs.stat(archivePath)).size;
      await collection.updateOne({id: document.id}, {$set: {sizeInBytes}});
    }
  },

  async down(db) {
    await db.collection('archives').updateMany({}, {$unset: {sizeInBytes: ''}});
  }
};
