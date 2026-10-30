# Prompt for Google AI Studio (Build mode)

## Files to attach

AI Studio accepts images, PDFs and text files. If it will not take the whole zip, attach these:

1. `Adashenmu-App-Build-Spec.pdf`: everything in one file (spec, design tokens, all 19 screens). Attach this first.
2. The 19 screen images in `screens/` (attach the ones for the part you are building if there is a limit).
3. `design-system/design-tokens.json` and `data/mock-data.json`. If these file types are refused, paste their contents into the chat.
4. Optional: `brand/adashenmu-mark.svg`, `brand/adashenmu-mark-reversed.svg` and `brand/adashenmu-app-icon-512.png`.

## Prompt to paste

```
Build "Adashenmu", a mobile-first web app (React + TypeScript + Tailwind) for rotating savings groups (adashe) in Nigeria. Follow the attached build spec exactly; the attached screen images are the visual source of truth, so match their layout, copy, colours and type.

Key requirements:
- 390 px wide mobile layout; on desktop, centre it in a 390 × 844 phone frame on a cream (#FAF7F0) background.
- Fonts: Manrope (headings and naira amounts) and Inter (body) from Google Fonts.
- Use the colour tokens, money-state badges, turn chips and components described in the spec and design-tokens.json.
- Build all 19 screens with the routes in section 3 of the spec, a 5-tab bottom bar (Home, Groups, Pay, Activity, Profile; Pay is a raised green circle), and the four flows: onboarding, join by invite, pay a contribution (USSD), and create a group.
- Load mock-data.json as app state. The logged-in user is Hauwa Ibrahim, organiser of "Kasuwa Atamfa Adashe" (10 members × ₦20,000 monthly, cycle 4 of 10, ₦140,000 of ₦200,000 in the pot).
- Simulate payment: the user's contribution goes Pending → Confirming → In the pot (after about 3 seconds), and the pot total, ledger counts, Home and Activity update.
- Money states always show a word and an icon: Pending, Confirming, In the pot, Released, Late, Failed, Refunded.
- Format naira as ₦20,000 (never "20k").
- Identity check is NIN only. Languages: English and Hausa (put strings in en.json and ha.json; leave Hausa values I have not provided as English placeholders marked TODO).
- No real payments, bank or NIMC calls; everything is mocked.
- Add a small demo menu on the Profile screen to open the Late payment (M-15) and Payout released (M-16) screens.

Start with the design tokens, shared components (status bar, top bar, tab bar, buttons, badges, chips, cards, fields), then build the screens in the order of the spec.
```

## Follow-up prompts

- "Compare the Home screen with M-04-home.png and fix any differences in spacing, colours or copy."
- "Add the 'What do these states mean?' bottom sheet on the ledger."
- "Make the Create a group form compute the payout and the date range live."
- "Add the Hausa translations from this list: …" (paste your own Hausa text).
