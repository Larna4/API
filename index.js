const express = require('express')
const has = require('has-value');
const port = 3000
const app = express()
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

function getUserByName(uname){
    (resUser) = users.find(u => u.username == uname);
    return resUser;
}

function getNameByItemId(iid){
    (resItem) = items.find(i => i.id == iid);
    return resItem.sellersName;
}

passport.use(new BasicStrategy(
  function(username, password, done) {

    const user = getUserByName(username);
    if(user == undefined)
    {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match, note that the password here is in plaintext.
       DO NOT EVER STORE PASSWORDS in plaintexts */
    if(user.password !== password) 
    {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

app.use(express.json());

let users = [
    {
    	id: 1,
        username: "One",    
        password: "password1",
      	name: "John Doe",
      	dateOfBirth: "1990-05-20",
      	address: "Measurement Street 567",
      	city: "London",
      	country: "UK",
      	email: "john.doe@demo.com"
    },
    {
      	id: 2,
        username: "Two",    
        password: "password2",
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
		title: "Laptop",
		description: "This is my old laptop.",
		category: "IT",
		location: {
            country: "Finland",
            city: "Oulu"
        },
		image: "itemImage.img",
		askingPrice: 100,
		dateOfPosting: "2020/02/18",
		deliveryType: "Shipping",
		sellersName: "Alexandra Lahotte"
    },
    {
		id: 2,
		title: "Knife",
		description: "Good knife for cooking.",
		category: "Kitchen",
		location: {
            country: "UK",
            city: "London"
        },
		image: "itemImage.img",
		askingPrice: 20,
		dateOfPosting: "2020/02/26",
		deliveryType: "Shipping",
		sellersName: "John Doe"
	}
];

app.get('/', function (req, res) {
    res.send('Welcome !')
})

app.get('/users',passport.authenticate('basic', { session: false }),(req, res) => {
    if(req.user.id == 1){
        res.json(users);
    }
    else{
        return res.sendStatus(401);
    }
})

app.get('/items', (req, res) => {
    res.json(items);
})

app.get('/items/category/:category', (req, res) => {
    const resultItem = items.find(i => {
        if (i.category == req.params.category) {
            return 1;
        }
    });
    if(resultItem === undefined)
    {
        res.send('There is no items with this category.');
    }
    else
    {
        res.json(resultItem);
    }
})

app.get('/items/title/:title', (req, res) => {
    const resultItem = items.find(i => {
        if (i.title == req.params.title) {
            return 1;
        }
    });
    if(resultItem === undefined)
    {
        res.send('There is no items with this title.');
    }
    else
    {
        res.json(resultItem);
    }
})

app.get('/items/country/:country', (req, res) => {
    const resultItem = items.find(i => {
        if (i.location.country == req.params.country) {
            return 1;
        }
    });
    if(resultItem === undefined)
    {
        res.send('There is no items with this country.');
    }
    else
    {
        res.json(resultItem);
    }
})
  
app.get('/userinfo', passport.authenticate('basic', { session: false }), (req, res) => {

            res.json(req.user);

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

app.put('/item/:Itemid', passport.authenticate('basic', { session: false }), (req, res) => { 
    let UseritemName = getNameByItemId(req.params.Itemid);
    if(req.user.name == UseritemName)
    {
        if(req.body.title != undefined)
            items[req.params.Itemid].title = req.body.title;
        if(req.body.description != undefined)
            items[req.params.Itemid].description = req.body.description;
        if(req.body.category != undefined)
            items[req.params.Itemid].category = req.body.category;
        if(req.body.image != undefined)
            items[req.params.Itemid].image = req.body.image;
        if(req.body.askingPrice != undefined)
            items[req.params.Itemid].askingPrice = req.body.askingPrice;
        return res.status(201).json({
            message: 'Your item has been modified !',
            item: items[req.params.Itemid]
        }); 
    }
    else{
        res.send('You can just modify your items');
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
            "password": req.body.password,
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

app.post('/item',
    [
        validateJSONHeaders,
        validateNewItem
    ],
    passport.authenticate('basic', { session: false }), (req, res) => {
   
        let newItem = {
            "id": items.length + 1,
            "title": req.body.title,
            "description": req.body.description,
            "category": req.body.category,
            "location": {
                "country": req.user.country,
                "city": req.user.city
            },
            "image": req.body.image,
            "askingPrice": req.body.askingPrice,
            "dateOfPosting": new Date(),
            "deliveryType": "Shipping",
            "sellersName": req.user.name
        }
        items.push(newItem);

        return res.status(201).json(newItem);

});
  
function verifId(userId){
    let index;
    let res=-1;
    for(index=0; index<users.length; index++){
        if(users[index].id==userId)
            res = 1;
    }
    return res;
}

app.delete('/user/:id', passport.authenticate('basic', { session: false }), (req, res) => {
    if(req.user.id == req.params.id)
    {
        users = users.filter(user => user.id != req.params.id);
        items = items.filter(item => item.sellersName != req.user.name);
        res.sendStatus(200);
    }
    else{
        res.send('You cannot delete this user.');
    }
})

app.delete('/item/:id', passport.authenticate('basic', { session: false }),(req, res) => {
    let UseritemName = getNameByItemId(req.params.id);
    if(req.user.name == UseritemName)
    {
        items = items.filter(item => item.id != req.params.id);
        res.sendStatus(200);
    }
    else{
        res.send('You can just delete your items');
    }
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