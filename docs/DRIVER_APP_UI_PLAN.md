# Ambulance Driver App: UI Plan

For Dev C. Screens for the driver mobile app only. API details and task IDs (C1 to C12) are in [HACKATHON_ROADMAP.md](HACKATHON_ROADMAP.md), sections 5 and 8.

The same design works in Flutter or React Native.

**User:** an ambulance driver with one hand free, in a moving vehicle, often in bright sun.

**Goal of every screen:** the driver knows the next step within 2 seconds.

---

## 1. Screen flow

```
Login
  |
Permissions (location, notifications)
  |
Home (Available / Offline)  <-----------------------------+
  |                                                       |
  | ambulance:offer                                       |
  v                                                       |
Job offer --- Reject, timeout or offer closed ------------+
  |
  | Accept
  v
Drive to patient
  |
  | ARRIVED
  v
Pickup (wait for destination)
  |
  | PATIENT PICKED UP
  v
Drive to hospital
  |
  | COMPLETE TRIP
  v
Trip complete --- Done -----------------------------------+
```

The doctor and patient choose the hospital. The driver does not, except in the fallback in 3.6.

If the doctor releases the ambulance, `ambulance:job-released` shows a full screen "Job cancelled" from any job screen, then returns to Home.

If the app is closed and reopened during a job, call `GET ambulance/me` and return to the correct screen. A driver must never lose a job.

---

## 2. Design rules

1. **One main button per screen.** It is always at the bottom, within thumb reach.
2. **Show severity with a word and a colour.** Never colour alone.
3. **Keep Accept and Reject far apart,** so a bump in the road cannot cause a wrong tap.
4. **Taps act at once.** The only confirmation is on `COMPLETE TRIP`.
5. **Connection is always visible.** A driver who is offline must know it.
6. **Keep the screen on during a job.**
7. **Label simulated movement.** Demo Drive always shows `SIMULATED`.

### Colours

```
primary      #4F46E5   same as the web app
background   #0F172A   dark, easier to read in a vehicle
surface      #1E293B   cards and panels
text         #F8FAFC
text-muted   #94A3B8
red          #EF4444
yellow       #F59E0B   use dark text on this colour
green        #10B981   use dark text on this colour
```

### Sizes

| Item | Minimum |
|---|---|
| Main button height | 64 |
| Main button text | 20, bold |
| Other tap targets | 48 |
| Body text | 16 |
| ETA and distance | 28, bold |
| Offer countdown | 56, bold |
| Side margin | 16 |

Follow the system font. Check the layout with the phone's large text setting turned on.

---

## 3. Screens

### 3.1 Login

```
+----------------------------+
|                            |
|        Clinic Cloud        |
|         Ambulance          |
|                            |
|  Email                     |
|  [                      ]  |
|  Password                  |
|  [                      ]  |
|                            |
|  [         LOG IN        ] |
|                            |
+----------------------------+
```

- **API:** `POST auth/login`. Save the JWT and clinic ID, and send `Authorization` and `x-tenant-id` on later requests.
- Keep the driver logged in after the app closes.
- **Wrong details:** "Email or password is wrong."
- **No network:** "No internet. Check your connection."
- **User is not a driver:** "This account has no ambulance assigned."

### 3.2 Permissions

Show once, before Home.

```
+----------------------------+
|                            |
|   Allow location and       |
|   notifications            |
|                            |
|   Location shows the       |
|   doctor where you are.    |
|                            |
|   Notifications help you   |
|   hear new jobs.           |
|                            |
|  [       CONTINUE        ] |
+----------------------------+
```

- **Location denied:** "Location is needed to receive jobs." Add `OPEN SETTINGS`. The driver cannot go Available without it.
- **Notifications denied:** continue, but keep the warning on Home.

### 3.3 Home

```
+----------------------------+
| RJ-XX-XX-1234      [menu]  |
| * Connected                |
|                            |
|                            |
|         AVAILABLE          |
|     Waiting for a job      |
|                            |
|    Keep this app open      |
|                            |
|                            |
|  [      GO OFFLINE       ] |
+----------------------------+
```

