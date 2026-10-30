# Adashenmu: UX Case Study

Oct 26, 2026 · @Abusuhailah · Mustapha Shuaibu (Abusuhailah)

## Overview

Adashenmu (Hausa for “our adashe”) is a mobile app that runs a rotating savings group so every member sees the same record of who paid, who collects next and where the money is.

In an adashe (also esusu, ajo or jam’iyya), each member pays a fixed amount on a schedule and one member collects the whole pot each round. Adashenmu replaces the WhatsApp group and the organiser’s paper list with verified members, scheduled contributions, a payout calendar everyone can see and money held safely until it is paid out.

|  |  |
| --- | --- |
| Role | Lead UX/UI designer: research, IA, interaction and visual design, prototyping, testing |
| Designer | Mustapha Shuaibu (Abusuhailah) |
| Users | Group organisers, members, and optionally a cooperative or association admin |
| Platform | Mobile app, iOS and Android (390 px), plus a web page for invite links |
| Language | English, with an optional Hausa version |
| Timeline | 4 weeks, October to November 2026 |
| Tools | Figma, FigJam, Claude |

This is a self-initiated concept project. Research and usability testing are simulated for portfolio purposes. In a real launch, the money would be held by a licensed partner bank, not by Adashenmu.

## Problem

Adashe groups run on trust in one person and a WhatsApp chat, so when payments slip or the collector fails, there is no shared record to fall back on.

A typical group: 10 traders in a Kaduna market each pay ₦20,000 a month, and each month one of them collects ₦200,000. The organiser (often called the *mai adashe*) collects the cash or transfers, writes names in a notebook and announces whose turn it is in the group chat.

Where it breaks:

- **Late and missed payments.** The organiser chases members one by one; the person due to collect waits or gets less.
- **Turn disputes.** The payout order lives in the organiser’s head or notebook, so members argue about who agreed to which month and who has already collected.
- **One point of failure.** All the money passes through one person. If they spend it, fall ill or disappear, members have no proof of what they paid.
- **No history.** A reliable member has nothing to show the next group; an unreliable one can join a new group with a clean slate.
- **Hard to grow.** Groups stay small because trust doesn’t extend beyond people who know each other well.

**Problem statement.** Members of rotating savings groups need a shared, trustworthy record of contributions and payouts, because today the group’s money and its rules depend on one person’s notebook and memory, which leads to late payments, disputes and lost savings.

## Goals & Metrics

The design succeeds if a group can be set up and trusted without the organiser holding the money, and members always know where they stand.

| Goal | How it will be measured (in testing) | Target |
| --- | --- | --- |
| Start a group fast | Time to create a group and invite members | Under 2 minutes |
| Make the order of turns undisputed | Time for a member to find whose turn is next and when they collect | Under 10 seconds |
| Get contributions in on time | Members who set up automatic payment or a reminder during onboarding | 80% or more |
| Make money states clear | Members who correctly explain a pending, failed or refunded payment | 90% or more |
| Settle missed payments fairly | Organisers who can follow the missed-payment steps unaided | 5 of 6 or more |
| Easy to learn overall | Unaided task success / SUS score | 85% or more / 75 or more |

## Research Plan

One question drove the research: what would make people trust a savings group they can't see in person, and what breaks that trust today?

**Research questions**

1. How do adashe groups start, set the payout order and collect money today?
2. What goes wrong, how often, and who loses when it does?
3. What makes a member trust (or leave) a group?
4. Would people let an app hold the group's money, and what would they need to see first?
5. How do organisers handle a member who stops paying?

**Methods**

