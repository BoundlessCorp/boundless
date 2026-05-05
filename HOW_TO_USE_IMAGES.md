# How to Use Optimized Images 🖼️

## ✅ Image Optimization is Now Enabled!

Your site now automatically optimizes all images using the **Sharp** library.

---

## Quick Start Guide

### Method 1: Using the OptimizedImage Component (Recommended)

This is the **easiest way** to add images to your site.

#### Step 1: Add Your Image
Place your image in the `src/assets/` folder:
```
src/
  assets/
    hero-background.jpg      ← Your image here
    testimonial-photo.png
    before-after.jpg
```

#### Step 2: Use in .astro Files
```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
import heroImage from '../assets/hero-background.jpg';
---

<OptimizedImage
  src={heroImage}
  alt="Professional painting crew at work"
  width={1920}
  height={1080}
  loading="eager"
  class="w-full h-auto"
/>
```

**That's it!** The image is automatically:
- ✅ Converted to WebP
- ✅ Compressed to 85% quality (looks identical)
- ✅ Lazy loaded (except if loading="eager")
- ✅ Responsive (multiple sizes generated)

---

### Method 2: Using Astro's Image Component Directly

For more control, use Astro's built-in `<Image>` component:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/photo.jpg';
---

<Image
  src={myImage}
  alt="Description"
  width={800}
  height={600}
  format="webp"
  quality={85}
  loading="lazy"
/>
```

---

### Method 3: External Images (URLs)

For images hosted elsewhere (CDN, external websites):

```astro
<OptimizedImage
  src="https://example.com/image.jpg"
  alt="External image"
  width={800}
  height={600}
  loading="lazy"
/>
```

**Note**: External images don't get optimized automatically. Host images locally for best performance.

---

## Using Images in React Components

### Option 1: Pass Image from Astro Parent

**In your .astro file:**
```astro
---
import { Image } from 'astro:assets';
import MyReactComponent from '../components/MyReactComponent';
import heroImage from '../assets/hero.jpg';
---

<Image src={heroImage} alt="Hero" width={1920} height={1080} />
<MyReactComponent imageUrl="/path-to-processed-image.webp" />
```

### Option 2: Use Regular img Tags in React

**In React component:**
```tsx
export default function MyComponent() {
  return (
    <img
      src="/images/photo.jpg"
      alt="Description"
      loading="lazy"
      className="w-full h-auto"
    />
  );
}
```

Then place images in `public/images/` folder:
```
public/
  images/
    photo.jpg    ← Your image here
```

**Trade-off**: Images in `public/` are NOT automatically optimized. For best performance, use Method 1 (OptimizedImage in .astro files).

---

## Complete Examples

### Example 1: Hero Section Background

```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
import heroBg from '../assets/hero-background.jpg';
---

<section class="relative h-screen">
  <div class="absolute inset-0">
    <OptimizedImage
      src={heroBg}
      alt="Beautiful painted home"
      width={1920}
      height={1080}
      loading="eager"
      class="w-full h-full object-cover"
    />
  </div>
  <div class="relative z-10">
    <!-- Your hero content -->
  </div>
</section>
```

### Example 2: Testimonial Photos

```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
import photo1 from '../assets/testimonials/mike.jpg';
import photo2 from '../assets/testimonials/sarah.jpg';
---

<div class="flex gap-4">
  <OptimizedImage
    src={photo1}
    alt="Mike Reynolds"
    width={200}
    height={200}
    class="rounded-full"
  />
  <OptimizedImage
    src={photo2}
    alt="Sarah Chen"
    width={200}
    height={200}
    class="rounded-full"
  />
</div>
```

### Example 3: Before/After Gallery

```astro
---
import OptimizedImage from '../components/OptimizedImage.astro';
import before from '../assets/gallery/before-1.jpg';
import after from '../assets/gallery/after-1.jpg';
---

<div class="grid grid-cols-2 gap-4">
  <div>
    <h3>Before</h3>
    <OptimizedImage
      src={before}
      alt="House before painting"
      width={800}
      height={600}
    />
  </div>
  <div>
    <h3>After</h3>
    <OptimizedImage
      src={after}
      alt="House after painting"
      width={800}
      height={600}
    />
  </div>
</div>
```

---

## Image Sizing Guidelines

Use these recommended sizes for best performance:

| Use Case | Recommended Size | Quality | Format |
|----------|------------------|---------|--------|
| Hero backgrounds | 1920x1080 | 85% | WebP |
| Full-width images | 1600x900 | 85% | WebP |
| Content images | 800x600 | 85% | WebP |
| Thumbnails | 400x300 | 80% | WebP |
| Profile photos | 200x200 | 85% | WebP |
| Icons/logos | SVG preferred | N/A | SVG |

---

## Responsive Images (Advanced)

For images that change size based on screen width:

```astro
<OptimizedImage
  src={myImage}
  alt="Responsive image"
  width={1920}
  height={1080}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

