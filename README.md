# JSONer

JSONer is a minimalist JSON beautifier built with Next.js and React. It helps to format the input JSON and beautify it to display in a more readable way.

Try it now at https://jsoner.app/

## Features

- ✅ JSON beautification and formatting
- ✅ Ruby hash syntax support (hash rocket `=>` and symbol shorthand)
- ✅ Copy formatted JSON to clipboard
- ✅ Real-time error highlighting
- ✅ Partial JSON parsing with intelligent error recovery
- ✅ Dark theme optimized for readability

## Preview

<img width="1437" alt="JSONer Preview" src="https://user-images.githubusercontent.com/40559684/137627912-f2cdbe4f-5c18-4856-b4ef-652ec763c417.png">

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Static Export

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production
npm run build

# serve production build locally
npm run start
```

## Project Structure

```
jsoner/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── nodes/            # JSON node rendering components
│   ├── App.tsx           # Main application component
│   ├── Coffee.tsx        # Buy me a coffee button
│   ├── CopyButton.tsx    # Copy to clipboard functionality
│   ├── ErrorUnderline.tsx # Error highlighting
│   └── Analytics.tsx     # Google Analytics
├── utils/                # Utility functions
│   ├── partialJsonParser.ts  # JSON parser with error recovery
│   └── rubyHashParser.ts     # Ruby hash to JSON converter
└── public/               # Static assets
```

## Key Components

### JSON Parser
The application uses a sophisticated partial JSON parser that can:
- Parse incomplete JSON gracefully
- Detect and highlight syntax errors
- Auto-fix common issues like trailing commas
- Convert Ruby hash syntax to JSON

### Supported Formats
- Standard JSON
- Ruby Hash with hash rocket (`=>`)
- Ruby Hash with symbol shorthand (`:key`)

## Development

This project was migrated from Nuxt.js 2 to Next.js 14 to take advantage of:
- Modern React features and hooks
- Better TypeScript support
- Improved performance with App Router
- Static site generation capabilities

## License

MIT
