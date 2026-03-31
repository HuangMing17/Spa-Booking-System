# Design Style: God Spa — Champagne Academia

## Design Philosophy

**Core Principles**: Tinh tế thanh lịch gặp gỡ không khí spa thượng lưu. Style này lấy cảm hứng từ thương hiệu God Spa — kết hợp **vẻ đẹp ấm áp của lụa champagne, sáp ngà voi, và vàng đất sang trọng** với **kỹ thuật in ấn truyền thống** và **trang trí đo lường**. Mỗi yếu tố phải toát lên vẻ uy nghi của một spa đẳng cấp quốc tế.

**Vibe**: Uy nghi, Sang trọng, Ấm áp, Thanh lịch, Chuyên nghiệp, Tin cậy, Thượng lưu.

**The God Spa Promise**: Đây không phải chỉ là light theme với serif fonts. Đây là trải nghiệm hoàn chỉnh mang hơi thở spa thượng lưu — nơi mỗi tương tác cảm giác như chạm vào lụa mịn màng, nơi ánh sáng vàng champagne tràn ngập không gian, tạo nên bầu không khí uy nghi và đẳng cấp xứng tầm thương hiệu God Spa.

---

## Design Token System (The DNA)

### Color System (Champagne & Ivory Palette)

**Foundation Colors**:
- **background**: `#2C2218` (Dark Walnut Warm) — Nâu đen ấm, nền tối cho layout
- **backgroundAlt**: `#EFE0C8` (Champagne Cream) — Nền thẻ và bảng sáng, tone kem be
- **foreground**: `#F7F0E6` (Ivory Silk) — Màu chữ chính, kem ngà sáng
- **muted**: `#D4B896` (Caramel Linen) — Nền phụ, trạng thái disabled
- **mutedForeground**: `#7A6050` (Warm Mocha) — Chữ thứ cấp, nhãn, metadata
- **border**: `#D4B896` (Caramel Grain) — Viền tinh tế và phân cách

**Accent Colors**:
- **accent**: `#C8A87A` (Warm Gold Earth) — Màu tương tác chính, highlight, focus — **thay thế Brass**
- **accentSecondary**: `#A88860` (Burnished Copper) — Nhấn mạnh, hover, đường viền đặc biệt
- **accentForeground**: `#2C2218` (Dark on Gold) — Chữ trên nút vàng

**Color Usage Rules**:
1. **Contrast Ratios**: Duy trì 8.5:1 cho ivory trên dark walnut, tối thiểu 4.5:1 cho muted text
2. **Layering Strategy**: Luôn đặt backgroundAlt (`#EFE0C8`) lên trên background cho chiều sâu
3. **Gold Application**: Dùng gold earth cho TẤT CẢ interactive elements (buttons, links, focus rings, icons)
4. **Copper Sparingly**: Dành copper cho hover transforms và viền đặc biệt
5. **Border Subtlety**: Viền dùng `#D4B896` — nhẹ nhàng, không gắt

**Gold Gradient Formula** (cho buttons và metallic elements):
```css
background: linear-gradient(180deg, #D4B896 0%, #C8A87A 50%, #A88860 100%);
```
Tạo hiệu ứng vàng đất bóng nhẹ với highlight và shadow.

**Light Mode là mặc định**: Trang web God Spa dùng nền sáng (champagne/ivory), không tối.
- **Nền trang**: `#F7F0E6` (Ivory Silk)
- **Nền thẻ/card**: `#EFE0C8` (Champagne Cream)
- **Nền tối nhất** (footer, hero dark): `#2C2218`

---

### Typography System

**Font Families**:
- **Heading Font**: `"Cormorant Garamond", serif` — Serif cổ điển tinh tế, calligraphic
- **Body Font**: `"Crimson Pro", serif` — Serif cho đọc dài, thanh lịch
- **Display Font**: `"Cinzel", serif` — All-caps engraved, dùng cho nhãn và đặc biệt

**Type Scale & Hierarchy**:
- **Display Headings**: `text-3xl` → `text-4xl` (30px–36px), Cormorant Garamond, `leading-[1.2]`, `tracking-tight`
- **Section Headings**: `text-2xl` → `text-3xl` (24px–30px), Cormorant Garamond
- **Subsection Headings**: `text-xl` → `text-2xl` (20px–24px), Cormorant Garamond
- **Body Text**: `text-sm` → `text-base` (14px–16px), Crimson Pro, `leading-relaxed`
- **Labels/Overlines**: `text-[10px]` → `text-xs` (10px–12px), Cinzel, `uppercase`, `tracking-[0.2em]`

