# Contributing to Cat Facts App

First off, thank you for considering contributing to Cat Facts App! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your browser and OS version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Pull Requests

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Follow the coding style** (see below)
5. **Test your changes thoroughly**
6. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
7. **Push to the branch** (`git push origin feature/AmazingFeature`)
8. **Open a Pull Request**

## Development Setup
```bash
# Clone your fork
git clone https://github.com/VawnDyu/cat-facts-app.git

# Navigate to the directory
cd cat-facts-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Coding Style

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid using `any` type
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks or utilities
- Use proper prop types

### CSS

- Use the existing CSS structure in `App.css`
- Follow BEM naming convention when adding new classes
- Use CSS custom properties for theme values
- Ensure responsive design (mobile-first approach)

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Run `npm run lint` before committing

## Project Structure
```
src/
├── App.tsx          # Main component
├── App.css          # Styles
├── types.ts         # TypeScript interfaces
└── utils/           # Utility functions
    ├── theme.ts     # Theme configuration
    ├── storage.ts   # localStorage utilities
    └── export.ts    # Export functionality
```

## Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests

Examples:
```
feat: Add search functionality for saved facts
fix: Resolve dark mode toggle issue
docs: Update README with new features
style: Format code with Prettier
refactor: Extract rating component
test: Add tests for export functionality
```

## Testing

Before submitting a pull request:

1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Test on mobile devices
3. Test both light and dark modes
4. Test with localStorage disabled
5. Ensure no console errors

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🐱✨