- **API:** `GET ambulance/me`, `PATCH ambulance/me/status`, socket `/events`.
- **Location:** send `POST ambulance/me/location` every 5 seconds while Available, so dispatch can find the nearest ambulance.

| State | What the driver sees |
|---|---|
| Available | Green `AVAILABLE`, button `GO OFFLINE` |
| Offline | Grey `OFFLINE`, "You will not get jobs", button `GO AVAILABLE` |
| Socket down | Red banner: "Reconnecting. You may miss jobs." |
| GPS off | Red banner: "Turn on location." `GO AVAILABLE` is disabled |

### 3.4 Job offer

This takes over the whole screen, from any state, with loud sound and vibration until the driver responds.

```
+----------------------------+
| ███ RED: CRITICAL ████████ |
|                            |
|            00:24           |
|         to respond         |
|                            |
|  Chest pain, breathless    |
|                            |
|  2.4 km away               |
|  Near Hiran Magri          |
|                            |
|                            |
|  [ Reject ]                |
|                            |
|                            |
|  [        ACCEPT         ] |
+----------------------------+
```

- **Trigger:** socket `ambulance:offer`.
- **API:** `POST emergencies/:id/ambulance/accept` or `.../reject`.
- **Header colour:** RED or YELLOW, with the word always shown.
- **Rule:** the driver sees only what is needed: summary, severity, distance and area.

| State | What the driver sees |
|---|---|
| Accepting | Spinner on the button, button disabled |
| Timer reaches 0 | "Job sent to another driver." Return to Home after 2 seconds |
| `ambulance:offer-closed` | Same message |
| `409`, already taken | "Another driver took this job." Return to Home |
| Accept failed | "Could not accept. Try again." Keep the timer running |

### 3.5 Drive to patient

```
+----------------------------+
| RED  Chest pain, breathless|
| To patient       SIMULATED |
|                            |
|          ( map )           |
|                            |
|    (A)-----route-----(P)   |
|                            |
|                            |
+----------------------------+
| 7 min           2.4 km     |
| [ Navigate ] [Call patient]|
|                            |
| [        ARRIVED         ] |
+----------------------------+
```

- **API:** `GET emergencies/:id/route?to=patient`, `POST ambulance/me/location`, `PATCH emergencies/:id/ambulance/status`.
- **Map:** ambulance marker turned to the direction of travel. Patient pin. Route line. Fit both on screen.
- **Navigate:** opens Google Maps with the destination.
- **Call patient:** opens the phone dialler.
- **`SIMULATED`:** only when Demo Drive is on.

| State | What the driver sees |
|---|---|
| Route failed | Show both pins and "Route unavailable. Use Navigate." Navigate still works |
| Map failed | Show address, distance and Navigate |
| Offline | Banner: "Offline. Updates will send when you are back online." |
| Destination confirmed while driving | Banner: "Hospital: {name}." Keep driving to the patient |

### 3.6 Pickup

The driver is with the patient. The doctor is on the video call and the patient must agree to the hospital.

```
+----------------------------+
| RED  Chest pain, breathless|
| At patient                 |
|                            |
|   Waiting for the doctor   |
|   to confirm the hospital  |
|                            |
|   (spinner)                |
|                            |
| [Call patient]             |
|                            |
| [   PATIENT PICKED UP    ] |  disabled
+----------------------------+
```

After `ambulance:destination`:

```
+----------------------------+
| RED  Chest pain, breathless|
| At patient                 |
|                            |
|   Go to                    |
|   {hospital name}          |
|   3.8 km, about 11 min     |
|                            |
|                            |
| [Call patient]             |
|                            |
| [   PATIENT PICKED UP    ] |
+----------------------------+
```

- **API:** socket `ambulance:destination`, `PATCH emergencies/:id/ambulance/status` with `TO_HOSPITAL`.
- If the app missed the event, `GET ambulance/me` still returns the destination.

