# Hacker Menu

[Hacker Menu](https://hackermenu.io/) stays on your menu bar and delivers the top news stories from [Y Combinator news aggregator](https://news.ycombinator.com/),
built with love by [@jingweno](https://github.com/jingweno) & [@lokywin](https://github.com/lokywin). It's powered by [Electron](http://electron.atom.io/) and [Node.js](https://nodejs.org).

Website: [https://hackermenu.io](https://hackermenu.io).

Screenshot:
![Hacker Menu Screenshot](images/screenshot.png)
## Installation

Download the latest build for your platform from [releases](https://github.com/jingweno/hacker-menu/releases). We only have OSX build now, and we're working Windows and Linux builds. Feel free to contribute if you can't wait :heart:.

## Development

You need to have the latest [io.js](https://iojs.org) or [node.js](https://nodejs.org/) installed.

```bash
$ npm install # installs dependencies
$ npm start # starts the app in the electron wrapper
```

Other useful tasks:

```bash
$ npm test # runs tests
$ npm run watch # watches and rebuilds assets
$ npm run release # builds and packages the Mac app
```

## Known Issues
- Large filesize. Unfortunately, there is not much we can do about this. At the core, the app is small, because it is written in JS, HTML and CSS. We use Eletron wrapper which cause the large filesize.

## Upcoming Features and Improvements

#### 1. Upcoming Features
- Add ability to mark a news item as **not interested**, and it will not be shown on the list.
- Remember the menu dimension after resizing.
- Add ranking. As the poster, I find myself looking for ranking of a news item.

#### 2. Upcoming Improvements

## License

See [LICENSE](https://github.com/jingweno/hacker-menu/blob/master/LICENSE).
