const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {

    // const token = req.session.token;
    const authHeader = req.headers.authorization;
    console.log('auth header', authHeader);

    if(!authHeader) {
        // res.status(401).send({ message: 'Unauthorized'});
        console.log('no token provided');
        res.redirect('/signin.html');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    //verify with secret key. if wrong wont be decoded
    jwt.verify( token, process.env.JWT_SECRET, (err, decoded) => {  
        if(err) {
            // res.status(401).send({ message: 'Unauthorized'});
            console.log('invalid token');
            res.redirect('/signin.html');
        }

        console.log("token decoded", token);

        req.user = decoded;
        next();
        
    });

};


// default export
module.exports = authMiddleware;