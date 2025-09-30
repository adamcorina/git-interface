# Git Interface

A desktop application for visualizing and managing Git repositories, built with Electron and React.

## Features

- Import and manage multiple Git repositories
- Browse branches and commit history
- Visualize branch activity and merges
- Responsive, modern UI

## Project Structure

```
.
├── public/                # Static files (HTML, manifest, robots.txt)
├── server/                # Electron main process and backend logic
│   ├── electron-starter.js
│   └── db/
├── src/                   # React frontend source code
│   ├── actions/           # Redux actions
│   ├── components/        # UI components
│   ├── reducers/          # Redux reducers
│   ├── routes/            # App routes (pages)
│   └── service/           # IPC service for Electron communication
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Electron](https://www.electronjs.org/)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd git-interface
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

For development (with hot reload):

```sh
npm run dev
```

This will start both the React development server and Electron.

To build for production:

```sh
npm run build
```

Then start Electron:

```sh
npm start
```

## Usage

- On launch, select or import a Git repository.
- Browse branches and view commit history.
- Visualize branch merges and activity.

## Technologies Used

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [simple-git](https://github.com/steveukx/git-js)

## License