**Font Weight**:
- Headings: Regular 400 — để serif tự thể hiện
- Body: Regular 400
- Labels: Medium 500–600 (Cinzel)
- Emphasis: Italic thay vì bold

**Special Typography Patterns**:

1. **Drop Caps** (mở đầu đoạn lớn):
   - Font: Cinzel, `text-4xl` (36px), `float-left`, `mr-3`, `leading-[0.85]`
   - Color: `#C8A87A` (Gold Earth)
   - Shadow: `1px 1px 3px rgba(0,0,0,0.15)`

2. **Section Numbering**: Roman numerals với prefix "Volume"
   - Font: Cinzel, `text-xs`, `uppercase`, `tracking-[0.25em]`
   - Color: `#C8A87A`
   - Pattern: "Volume I", "Volume II"... cho section lớn

3. **Engraved Text Effect** (buttons, headings đặc biệt):
   ```css
   text-shadow: 1px 1px 1px rgba(0,0,0,0.3), -1px -1px 1px rgba(255,255,255,0.15);
   ```

---

### Radius & Border System

**Border Radius**:
- **Default**: `4px` — góc nhẹ truyền thống
- **Arch-Top**: `border-radius: 40% 40% 0 0 / 20% 20% 0 0` — cổng vòm cho ảnh
- **Full Circle**: Cho icon container, badge, avatar

**Border Styling**:
- Thickness: `1px` chuẩn, `2px` cho frame trang trí
- Color: `#D4B896` chuẩn, `#C8A87A` cho interactive/decorative
- Pattern: Solid, không dashed hay dotted

---

### Shadows & Depth

**Shadow Philosophy**: Shadow phải cảm giác như chiều sâu vật lý trong ánh đèn spa — mềm mại, ấm áp.

**Shadow Recipes**:

1. **Card Elevation**:
   ```css
   /* default */ box-shadow: none;
   /* hover */   box-shadow: 0 8px 24px rgba(44,34,24,0.12);
   ```

2. **Engraved/Embossed** (buttons):
   ```css
   box-shadow:
     inset 0 1px 0 rgba(255,255,255,0.35),
     inset 0 -1px 0 rgba(0,0,0,0.15),
     0 2px 8px rgba(44,34,24,0.2);
   /* hover: */ box-shadow: 0 4px 12px rgba(200,168,122,0.35);
   ```

3. **Wax Seal Badge**:
   ```css
   box-shadow:
     inset 0 2px 4px rgba(255,255,255,0.25),
     inset 0 -2px 4px rgba(0,0,0,0.2),
     0 4px 8px rgba(44,34,24,0.25);
   ```

4. **Focus Ring**:
   ```css
   ring-2 ring-[#C8A87A] ring-offset-2 ring-offset-[#F7F0E6]
   ```

---

### Textures & Atmospheric Effects

**1. Aged Paper Texture Overlay**:
- SVG noise filter, fractal turbulence
- Opacity: `0.03` (cực kỳ nhẹ)
- Position: Fixed overlay toàn viewport
- Blend mode: `overlay`

**2. Vignette Effect**:
```css
background: radial-gradient(ellipse at center,
  transparent 0%, transparent 50%,
  rgba(44,34,24,0.15) 100%);
```
Position: Fixed overlay, tạo độ sâu nhẹ ở góc.

**3. Sepia Image Treatment**:
- Default: `filter: sepia(0.4) contrast(0.97) brightness(1.0)`
- Hover: `filter: sepia(0) contrast(1) brightness(1)`
- Transition: `700ms ease-out`

**4. Decorative Patterns**:

**Ornate Corner Flourishes**:
```css
.ornate-frame::before,
.ornate-frame::after {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid #C8A87A;
}
.ornate-frame::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.ornate-frame::after  { bottom: -1px; right: -1px; border-left: none; border-top: none; }
```

