# Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ (for development server)
- Modern web browser
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/pavlenkotm/pavlenkotm.git
cd pavlenkotm
```

2. **Start the development server**
```bash
# Using Node.js
node server.js

# OR using npm
npm start
```

3. **Open in browser**
```
http://localhost:3000
```

### Alternative: Static File Server

If you don't have Node.js, you can use Python:

```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

Or use any other static file server like `live-server`, `http-server`, etc.

## 📁 Project Structure

```
pavlenkotm/
├── index.html              # Main portfolio page
├── 404.html               # Custom 404 page
├── server.js              # Development server
├── package.json           # Node.js configuration
├── assets/
│   ├── css/
│   │   └── style.css      # All styles and responsive design
│   ├── js/
│   │   └── main.js        # Interactive functionality
│   └── images/
│       └── projects/      # Project preview images
├── projects/              # Real project code
│   ├── solana-defi-optimizer/
│   ├── python-automation/
│   ├── rust-blockchain/
│   ├── web3-typescript-sdk/
│   └── docker-devops/
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
└── README.md             # Main README
```

## 🎨 Customization

### Changing Colors

Edit `assets/css/style.css` and modify the CSS variables:

```css
:root {
    --primary-color: #00d4ff;     /* Main accent color */
    --secondary-color: #ff00ff;   /* Secondary accent */
    --accent-color: #00ff88;      /* Highlight color */
    --bg-dark: #0a0a0f;          /* Dark background */
    --bg-card: #1a1a2e;          /* Card background */
}
```

### Adding New Projects

1. Add project image to `assets/images/projects/`
2. Update `index.html` in the projects section
3. Update CSS for the new project card:

```css
.project-card:nth-child(7) .project-image {
    background-image: url('../images/projects/your-project.svg');
}
```

### Modifying Content

- **Hero Section**: Edit `index.html` lines 39-106
- **About Section**: Edit `index.html` lines 108-163
- **Projects**: Edit `index.html` lines 165-360
- **Skills**: Edit `index.html` lines 362-503
- **Contact**: Edit `index.html` lines 505-559

## 🧪 Testing

### Manual Testing Checklist

- [ ] All sections load properly
- [ ] Navigation links work
- [ ] Typing animation displays correctly
- [ ] Counter animation triggers on scroll
- [ ] Project cards have hover effects
- [ ] Skill bars animate on scroll
- [ ] All links are functional
- [ ] Mobile menu opens/closes
- [ ] Responsive on mobile devices
- [ ] Images load correctly

### API Testing

Test the backend API endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Get projects
curl http://localhost:3000/api/projects

# Get stats
curl http://localhost:3000/api/stats

# Filter projects by tech
curl http://localhost:3000/api/projects?tech=rust
```

### Browser Testing

Test on multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

Test on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## 🐛 Common Issues & Solutions

### Issue: Styles not loading
**Solution**: Check that `assets/css/style.css` path is correct and file exists.

### Issue: Images not showing
**Solution**: Verify image paths in CSS and that files exist in `assets/images/projects/`.

### Issue: JavaScript not working
**Solution**: Check browser console for errors. Ensure `assets/js/main.js` is loaded.

### Issue: Server won't start
**Solution**:
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Use different port
PORT=8080 node server.js
```

## 📱 Mobile Responsiveness

The site is responsive with breakpoints at:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

Test responsive design:
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test different device sizes

## 🚀 Deployment

### GitHub Pages

1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Select "GitHub Actions" as source
4. Workflow will automatically deploy

### Custom Domain

1. Add CNAME file with your domain
2. Configure DNS records:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   ```
3. Wait for DNS propagation (up to 48 hours)

### Alternative Hosting

The site can be deployed to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop folder
- **AWS S3**: Static website hosting
- **Firebase Hosting**: `firebase deploy`

## 🔧 Performance Optimization

### Current Optimizations
- ✅ CSS minification ready
- ✅ Lazy loading for images
- ✅ Async animations
- ✅ Optimized SVG images
- ✅ CDN for external resources

### Additional Improvements
```bash
# Minify CSS
npx csso assets/css/style.css -o assets/css/style.min.css

# Minify JavaScript
npx terser assets/js/main.js -o assets/js/main.min.js -c -m
```

## 📊 Analytics (Optional)

Add Google Analytics:

1. Get tracking ID from Google Analytics
2. Add to `index.html` before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

MIT License - feel free to use this template for your own portfolio!

## 🆘 Support

- **Issues**: Open an issue on GitHub
- **Email**: pavlenko.tm.dev@gmail.com
- **Telegram**: @pavlenkotm

---

**Happy coding! 🚀**
