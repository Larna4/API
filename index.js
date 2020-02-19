const express = require('express')
const has = require('has-value');
const app = express()
const port = 3000

app.use(express.json());

let users = [
    {
    	id: 1,
      	username: "One",    
      	name: "John Doe",
      	dateOfBirth: "1990-05-20",
      	address: "Measurement Street 567",
      	city: "London",
      	country: "uk",
      	email: "john.doe@demo.com"
    },
    {
      	id: 2,
      	username: "Two",    
      	name: "Alexandra Lahotte",
      	dateOfBirth: "1995-03-28",
      	address: "Pouppi Street 411",
      	city: "Oulu",
      	country: "Finland",
      	email: "alexandra.lahotte@demo.com"
    }
];

let items = [
	{
		id: 1,
		title: "Test",
		description: "Test test test",
		category: "Test",
		location: "Test, test",
		image: "test.img",
		askingPrice: 10,
		dateOfPosting: "2020/02/18",
		deliveryType: "Shipping",
		sellersName: "Alexandra"
	}
];

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/users', (req, res) => {
    res.json(users);
  })
  
app.get('/users/:userId', (req, res) => {
    const resultUser = users.find(i => {
        if (i.id == req.params.userId) {
            return 1;
        }
    });
    if(resultUser === undefined)
    {
        res.send('User not found.')
    }
    else
    {
        res.json(resultUser);
    }
})

app.get('/items/:itemId', (req, res) => {
    const resultItem = items.find(i => {
        if (i.id == req.params.itemId) {
            return 1;
        }
    });
    if(resultItem === undefined)
    {
        res.send('Item not found.')
    }
    else
    {
        res.json(resultItem);
    }
})

app.post('/user',
    [
      validateJSONHeaders,
      validateNewUser
    ],
    (req, res) => {
        let newUser = {
            "id": users.length + 1,
            "username": req.body.username,
            "name": req.body.name,
            "dateOfBirth": req.body.dateOfBirth,
            "address": req.body.address,
            "city": req.body.city,
            "country": req.body.country,
            "email": req.body.email
        }
        users.push(newUser);

        return res.status(201).json(newUser);
});

app.post('/item', function (req, res) {
    res.send('Got a POST request')
})
  
app.put('/user', function (req, res) {  
    res.send('Got a PUT request at /user')
})
  
app.delete('/user/:id', (req, res) => {
    users = users.filter(user => user.id != req.params.id);
    res.sendStatus(200);
})

function validateJSONHeaders(req, res, next)
{
    if(req.get('Content-Type') === 'application/json')
    {
        next();
    }
    else
    {
        const err = new Error('Bad Request - Missing Headers');
        err.status = 400;
        next(err);
    }
}

function validateNewItem(req, res, next) {
    // prepare error object
    const err = new Error();
    err.name = "Bad Request";
    err.status = 400;
    if(has(req.body, 'title') == false)
    {
        err.message = "Missing or empty title";
        next(err);
    }
    if(has(req.body, 'location') == false)
    {
        err.message = "Missing or empty location";
        next(err);
    }
    if(has(req.body, 'image') == false)
    {
        err.message = "Missing or empty image, you need to put at least one image";
        next(err);
    }
    if(has(req.body, 'askingPrice') == false)
    {
        err.message = "Missing or empty asking price";
        next(err);
    }
    next(); // no validation errors, so pass to the next
}

function validateNewUser(req, res, next) {
    // prepare error object
    const err = new Error();
    err.name = "Bad Request";
    err.status = 400;
    if(has(req.body, 'username') == undefined){
        err.message = "Missing or empty username";
        next(err);
    }
    if(has(req.body, 'name') == undefined){
        err.message = "Missing or empty name";
        next(err);
    }
    if(has(req.body, 'dateOfBirth') == undefined){
        err.message = "Missing or empty date of birth";
        next(err);
    }
    if(has(req.body, 'address') == undefined){
        err.message = "Missing or empty address";
        next(err);
    }
    if(has(req.body, 'city') == undefined){
        err.message = "Missing or empty city";
        next(err);
    }
    if(has(req.body, 'country') == undefined){
        err.message = "Missing or empty country";
        next(err);
    }
    if(has(req.body, 'email') == undefined){
        err.message = "Missing or empty email";
        next(err);
    }
    next(); // no validation errors, so pass to the next
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))