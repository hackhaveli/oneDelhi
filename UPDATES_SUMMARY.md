# HomeScreen Updates - Exact Replica

## ✅ Changes Made:

### 1. **Logo Centered in White**
- OneDelhi logo now centered in the header
- Applied white tint color to match design
- Settings icon positioned absolutely on the right

### 2. **Notification Bell Color**
- Changed to exact orange: `#FFA500`
- Increased size to 52x52 for better visibility
- Proper shadow and elevation

### 3. **Fixed Top/Bottom Cutting**
- Adjusted `paddingTop` to use `StatusBar.currentHeight + 15`
- Proper spacing to prevent content from being cut off
- Header height optimized

### 4. **Scrollable Nearby Stops**
- Added drag handle (gray bar at top)
- Implemented `Animated.View` for smooth scrolling
- Scroll animation: swipe up to expand, down to collapse
- Position: absolute at bottom for overlay effect

### 5. **Design Refinements**
- Border radius: 30px for smoother curves
- Map height: 52% of screen
- Nearby stops: 35% of screen height
- Proper elevation and shadows throughout
- Footer positioned absolutely at bottom

## 🎨 Color Scheme:
- Notification: `#FFA500` (Orange)
- Footer: `#c62828` (Red)
- Background: `#f5f5f5` (Light gray)
- Text: `#1a1a1a` (Dark)

## 📱 Layout:
```
┌─────────────────────────┐
│   Gradient Header       │
│   [Logo centered]   ⚙️  │
│   🔍 Search    🔔       │
└─────────────────────────┘
│                         │
│       Map View          │
│                         │
┌─────────────────────────┐
│   ─── (drag handle)     │
│   Nearby Stops          │
│   [Scrollable content]  │
└─────────────────────────┘
│ Powered by IIIT-Delhi   │
└─────────────────────────┘
```

## 🔄 To See Changes:
Press `r` in Expo terminal or shake device and tap "Reload"
