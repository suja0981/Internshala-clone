1. Color tokens
:root {
  /* ─────────────────────────
     NEUTRALS
  ───────────────────────── */


  --color-neutral-950: #142124;
  --color-neutral-900: #1D2B2E;
  --color-neutral-800: #29383B;
  --color-neutral-700: #425255;
  --color-neutral-600: #5F7073;
  --color-neutral-500: #7C8C8F;
  --color-neutral-400: #9EAAAC;
  --color-neutral-300: #C5CDCE;
  --color-neutral-200: #DDE3E3;
  --color-neutral-100: #EDF1F1;
  --color-neutral-50:  #F7F9F9;




  /* ─────────────────────────
     SURFACES
  ───────────────────────── */


  --color-background: #F9FAF8;
  --color-surface: #FFFFFF;
  --color-surface-soft: #F3F7F6;
  --color-surface-muted: #EDF4F3;
  --color-surface-brand: #E7F3F2;




  /* ─────────────────────────
     ACCENT
  ───────────────────────── */


  --color-accent-600: #E87900;
  --color-accent-500: #FF9414;
  --color-accent-400: #FFAA3D;
  --color-accent-100: #FFF0D9;
  --color-accent-50:  #FFF8ED;




  /* ─────────────────────────
     SUCCESS
  ───────────────────────── */


  --color-success-700: #18734B;
  --color-success-600: #218657;
  --color-success-500: #32A66F;
  --color-success-100: #E4F5EC;
  --color-success-50:  #F1FAF5;




  /* ─────────────────────────
     WARNING
  ───────────────────────── */


  --color-warning-600: #C47700;
  --color-warning-500: #E39A18;
  --color-warning-100: #FFF2D7;




  /* ─────────────────────────
     ERROR
  ───────────────────────── */


  --color-error-600: #C63D3D;
  --color-error-500: #DF5757;
  --color-error-100: #FDEAEA;




  /* ─────────────────────────
     INFO
  ───────────────────────── */


  --color-info-600: #256B9A;
  --color-info-500: #3686B8;
  --color-info-100: #E7F2F9;
}
Brand usage
Token	Use
brand-900	Navbar, sidebar, dark sections
brand-800	Primary text on branded areas
brand-700	Primary buttons
brand-600	Hover states
brand-500	Icons, links, charts
brand-100	Selected backgrounds
brand-50	Very subtle backgrounds
accent-500	Featured, promoted, attention
success-500	Applied, shortlisted, accepted
error-500	Rejected, errors

Don't use orange as a second primary color. It should signal something, not become another brand color.

2. Typography

I'd use Inter for the product rather than Poppins.

:root {
  --font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;


  --text-xs: 0.75rem;       /* 12px */
  --text-sm: 0.875rem;      /* 14px */
  --text-md: 1rem;          /* 16px */
  --text-lg: 1.125rem;      /* 18px */
  --text-xl: 1.25rem;       /* 20px */
  --text-2xl: 1.5rem;       /* 24px */
  --text-3xl: 1.875rem;     /* 30px */
  --text-4xl: 2.25rem;      /* 36px */
  --text-5xl: 3rem;         /* 48px */
  --text-6xl: 3.75rem;      /* 60px */
}
Weight
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
Recommended hierarchy
Hero                56px / 700
Page heading        32px / 700
Section heading     24px / 600
Card heading        16px / 600
Body                14-16px / 400
Label               13px / 500
Caption             12px / 400

Don't make every heading huge. Your product has lots of information, so hierarchy should come from weight and spacing, not just font size.

3. Spacing

Use a 4px base system.

:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}

For most product UI:

16px / 24px / 32px should do most of the work.

4. Border radius

Your UI is rounded, but don't make everything pill-shaped.

:root {
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}

Use:

Inputs          10–12px
Buttons         10–12px
Job cards       16px
Dashboard cards 16px
Hero cards      20–24px
Badges          full
Avatars         full
5. Shadows

Keep them extremely subtle.

:root {
  --shadow-xs:
    0 1px 2px rgba(20, 59, 64, 0.04);


  --shadow-sm:
    0 2px 8px rgba(20, 59, 64, 0.06);


  --shadow-md:
    0 8px 24px rgba(20, 59, 64, 0.08);


  --shadow-lg:
    0 16px 40px rgba(20, 59, 64, 0.10);


  --shadow-xl:
    0 24px 60px rgba(20, 59, 64, 0.12);
}

For normal cards, use border + very small shadow, not a heavy floating effect.

6. Borders
:root {
  --border-default: #DDE3E3;
  --border-subtle: #EDF1F1;
  --border-strong: #C5CDCE;


  --border-brand: #2B7078;
  --border-focus: #3F9298;
}

Normal card:

border: 1px solid var(--border-default);
7. Buttons
Primary
background: #1F5F66;
color: #FFFFFF;

Hover:

background: #164A50;
Secondary
background: #E7F3F2;
color: #164A50;
Outline
background: #FFFFFF;
border: 1px solid #C5CDCE;
color: #29383B;
Accent

Use only for things like:

Featured
Promoted
Urgent
Limited
background: #FF9414;
color: #142124;
8. Job-status tokens

This is particularly important for your platform.

:root {
  --status-applied-bg: #E7F2F9;
  --status-applied-text: #256B9A;


  --status-shortlisted-bg: #E4F5EC;
  --status-shortlisted-text: #18734B;


  --status-interview-bg: #FFF2D7;
  --status-interview-text: #C47700;


  --status-offered-bg: #E7F3F2;
  --status-offered-text: #164A50;


  --status-rejected-bg: #FDEAEA;
  --status-rejected-text: #C63D3D;
}

This gives you:

Applied       → Blue
Shortlisted   → Green
Interview     → Amber
Offered       → Teal
Rejected      → Red

Don't rely on color alone; always include the text label.

9. Glassmorphism tokens

Use this primarily for the navbar, floating controls and hero elements, not every card.

:root {
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(255, 255, 255, 0.65);
  --glass-blur: 20px;
  --glass-shadow:
    0 8px 30px rgba(20, 59, 64, 0.08);
}

Example:

.glass-nav {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur));
  box-shadow: var(--glass-shadow);
  border-radius: 20px;
}

The mistake to avoid is making every section glassmorphic. Then nothing has visual hierarchy.

10. Layout tokens
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1200px;
  --container-2xl: 1280px;


  --page-padding-desktop: 32px;
  --page-padding-tablet: 24px;
  --page-padding-mobile: 16px;
}

For the main website:

max-width: 1280px

For dashboards:

max-width: 1440px

11. Z-index

Useful once you have sticky navs, dialogs, dropdowns, etc.

:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-header: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-toast: 700;
  --z-tooltip: 800;
}
12. Component philosophy

I'd keep the visual hierarchy roughly like this:

                DARK TEAL
                   │
            Primary actions
                   │
        ┌──────────┴──────────┐
        │                     │
      TEAL                  MINT
    Links/icons         Selected states
        │                     │
        └──────────┬──────────┘
                   │
                 WHITE
              Main surfaces
                   │
                 CREAM
              Page background
                   │
                ORANGE
             Attention only


Brand:       #1F5F66
Brand Dark:  #164A50
Brand Light: #E7F3F2

Background:  #F9FAF8
Surface:     #FFFFFF

Text:        #1D2B2E
Muted Text:  #5F7073

Border:      #DDE3E3

Success:     #32A66F
Accent:      #FF9414
Error:       #DF5757