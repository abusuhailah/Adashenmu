# Adashenmu: project export

Group savings (adashe) mobile app, UI/UX case study by **Mustapha Shuaibu (Abusuhailah)** · Abusuhailah Limited · October 2026.

This package has everything needed to build the app in Google AI Studio (or with any developer): brand, design system, all screens, a build spec, mock data and the full case study.

> Concept project. Research and usability testing were simulated for portfolio purposes. Real money would be held by a licensed partner bank.

## Start here

1. **`01-AI-STUDIO-PROMPT.md`**: which files to attach, and the prompt to paste.
2. **`Adashenmu-App-Build-Spec.pdf`**: one file with the spec, tokens and all 19 screens (best single attachment).
3. **`02-BUILD-SPEC.md`**: the same spec as text: routes, every screen, business rules, accessibility and acceptance checklist.

## Folders

| Folder | Contents |
|---|---|
| `brand/` | Logo mark (SVG and PNG), reversed mark, lockups, app icons (1024/512/192), favicons, `BRAND-GUIDE.md` |
| `design-system/` | `design-tokens.json`, `tokens.css`, `tailwind.theme.js`, 41 icon SVGs, `design-system-board.png` |
| `screens/` | 19 high-fidelity screens at 2x (780 × 1688; the design size is 390 × 844), named by screen ID |
| `data/` | `mock-data.json` (the full story: users, groups, ledger, payout calendar, activity) and `types.ts` |
| `case-study/` | Full written case study (`Adashenmu-Case-Study.md`), the Figma case study page in 4 parts, the testing board, the walkthrough video (MP4) and its poster |

## Screens

| ID | Screen |
|---|---|
| M-01 | Welcome |
| M-02 | Phone and OTP |
| M-03 | Verify identity (NIN) |
| W-01 | Invite web page |
| M-04 | Home |
| M-05 | My groups |
| M-06 | Group ledger |
| M-07 | Payout calendar |
| M-08 | Create group: rules |
| M-09 | Create group: payout order |
| M-10 | Create group: review |
| M-11 | Invite members |
| M-12 | Pay contribution |
| M-13 | Pay with USSD |
| M-14 | Receipt |
| M-15 | Late payment reminder |
| M-16 | Payout released |
| M-17 | Activity |
| M-18 | Profile |

## Live design files

- Figma design file (all pages, components, prototype): https://www.figma.com/design/Fxd2664sKXCEiw1g747jvt
- Clickable prototype: https://www.figma.com/proto/Fxd2664sKXCEiw1g747jvt?page-id=1%3A7&node-id=4-3&starting-point-node-id=4%3A3&scaling=scale-down
- Case study page in Figma: https://www.figma.com/design/Fxd2664sKXCEiw1g747jvt?node-id=17-211
- FigJam research and ideation boards: https://www.figma.com/board/BJwyG9yErxu7Ws7E9aWEd5

A Figma design file can't be downloaded as a .fig file from here. To keep an offline copy, open the Figma link and use **File → Save local copy**.

## Product decisions

- Languages: **English and Hausa** only.
- Identity check: **NIN only**.
- Money states: Pending · Confirming · In the pot · Released · Late · Failed · Refunded ("Confirming" replaced "Paid" after testing).
