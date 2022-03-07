# Replit DB & Auth Integration

A global `replit` object is exposed, containing all functions you need for interacting with Replit Auth and DB.

## Database

### `replit.getData(key: string, default?: Data): Promise<Data | null>`

Get data from replit db, returns a `Promise` containing the data (`null` if key doesn't exists). Data is automatically `JSON.parsed()`-ed. Can optionally provide `default` to set the default value if the key doesn't exist.

### `replit.setData(key: string, val: Data): Promise<Data>`

Set data to replit db. Data is automatically `JSON.stringify()`-ed. Returns a `Promise` that resolves when the operation is complete.

### `replit.delData(key: string): Promise<void>`

Delete a key from database.

### `replit.listData(): Promise<string[]>`

Get all keys in database.

### `replit.clearData(): Promise<void>`

**BE CAREFUL** Nuke the database.

Database Example:

```js
// get current high score from DB
db.getData("highscore").then((highscore) => {

	// update highest score in DB if user just got a higer one
	if (score > highscore) {
		highscore = score;
		db.setData("highscore", highscore);
	}

	add([
		text("High score: " + highscore),
		pos(20, 20),
	]);

});
```


## Auth

### `replit.auth(): Promise<User | null>`

Opens a window that prompts user to log in and authenticate. Returns a Promise that contains the user data if successful.

### `replit.getUser(): Promise<User | null>`

Get the user without initiating an auth process. Returns a Promise of the user if they're already authed (has auth token in cookies), `null` if not.

### `replit.getUserOrAuth(): Promise<User | null>`

Like `getUser()`, but initiates an auth if auth doesn't exist.

a `User` looks like this:

```ts
User {
	id: string,
	name: string,
}
```

Auth Example:

```js
replit.getUserOrAuth().then((user) => {
	if (user) {
		// insert an entry to DB with the user name as key
		replit.setData(user.name, 0);
	}
});
```

Check out `helper.ts` and `run.js` to see how they work and tweak around.
