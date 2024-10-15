const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    // const token = req.session.token;
    console.log("req header in JWT", req.headers);

    const authHeader = req.headers['authorization'];

    console.log("auth header", authHeader);

    if(!authHeader) {
        // res.status(401).send({ message: 'Unauthorized'});
        console.log('no token provided');
        return res.redirect('/signin.html');
    }

    const token = authHeader && authHeader.split(' ')[1];
    console.log('token', token);

    if (!token) {
        console.log("no token found");
        res.redirect('/signin.html');
        return res.status(401).json({ message: 'Token not found' });
    }

    console.log("JWT secret key" ,process.env.JWT_SECRET);

    // const decodedToken =  jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded token", decodedToken);
    // if(!decodedToken) {
    //     console.log('invalid token');
    //     return res.status(401).json({ message: 'Unauthorized' });
    // }

    // req.user = decodedToken;
    // next();



    // verify with secret key. if wrong wont be decoded
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {  
        if(err) {
            console.log('invalid token');
            res.status(401).send({ message: 'Unauthorized'});
            // res.redirect('/signin.html');
        }

        console.log("token decoded", token);

        req.user = decoded;
        next(); 
    });

};


// default export
module.exports = authMiddleware;