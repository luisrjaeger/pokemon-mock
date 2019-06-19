var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var jsonfile   = require('jsonfile');
var path       = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;
var mainRouter = express.Router();
//var pokemonRouter = express.Router();
const jsonPath = __dirname + '/jsons/'

/* Build product list */
var pokemons = jsonfile.readFileSync(jsonPath + 'pokemon.json')["pokemon"]
var moves = jsonfile.readFileSync(jsonPath + 'pokemon.json')["move"]
var items = jsonfile.readFileSync(jsonPath + 'pokemon.json')["item"]

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

mainRouter.get("/move/:name?", function (req, res) {
    var name = req.params.name
    var result = name ? moves.find(move => move.name === name) : moves
    res.json(result || moves)
})

mainRouter.get("/item/:name?", function (req, res) {
    var name = req.params.name
    var result = name ? items.find(item => item.name === name) : items
    res.json(result || items)
})

/******* CONFIGS *******/

//mainRouter.use('/pokemon', pokemonRouter)

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
    pokemons[foundIndex] = { ...pokemons[foundIndex], ...pokemon }

    if (insert && foundIndex == -1) {
        pokemons.push(pokemon)
        foundIndex = pokemons.findIndex(x => x.id == id)
    }

    res.json(pokemons[foundIndex])
}

var getJsonObject = function(apiName, queryString, response, callback) {
    jsonfile.readFile(jsonPath + apiName + '.json', function (err, obj) {
        if (err) {
            response.json(err)
            return
        }

        var item = obj[queryString]

        if (item) {
            if (callback) {
                callback(item)
                return
            }

            response.json(item)
            return
        }

        errorCall(response, apiName)
    })
}

var errorCall = function(res, errorName) {
    jsonfile.readFile(jsonPath + 'error.json', function (err, obj) {
        if (err) {
            res.json(err)
            return
        }

        res.status(500)
        res.json(obj[errorName] || obj["default"])
    })
}

var buildResponse = function(success, data) {
    return {
        success: success,
        data: data
    }
}

var parseJson = function(str) {
    var result = ''

    try {
        result = JSON.parse(str)
    } catch(error) { }

    return result
}