| Method | Who | Purpose |
| --- | --- | --- |
| Online survey | 56 people in active or recent groups | Size the problems and attitudes to an app |
| Interviews | 12: 5 organisers, 6 members, 1 market association treasurer | Understand the full cycle and the emotions behind it |
| Group observation | 2 payout days (a market traders' group and an office group) | See how money and turns are handled in practice |
| Competitor review | 5 products and the WhatsApp + notebook workaround | Find patterns, gaps and opportunities |

**Survey questions (Google Forms)**

1. How many savings groups are you in, and what is your role (organiser, member)?
2. How much do you contribute, and how often (daily, weekly, monthly)?
3. How is money collected: cash, bank transfer, or both?
4. How is the payout order decided?
5. In the last 12 months, has a member paid late, missed a payment, or left the group?
6. Have you ever lost money in a group? How much, roughly?
7. How do you know what you have paid so far?
8. Would you use an app that holds the group's money until payout? Why or why not?
9. What would make you trust it? (Bank partner, ID checks, seeing everyone's payments, reviews, other)
10. Which phone do you use most for banking?

**Interview guide (45 minutes)**

- Walk me through the last group you joined, from the first conversation to the final payout.
- Tell me about a time something went wrong. What did you do? How did it end?
- How do you decide whom to let into a group?
- What do you keep as proof of your payments?
- If an app held the money, what would worry you? What would reassure you?
- (Organisers) How much time does running the group take each month?

## Survey Results

Of 56 people in savings groups, 79% saw a late or missed payment in the last year and 30% have lost money in a group, yet only 18% would refuse an app that holds the money.

Note: this research is simulated for portfolio purposes. Figures are realistic estimates, not data from real participants.

**Respondents:** 56 people in Kaduna, Kano, Abuja, Jos and Lagos. 15 organisers (27%) and 41 members (73%). Traders 38%, salaried workers 34%, students and others 28%. 41% are in two or more groups.

| Finding | Result |
| --- | --- |
| How often members pay | Monthly 61%, weekly 25%, daily 14% (mostly market traders) |
| Typical contribution per round | Median ₦10,000 (from ₦500 daily to ₦100,000 monthly) |
| How money is collected | Bank transfer 38%, cash 29%, both 33% |
| How the payout order is set | Organiser decides 46%, draw 32%, agreed by need 22% |
| Saw a late or missed payment in the last 12 months | 79% |
| A payout was delayed because of it | 55% |
| Argued over whose turn it was | 36% |
| Ever lost money in a group | 30% (median loss ₦50,000) |
| Proof of what they've paid | Bank alerts or screenshots 52%, organiser's notebook 34%, nothing 14% |
| Would use an app that holds the money until payout | Yes 48%, maybe 34%, no 18% |
| Main worry (maybe or no) | The app or company disappearing with the money 61%, fees 22%, privacy 17% |
| What would build trust (pick any) | A licensed bank holding the money 70%, seeing everyone's payments 66%, ID checks on members 54% |
| Main phone | Android 89%, iPhone 11% |

Top open-ended comments: “The adashe is good, it's the people that spoil it,” “I paid for 8 months and the woman travelled before my turn,” “Every month I'm begging people like it's my own money.”

**What this changes:** trust has to be designed in, not claimed. The app must show who holds the money, show every member's payment status to the whole group, and verify members before they join.

## Interview & Observation Findings

Across 12 interviews and two payout days, the same pattern held: the group works when everyone can see the same record, and fails quietly when only the organiser can.

**Who we spoke to (simulated):** 5 organisers (3 market traders, 1 civil servant, 1 nurse), 6 members (traders, a teacher, a driver, two students, a tailor) and 1 market association treasurer who runs four groups.

**Patterns**

1. **The organiser is unpaid staff.** Organisers spend 3 to 6 hours a month chasing payments, confirming transfers against bank alerts and updating the notebook. Two said they keep running groups only because members asked them to.
2. **Bank alerts are the real ledger.** Members screenshot every transfer and post it in the group chat as proof. Cash payers have nothing but the organiser's word.
3. **The order of turns is political.** Members who “need it more” (a wedding, school fees, rent) ask to swap. Swaps happen in private chats, so others feel cheated.
4. **Late payers are known, but not named.** Everyone knows who pays late; nobody wants to shame them in the chat. Organisers cover the gap from their own pocket or delay the payout.
5. **Trust doesn't travel.** A member who has paid on time for years starts from zero in a new group, and a defaulter can join another group in the next street.
6. **Fear of apps is about who holds the money.** Several had heard of savings apps that collapsed. They want to know which bank holds the money and to see it is still there.

**Observation, payout days**

- *Market traders' group (12 members, ₦5,000 weekly):* the organiser collected cash stall to stall over two hours, wrote each name in an exercise book and handed ₦60,000 in an envelope to the week's collector. Two members were short; she added ₦4,000 of her own.
- *Office group (8 members, ₦50,000 monthly):* all payments by transfer. The organiser checked 8 bank alerts against a WhatsApp list, found one missing, and the payout was held for 3 days until it came in.

**Quotes**

- “It's my phone number on the account, so if anything goes wrong, they come to my house.” (Organiser, 41, Kano)
- “I don't mind paying. I mind not knowing if everyone else paid.” (Member, 29, Kaduna)
- “She moved my turn to December. December! I needed it in March.” (Member, 35, Jos)
- “If the bank is holding it, and I can see it, I'll join.” (Member, 24, Abuja)

## Competitor Analysis

The proven model is Egypt's Money Fellows and Saudi Arabia's Hakbah: licensed apps that digitise rotating savings at scale. In Nigeria, the big savings apps offer group or pooled saving, but not a rotating adashe run around a known group's own rules.

Checked 26 Oct 2026 from public pages and press; details of each product's flows were not verified in the apps themselves.

| Product | Model | Market | Strength to learn from | Gap Adashenmu can fill |
| --- | --- | --- | --- | --- |
| [Money Fellows](https://launchbaseafrica.com/2025/10/21/how-money-fellows-hit-profitability-by-digitising-egypts-informal-gameya-and-processing-1-5b) | Digital gam'eya (rotating circles), licensed by the Central Bank of Egypt | Egypt | Proof of scale: over 1 million customers and $1.5 billion processed; vets users with credit scoring and steps in when a slot is unfilled | Built for circles of vetted strangers in Egypt; not for an existing Nigerian group with its own organiser and rules |
| [Hakbah](https://www.wamda.com/en/2023/12/saudi-fintech-hakbah-raises-5-1-million-series) | Digital jam'iyah plus personal savings | Saudi Arabia | Frames the circle around a goal; over 500,000 users, 70% aged 21 to 35 | Saudi-only; not available to Nigerian groups |
| [Cowrywise Circles](https://cowrywise.com/blog/cowrywise-updates/cowrywise-circles-group-savings) | Group savings challenges and pooled collections | Nigeria | Shared progress and friendly accountability inside a trusted brand | A pooled savings challenge, not a rotating payout with a turn order |
| [PiggyVest](https://www.tekedia.com/nigerians-discuss-traditional-ajo-savings-in-digital-era-as-trust-moves-online/) | Savings circles with automatic contributions and digital records (as reported by Tekedia) | Nigeria | The most trusted savings brand in the market; automatic debits make saving effortless | Personal saving first; no organiser tools, turn order or missed-payment process for an adashe |
| WhatsApp + notebook | The organiser keeps the list and announces turns | Everywhere | Free, familiar, and the group already lives there | No proof, no reminders, money held by one person, disputes settled by memory |

**Lessons for Adashenmu**

- **Adopt:** a licensed partner holding the money (both scaled players lead with this), automatic contributions and reminders, member vetting before joining.
- **Add what's missing:** organiser tools for an existing group (invite, set rules, set or draw the order), a payout calendar every member sees, transparent payment status for the whole group, and a clear missed-payment process.
- **Earn trust:** show which bank holds the money on every money screen, give receipts for every payment, and let members carry a reliability record from group to group.
- **Meet people where they are:** invites and reminders shared on WhatsApp; Hausa as an option.

## Affinity Map

The notes from the survey, interviews and observations fell into six themes; late payments and the question of who holds the money came up most.

[Diagram: Simulated research · notes from the survey, 12 interviews and 2 payout-day observations]

Example notes per theme:

- **Late and missed payments:** “Every month I'm begging people” · organiser covers gaps from her own pocket · payout held 3 days for one missing transfer
- **Who holds the money:** “It's my phone number on the account” · fear of apps collapsing · “If the bank is holding it, I'll join”
- **Disputes over the order of turns:** private swaps for weddings and school fees · “She moved my turn to December”
- **The organiser does unpaid work:** 3 to 6 hours a month chasing and checking alerts · runs groups only because members ask
- **No proof of what was paid:** screenshots posted as receipts · cash payers have only the organiser's word
- **Trust does not travel between groups:** good payers start from zero · defaulters join the next street's group

The full board, with notes coloured by organiser, member and observation, will be built in FigJam.

## Key Insights

People don't distrust the adashe; they distrust not being able to see it. Every insight below turns something only the organiser can see into something the whole group can see.

| # | Insight | Design response |
| --- | --- | --- |
| 1 | Members trust what they can see, not what they're told. | A group board shows every member's status for the current round: paid, pending or late |
| 2 | Who holds the money decides whether people join. | The partner bank's name and the group's balance on every money screen; money released only at payout |
| 3 | The order of turns needs to be agreed once and then fixed. | Order set at the start (fixed, random draw or by request), shown on a payout calendar; swaps need both members to agree and the group is told |
| 4 | Late payments are a process problem, not a people problem. | Automatic debit, reminders before the due date, a grace period, and an agreed penalty that the app applies, so nobody has to chase or shame |
| 5 | The organiser needs relief, not more admin. | Organiser tools that confirm payments automatically and replace the notebook; the organiser never holds the money |
| 6 | Good payers deserve a record that travels. | A reliability badge built from on-time payments, visible when joining a new group |

## Personas

Three people built from the research: the organiser who carries the group (primary), a member who wants to know where he stands, and a treasurer who runs several groups. Names are fictional; research is simulated.

|  | Malama Hauwa Ibrahim (primary) | Ibrahim Suleiman (secondary) | Alhaji Musa Danladi (tertiary) |
| --- | --- | --- | --- |
| Role | Organiser (mai adashe) | Member | Market association treasurer |
| About | 38, sells atamfa fabrics in Kaduna Central Market | 27, ride-hailing driver in Abuja | 52, treasurer of a traders' association in Kaduna |
| Groups | Runs a 10-member group, ₦20,000 monthly (₦200,000 pot), and a weekly stall group | In 2 groups, ₦10,000 weekly, saving for a car deposit | Oversees 4 groups, about 60 members |
| Goals | Collect on time without chasing · never hold other people's money · keep her good name | Know his collection date · see that everyone paid · build a record to join bigger groups | One view of all groups · settle defaults by the association's rules · reports for meetings |
| Frustrations | 3 to 6 hours a month checking alerts and begging · covers gaps from her own pocket · members blame her for delays | Turn swaps made in private · no receipt when he pays in cash · starts from zero in every new group | Notebooks for each group · disputes brought to him with no proof · can't tell who is reliable |
| Quote | “Every month I'm begging people like it's my own money.” | “I don't mind paying. I mind not knowing if everyone else paid.” | “Bring me proof and I'll settle it. Nobody ever has proof.” |
| Tech | Android, bank app and WhatsApp daily; prefers voice notes and Hausa | Android, heavy app user, pays by transfer and USSD | Android and a laptop; uses WhatsApp and Excel |

## Empathy Map

Malama Hauwa runs the group because people trust her, and that trust is exactly what wears her down: every naira and every argument goes through her.

| Says | Thinks |
| --- | --- |
| “Please send your contribution before Friday.” · “I'll add it and you pay me back.” · “It's not my fault the payout is late.” | “If someone runs away with this money, they'll come to my house.” · “I'm tired of chasing grown people.” · “Maybe I should stop running groups.” |
| **Does** | **Feels** |
| Checks bank alerts against her notebook every evening · sends reminders one by one · holds the pot in her personal account · negotiates turn swaps in private chats | Proud to be trusted · anxious holding ₦200,000 that isn't hers · embarrassed when a payout is late · relieved when the round closes |

**Pains:** she is the bank, the debt collector and the judge, unpaid. **Gains she wants:** a group that runs itself, proof she can show anyone, and her name kept clean.

## Journey Map

Hauwa's lowest point is payout day when one member hasn't paid: she either delays the payout and takes the blame, or covers the gap from her own pocket.

|  | 1. Form the group | 2. Set the order | 3. Collect | 4. Chase late payers | 5. Pay out | 6. Swap or exit | 7. Close the cycle |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Actions | Invites people she knows on WhatsApp | Decides the order, or draws names | Checks alerts and cash against her notebook | Sends reminders one by one, calls, visits stalls | Transfers the pot from her personal account | Negotiates swaps in private chats | Announces the end; some ask to start again |
| Thoughts | “Can I trust the new lady?” | “Someone will say it's unfair.” | “Did Musa pay or not?” | “I'm tired of begging grown people.” | “If I'm late, they'll talk.” | “Why is this my problem?” | “Never again… until next month.” |
| Feeling | Hopeful · 4/5 | Uneasy · 3/5 | Busy · 3/5 | Frustrated · 2/5 | Anxious · 1/5 | Annoyed · 2/5 | Relieved · 4/5 |
| Pain points | No way to check a stranger | Order disputes from day one | Proof scattered across chats | Shaming people to get paid | Covers gaps or delays payout | Others feel cheated by private swaps | No record carried forward |
| Opportunities | Verified members with a reliability badge | Order fixed by draw or request, shown to all | Automatic debit and a live group board | Reminders, grace period and agreed penalty | Payout released by the bank when the round is complete | Swaps both members agree to, and the group is told | Cycle summary and a record for the next group |

## POV & How Might We

One challenge sits under all three people: make a savings group that everyone can see and nobody has to hold.

**Points of view**

- **Malama Hauwa, an organiser,** needs the group to collect and pay out on its own, because holding other people's money and chasing them is costing her time, money and her good name.
- **Ibrahim, a member,** needs to see that everyone has paid and exactly when he collects, because a turn he can't see feels like a turn he might lose.
- **Alhaji Musa, a treasurer,** needs one record of every group and payment, because disputes reach him with no proof on either side.

**How might we…**

1. …let a group save together without any one person holding the money?
2. …make the order of turns agreed once and visible to everyone?
3. …get contributions in on time without anyone chasing or shaming?
4. …show every member, at a glance, who has paid this round?
5. …handle a missed payment fairly, by rules the group agreed at the start?
6. …let a good payer carry their reputation into a new group?

**Pain point priority**

| Priority | Pain point | Who feels it | HMW |
| --- | --- | --- | --- |
| P1 | One person holds all the money | Organiser, members | 1 |
| P1 | Late and missed payments delay payouts | Everyone | 3, 5 |
| P1 | Nobody can see who has paid | Members | 4 |
| P2 | Disputes over the order of turns | Members | 2 |
| P2 | No proof when disputes reach the treasurer | Treasurer | 4, 5 |
| P3 | Trust doesn't travel between groups | Members | 6 |

# Ideate

The Define stage gave us three P1 pains: one person holds the money, payments arrive late or not at all, and nobody can see who has paid. Ideate turns those pains into principles that every screen must respect, a ranked feature list for the first release, the main user flows and the app structure.

## Design Principles

Each principle comes from a research insight. When two design options compete, the one that follows more of these principles wins.

1. **See it, don't be told.** Every member can see the full ledger of who paid, when, and how much. Nobody has to ask the organiser or scroll WhatsApp. *(Insight: nobody sees who paid.)*
2. **No one holds the money.** Contributions go into a bank-held group wallet, and a payout is released by the app on the agreed date, not by one person's goodwill. *(Insight: trust breaks when one person holds the pot.)*
3. **Rules agreed once.** Amount, frequency, payout order and late-payment rules are set when the group is created. Every member accepts them before joining, and changes need a group vote. *(Insight: turn disputes and unclear rules.)*
4. **Polite by default.** Reminders come from the app, not from Malama. The tone is respectful and the language is local (English and Hausa), so nobody is shamed in the group chat. *(Insight: organisers hate chasing friends and family.)*
5. **Money states are always clear.** Every naira is in one named state: pending, paid, in the pot, released or late. Colour is never the only signal; each state has a word and an icon. *(Insight: confusion about whether a transfer "landed".)*

## Feature Prioritisation (MoSCoW)

Features were scored against the P1 pains and the trust drivers from the survey (bank-held money 70%, seeing payments 66%, ID checks 54%). **Must** items make up the first release (MVP). **Should** items follow in the next release.

| Priority | Feature | Pain or insight it answers | Persona |
| --- | --- | --- | --- |
| Must | Create a group with rules (amount, frequency, size, payout order, late rule) | Rules agreed once; turn disputes | Malama |
| Must | Invite by link or phone number, with NIN identity check | Trust in strangers; ID checks 54% | Malama, Ibrahim |
| Must | Bank-held group wallet with a named partner bank | One person holds the money; bank-held 70% | All |
| Must | Pay contribution (bank transfer, card, USSD) with a receipt | Payments land in the right place | Ibrahim |
| Must | Shared ledger: who paid, when, and the money state | Nobody sees who paid; 66% | All |
| Must | Payout calendar showing whose turn is next | Turn disputes 36% | All |
| Must | Automatic payout release on the agreed date | Payout delayed 55% | Malama, Ibrahim |
| Must | Polite automatic reminders (push and SMS) | Late payments 79%; organisers chasing | Malama |
| Should | Late-payment handling (grace period, flag, agreed fee) | Late or missed payments | Malama |
| Should | Swap turn requests, approved by the group | Emergencies change who needs money first | Ibrahim |
| Should | Treasurer dashboard for several groups | Running 4 groups by notebook | Alhaji Musa |
| Should | Hausa language option | Polite by default; low-literacy members | All |
| Could | Auto-debit (direct debit mandate) | Members forget the due date | Ibrahim |
| Could | Member trust score from payment history | Choosing who joins | Malama |
| Could | Group chat inside the app | Replaces WhatsApp threads | All |
| Won't (this release) | Interest or returns on the pot | Not a savings product; regulatory scope | — |
| Won't (this release) | Loans against future payout | Credit risk; outside the trust problem | — |

The MVP covers all three P1 pains with eight Must features. Loans and interest were left out on purpose: they add risk and regulation, and the research showed that the core problem is trust, not returns.

## Core User Flows

Four flows carry the MVP. Flows 1 and 2 happen once per member; flows 3 and 4 repeat every cycle until each member has collected.

[Diagram: Core user flows · 4 flows, 16 steps]

- **Create a group (Malama).** Rules are set before anyone joins, so nobody can change the amount or the order later without a vote.
- **Join a group (Ibrahim).** The identity check comes before accepting the rules, so every member knows the others are real people.
- **Contribute.** The app sends the reminder, not the organiser. A missed payment goes through a grace period first and is then marked Late in the ledger for everyone to see.
- **Payout.** The release is automatic on the agreed date. This is the step that answers the main pain: no single person holds or releases the money.

## Sitemap

The app uses five bottom tabs, a common pattern on the Android phones that 89% of respondents use. Pay has its own tab because paying is the action members repeat most.

[Diagram: MVP sitemap · 5 tabs and the invite web page]

- **Home** answers the three questions members asked most: how much is in the pot, when is my next payment, and whose turn is next.
- **Groups** holds the ledger, payout calendar and rules for each group. This is where the principle *See it, don't be told* lives.
- **Activity** lists every naira with its money state, so a member can prove a payment without screenshots.
- **The invite web page** lets a new member see the group, its rules and who invited them before downloading anything, which lowers the trust barrier for strangers.
- The treasurer dashboard (a Should feature) will be added under Groups in the next release, for users like Alhaji Musa who run several groups.

# Design

## Design System

The system starts from the locked brand (forest, Adashe Green, coin gold, clay and cream) and adds what a money app needs: clear money-state colours, large readable numbers and touch targets that work on mid-range Android phones. It will be built in Figma as variables and components on the **04 Design System** page.

### Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| ink | #0B3D2E (Forest) | Headings, app bar, primary text |
| text-muted | #4F5F57 | Secondary text, captions |
| primary | #0F8A5F (Adashe Green) | Primary buttons, active tab, links |
| primary-pressed | #0B6E4B | Pressed state; green text on light tints |
| accent | #F2B33D (Coin Gold) | Pot total highlight, coin icon, "your turn" badge |
| heritage | #C8643B (Clay) | Illustrations and the zigzag pattern only, never for states |
| surface | #FFFFFF | Cards and sheets |
| background | #FAF7F0 (Cream) | Screen background |
| line | #E3DDCF | Dividers and card borders |

### Money-state tokens

Every state pairs a word and an icon with its colour, so colour is never the only signal (principle 5).

| State | Text / icon | Tint | Icon | Meaning |
| --- | --- | --- | --- | --- |
| Pending | #8A5A00 | #FFF4DB | Clock | Due, not yet paid |
| Paid | #0B6E4B | #E3F4EC | Check | Member has sent the money, bank confirming (shown as “Confirming” after testing; first called “Paid”) |
| In the pot | #0B6E4B | #E3F4EC | Pot | Confirmed in the group wallet |
| Released | #1D4ED8 | #E6EEFF | Arrow out | Paid out to this turn's member |
| Late | #B42318 | #FDECEA | Alert | Grace period ended, still unpaid |
| Failed | #B42318 | #FDECEA | Cross | A payment attempt did not go through |
| Refunded | #4F5F57 | #EEF0EE | Return | Money from a failed attempt returned |

[Diagram: Money states · 5 states a contribution can be in]

### Typography

- **Manrope** (the wordmark font) for headings and money amounts: Display 32/40 ExtraBold for the pot total; H1 24/32 Bold; H2 20/28 Bold; Amount 18/24 Bold with tabular figures.
- **Inter** for body and UI text: Body 16/24 Regular; Body small 14/20; Label 14/20 SemiBold; Caption 12/16 Medium.
- Naira amounts always show the ₦ sign and thousands separators (₦20,000), never shortened to "20k" in money states.

### Spacing, shape and touch

- 4-point spacing scale: 4, 8, 12, 16, 24, 32, 48. Screen side margin 20.
- Radius: 8 for inputs and chips, 12 for cards, 20 for bottom sheets, full for avatars and pills.
- Minimum touch target 48 × 48; primary buttons 52 high and full width at the bottom of the screen.
- Elevation: borders instead of heavy shadows, so screens stay clear on low-brightness phone screens.

### Core components

Button (primary, secondary, text, destructive) · Text field and amount field · OTP input · Money-state badge (7 states) · Pot card · Member row (avatar, name, state badge, amount) · Turn chip ("Your turn", "Next", "Collected") · Payout calendar row · Stepper (create-group steps) · Bottom tab bar (5 tabs) · Bottom sheet · Reminder banner · Receipt card · Language switch (English, Hausa) · Empty state with the pot illustration.

## Wireframes

Low-fidelity wireframes come before colour, so the structure can be checked against the flows. They are drawn in Figma at 390 × 844 (a common Android and iPhone width), in grey only, on the **05 Wireframes** page. The list below is the screen plan for the MVP.

| ID | Screen | Flow | What it must show |
| --- | --- | --- | --- |
| M-01 | Welcome | Start | Logo, tagline, language choice, Get started |
| M-02 | Phone and OTP | Start | Phone number, 6-digit code, resend timer |
| M-03 | Verify identity | Join | NIN (National Identification Number), why it is needed, partner-bank note |
| M-04 | Home | All | Pot card, next payment due, whose turn next, reminder banner |
| M-05 | My groups | Groups | Group cards with progress (paid members out of total) |
| M-06 | Group ledger | Groups | Cycle total, member rows with money-state badges |
| M-07 | Payout calendar | Groups | Turn order, dates, Collected / Next / Your turn chips |
| M-08 | Create group: rules | Create | Name, amount, frequency, size, late rule |
| M-09 | Create group: payout order | Create | Fixed, draw or vote; drag to reorder |
| M-10 | Review and confirm | Create | Summary of rules, partner-bank wallet, Confirm |
| M-11 | Invite members | Create | Share link, add by phone, invite status |
| W-01 | Invite web page | Join | Group, organiser, rules, Join button, works before download |
| M-12 | Pay contribution | Contribute | Amount, group, method: transfer, card or USSD |
| M-13 | USSD code | Contribute | Code to dial, copy button, waiting state |
| M-14 | Receipt | Contribute | Paid state, reference, Share receipt |
| M-15 | Late payment | Contribute | Late badge, agreed fee, Pay now, polite tone |
| M-16 | Payout released | Payout | Released state, amount, bank, Group notified |
| M-17 | Activity | Activity | Transactions grouped by date, filter by state |
| M-18 | Profile | Profile | ID check status, bank account, language, help |

## High-fidelity checklist

When the wireframes are approved, each screen moves to high fidelity with these checks:

- [ ] Every amount uses Manrope with tabular figures and the ₦ sign.
- [ ] Every money state uses its badge: word, icon and colour.
- [ ] Text contrast is at least 4.5:1 (WCAG AA) on cream and on tints.
- [ ] Partner-bank and "no one holds the money" messages appear on M-03, M-10, W-01 and M-16.
- [ ] Copy is checked in English, with Hausa versions for Home and the reminder.
- [ ] The story numbers agree across screens (Malama's group: 10 members × ₦20,000 = ₦200,000 per payout).
- [ ] A prototype links the four core flows, starting from M-01.

## Build in Figma

The design is built and linked as a clickable prototype.

- **Figma design file:** [Adashenmu — Group Savings App Case Study](https://www.figma.com/design/Fxd2664sKXCEiw1g747jvt). Pages: Cover, 01 Research, 02 Define, 03 Ideate, 04 Design System, 05 Wireframes, 06 Hi-Fi + Prototype, 07 Testing & Outcome, ★ Case Study.
- **FigJam boards:** [Adashenmu — Research & Ideation Boards](https://www.figma.com/board/BJwyG9yErxu7Ws7E9aWEd5). Ten boards: affinity map, key insights, personas, empathy map, journey map, competitors, POV and HMW, MoSCoW, core flows and sitemap.
- **Design system:** 29 colour variables, 11 text styles, 41 icons, and components for buttons, the seven money-state badges, turn chips, avatar, field, top bar, status bar and the five-tab bar.
- **Screens:** 19 high-fidelity screens at 390 × 844 (M-01 to M-18 plus the W-01 invite web page) and the matching grey wireframes.
- **Prototype:** 50 links and six starting points: Onboarding, Join by invite, Home ledger and pay, Create a group, Late payment, Payout released.

One story runs through every screen: Hauwa's Kasuwa Atamfa Adashe is in cycle 4 of 10 with ₦140,000 of ₦200,000 in the pot. Hadiza collects on Sat 31 Oct, and Hauwa's own turn is Mon 30 Nov.

# Test

## Usability Testing

Two rounds of moderated, think-aloud sessions on an Android phone, using the Figma prototype. Round 1 tested the first high-fidelity design; round 2 tested the changes. Each session took about 30 minutes.

Note: this testing is simulated for portfolio purposes. Participants are fictional and the figures are realistic estimates, not data from real sessions.

**Participants**

| # | Who | Role | Place |
| --- | --- | --- | --- |
| P1 | Aisha, 41, fabric trader | Organiser | Kaduna |
| P2 | Yusuf, 29, ride-hailing driver | Member | Abuja |
| P3 | Zainab, 34, teacher | Member | Zaria |
| P4 | Alhaji Bello, 55, association treasurer | Treasurer | Kano |
| P5 | Maryam, 22, student (prefers Hausa) | Member | Kaduna |

**Tasks and results**

| Task | Round 1 | Round 2 | Target |
| --- | --- | --- | --- |
| T1 Join a group from an invite link and verify with NIN | 4 of 5 · 1:50 | 5 of 5 · 1:25 | — |
| T2 Find out when you collect your payout | 3 of 5 · 14 s | 5 of 5 · 6 s | Under 10 s |
| T3 Pay this month's ₦20,000 by USSD | 5 of 5 · 1:10 | 5 of 5 · 0:58 | — |
| T4 Create a weekly group and invite members | 4 of 5 · 2:35 | 4 of 5 · 1:48 | Under 2 min |
| T5 Explain the difference between two money states | 3 of 5 | 5 of 5 | 90% or more |
| T6 Respond to a late-payment notice | 5 of 5 · 2 felt shamed | 5 of 5 · none felt shamed | No one feels shamed |
| **Overall** | **80% success · SUS 71** | **97% success · SUS 83** | **85% · SUS 75** |

## Findings and Iterations

Five problems came out of round 1. Each one was fixed in the design and checked again in round 2.

| # | Severity | Finding | Change | Round 2 |
| --- | --- | --- | --- | --- |
| 1 | High | “Paid” and “In the pot” looked the same. “If it says paid, why is it not in the pot? Did the money get lost?” (P3) | The state was renamed **Confirming**, so it reads as a step towards In the pot. The ledger now has “What do these states mean?” | 5 of 5 explained the states |
| 2 | High | People could not find their own turn quickly. “Your payout… is that my turn or what I have collected?” (P2) | The Home tile now says “Your turn to collect” with a countdown: “Mon 30 Nov · in 35 days” | Average 6 s, down from 14 s |
| 3 | Medium | Creating a group took 2:35. “I already know what kind of group I want. Why so many boxes?” (P1) | Templates (Monthly market, Weekly stall) fill in the amount, frequency, size and late rule | Average 1:48 |
| 4 | Medium | The late notice felt like public shaming. “Red with ‘late’, it feels like everyone is pointing at me.” (P5) | A softer amber card titled “A gentle reminder”, the fee framed as the group's own rule, and “Ask the group for more time”. The Late badge stays. | No one said they felt shamed |
| 5 | Low | No NIN to hand during sign-up. “My NIN slip is at home. Can I come back to this?” (P2) | “I don't have my NIN with me” saves progress and sends a reminder; paying stays locked until the NIN is verified | 5 of 5 completed or saved the step |

One problem remains: in round 2, P4 (the treasurer) still wanted to type a fixed order rather than use a template. The treasurer view planned for the next release is the place to solve this.

## Outcome

| Measure | Round 1 | Round 2 |
| --- | --- | --- |
| Task success | 80% | 97% |
| SUS score | 71 | 83 |
| Time to find your turn | 14 s | 6 s |
| Money states explained correctly | 60% | 100% |
| Time to create a group and invite | 2:35 | 1:48 |

Four of the six goals set at the start were measured, and all four were met in round 2: creating a group, finding your turn, understanding money states, and overall ease (task success and SUS). The other two, reminder set-up during onboarding and organisers handling a missed payment unaided, need their own tasks in the next round. Next round also: test the treasurer view with association treasurers, and test the Hausa version with members who prefer it.

The before and after screens for each finding are on the **07 Testing & Outcome** page of the Figma file.

# Portfolio Copy

Ready-to-paste text for the portfolio website and LinkedIn. The same text, with copy buttons, is on the Adashenmu tab of the Portfolio Hub. The prototype walkthrough video (57 s, tech background music) goes with the LinkedIn post.

## Summary (one line)

End-to-end UX for a group savings (adashe) app in Nigeria: NIN-verified members, a bank-held group wallet and a ledger everyone can see, which reached 97% task success and SUS 83 in testing.

## Case study body

In Nigeria, millions save through rotating savings groups (adashe, esusu, ajo): each member pays a fixed amount and one member collects the whole pot each round. The groups run on a WhatsApp chat and the organiser's notebook, so one person holds the money, payments arrive late, and members argue over whose turn it is. Adashenmu is a mobile app that gives the whole group one record it can trust. I led the work end to end: research with 56 survey respondents, 12 interviews and two payout-day observations showed that 79% had seen a late or missed payment in a year, 30% had lost money in a group, and 70% would trust an app if a licensed bank held the money. I designed a bank-held group wallet that releases each payout on the agreed date, NIN checks for every member, a shared ledger with seven named money states, a payout calendar fixed by a draw, USSD payments that work without data, and polite reminders in English or Hausa. I delivered a design system, 19 high-fidelity screens and a prototype with six starting points, then ran two rounds of testing with five people and made five changes, including renaming one money state from "Paid" to "Confirming". This is a self-initiated concept project; the research and usability testing were simulated for portfolio purposes.

**Result:** task success rose from 80% to 97%, the SUS score from 71 to 83, and members found their turn to collect in 6 seconds instead of 14.

## Short version

Adashenmu runs a rotating savings group so no single person has to hold the money: members verify with their NIN, contributions go to a bank-held group wallet, and everyone sees the same ledger and payout calendar. I led research, IA and UI design for the mobile app and its invite web page, delivering a design system, 19 screens and a prototype tested over two rounds. The research and testing were simulated for this portfolio project.

**Result:** 97% task success, SUS 83, and your turn found in 6 seconds.

## LinkedIn caption

The full caption, with its emojis and hashtags, is on the Adashenmu tab of the Portfolio Hub, ready to copy. It explains how AI and I worked together: AI drafted and produced; I chose the problem, the name and the logo direction, made the product calls (English and Hausa only, NIN as the single identity check), and directed testing and the five changes. It also shares the key finding: one word, “Paid” to “Confirming”, took understanding of money states from 60% to 100%.

## Sources

Competitor facts only; all survey and interview figures are simulated.

- [How Money Fellows hit profitability by digitising Egypt's informal gam'eya](https://launchbaseafrica.com/2025/10/21/how-money-fellows-hit-profitability-by-digitising-egypts-informal-gameya-and-processing-1-5b), Launch Base Africa, 21 Oct 2025
- [Saudi fintech Hakbah raises $5.1 million Series A](https://www.wamda.com/en/2023/12/saudi-fintech-hakbah-raises-5-1-million-series), Wamda, Dec 2023
- [Cowrywise Circles: group savings](https://cowrywise.com/blog/cowrywise-updates/cowrywise-circles-group-savings), Cowrywise blog
- [Nigerians discuss traditional ajo savings in the digital era](https://www.tekedia.com/nigerians-discuss-traditional-ajo-savings-in-digital-era-as-trust-moves-online/), Tekedia, 6 Nov 2025
