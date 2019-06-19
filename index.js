var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var jsonfile   = require('jsonfile');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;
var mainRouter = express.Router();
const jsonPath = __dirname + '/jsons/'

/* Build lists */
var file = jsonfile.readFileSync(jsonPath + 'pokemon.json')
var pokemons = file["pokemon"]
var moves = file["move"]
var items = file["item"]

/* POKEMON */

mainRouter.get("/pokemon/favorite", function (req, res) {
    res.json(pokemons.filter(poke => poke.favorite))
})

mainRouter.get("/pokemon/:id?", function (req, res) {
    var id = parseInt(req.params.id)
    var result = id ? pokemons.find(poke => poke.id === id) : pokemons
    res.json(result || pokemons)
})

mainRouter.post("/pokemon/:id", function (req, res) {
    var id = parseInt(req.params.id)
    var body = req.body
    saveFavorite(id, body, res, true)
})

mainRouter.put("/pokemon/:id", function (req, res) {
    var id = parseInt(req.params.id)
    var body = req.body
    saveFavorite(id, body, res)
})

/* MOVE */

mainRouter.get("/move/:name?", function (req, res) {
    var name = req.params.name
    var result = name ? moves.find(move => move.name === name) : moves
    res.json(result || moves)
})

/* ITEM */

mainRouter.get("/item/:name?", function (req, res) {
    var name = req.params.name
    var result = name ? items.find(item => item.name === name) : items
    res.json(result || items)
})

/******* CONFIGS *******/

mainRouter.get('*', function (req, res) {
    console.log("URL FALLBACK")
    errorCall(res, 'default')
});

app.use('/api', mainRouter);

var server = app.listen(port, function () {
    var port = server.address().port
    console.log("Listening at %s", port)
})

/******* FUNCTIONS *******/

var saveFavorite = function(id, pokemon, res, insert) {
    var foundIndex = pokemons.findIndex(x => x.id == id)

    if (foundIndex != -1) {
        pokemons[foundIndex] = { ...pokemons[foundIndex], ...pokemon }
    } else if (insert) {
        pokemons.push(pokemon)
        foundIndex = pokemons.findIndex(x => x.id == id)
    }

    var poke = pokemons[foundIndex]

    poke ? res.json(poke) : errorCall(res, "pokemon")
}

var errorCall = function(res, errorName) {
    jsonfile.readFile(jsonPath + 'error.json', function (err, obj) {
        if (err) {
            res.json(err)
            return
        }

        res.status(400)
        res.json(obj[errorName] || obj["default"])
    })
}
