# Adashenmu: App Build Specification

**Product:** Adashenmu, a mobile app for rotating savings groups (adashe, esusu, ajo, jam'iyya) in Nigeria.
**Tagline:** Save together. Collect on time.
**Designer:** Mustapha Shuaibu (Abusuhailah) · Abusuhailah Limited · 2026
**Source of truth:** the 19 screen images in `/screens` (2x, 780 × 1688 = 390 × 844 at 1x), the tokens in `/design-system`, and the mock data in `/data`.

> Concept project. Research and usability testing were simulated for a portfolio. In a real launch, the money would be held by a licensed partner bank, never by Adashenmu or any member. The app below is a front-end prototype with mock data: **no real payments, no real NIN checks and no real bank calls.**

---

## 1. What the app does

In an adashe, each member pays a fixed amount on a schedule, and one member collects the whole pot each round. Today this runs on a WhatsApp chat and the organiser's notebook, so one person holds the money, payments are late, and people argue over whose turn it is.

Adashenmu gives the whole group one record it can trust:

- Every member verifies once with their **NIN** (National Identification Number).
- Contributions go to a **group wallet at a licensed partner bank**. No member, including the organiser, can withdraw it.
- Everyone sees the same **ledger** (who paid, with a named money state) and the same **payout calendar** (whose turn, on which date).
- The app **releases each payout on the agreed date**.
- The **app sends polite reminders**, in English or Hausa, and applies the late fee the group agreed on.

### Design principles (apply to every screen)

1. **See it, don't be told.** Every member can see the full ledger.
2. **No one holds the money.** Money sits in the bank-held wallet; the app releases payouts.
3. **Rules agreed once.** Amount, frequency, size, payout order and late rule are set before anyone joins. Changes need a group vote.
4. **Polite by default.** Reminders come from the app, never as public shaming in the group chat.
5. **Money states are always clear.** Every amount is in one named state with a word and an icon, never colour alone.

### Users

- **Organiser (primary):** Malama Hauwa Ibrahim, 38, atamfa fabric seller in Kaduna. She runs a 10-member group at ₦20,000 a month (₦200,000 pot). She is the logged-in user in the prototype.
- **Member:** e.g. Ibrahim Suleiman, 27, ride-hailing driver in Abuja. Wants to know his collection date and that everyone has paid.
- **Treasurer (later release):** Alhaji Musa Danladi, 52, oversees 4 groups. The treasurer view is NOT in this build.

---

## 2. Recommended build (for Google AI Studio)

- **Stack:** React + TypeScript + Tailwind CSS (or plain CSS with `design-system/tokens.css`). Single-page app with client-side routing.
- **Layout:** mobile-first at **390 px wide**. On a desktop browser, centre the app in a phone-sized frame (390 × 844, rounded corners, forest `#072A20` bezel) on a cream background.
- **Fonts:** Google Fonts **Manrope** (500, 600, 700, 800) for headings and money amounts, **Inter** (400, 500, 600, 700) for body and UI.
- **Icons:** the 41 SVGs in `design-system/icons/` (Lucide-style, 24 px, 2 px stroke, `currentColor`). Lucide React is an acceptable substitute; use `pot.svg` from this pack for the "In the pot" state.
- **Logo:** `brand/adashenmu-mark.svg`, `brand/adashenmu-mark-reversed.svg` (on dark) and the lockup PNGs.
- **Data:** load `data/mock-data.json` into app state. Use `data/types.ts` for the types.
- **State to simulate:** paying moves the user's contribution Pending → Confirming → (after about 3 s) In the pot, and updates the pot total from ₦140,000 to ₦160,000 and the ledger counts. Creating a group adds "Kasuwa Stall Weekly" to My groups.
- **Language:** English by default with an English/Hausa switch. Keep all strings in a translation file (`en.json`, `ha.json`). Only a few Hausa strings exist in the design ("Sannu, Hauwa", "Karanta da Hausa"); **leave the other Hausa strings for the product owner to supply** rather than machine-translating them.
- **Formatting:** always show naira as `₦20,000` (₦ sign, thousands separators). Never "20k". Dates like "Wed 28 Oct".

---

## 3. Information architecture and routes

Bottom tab bar (5 tabs) on main screens: **Home · Groups · Pay · Activity · Profile**. Pay is a raised green circle in the centre.

| Route | Screen | Image |
|---|---|---|
| `/welcome` | M-01 Welcome | `screens/M-01-welcome.png` |
| `/sign-in` | M-02 Phone and OTP | `screens/M-02-phone-and-otp.png` |
| `/verify` | M-03 Verify identity (NIN) | `screens/M-03-verify-identity-nin.png` |
| `/join/:slug` | W-01 Invite web page (works before download) | `screens/W-01-invite-web-page.png` |
| `/home` (tab) | M-04 Home | `screens/M-04-home.png` |
| `/groups` (tab) | M-05 My groups | `screens/M-05-my-groups.png` |
| `/groups/:id/ledger` | M-06 Group ledger | `screens/M-06-group-ledger.png` |
| `/groups/:id/calendar` | M-07 Payout calendar | `screens/M-07-payout-calendar.png` |
| `/groups/new/rules` | M-08 Create group: rules (step 1 of 3) | `screens/M-08-create-group-rules.png` |
| `/groups/new/order` | M-09 Create group: payout order (step 2) | `screens/M-09-create-group-payout-order.png` |
| `/groups/new/review` | M-10 Create group: review (step 3) | `screens/M-10-create-group-review.png` |
| `/groups/:id/invite` | M-11 Invite members | `screens/M-11-invite-members.png` |
| `/pay` (tab) | M-12 Pay contribution | `screens/M-12-pay-contribution.png` |
| `/pay/ussd` | M-13 Pay with USSD | `screens/M-13-pay-with-ussd.png` |
| `/pay/receipt` | M-14 Receipt | `screens/M-14-receipt.png` |
| `/late` | M-15 Late payment reminder (member view, Safiya) | `screens/M-15-late-payment-reminder.png` |
| `/payout` | M-16 Payout released | `screens/M-16-payout-released.png` |
| `/activity` (tab) | M-17 Activity | `screens/M-17-activity.png` |
| `/profile` (tab) | M-18 Profile | `screens/M-18-profile.png` |

Add a small hidden **demo menu** (e.g. long-press the logo, or a "Demo" link on Profile) to jump to M-15 Late payment and M-16 Payout released, because they belong to other dates in the story.

---

## 4. Design system summary

Full values: `design-system/design-tokens.json`, `tokens.css`, `tailwind.theme.js`, and the visual board `design-system-board.png`.

**Colours:** ink `#0B3D2E` (Forest) · primary `#0F8A5F` (Adashe Green) · primaryPressed `#0B6E4B` · onDark `#2FBF85` · accent `#F2B33D` (Coin Gold) · accentSoft `#FFF4DB` · primarySoft `#E3F4EC` · background `#FAF7F0` (Cream) · surface `#FFFFFF` · line `#E3DDCF` · lineSoft `#EFEAE0` · textMuted `#4F5F57` · faint `#8A968F` · clay `#C8643B` (illustration only).

**Money-state badge** (pill, 4/10 padding, 14 px icon + 12 px semibold label):

| State | Label | Text/icon | Tint | Icon |
|---|---|---|---|---|
| pending | Pending | `#8A5A00` | `#FFF4DB` | clock |
| confirming | Confirming | `#0B6E4B` | `#E3F4EC` | check |
| inThePot | In the pot | `#0B6E4B` | `#E3F4EC` | pot |
| released | Released | `#1D4ED8` | `#E6EEFF` | arrow-up-right |
| late | Late | `#B42318` | `#FDECEA` | alert |
| failed | Failed | `#B42318` | `#FDECEA` | x |
| refunded | Refunded | `#4F5F57` | `#EEF0EE` | undo |

**Turn chip** (radius 8): Your turn (gold bg, ink text) · Next (primarySoft, primaryPressed) · Collected (greySoft, muted, check icon) · Upcoming (white, line border, muted).

**Type:** Display 32/40 Manrope 800 · H1 24/32 Manrope 700 · H2 20/28 · H3 16/22 · Amount L 24/32 800 · Amount 18/24 700 · Body 16/24 Inter 400 · Body small 14/20 · Label 14/20 Inter 600 · Caption 12/16 Inter 500 · Overline 11/16 Inter 600, uppercase, 8% tracking.

**Spacing and shape:** 4-pt scale; screen side margin 20; cards radius 16 with 1 px `#E3DDCF` border and 16 px padding; inputs 52 px high, radius 10, 1.5 px border; primary button 52 px high, full width, radius 14; touch targets ≥ 48 px; borders instead of heavy shadows.

**Shared components:**
- **Status bar** (44 px; "9:41" and signal/battery; light or dark).
- **Top bar** (56 px): 40 px round back button (white, line border, arrow-left) + H2 title; optional 40 px round bell action on the right.
- **Bottom tab bar** (92 px incl. safe area, white, top border): Home (home icon), Groups (users), **Pay** (44 px green circle with white wallet icon), Activity (activity), Profile (user). Active tab: primary icon + primaryPressed semibold caption; inactive: faint icon + muted caption.
- **Button** variants: Primary (green fill, white label), Secondary (white, 1.5 px line border, ink label), Text (no fill, primaryPressed label), Danger (redSoft fill, red label). Optional leading icon.
- **Field:** label (Label, ink) · input box · helper (Caption, muted).
- **Avatar:** 40 px circle with initials (Label). Tints: green (primarySoft/primaryPressed), gold (accentSoft/#8A5A00), blue (blueSoft/blue), clay (claySoft/clay), grey (greySoft/muted).
- **Card**, **reminder banner** (accentSoft), **info card** (primarySoft with icon), **segmented tabs** (lineSoft track, white active pill with shadow), **stepper bar** (3 segments, 4 px, primary for done).

---

## 5. Screen-by-screen specification

Every screen: status bar on top, content with 20 px side margins. Footer buttons sit in a white footer with a top border, 12 px top / 28 px bottom padding. Follow the images for exact layout.

### M-01 Welcome (`/welcome`), dark screen
- Background ink `#0B3D2E`, light status bar.
- Centred: reversed pot logo (about 150 px), wordmark "adashenmu" (Manrope 800, 40 px, white), tagline "Save together. Collect on time." (onDark).
- Promises card (forestDeep, radius 16) with three icon rows in white text: shield "Money held by a licensed partner bank, not by one person" · users "Everyone in the group sees who has paid" · calendar "Payouts released on the agreed date".
- Language chips: globe icon + **English** (selected, onDark fill, ink text) + **Hausa** (outlined). Tapping switches the language.
- Footer: Primary **Get started** → M-02. Text button **I have an invite link** (onDark) → W-01.

### M-02 Phone and OTP (`/sign-in`)
- Top bar with back only (no title) → M-01.
- H1 "Enter your phone number"; body "We will send a 6-digit code by SMS to confirm it is you."
- Field "Phone number" = "+234 803 412 7765", helper "Use the number linked to your bank account".
- Label "Enter the code we sent" + six 48 × 56 digit boxes (4 8 2 9, the 5th focused with a green 2 px border and caret, the 6th empty).
- Clock icon + "Resend code in 0:42" (count down live).
- Footer: Primary **Verify** → M-03 (accept any 6 digits).

### M-03 Verify identity (`/verify`)
- Top bar "Verify identity" + back → M-02. Stepper 2 of 3, caption "Step 2 of 3".
- 56 px primarySoft circle with shield icon.
- H1 "Confirm who you are"; body "Every member verifies once with their National Identification Number (NIN), so your group knows everyone is a real person."
- Field "NIN (11 digits)" = "7031 4482 905"; helper "Find it on your NIN slip or dial *346# from your phone. We only confirm your name and photo with NIMC." Validate 11 digits.
- Info card (primarySoft, lock icon): "Your contributions are held by a licensed partner bank, not by any member. Adashenmu cannot spend them."
- Footer: Primary **Verify and continue** → M-04 (show a short "Checking with NIMC…" loading state, then success). Text button **I don't have my NIN with me** → save progress, show a toast "We'll remind you. You can view groups, but paying stays locked until your NIN is verified.", then go to M-04.
- NIN is the ONLY identity option (no BVN).

### W-01 Invite web page (`/join/kasuwa-stall-weekly`)
- Mobile browser look: light status bar, then a grey URL pill with lock icon "adashenmu.app/join/kasuwa-stall-weekly".
- Lockup (small). Inviter row: avatar HI + "Hauwa Ibrahim invited you to join" / "Organiser · verified".
- Group card: "Kasuwa Stall Weekly"; three stat tiles: Each week ₦5,000 · Members 8 · Payout ₦40,000. "Rules everyone accepts" with check rows: "Pay every Friday by 6 pm" · "Payout order is drawn when the group starts" · "1-day grace, then marked Late with a ₦500 fee added to the pot".
- Overlapping avatar stack (HI ZM AB FY HL) + "5 of 8 places filled".
- Info card (shield): "Money is held by a licensed partner bank. Every member verifies with their NIN."
- Footer: Primary **Join group** → M-02 (then M-03); caption "You will get the app after you accept the rules."

### M-04 Home (`/home`, tab Home)
- Header: caption "Monday, 26 October" + H1 "Sannu, Hauwa"; 40 px bell button with red dot.
- Reminder banner (accentSoft): clock + "Your ₦20,000 for Kasuwa Atamfa is due Wed 28 Oct." + link **Pay now** → M-12. Hide it once the user has paid.
- **Pot card** (ink background, radius 16, 20 px padding) → tap opens M-06:
  - Overline "KASUWA ATAMFA ADASHE · CYCLE 4 OF 10" (onDark)
  - Display "₦140,000" (white) + "of ₦200,000" (onDark)
  - 8 px progress bar at 70% (onDark on forestDeep)
  - Row: "In the pot · 7 of 10 confirmed" · "Held by partner bank"
  - Divider, then payout row: avatar HL, "Payout to Hadiza Lawal" / "Sat 31 Oct · ₦200,000", Next chip.
- Two tiles side by side:
  - **Your payment**: caption, Amount L "₦20,000", Pending badge, "Due Wed 28 Oct". Tap → M-12.
  - **Your turn to collect** (accentSoft fill): "₦200,000", Your turn chip, "Mon 30 Nov · in 35 days". Tap → M-07. (Wording changed after testing: show the countdown.)
- "Recent activity" + "See all" → M-17. Card with 2 rows: Rukayya Adamu "Paid ₦20,000 · Today 9:12" Confirming · Maryam Sani "Paid ₦20,000 · Yesterday" In the pot.
- Tab bar (Home active).

### M-05 My groups (`/groups`, tab Groups)
- Top bar "My groups" with no back button, bell action.
- Group card → M-06: 44 px primarySoft tile with pot icon; "Kasuwa Atamfa Adashe" / "₦20,000 monthly · 10 members · Organiser"; chevron. Row "Cycle 4 of 10 · October" / "7 of 10 in the pot"; 8 px progress at 70%. Row "Next payout: Hadiza Lawal · Sat 31 Oct" / "Your payment" Pending badge.
- Dashed primary card **Create a new group** (green circle with plus) "Set the rules once. Everyone agrees before joining." → M-08.
- Card **Join with an invite link** "Paste a link or enter a group code" (send icon) → W-01.
- Info card: "Run more than one group? A treasurer view for several groups is coming next."
- After the user creates a group (M-10), add a second card for Kasuwa Stall Weekly ("₦5,000 weekly · 8 members · 5 of 8 joined").

### M-06 Group ledger (`/groups/g-kasuwa-atamfa/ledger`)
- Top bar "Kasuwa Atamfa Adashe" + back → M-04.
- Segmented tabs: **Ledger** (active) · Payout calendar (→ M-07) · Rules (show the rules list from mock data).
- Summary card: "Cycle 4 of 10 · October" / "₦20,000 each"; Amount L "₦140,000" + "in the pot of ₦200,000".
  - Split bar (3 px gaps): 70% primary (in the pot) · 10% onDark (confirming) · 20% accent (pending).
  - Legend dots: "7 in the pot · 1 confirming · 2 pending".
  - Link (info icon) **What do these states mean?** opens a bottom sheet listing all 7 states with badge + meaning (from tokens).
- Members card, rows with dividers: avatar, name, caption, badge. Order:

  | Member | Caption | State |
  |---|---|---|
  | Hauwa Ibrahim (you) | Due Wed 28 Oct | Pending |
  | Safiya Umar | Due Wed 28 Oct | Pending |
  | Rukayya Adamu | Today 9:12 · bank confirming | Confirming |
  | Amina Danjuma | Sun 25 Oct | In the pot |
  | Halima Garba | Sun 25 Oct | In the pot |
  | Maryam Sani | Sun 25 Oct | In the pot |
  | Hadiza Lawal | Fri 23 Oct | In the pot |
  | Fatima Yusuf | Thu 22 Oct | In the pot |
  | Aisha Bello | Thu 22 Oct | In the pot |
  | Zainab Musa | Wed 21 Oct | In the pot |

- The list scrolls.

### M-07 Payout calendar (`/groups/g-kasuwa-atamfa/calendar`)
- Same header and tabs (Payout calendar active).
- Note with shuffle icon: "Order drawn on Wed 1 Jul 2026 and accepted by all 10 members. ₦200,000 is released on each date."
- List of 10 turns: number circle, name, date, chip.
  - 1 Zainab Musa · Fri 31 Jul · Collected
  - 2 Aisha Bello · Mon 31 Aug · Collected
  - 3 Fatima Yusuf · Wed 30 Sep · Collected
  - 4 Hadiza Lawal · Sat 31 Oct · Next (green circle)
  - **5 Hauwa Ibrahim (you) · Mon 30 Nov · Your turn** (row highlighted with accentSoft; gold circle)
  - 6 Maryam Sani · Thu 31 Dec · Upcoming
  - 7 Rukayya Adamu · Sun 31 Jan 2027 · Upcoming
  - 8 Halima Garba · Sun 28 Feb 2027 · Upcoming
  - 9 Safiya Umar · Wed 31 Mar 2027 · Upcoming
  - 10 Amina Danjuma · Fri 30 Apr 2027 · Upcoming
- Collected rows use muted text.

### M-08 Create a group: rules (`/groups/new/rules`)
- Top bar "Create a group" + back → M-05. Stepper 1 of 3, caption "Step 1 of 3 · Rules".
- Template chips: caption "Template" + **Monthly market** · **Weekly stall** (selected, check). Selecting a template fills the fields (see `templates` in mock data).
- Field "Group name" = "Kasuwa Stall Weekly"; Field "Amount each member pays" = "₦5,000".
- "How often": chips **Weekly** (selected, green) · Monthly · a calendar chip "Fri, 6 pm" (opens a day/time picker).
- "Number of members" / "Including you" + stepper (− 8 +), min 3, max 30.
- Field "If someone pays late" = "1-day grace, then ₦500 fee to the pot" (select).
- Live summary card (primarySoft, pot icon): "Each payout: ₦40,000" / "8 weeks · Fri 6 Nov to Fri 25 Dec 2026". Compute payout = amount × members and the date range.
- Footer: Primary **Next: payout order** → M-09.

### M-09 Create a group: payout order (`/groups/new/order`)
- Stepper 2 of 3, "Step 2 of 3 · Payout order". H2 "How will you decide who collects first?"
- Three radio cards (selected = primarySoft fill + 2 px primary border):
  - list icon **Fixed order**: "You set the order now and members see it before joining."
  - shuffle icon **Draw at the start** (selected): "The app draws the order when all 8 members have joined. Nobody can change it later."
  - vote icon **Group vote**: "Members vote on the order in the app before the first week."
- Note (info): "Later, two members can swap turns only if both agree and the group approves."
- Footer: **Next: review** → M-10.

### M-10 Create a group: review (`/groups/new/review`)
- Stepper 3 of 3, "Step 3 of 3 · Review". H2 "Check the rules".
- Key-value card with these rows:

  | Label | Value |
  |---|---|
  | Group | Kasuwa Stall Weekly |
  | Each member pays | ₦5,000 · Fridays, 6 pm |
  | Members | 8, including you |
  | Each payout | ₦40,000 |
  | Payout order | Drawn when all 8 join |
  | If late | 1-day grace, then ₦500 fee |
  | Dates | Fri 6 Nov to Fri 25 Dec 2026 |

- Dark wallet card (ink): bank icon + "Group wallet at a licensed partner bank" / "Payments go straight into the group wallet. The app releases each payout on its date. No member, including you, can withdraw it."
- Checkbox (checked): "I agree to these rules. Any change later needs a group vote." The button is disabled until it is checked.
- Footer: **Create group** → M-11 and add the group to state.

### M-11 Invite members (`/groups/g-kasuwa-stall-weekly/invite`)
- Top bar "Invite members" + back → M-05.
- Success card (primarySoft): green check circle, "Kasuwa Stall Weekly is ready" / "Wallet opened at the partner bank".
- Invite link card: label "Invite link", grey box "adashenmu.app/join/kasuwa-stall-weekly" + copy icon (copy to clipboard, toast "Link copied"). Three outlined buttons: WhatsApp (opens `https://wa.me/?text=` with the link) · SMS · More (Web Share API).
- "Add by phone number" field "+234 806 221 0934" + 52 px green plus button.
- "Members" / "5 of 8 joined". List:
  - Zainab Musa · Aisha Bello · Fatima Yusuf · Hadiza Lawal: "Joined · ID verified", green shield icon.
  - Maryam Sani: "Invited · not opened yet", text action "Remind".

### M-12 Pay contribution (`/pay`)
- Top bar "Pay contribution" + back → M-04.
- Group selector card: pot tile, "Kasuwa Atamfa Adashe" / "Cycle 4 of 10 · due Wed 28 Oct", chevron-down.
- Amount card (centred): caption "Amount", Display "₦20,000", caption "Set by the group rules". The amount is not editable.
- H3 "How do you want to pay?" Radio list with dividers: bank icon **Bank transfer** "Send to the group wallet account" · card icon **Debit card** "Pay with a saved or new card" · hash icon **USSD** "No data needed. Dial from your phone." (selected).
- Note with lock icon: "Your money goes to the group wallet at the partner bank, not to any member."
- Footer: **Pay ₦20,000** → M-13 for USSD (for transfer or card, show a simple mock sheet, then M-14).

### M-13 Pay with USSD (`/pay/ussd`)
- Top bar "Pay with USSD" + back → M-12.
- "Your bank" chips: **GTBank** (selected) · Access · First Bank · UBA.
- Dark code card: "Dial this code" / Amount L "*737*000*5821047#" (white) / copy icon "Copy code".
- Steps card (numbered circles): "1 Dial the code from 0803 412 7765" · "2 Enter your bank PIN on your phone" · "3 Keep this screen open. We confirm it for you."
- Waiting card (accentSoft): clock "Waiting for your bank" / "This usually takes under a minute."
- Caption "Reference ADS-K4-0912".
- Footer: Primary **Dial now** (phone icon; opens `tel:` with the code) and Text **I have paid**, both → M-14.

### M-14 Receipt (`/pay/receipt`)
- Top bar "Receipt" + back → M-04.
- 64 px primarySoft ring with a 44 px green check circle. H1 "Payment sent". Display "₦20,000". Confirming badge.
- State timeline card: Pending (done) — Confirming (current, done) — In the pot (empty circle). After about 3 s, animate In the pot to done, switch the badge to In the pot, and update ledger and Home.
- Note: "The bank is confirming. It will show In the pot for everyone in a few minutes."
- Receipt card with these rows:

  | Label | Value |
  |---|---|
  | Group | Kasuwa Atamfa Adashe |
  | For | Cycle 4 · October |
  | Method | USSD · GTBank |
  | Paid to | Group wallet, partner bank |
  | Date | Mon 26 Oct, 9:41 |
  | Reference | ADS-K4-0912 |

- Footer row: Secondary **Share** (share icon) · Primary **Back to group** → M-06.

### M-15 Late payment reminder (`/late`): member view for Safiya, Fri 30 Oct
- Top bar "Kasuwa Atamfa Adashe" + back.
- Gentle reminder card (**accentSoft**, not red):
  - Header row: clock icon, "October contribution", Late badge.
  - H2 "A gentle reminder, Safiya".
  - Body: "Your ₦20,000 was due Wed 28 Oct and the 2-day grace period ended today, so the ₦1,000 fee your group agreed on now applies."
- Breakdown card: Contribution ₦20,000 · Late fee (goes into the pot) ₦1,000 · **Total to pay ₦21,000**.
- Card (calendar icon): "Hadiza's payout is tomorrow" / "Sat 31 Oct. Paying today keeps her payout on time."
- Note (info): "This rule was agreed by all 10 members when the group started. Only the app sends reminders; your name is not posted in the group chat."
- Link (globe): "Karanta da Hausa" (switches to Hausa).
- Footer: **Pay ₦21,000 now** → M-13. Text **Ask the group for more time** (message icon) → toast "Request sent to the group".

### M-16 Payout released (`/payout`): Hauwa, Mon 30 Nov, dark screen
- Ink background. Reversed pot illustration. Overline "MON 30 NOV · CYCLE 5 OF 10" (onDark). H1 "Your payout is on its way" (white). Display "₦200,000" in accent gold, about 44 px. Released badge.
- Details card (forestDeep): To "GTBank •••• 4821" · Account name "Hauwa Ibrahim" · From "Kasuwa Atamfa group wallet" · Released "Mon 30 Nov, 9:00 am".
- Note (users icon): "All 10 members paid on time this month. The group has been notified."
- Footer: Primary **View the ledger** → M-06. Text **Share the good news** (share icon, onDark).

### M-17 Activity (`/activity`, tab Activity)
- Top bar "Activity" (no back). Horizontal scroll filter chips: **All** (ink fill, white text) · Pending · Confirming · Late · Released. Filtering works on the list.
- Sections by date with cards (avatar, title, detail, amount + badge on the right):
  - **Today · Mon 26 Oct:** You paid · Kasuwa Atamfa (USSD · 9:41) ₦20,000 Confirming · Rukayya Adamu paid (9:12) ₦20,000 In the pot.
  - **Sun 25 Oct:** Maryam Sani paid (6:20 pm) ₦20,000 In the pot · Halima Garba paid (2:05 pm) ₦20,000 In the pot.
  - **Wed 30 Sep:** Payout to Fatima Yusuf (Cycle 3) ₦200,000 Released.
  - **Thu 24 Sep:** Your card payment (Bank declined) ₦20,000 Failed · Money returned to your card (Same day) ₦20,000 Refunded.

### M-18 Profile (`/profile`, tab Profile)
- Top bar "Profile" (no back).
- Header card: 56 px avatar HI (clay), H2 "Hauwa Ibrahim", "+234 803 412 7765", green shield "ID verified with NIN".
- Record card (primarySoft): check "Paid on time: 3 of 3 months" / "Your payment record in Kasuwa Atamfa".
- Settings list (36 px icon tiles + chevron):
  - Payout account: GTBank •••• 4821
  - Identity: NIN · verified 28 Jun 2026
  - Language: English · Hausa (opens the language switch)
  - Reminders: Push and SMS, 2 days before
  - Help and safety: How the group wallet works
  - Log out (red) → M-01

---

## 6. Business rules and money-state logic

- **States:** pending → confirming (member pays) → inThePot (bank confirms) → released (on payout day, for the whole pot).
- **Late:** if a contribution is still pending when the grace period ends (due date + graceDays), it becomes `late` and the agreed fee is added (Kasuwa Atamfa: 2 days, ₦1,000; Kasuwa Stall Weekly: 1 day, ₦500). The fee goes into the pot. Paying moves it to confirming → inThePot.
- **Failed and refunded** belong to a single payment attempt: confirming → failed → refunded. The contribution goes back to pending.
- **Pot total** = sum of contributions in the pot. Progress = inThePot ÷ size.
- **Payout release:** on the payout date the whole pot goes to that turn's member; their calendar row becomes Collected, and the next row becomes Next.
- **Payout order** is fixed, drawn or voted at creation and cannot be changed by one person. Swaps need both members to agree and group approval (not built in this version).
- **Verification:** paying is locked until the NIN is verified.
- **Reminders** come from the app (push and SMS, 2 days before the due date). The app never posts names of late payers to the group chat.

---

## 7. Accessibility

- Text contrast at least 4.5:1 (all token pairs above pass on their tints).
- Never rely on colour alone: badges always show a word and an icon.
- Touch targets at least 48 × 48 px; primary buttons 52 px high.
- Support system font scaling. Add `aria-label`s to icon-only buttons (back, bell, copy, plus).
- Amounts use tabular figures where possible.

## 8. Out of scope for this build

Real payments, a real bank or NIMC integration, a backend or authentication server, the treasurer view for several groups, turn-swap requests, auto-debit, in-app group chat, interest or loans.

## 9. Acceptance checklist

- [ ] All 19 screens match the images in `/screens` (layout, copy, colours, type).
- [ ] Tab bar navigation works on Home, Groups, Activity and Profile; Pay opens M-12.
- [ ] Four flows work end to end: onboarding (M-01 → M-02 → M-03 → M-04), join by invite (W-01 → M-02 → M-03 → M-04), pay (M-04 → M-12 → M-13 → M-14 → M-06), and create a group (M-05 → M-08 → M-09 → M-10 → M-11).
- [ ] Paying updates the ledger, Home pot card and Activity (₦140,000 → ₦160,000; 7 → 8 in the pot).
- [ ] The "What do these states mean?" sheet lists all 7 states.
- [ ] English/Hausa switch is wired to translation files.
- [ ] Naira always formatted as ₦20,000.
- [ ] Looks right at 390 px, and centred in a phone frame on desktop.
