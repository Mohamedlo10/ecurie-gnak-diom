// chatSessionMiddleware.js
export const chatSessionMiddleware = (req, res, next) => {
    if (!req.session.chatContext) {
      req.session.chatContext = [];
    }
    next();
  };
  