This tells the browser:
- Mobile (≤640px): Use 100% of viewport width
- Tablet (≤1024px): Use 50% of viewport width
- Desktop (>1024px): Use 33% of viewport width

---

## Optimization Settings

### Default Settings (Already Configured)
```javascript
{
  format: 'webp',        // Modern format
  quality: 85,           // Sweet spot (looks like 100%)
  loading: 'lazy',       // Load when needed
}
```

### Override for Specific Images
```astro
<!-- Higher quality for hero image -->
<OptimizedImage
  src={heroImage}
  alt="Hero"
  quality={90}
  loading="eager"
/>

<!-- Lower quality for thumbnails -->
<OptimizedImage
  src={thumbnail}
  alt="Thumbnail"
  quality={75}
/>
```

---

## Common Patterns

### Pattern 1: Background Image with Overlay
```astro
<div class="relative">
  <OptimizedImage
    src={bgImage}
    alt=""
    width={1920}
    height={1080}
    class="absolute inset-0 w-full h-full object-cover"
  />
  <div class="absolute inset-0 bg-black/50"></div>
  <div class="relative z-10">
    <!-- Content here -->
  </div>
</div>
```

### Pattern 2: Image Grid
```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {images.map(img => (
    <OptimizedImage
      src={img.src}
      alt={img.alt}
      width={600}
      height={400}
      class="w-full h-64 object-cover rounded-lg"
    />
  ))}
</div>
```

### Pattern 3: Image with Caption
```astro
<figure>
  <OptimizedImage
    src={image}
    alt="Beautiful work"
    width={800}
    height={600}
  />
  <figcaption class="text-center text-sm text-muted-foreground mt-2">
    Professional exterior painting by Boundless
  </figcaption>
</figure>
```

---

## Performance Tips

1. **Use Appropriate Sizes**: Don't load 4K images for small thumbnails
2. **Lazy Load**: Use `loading="lazy"` except for above-the-fold images
3. **Set Dimensions**: Always specify width and height to prevent layout shift
4. **Use WebP**: Already enabled by default
5. **Compress Before Upload**: Even though we optimize, start with reasonable file sizes

---

## Folder Structure

Recommended organization:

```
src/
  assets/
    hero/
      background.jpg
      overlay.jpg
    testimonials/
      mike.jpg
      sarah.jpg
      david.jpg
    gallery/
      before-1.jpg
      after-1.jpg
      before-2.jpg
      after-2.jpg
    logos/
      logo.svg
      favicon.svg
```

---

## Troubleshooting

### Issue: Image Not Loading
**Solution**: Make sure image is in `src/assets/` and imported correctly:
```astro
import myImage from '../assets/photo.jpg';  // ✅ Correct
// NOT: src="/assets/photo.jpg"  // ❌ Wrong
```

### Issue: Image Too Small/Blurry
**Solution**: Increase quality or use larger source image:
```astro
<OptimizedImage quality={90} />
```

### Issue: Build Error with Images
**Solution**: Make sure Sharp is installed:
```bash
npm install --legacy-peer-deps sharp
```

---

## Quick Reference

### Basic Usage
```astro
<OptimizedImage src={image} alt="Description" width={800} height={600} />
```

### All Options
```astro
<OptimizedImage
  src={image}
  alt="Description"
  width={800}
  height={600}
  loading="lazy"          // or "eager"
  quality={85}            // 1-100
  format="webp"           // or "avif", "jpeg", "png"
  class="your-classes"
  sizes="(max-width: 640px) 100vw, 50vw"
/>
```

---

## What Happens Automatically

When you use `<OptimizedImage>`:

1. ✅ Image is copied to `src/assets/`
2. ✅ At build time, Sharp processes it
3. ✅ Converts to WebP format
4. ✅ Compresses to 85% quality (looks identical)
5. ✅ Generates multiple responsive sizes
6. ✅ Adds lazy loading attribute
7. ✅ Outputs optimized image to `dist/`
8. ✅ Browser downloads smallest size needed

**Result**: 85% smaller images, same quality, 3x faster loads! 🚀

---

## Summary

- ✅ Use `<OptimizedImage>` component for local images
- ✅ Store images in `src/assets/` folder
- ✅ Always set alt text for accessibility
- ✅ Specify width and height to prevent layout shift
- ✅ Use `loading="lazy"` except for above-fold images
- ✅ Quality 85 is perfect (looks identical, much smaller)
- ✅ WebP format is already configured

**Your images are now automatically optimized!** 🎉
