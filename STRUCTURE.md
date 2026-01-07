# Website Project Structure

## Folder Structure

```
/
├── index.html                    # Home page with hero carousel and content sections
├── taniltsuulga.html            # Танилцуулга (Introduction) page
├── udirdamj.html                # Удирдамж (Guidelines) page
├── bidnii_baharhal.html         # Бидний бахархал (Our Pride) page
├── medee_medeelel.html          # Мэдээ мэдээлэл (News & Information) page
├── surgalt.html                 # Уртын дууны сургалтууд (Training Programs) page
├── duugaa_sonsotsgooy.html      # Уртын дуугаа сонсоцгооё (Listen to Songs) page
├── uraldaan_bolzol.html         # Уралдаан болзол (Competitions) page
├── owlonteegchid.html           # Өвлөн тээгчид (Heritage Bearers) page
├── sudalgaanii_sedew.html       # Судалгааны сэдэв (Research Topics) page
├── holboo_barih.html            # Холбоо барих (Contact Us) page
├── styles.css                    # Main CSS file for all pages
├── script.js                     # JavaScript for carousel and navigation
├── assets/                       # Directory for assets
├── image/                        # Directory for images
└── README.md                     # Project documentation
```

## Menu Structure

### Main Navigation
- **Нүүр** (Home) - index.html
- **Танилцуулга** (Introduction) - taniltsuulga.html
- **Удирдамж** (Guidelines) - udirdamj.html
  - Уртын дууны сургалтууд - surgalt.html
  - Уртын дуугаа сонсоцгооё - duugaa_sonsotsgooy.html
  - Уралдаан болзол - uraldaan_bolzol.html
- **Бидний бахархал** (Our Pride) - bidnii_baharhal.html
  - Өвлөн тээгчид - owlonteegchid.html
  - Судалгааны сэдэв - sudalgaanii_sedew.html
  - Холбоо барих - holboo_barih.html
- **Мэдээ мэдээлэл** (News) - medee_medeelel.html

## Features

### All Pages Include:
1. **Header Section**
   - Contact information (phone and email)
   - Site logo/title
   - Navigation menu with dropdowns
   - Hamburger menu for mobile

2. **Main Content**
   - Page title and subtitle
   - Content cards with icons
   - Example content blocks
   - Image placeholders with comments

3. **Footer Section**
   - Contact information
   - Quick links
   - About section
   - Copyright notice

### Responsive Design
- Desktop: Full navigation menu, multi-column layouts
- Mobile: Hamburger menu, single-column layouts
- Breakpoint: 968px

### SEO Features
- Meta descriptions on all pages
- Meta keywords
- Semantic HTML5 elements
- Descriptive page titles

## HTML Structure

Each page follows this semantic structure:
```html
<header class="header">
  <nav class="navbar">...</nav>
</header>

<main>
  <section class="content-section">
    <div class="container">
      <div class="section-header">...</div>
      <div class="content-grid">
        <div class="content-card">...</div>
      </div>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="footer-content">...</div>
</footer>
```

## CSS Features

### Color Scheme
- Primary: #1e1e1e (dark gray)
- Secondary: #0088cc (blue)
- Accent: #f7941d (orange)
- Background: #f5f5f5 (light gray)

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Base Line Height: 1.6

### Components
- Header with sticky navigation
- Dropdown menus
- Content cards with hover effects
- Responsive footer
- Mobile hamburger menu

## JavaScript Functionality

### Carousel (index.html)
- Auto-slide every 10 seconds
- Manual navigation buttons
- Keyboard navigation (arrow keys)
- Pause on hover

### Navigation
- Hamburger menu toggle
- Dropdown menu handling
- Mobile-responsive behavior

## Adding Content

### Images
Replace placeholder comments with actual images:
```html
<!-- <img src="image/example.jpg" alt="Description" /> -->
```

### Text Content
Update the example content in each page's content-card sections with real information.

### Audio/Video
Add media files and update paths in duugaa_sonsotsgooy.html

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Font Awesome 6.4.0 for icons

## External Dependencies
- Font Awesome 6.4.0 (CDN)
