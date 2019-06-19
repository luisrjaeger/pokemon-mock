# pokedex-mock

Sample of a very simple mock server in Node.js using a list of 151 pokemons.

## How to use it:

- You'll need to have at least Node.js 8.
- On project root run `npm install` and `npm start` 
- It runs on `http://localhost:8081/api`

## It have these methods:

```
  GET    /pokemon/:id?
  POST   /pokemon/:id  <- It works as a PUT when u send an existing id
  PUT    /pokemon/:id
  GET    /pokemon/favorite
  GET    /move/:name?
  GET    /item/:name?
```

Changes made through API calls won't be persisted to json, after a server restart everything will come back to initial state.