| State | What the driver sees |
|---|---|
| No destination | Waiting text. `PATIENT PICKED UP` is disabled |
| Patient declined | Same waiting text. The doctor decides. Only `ambulance:job-released` ends the job |
| No doctor has accepted, or 3 minutes have passed | `Use nearest hospital` link appears |
| `Use nearest hospital` | `GET emergencies/:id/hospitals`, nearest first. Tap one to call `PATCH emergencies/:id/hospital` |
| Hospital list failed | Show one fixed Udaipur hospital, so the job can still finish |

### 3.7 Drive to hospital

The same layout as 3.5, with these changes:

- Header says `To {hospital name}`.
- Route uses `?to=hospital`.
- Main button is `COMPLETE TRIP`.

Tapping `COMPLETE TRIP` asks: "Patient handed over to the hospital?" with `Yes` and `Cancel`.

### 3.8 Trip complete

```
+----------------------------+
|                            |
|       Trip complete        |
|       {hospital name}      |
|                            |
|  Extra, if built:          |
|  AI summary. Doctor to     |
|  verify.                   |
|  ALLERGY: Penicillin       |
|  Doctor notes: ...         |
|                            |
| [          DONE          ] |
+----------------------------+
```

- `DONE` returns to Home with status Available.
- **The AI summary is an extra (C10).** Build this screen without it first.
- **If built:** `POST emergencies/:id/handoff`, allergies first in red, "Preparing summary..." while loading. On failure show doctor notes with `Retry`. Never block `DONE`.

---

## 4. Status and main button

| `ambulanceStatus` | Screen | Main button | API on tap |
|---|---|---|---|
| `OFFERED` | Job offer | `ACCEPT` | `POST .../ambulance/accept` |
| `ACCEPTED` | Drive to patient | `ARRIVED` | `PATCH .../ambulance/status` with `ARRIVED` |
| `ARRIVED` | Pickup | `PATIENT PICKED UP`, once a destination exists | `PATCH .../ambulance/status` with `TO_HOSPITAL` |
| `TO_HOSPITAL` | Drive to hospital | `COMPLETE TRIP` | `PATCH .../ambulance/status` with `COMPLETED` |
| `COMPLETED` | Trip complete | `DONE` | Go to Home, `PATCH ambulance/me/status` with `AVAILABLE` |
| `RELEASED` | Job cancelled | None | Return to Home |

---

## 5. Sound, vibration and network

**Offer alert**
- Play a loud looping sound, and vibrate until the driver responds or the timer ends.
- Bundle the sound in the app. Do not stream it.
- Test at full volume on the real phone.
- For the hackathon, the app must stay open. FCM push for a closed app is a stretch goal.

**Network loss**
- Reconnect the socket automatically.
- On reconnect, call `GET ambulance/me` to catch any missed job or status change.
- Queue status changes and send them in order.
- For location, send only the latest position.

---

## 6. Demo Drive

This lets the ambulance move on screen while we stay in the hall.

- Show the switch only when the server has `DEMO_MODE=true`. Put it on the Drive screen menu.
- It moves the ambulance along the route polyline and posts each position with `simulated: true`.
- A yellow `SIMULATED` label stays on screen, and the doctor dashboard shows it too.
- Say out loud in the demo that this movement is simulated.

---

## 7. Final check

- [ ] Fresh install asks for permissions and reaches Home
- [ ] Offer appears on top of any screen, with sound at full volume
- [ ] Accept, Reject and timeout all work
- [ ] Two drivers: only one can take a job
- [ ] App restart during a job returns to the correct screen
- [ ] Airplane mode on and off recovers, and queued updates arrive
- [ ] Map, Navigate and Call patient work on a real phone
- [ ] Patient's Yes on WhatsApp turns on `PATIENT PICKED UP`
- [ ] `PATIENT PICKED UP` stays off with no destination
- [ ] `Use nearest hospital` appears when no doctor has accepted, or after 3 minutes
- [ ] `Release ambulance` on the doctor screen ends the job on the phone
- [ ] Route, hospital list and summary failures do not block the job
- [ ] Screen stays on during a job
- [ ] Readable in bright light and at arm's length
- [ ] `SIMULATED` shows during Demo Drive
- [ ] Release build works with no dev server, on 2 phones

**Not this weekend:** chat, earnings, trip history, profile editing, dark and light theme switch, in-app turn-by-turn navigation, language settings.
