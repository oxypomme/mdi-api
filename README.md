# MDI API

Simple wrapper of [Material Design Icons](https://materialdesignicons.com/) with a few more options.

All responses from [Material Design Icons](https://materialdesignicons.com/) are cached for 7 days.

## Data type

All API endpoints returns the following type :

```ts
interface APIResult {
 total?: number, // Total items in collection
 count: number, // Total items shown
 offset?: number, // Total items skiped,
 data: Icon|Icon[]
}
```

One icon is defined by the following type :

```ts
interface Icon {
 id: string,
 name: string,
 aliases: string[],
 data: string, // The SVG data
 user: {
  id: string,
  name: string,
 },
 commentCount: number
}
```

## Query Options

- limit: The number of item displayed (25 by default)
- offset: The number of item to skip (0 by default)
- select: Comma separated fields that you want in response (all by default)
- search: Search for a specific word in icon's name or aliases
- type: `filled` or `outlined`. Something else will send back both

## Endpoints

- `/icons/`: Get all the icons (returns `Icon[]`). Supported options :
  - `limit`
  - `offset`
  - `select`
  - `search`
  - `type`
- `/icons/:id`: Get specific icon (returns `Icon`). Supported options :
  - `select`
