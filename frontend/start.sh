#!/bin/bash
cd /var/www/elite/ecurie-gnak-diom/frontend
export PATH=/var/www/elite/.nvm/versions/node/v18.20.7/bin:/usr/bin:/bin
export NODE_ENV=production
export PORT=3000

/var/www/elite/.nvm/versions/node/v18.20.7/bin/npm run start