**Ornate Divider**:
```css
.ornate-divider {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, #D4B896 20%,
    #C8A87A 50%, #D4B896 80%,
    transparent 100%);
  position: relative;
}
.ornate-divider::before {
  content: "✶";
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  color: #C8A87A;
  font-size: 12px;
  background: #F7F0E6;
  padding: 0 12px;
}
```

---

## Component Styling Principles

### Buttons

**Visual Treatment**:
- Font: Cinzel, uppercase, `tracking-[0.15em]`, `text-xs`
- Effect: Engraved text shadow

**Primary Button** (gold earth, main actions):
```css
background: linear-gradient(180deg, #D4B896 0%, #C8A87A 50%, #A88860 100%);
color: #2C2218;
border-radius: 4px;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 2px 8px rgba(44,34,24,0.2);
```
- Hover: `filter: brightness(1.08)` + glow `0 4px 12px rgba(200,168,122,0.35)`

**Secondary Button** (outlined):
```css
background: transparent;
border: 2px solid #C8A87A;
color: #C8A87A;
```
- Hover transform: `border-color: #A88860; background: #A88860; color: #F7F0E6`

**Ghost Button**:
- No background/border, text `#C8A87A`
- Hover: underline, brighten to `#D4B896`

**Button Sizes**:
- Default: `h-12 px-8`
- Small: `h-10 px-6`
- Large: `h-14 px-10`

---

### Cards & Containers

```css
background: #EFE0C8;       /* Champagne Cream */
border: 1px solid #D4B896; /* Caramel Grain */
border-radius: 4px;
padding: 2rem–3rem;
position: relative;        /* cho corner flourishes */
```

**Hover**:
```css
border-color: rgba(200,168,122,0.6);
box-shadow: 0 8px 24px rgba(44,34,24,0.12);
transition: 300ms ease;
```

**Corner Flourish**: Brackets vàng 24×24px, opacity 0.5 default → 1.0 hover.

**Wax Seal Badge** (featured):
```css
background: radial-gradient(circle at 40% 35%,
  #D4B896 0%, #C8A87A 40%, #8B6A40 100%);
border-radius: 50%;
position: absolute; top: -12px; right: 24px;
box-shadow: inset 0 2px 4px rgba(255,255,255,0.25),
            inset 0 -2px 4px rgba(0,0,0,0.2),
            0 4px 8px rgba(44,34,24,0.25);
```

---

### Form Inputs

```css
background: #F7F0E6;         /* Ivory Silk */
border: 1px solid #D4B896;
color: #2C2218;
font-family: 'Crimson Pro', serif;
height: 48px;
padding: 0 1rem;
border-radius: 4px;
```

**Placeholder**: Italic, color `#7A6050`

**Focus**:
```css
border-color: #C8A87A;
box-shadow: 0 0 0 3px rgba(200,168,122,0.2);
outline: none;
```

---

### Interactive States

**Hover**:
- Links: `#C8A87A`, letter-spacing tăng nhẹ
- Cards: Gold border tint, shadow lift
- Buttons: Brightness 108%, gold glow
- Images: Sepia removal 700ms + scale 105%

**Focus** (keyboard):
```css
outline: 2px solid #C8A87A;
outline-offset: 2px;
```

**Disabled**: `opacity: 0.5; pointer-events: none`

---

## Layout Principles

### Spacing Rhythm

**Base Grid**: 8px system
- Micro (icon gaps): `gap-2` → `gap-4`
- Element (card internals): `gap-4` → `gap-8`
- Section: `gap-8` → `gap-12`
- Vertical section padding: `py-24` → `py-32`

**Content Width**:
- Standard: `max-w-6xl` (1152px)
- Narrow (blog, form): `max-w-4xl` (896px)
- Full-width: `max-w-7xl` hoặc full viewport

**Grid Patterns**:
- 3 cột: `grid-cols-1 md:grid-cols-3`
- 2 cột: `grid-cols-1 lg:grid-cols-2`
- 4 cột: `grid-cols-2 md:grid-cols-4`

---

## The "Bold Factor" — Signature Elements Bắt Buộc

### 1. Arch-Topped Images
```css
border-radius: 40% 40% 0 0 / 20% 20% 0 0;
```
Áp dụng cho: Hero images, blog thumbnails, ảnh feature.

### 2. Sepia-to-Color Transition
```css
filter: sepia(0.4) contrast(0.97) brightness(1.0);
transition: filter 700ms ease-out;
```
Hover: `filter: sepia(0) contrast(1) brightness(1)`

