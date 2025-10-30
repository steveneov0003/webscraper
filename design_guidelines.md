# Design Guidelines: Bybit Copy Trade Monitor

## Design Approach: Dashboard-Focused System

**Selected Approach:** Modern data dashboard inspired by Linear's clean aesthetics and TradingView's information density, with principles from Material Design for data visualization.

**Key Design Principles:**
- Data clarity over decoration
- Instant readability of financial metrics
- Responsive grid system optimized for tabular data
- Clear visual hierarchy for trade status indicators
- Minimalist interface that doesn't compete with data

---

## Typography System

**Font Family:**
- Primary: Inter or DM Sans (via Google Fonts CDN)
- Monospace: JetBrains Mono for numerical data (prices, PnL, sizes)

**Type Scale:**
- Page Title: 2xl font weight 700
- Section Headers: xl font weight 600
- Table Headers: sm font weight 600 uppercase tracking-wide
- Data Values (Prices/Numbers): base font weight 500 (monospace)
- Trade Symbols: lg font weight 700
- Status Labels: xs font weight 600
- Filter Labels: sm font weight 500

**Typography Rules:**
- All numerical values use monospace font for alignment
- Trade symbols always bold for quick scanning
- Timestamp text in sm size, regular weight

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 8, 12, 16**
- Micro spacing: p-2, gap-2 (within cards, between inline elements)
- Component spacing: p-4, gap-4 (card padding, button spacing)
- Section spacing: p-8, gap-8 (between major sections)
- Container padding: px-4 md:px-8

**Grid Structure:**
- Main container: max-w-7xl mx-auto
- Dashboard layout: Single column stack on mobile, flexible grid on desktop
- Table: Full-width responsive with horizontal scroll on mobile
- Header: Sticky positioning with backdrop blur

---

## Component Library

### 1. Page Header
- Full-width sticky header with backdrop blur
- Left: App title + connection status indicator
- Right: Last update timestamp + manual refresh button
- Height: h-16
- Spacing: px-8, border-b with subtle divider

### 2. Stats Dashboard (Above Table)
- Grid layout: grid-cols-2 md:grid-cols-4 gap-4
- Each stat card: rounded-lg border p-4
- Structure: Label (xs uppercase) + Value (2xl font weight 700) + Change indicator
- Stats: Total Positions | Total PnL | Active Buys | Active Sells

### 3. Filter Bar
- Horizontal layout: flex justify-between items-center
- Search input: max-w-xs with leading icon (Heroicons magnifying glass)
- Filter chips: Inline flex gap-2, rounded-full px-4 py-2
- Spacing: p-4 mb-4

### 4. Data Table
- Structure: Sticky header with sorted columns
- Columns: Symbol | Type | Size | Entry Price | Current PnL | Leverage | Open Time
- Row height: Comfortable padding (py-4)
- Alternating row treatment for readability
- Hover state with subtle elevation
- Mobile: Stacked card layout (grid hidden, custom cards shown)

**Column Specifications:**
- Symbol: Font weight 700, larger text
- Type (Buy/Sell): Badge component, rounded-full px-3 py-1
- Size/Price: Monospace font, right-aligned
- PnL: Monospace font with directional indicator icon
- Leverage: Badge with subtle treatment
- Time: Muted text, sm size

### 5. Status Indicators
- Connection status: Dot indicator (w-2 h-2 rounded-full) + text label
- Loading state: Spinning icon (Heroicons arrow-path) + "Updating..." text
- Auto-refresh timer: Circular progress or countdown text
- Empty state: Centered message with illustration placeholder

### 6. Buttons
- Primary action (Refresh): px-4 py-2 rounded-lg font-medium
- Icon button: p-2 rounded-lg (for filters, actions)
- All buttons: Implement standard hover/active states with subtle scale/opacity changes

### 7. Cards (Mobile Trade View)
- Each trade as card: rounded-lg border p-4 space-y-3
- Symbol at top (text-lg font-bold)
- Data rows: flex justify-between for label-value pairs
- PnL prominent with larger text and indicator

### 8. Loading States
- Initial load: Skeleton screens with pulse animation for table rows
- Refresh: Subtle loading indicator in header, table remains visible
- Failed state: Alert banner with retry button

---

## Responsive Behavior

**Breakpoints:**
- Mobile (base): Stacked cards, simplified filters
- Tablet (md): Table view starts, 2-column stats
- Desktop (lg): Full table, 4-column stats, all features visible

**Mobile Optimizations:**
- Hide less critical columns (collapse to card view)
- Sticky filters at top
- Larger touch targets (min h-12 for buttons)
- Stats grid: 2 columns instead of 4

---

## Icons & Assets

**Icon Library:** Heroicons (outline style via CDN)

**Required Icons:**
- Arrow-path (refresh)
- Magnifying-glass (search)
- Funnel (filter)
- Arrow-trending-up/down (PnL direction)
- Clock (time)
- Signal (connection status)
- Chart-bar (stats)
- X-mark (clear filters)

**No Images:** This is a data dashboard - no hero images or decorative graphics needed. Focus purely on clean, functional UI.

---

## Special Considerations

**Real-time Updates:**
- Smooth transitions for data changes (not jarring)
- Highlight changed values briefly (flash effect for 1 second)
- Auto-refresh countdown subtle and non-intrusive

**Data Formatting:**
- Prices: Always 2-5 decimal places, monospace
- PnL: Include currency symbol, directional arrow
- Leverage: Display as "20x" format
- Timestamps: Relative time ("2m ago") with tooltip for exact time

**Accessibility:**
- Table headers with proper scope attributes
- Status indicators have text labels, not just visual cues
- Sufficient contrast for all text (especially PnL values)
- Keyboard navigation for filters and table

**Error Handling:**
- Failed scrape: Banner notification at top with specific error
- No data: Empty state with helpful message
- Connection lost: Status indicator changes with reconnection instructions