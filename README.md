# 🐱 Cat Facts App

A beautiful, minimalist web application to discover and save interesting cat facts. Built with React, TypeScript, and Vite.

![Cat Facts App Screenshot](./public/screenshot.png)

## ✨ Features

- 🎲 **Discover Random Facts** - Get random interesting facts about cats from the Cat Facts API
- ⭐ **Rate Facts** - Rate each fact from 1-5 stars based on how interesting you find it
- 💾 **Save Favorites** - Save your favorite cat facts locally for later reading
- 📄 **Export to Text** - Export all your saved facts as a formatted text file
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 💨 **Fast & Lightweight** - Built with Vite for lightning-fast performance
- 🎨 **Clean UI** - Minimalist design with smooth animations

## 🚀 Demo

[Live Demo](https://vawndyu.github.io/cat-facts-app)

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Lucide React** - Beautiful icons
- **Cat Facts API** - Source of cat facts
- **localStorage** - Client-side data persistence
- **CSS3** - Styling with modern features

## 📦 Installation

1. **Clone the repository:**
```bash
   git clone https://github.com/VawnDyu/cat-facts-app.git
   cd cat-facts-app
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Start the development server:**
```bash
   npm run dev
```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production
```bash
npm run build
```

The built files will be in the `dist` directory.

## 📤 Deploy to GitHub Pages

1. **Install gh-pages:**
```bash
   npm install --save-dev gh-pages
```

2. **Add to package.json:**
```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/cat-facts-app"
   }
```

3. **Deploy:**
```bash
   npm run deploy
```

## 📁 Project Structure
```
cat-facts-app/
├── src/
│   ├── App.tsx          # Main component
│   ├── App.css          # Styles
│   ├── types.ts         # TypeScript interfaces
│   └── utils/
│       ├── theme.ts     # Theme configuration
│       ├── storage.ts   # localStorage utilities
│       └── export.ts    # Export functionality
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Features in Detail

### Dark Mode
Toggle between light and dark themes with a single click. Your preference is saved locally.

### Rating System
Rate each fact from 1-5 stars. Your ratings are saved with each fact.

### Local Storage
All your saved facts and theme preference are stored in your browser's localStorage, so they persist across sessions.

### Export Functionality
Export all your saved facts as a nicely formatted text file with:
- Fact text
- Star ratings
- Date saved
- Total count

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cat Facts API](https://catfact.ninja/) - For providing the cat facts
- [Lucide Icons](https://lucide.dev/) - For the beautiful icons
- [Vite](https://vitejs.dev/) - For the amazing build tool

## 📧 Contact

Project Link: [https://github.com/VawnDyu/cat-facts-app](https://github.com/VawnDyu/cat-facts-app)

## 🐛 Known Issues

- None at the moment! Feel free to report issues on GitHub.

## 🔮 Future Enhancements

- [ ] Search functionality for saved facts
- [ ] Filter by rating
- [ ] Share facts on social media
- [ ] Multiple categories of facts
- [ ] Fact of the day notification

---

⭐ If you found this app inspiring, consider giving it a star!

Made with ❤️ and 🐱 by [VawnDyu](https://github.com/VawnDyu)