### 3. Roman Numeral Volume System
- Cinzel, uppercase, `#C8A87A`, `tracking-[0.25em]`
- "Volume I", "Volume II"... trước mỗi section lớn

### 4. Drop Cap Introductions
```css
.drop-cap::first-letter {
  font-family: 'Cinzel', serif;
  font-size: 36px;
  float: left;
  margin-right: 0.75rem;
  line-height: 0.85;
  color: #C8A87A;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.15);
}
```

### 5. Corner Flourishes
- Hero/major frames: 40×40px brass brackets
- Cards: 24×24px, opacity 0.5 → 1.0 on hover

### 6. Ornate Dividers with Glyphs
- Gradient: transparent → `#D4B896` → `#C8A87A` → `#D4B896` → transparent
- Glyph trung tâm: `✶`, `❧`, `✤`, `❦`

### 7. Wax Seal Badges
- Hình tròn, radial gradient gold, chứa icon ngôi sao
- Position: `-top-3 right-6`

### 8. Gold Interactive Elements
Tất cả interactive elements dùng `#C8A87A` hoặc gold gradient. Bắt buộc.

### 9. Engraved Text Effects
```css
text-shadow: 1px 1px 1px rgba(0,0,0,0.3), -1px -1px 1px rgba(255,255,255,0.15);
```

### 10. Texture Overlays
Cả paper texture (3% opacity) và vignette effect đều bắt buộc.

---

## Animation & Motion

**Philosophy**: Thanh thoát, chủ định, mượt mà. Như lụa nhẹ bay, như nến lung linh.

**Timing**: Chỉ dùng `ease-out`. Không `bounce`, không `spring`.

**Durations**:
- Fast (button press): `150ms`
- Standard (hover): `300ms`
- Deliberate (card lift): `500ms`
- Dramatic (sepia reveal): `700ms`

**Transforms**:
- Hover scale: `scale-105` hoặc `scale-[1.02]`
- Không translate dọc — tăng shadow thay thế
- Không rotate ngoại trừ chevron icon

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Strategy

**Mobile (< 768px)**:
- Stack tất cả columns dọc
- Touch targets tối thiểu 48px
- Giảm corner flourishes lớn, giữ nhỏ
- `py-16` thay `py-24`
- Form: stack input + button dọc

**Tablet (768px–1024px)**:
- 2-column grids
- Giữ hầu hết effects

**Desktop (> 1024px)**:
- Full ornate experience
- 3-column grids
- Đầy đủ texture + vignette + corner flourishes

---

## Accessibility

**Contrast**:
- Primary text on light bg: ≥ 7:1
- Secondary text: ≥ 4.5:1
- Gold on dark: 7:1

**Focus**: `outline: 2px solid #C8A87A; outline-offset: 2px`

**Semantic HTML**: Dùng đúng `<nav>`, `<main>`, `<footer>`, `<button>`, `<a>`

**Decorative elements**: `aria-hidden="true"`

---

## Design Token Reference (Quick Copy)

```javascript
export const godSpaTokens = {
  colors: {
    // === LIGHT MODE (mặc định) ===
    background:      "#F7F0E6",  // Ivory Silk — nền trang chính
    backgroundAlt:   "#EFE0C8",  // Champagne Cream — nền card/panel
    backgroundDark:  "#2C2218",  // Dark Walnut — footer, hero tối
    foreground:      "#2C2218",  // Dark Walnut — chữ chính trên nền sáng
    foregroundLight: "#F7F0E6",  // Ivory Silk — chữ trên nền tối
    muted:           "#D4B896",  // Caramel Linen — nền phụ, disabled
    mutedForeground: "#7A6050",  // Warm Mocha — chữ thứ cấp
    border:          "#D4B896",  // Caramel Grain — viền

    // === ACCENT ===
    accent:          "#C8A87A",  // Warm Gold Earth — interactive chính
    accentHover:     "#A88860",  // Burnished Copper — hover/focus
    accentForeground:"#2C2218",  // Dark Walnut — chữ trên gold button
  },
  fonts: {
    heading: "'Cormorant Garamond', serif",
    body:    "'Crimson Pro', serif",
    display: "'Cinzel', serif",
  },
  radius: {
    default: "4px",
    arch:    "40% 40% 0 0 / 20% 20% 0 0",
    full:    "9999px",
  },
  transitions: {
    fast:     "150ms ease-out",
    base:     "300ms ease-out",
    slow:     "500ms ease-out",
    dramatic: "700ms ease-out",
  },
  spacing: {
    section: ["py-24", "py-32"],
    card:    ["p-8", "p-12"],
    element: ["gap-4", "gap-8"],
  },
  effects: {
    sepia:         "sepia(0.4) contrast(0.97) brightness(1.0)",
    goldGradient:  "linear-gradient(180deg, #D4B896 0%, #C8A87A 50%, #A88860 100%)",
    engraved:      "1px 1px 1px rgba(0,0,0,0.3), -1px -1px 1px rgba(255,255,255,0.15)",
    cardShadow:    "0 8px 24px rgba(44,34,24,0.12)",
    buttonGlow:    "0 4px 12px rgba(200,168,122,0.35)",
  },
};
```

