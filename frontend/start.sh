#!/bin/bash
cd /var/www/elite/ecurie-gnak-diom/frontend
export PATH=/var/www/elite/.nvm/versions/node/v20.19.0/bin:/usr/bin:/bin
export NODE_ENV=production
export PORT=3006

/var/www/elite/.nvm/versions/node/v20.19.0/bin/npm run start