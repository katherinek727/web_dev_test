# Responsive Landing Page - Tech Conference 2024

A fully responsive landing page built with HTML, CSS, and pure JavaScript following Pixel Perfect principles.

## Features

### ✅ Responsive Design
- Mobile-first approach
- No horizontal scrolling on any device
- No text overlapping or moving off screen
- Single codebase for all screen sizes (no duplicate content)

### ✅ Required Components
1. **Running Line** - Animated ticker with conference information
2. **Anchor Navigation** - Smooth scrolling to sections
3. **Speakers Carousel** - Looped, auto-changes every 4 seconds
4. **Schedule Carousel** - Non-looped, manual navigation only
5. **Responsive Layout** - Adapts to all screen sizes

### ✅ Technical Implementation
- Pure HTML5, CSS3, and Vanilla JavaScript
- No external libraries or frameworks
- CSS Grid and Flexbox for layout
- CSS animations and transitions
- Touch/swipe support for mobile
- Accessible navigation

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # All styling with responsive design
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## How to Use

1. Open `index.html` in any modern web browser
2. The page will automatically adapt to your screen size
3. Use navigation to scroll to different sections
4. Interact with carousels using buttons or touch/swipe

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome for Android)

## Performance

- No external dependencies
- Optimized images (placeholders)
- Efficient JavaScript with event delegation
- CSS animations using GPU acceleration

## Design Principles

1. **Pixel Perfect** - Precise spacing and alignment
2. **Mobile First** - Base styles for mobile, enhancements for desktop
3. **Progressive Enhancement** - Core functionality works everywhere
4. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation

## Customization

To customize the content:
1. Update speaker data in `script.js` (lines 10-50)
2. Modify schedule items in `script.js` (lines 53-85)
3. Change colors in `styles.css` root variables
4. Update text content in `index.html`

## License

This project is created for demonstration purposes.