---

## Ngôn Ngữ Mặc Định

**Tất cả nội dung văn bản trên trang web phải dùng tiếng Việt** — đây là ngôn ngữ mặc định và duy nhất.

- **Nhãn button**: "Đặt Lịch Ngay", "Khám Phá Dịch Vụ", "Tìm Hiểu Thêm", "Liên Hệ"
- **Tiêu đề section**: Viết bằng tiếng Việt, dùng Cormorant Garamond
- **Labels / Overlines** (Cinzel): Viết bằng tiếng Việt, uppercase — ví dụ: "DỊCH VỤ NỔI BẬT", "VỀ CHÚNG TÔI", "LIÊN HỆ"
- **Volume numbering**: Dùng "Phần I", "Phần II"... hoặc giữ "Volume I", "Volume II" tùy ngữ cảnh
- **Placeholder inputs**: "Họ và tên của bạn...", "Số điện thoại...", "Tin nhắn..."
- **Alt text ảnh**: Mô tả bằng tiếng Việt
- **Meta title / description**: Tiếng Việt
- **Không** hardcode text tiếng Anh vào UI ngoại trừ tên thương hiệu **God Spa**

**Lưu ý font tiếng Việt**: Cormorant Garamond và Crimson Pro đều hỗ trợ đầy đủ dấu tiếng Việt (Unicode). Cinzel **không** hỗ trợ dấu tiếng Việt — chỉ dùng Cinzel cho text không dấu (tên thương hiệu, số La Mã, từ viết tắt).

---



1. **Không dùng sans-serif** ngoại trừ accessibility override
2. **Không màu sặc sỡ, bão hòa cao** — tất cả phải ấm và già dặn
3. **Không hình học sắc cạnh** — ưu tiên đường cong truyền thống
4. **Không lạm dụng trang trí** — tiết chế là sang trọng
5. **Không gradient hiện đại** ngoại trừ gold metallic
6. **Không bỏ qua arch-top** — ảnh flat-top phá vỡ aesthetic
7. **Không bỏ Roman numerals** — bắt buộc cho classical vibe
8. **Không pure white `#FFFFFF`** — dùng ivory `#F7F0E6`
9. **Không pure black `#000000`** — dùng dark walnut `#2C2218`
10. **Không animation vui nhộn** — không bounce, không elastic
11. **Không quên sepia filter** cho ảnh
12. **Không lạnh** — đây là palette ấm hoàn toàn

---

## Summary

God Spa Academia được định nghĩa bởi **tính xác thực vật liệu** (lụa champagne, ngà voi, vàng đất ấm), **xuất sắc typographic** (ba serif dùng có chủ đích), và **các yếu tố kiến trúc đặc trưng** (arch-tops, corner flourishes, Roman numerals).

Style thành công khi mỗi yếu tố cảm giác như thuộc về một spa thượng lưu đẳng cấp quốc tế. Style thất bại khi trông như generic light theme với serif fonts.

**Gold earth `#C8A87A` là ngôn ngữ tương tác.** Sepia-to-color transition là khoảnh khắc ma thuật. Arch-topped images là chữ ký kiến trúc. Toàn bộ nội dung bằng **tiếng Việt**. Cùng nhau, chúng tạo ra trải nghiệm sang trọng, tin cậy, và đáng nhớ — xứng tầm thương hiệu God Spa.
