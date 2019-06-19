# pokedex-mock

Sample of a very simple mock server in Node.js using a list of 151 pokemons.

## How to use it:

- You'll need to have at least Node.js 8.
- On project root run `npm start`

## It have these methods:

```
  GET    /pokemon/:id?
  POST   /pokemon/:id  <- It works as a PUT when u send a existing id
  PUT    /pokemon/:id
  GET    /pokemon/favorite
  GET    /move/:id?
  GET    /item/:id?
```
