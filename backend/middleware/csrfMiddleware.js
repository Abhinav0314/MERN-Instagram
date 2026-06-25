const csrfMiddleware = (req, res, next) => {
    // Only check state-changing methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    
    if (safeMethods.includes(req.method)) {
        return next();
    }

    // Require the x-requested-with header for CSRF protection
    const requestedWith = req.headers['x-requested-with'];
    
    if (!requestedWith || requestedWith !== 'XMLHttpRequest') {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden: CSRF protection failed. Missing required custom header." 
        });
    }

    next();
};

module.exports = csrfMiddleware;
