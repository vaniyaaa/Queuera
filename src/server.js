const { PORT } = require('./config/env.js');
const app = require('./app.js');
const mongoose = require('mongoose');
const connectDB = require('./config/db.js');
const logger = require('./utils/logger.js');

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Queuera server running on port ${PORT}`);
    require('./queues/post.worker.js');
    console.log('Post worker initialized');
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await mongoose.disconnect();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await mongoose.disconnect();
    process.exit(0);
  });
})();
