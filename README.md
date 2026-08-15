# Netflix Transcript Collector

Chrome Manifest V3 extension that captures Netflix subtitle responses, parses TTML captions, and presents them as a timestamped transcript that can seek the active video.

The project started as an experiment in browser extension APIs and evolved into a working transcript-navigation tool. The main engineering problems are request filtering, TTML parsing, state coordination between the service worker and popup, and translating subtitle timestamps into video seek operations.

> This is an independent portfolio project and is not affiliated with or endorsed by Netflix. Netflix implementation details can change without notice, so compatibility may break over time.

## What it does

- observes relevant subtitle/network requests while a Netflix title is playing;
- parses TTML subtitle data into timestamped transcript entries;
- displays the transcript in the extension UI;
- allows a transcript line to seek the current video position;
- stores extension settings locally;
- provides theme customization for the transcript interface.

## Architecture

```text
Netflix page / subtitle requests
            |
            v
Chrome webRequest API
            |
            v
background.js
request filtering and captured-resource coordination
            |
            v
popup.js
TTML parsing, transcript state, UI logic
            |
            v
popup.html
interactive transcript and settings
```

The extension is implemented as a small Manifest V3 codebase rather than a framework application.

## Files

```text
.
├── manifest.json    extension metadata and permissions
├── background.js   service worker and request monitoring
├── popup.js        transcript parsing and application logic
├── popup.html      extension interface
├── LICENSE
└── README.md
```

## Installation

1. Clone this repository.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the repository directory.
5. Open the extension while playing a Netflix title with subtitles available.

## Technical notes

### TTML parsing

Netflix subtitle resources can be represented as TTML. The extension converts timed `<p>` entries into a simpler transcript representation containing text and start/end timing information, which is then used by the UI for navigation.

### Browser permissions

The current manifest requests `webRequest`, `downloads`, `storage`, `activeTab`, `tabs`, and `scripting`, with broad host access. Those permissions reflect the experimentation history of the project and should be reviewed/minimized before any public-store distribution.

### Compatibility

The project interacts with a third-party streaming application whose network behavior and client APIs are outside this repository's control. A change on Netflix's side can require updates to request detection or video-control integration.

## Screenshots

![Transcript viewer](https://github.com/user-attachments/assets/63948a2c-d306-43d0-a297-b6e7845fa766)

![Extension dashboard](https://github.com/user-attachments/assets/35db5eee-907e-4a19-b662-e1c654fd51d8)

## Engineering lessons

This project was useful for learning how browser extensions differ from conventional web applications: long-lived page state cannot be assumed, service workers have a different lifecycle, cross-context messaging matters, and third-party application internals need defensive handling.

For a future release, I would reduce host permissions, split the large popup logic into modules, add parser tests with synthetic TTML fixtures, and isolate platform-specific integration behind a smaller adapter layer.

## Author

Muhammad Haikal Rahman  
[GitHub](https://github.com/HaikalE) · [Portfolio](https://haikale.github.io) · [LinkedIn](https://www.linkedin.com/in/muhammad-haikal-rahman)
