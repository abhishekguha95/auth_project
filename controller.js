const jwt = require("jsonwebtoken");

exports.first = (req, res) => {
    console.log('inside first')
  const { firstName, lastName } = req.body;
  const token = jwt.sign(
    { firstName: firstName, lastName: lastName },
    "secretkey",
    { expiresIn: 120 }
  );
  console.log('jwt: ',token)
  res.json({
    'jwt' : `${token}`
  })
};

exports.second = (req, res) => {
    console.log('inside second')
    res.json({
        'msg' : 'success',
        'firstName' : `${res.locals.firstName}`,
        'lastName' : `${res.locals.lastName}`
    })
}