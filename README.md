# Session: State Management in React
### Advanced Front-End Program  Building From Scratch with Vite

---

## How This Session Is Structured

Every step below follows the same pattern, so it's easy to follow whether you're studying alone or facilitating live:

> **Why we're doing this** plain explanation, no code
> 
> **The code** a clean, fully commented block, ready to copy
> 
> **Walkthrough** what the code actually does, line by line

Explanation and code are always kept in separate, clearly labeled blocks never mixed in the same paragraph so you can read the reasoning out loud without losing your place, or jump straight to a code block if you just need the syntax.

---

## Introduction: What Is State, and Why Does It Matter?

### The Core Idea

A React component is just a JavaScript function that returns some UI (JSX). By default, that function runs once, returns its UI, and is done it has no memory of anything. If you want a button click to *change what's on screen*, the component needs a way to remember information between renders, and a way to tell React "something changed, please redraw me."

That memory is called **state**, and the act of changing it (and telling React to redraw) is done through a *setter function* React gives you.

**A simple analogy:** think of a component like a whiteboard presenter who redraws the entire board from memory every time something changes. State is the sticky note the presenter checks before redrawing change the sticky note, and the next redraw reflects it. The presenter never erases just one part of the board by hand; they redraw the whole thing from the current sticky notes, every time. (React is actually smarter than this it only updates the parts of the *real* page that changed but the "redraw from current notes" mental model is exactly how to think about *your* code.)

### 1.2 State vs. Props Don't Confuse These

| | Props | State |
|---|---|---|
| Where it comes from | Passed in by a parent component | Owned by the component itself |
| Who can change it | Only the parent (by passing a new value) | The component itself, via its setter function |
| Purpose | Configure/customize a component from outside | Let a component remember and react to changes over time |

A component cannot change its own props if it needs to change something about itself over time (in response to a click, a timer, typed input, etc.), that "something" needs to be state.

### 1.3 Why We Need a Deliberate State Management Strategy

A single counter button can get away with one `useState` call and no real strategy. But as an app grows, three problems show up fast:

1. **Different pieces of data need different lifetimes and different "owners."** Some state belongs to one tiny component (is this dropdown open?). Some needs to be shared across many components (is the user logged in?).
2. **Components that aren't directly related still need to share data.** A filter sidebar and a results list are siblings, not parent/child without a plan, you either duplicate the data (and it goes out of sync) or pass it through components that don't actually need it themselves ("prop drilling").
3. **Update logic itself can get complicated.** "Add to favorites," "remove from favorites," and "clear all favorites" are three related operations on the same data scattering that logic across multiple `setX` calls gets messy fast.

State management is really just answering, deliberately, for every piece of data in your app: **Where does it live? Who can change it? Who needs to know when it changes?** Today's session builds up the three main tools React gives you to answer that `useState`, `useReducer`, and Context by building one real feature from nothing, step by step.

### 1.4 How State Works Under the Hood

This is the part that removes most "why isn't my UI updating?" confusion later, so it's worth sitting with.

When you call a state setter (e.g. `setCount(5)`):

1. React does **not** instantly change the variable and keep running your code, the way a normal JavaScript assignment would.
2. React **schedules a re-render** — it marks the component as "needs to update" and queues the new value.
3. On the next render pass, React calls your component function again, **from the top**. This time, the state hook returns the *new* value instead of the old one.
4. React builds a new description of the UI from your JSX and compares it to the previous version — a process called **reconciliation**.
5. React updates only the real DOM nodes that actually changed — not the whole page.
6. The browser paints the updated pixels.

**Two details that trip up almost everyone at first:**

- **Updates inside one event handler are batched.** Calling a setter twice in the same click handler doesn't necessarily cause two separate re-renders — React batches them. This is also why reading the state variable *immediately after* calling its setter, in the same function, still gives you the *old* value — it won't update until the *next* render.
- **Each render is its own snapshot.** A component re-runs completely on every render. Mutating existing state in place (e.g. `.push()`-ing into an array stored in state) doesn't trigger a re-render at all, because React only detects a change when the setter is called with a genuinely new value or reference — not when the existing one is edited quietly in memory.

### 1.5 What We're Building Today

Instead of several disconnected examples, this session builds **one real feature, from an empty project to a finished result**: a **"Save to Favorites"** feature for the property cards in your Booking Clone project, with a live saved-count shown in the header — the same pattern real booking/e-commerce sites use for wishlists.

By the end, you will have:
- A working Vite + React project
- Property cards with a working Save/Unsave button (`useState`)
- The save logic organized cleanly as your app's needs grow (`useReducer`)
- The saved count visible in a Header component that isn't a direct parent/child of the cards (Context)
- A final, fully working app you can run and click through

---

## Part 2 — Step-by-Step Build

### Step 1: Create the Project

**Why we're doing this:** every project needs a starting point. Vite gives us a fast dev server with instant hot-reload, so we can see every change immediately as we build.

**The code:**

```bash
npm create vite@latest favorites-demo -- --template react
cd favorites-demo
npm install
npm run dev
```

**Walkthrough:**
1. `npm create vite@latest` scaffolds a new project using Vite's React template.
2. `cd favorites-demo` moves into the new project folder.
3. `npm install` downloads the dependencies Vite set up for you.
4. `npm run dev` starts the local dev server — open the URL it prints (usually `http://localhost:5173`) to see the default Vite + React starter page.

---

### Step 2: A Static Property Card (No State Yet)

**Why we're doing this:** before adding state, it's worth seeing *why* we need it. Let's build the card with no interactivity at all, and notice what's missing.

**The code:**

Replace the contents of `src/App.jsx` with:

```jsx
function PropertyCard() {
  return (
    <div className="border rounded-lg p-4 w-64">
      <img
        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
        alt="Hotel room"
        className="rounded mb-2"
      />
      <h3 className="font-semibold">Lakeview Hotel</h3>
      <p className="text-sm text-gray-500">Kigali, Rwanda</p>

      {/* This button does nothing yet — clicking it has no effect */}
      <button className="mt-2 border rounded px-3 py-1">
        ♡ Save
      </button>
    </div>
  );
}

function App() {
  return <PropertyCard />;
}

export default App;
```

**Walkthrough:**
1. `PropertyCard` returns plain JSX — an image, a title, a location, and a button.
2. There is no `useState` anywhere, so this component has no memory at all.
3. Click the "Save" button — nothing happens, because nothing is telling React there's anything to redraw. This is the gap state is about to fill.

---

### Step 3: Make the Save Button Actually Work (`useState`)

**Why we're doing this:** we need the card to remember "is this saved or not," and to redraw itself the moment that changes. That's exactly what `useState` is for.

**The code:**

```jsx
import { useState } from "react";

function PropertyCard() {
  // "isSaved" is the current value. "setIsSaved" is the only way to change it.
  // It starts as false (not saved).
  const [isSaved, setIsSaved] = useState(false);

  function toggleSave() {
    // Functional update form: always base the new value on the previous one.
    setIsSaved((previous) => !previous);
  }

  return (
    <div className="border rounded-lg p-4 w-64">
      <img
        src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
        alt="Hotel room"
        className="rounded mb-2"
      />
      <h3 className="font-semibold">Lakeview Hotel</h3>
      <p className="text-sm text-gray-500">Kigali, Rwanda</p>

      <button onClick={toggleSave} className="mt-2 border rounded px-3 py-1">
        {isSaved ? "♥ Saved" : "♡ Save"}
      </button>
    </div>
  );
}

function App() {
  return <PropertyCard />;
}

export default App;
```

**Walkthrough:**
1. `useState(false)` gives the component a piece of memory, starting at `false`.
2. Clicking the button calls `toggleSave`, which calls `setIsSaved`, flipping the value.
3. React schedules a re-render. `PropertyCard` runs again, `useState` now returns the new value, and the button's label switches between "Save" and "Saved."
4. Try clicking fast multiple times — it always ends up correct, because we used the functional update form (`(previous) => !previous`) instead of reading the outer `isSaved` variable directly.

---

### Step 4: Multiple Cards — Where Should the Count Live?

**Why we're doing this:** one card works. But a real homepage has many cards, and the header needs to show a *total* saved count. This is the moment a single component's local state isn't enough — we need to **lift state up**.

**The code:**

```jsx
import { useState } from "react";

function PropertyCard({ id, name, isSaved, onToggleSave }) {
  return (
    <div className="border rounded-lg p-4 w-64">
      <h3 className="font-semibold">{name}</h3>
      <button onClick={() => onToggleSave(id)} className="mt-2 border rounded px-3 py-1">
        {isSaved ? "♥ Saved" : "♡ Save"}
      </button>
    </div>
  );
}

function Header({ savedCount }) {
  return <header className="font-bold p-4">Saved properties: {savedCount}</header>;
}

function App() {
  // The list of saved property ids now lives in the parent —
  // both Header and the cards need access to it.
  const [savedIds, setSavedIds] = useState([]);

  const properties = [
    { id: "1", name: "Lakeview Hotel" },
    { id: "2", name: "City Center Inn" },
  ];

  function toggleSave(id) {
    setSavedIds((previous) =>
      previous.includes(id)
        ? previous.filter((savedId) => savedId !== id) // remove it
        : [...previous, id]                            // add it
    );
  }

  return (
    <div>
      <Header savedCount={savedIds.length} />
      <div className="flex gap-4 p-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            name={property.name}
            isSaved={savedIds.includes(property.id)}
            onToggleSave={toggleSave}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
```

**Walkthrough:**
1. The saved-ids state moved from `PropertyCard` up to `App`, since both `Header` and every `PropertyCard` need to read or affect it.
2. `App` passes each card its own `isSaved` flag (computed from whether its id is in the list) and the shared `toggleSave` function, as props.
3. `Header` only receives a number — it doesn't need to know *how* saving works, just the current count.
4. This works cleanly because `Header` and the cards are all direct children of the same parent. Notice, though, that `toggleSave` had to be passed down through props — fine for now, but this is exactly the pattern that gets painful as components get deeply nested. That's the motivation for Steps 5 and 6.

---

### Step 5: Organizing the Update Logic (`useReducer`)

**Why we're doing this:** `toggleSave` is still simple, but real apps add more actions over time — add, remove, clear all, mark a default, etc. Instead of letting that logic spread across multiple functions, `useReducer` keeps every possible state change in one place.

**The code:**

```jsx
import { useReducer } from "react";

// All the ways saved-ids can change, described as plain actions.
function savedIdsReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload)
        : [...state, action.payload];

    case "CLEAR_ALL":
      return [];

    default:
      return state;
  }
}

function App() {
  // useReducer gives you: the current state, and a "dispatch" function
  // you call with an action object instead of calling a setter directly.
  const [savedIds, dispatch] = useReducer(savedIdsReducer, []);

  function toggleSave(id) {
    dispatch({ type: "TOGGLE", payload: id });
  }

  // ...Header and PropertyCard rendering stays the same as Step 4,
  // just calling this updated toggleSave function.
}
```

**Walkthrough:**
1. `savedIdsReducer` is a plain function: given the current state and an action describing what happened, it returns the new state. It never mutates `state` directly — every branch returns a brand-new array.
2. `dispatch({ type: "TOGGLE", payload: id })` doesn't change anything itself — it just hands the action to the reducer, which decides the new state.
3. Adding a "Clear all saved" button anywhere in the app is now a one-line `dispatch({ type: "CLEAR_ALL" })` — the logic for what that means already lives safely in the reducer.

---

### Step 6: Making It Available Anywhere (Context)

**Why we're doing this:** so far, `Header` and `PropertyCard` are direct children of `App`, so passing props down was easy. In a real project, `Header` usually lives in a completely separate part of the component tree from the property cards (e.g. inside a Layout component, several levels removed). Context lets any component read the saved-ids state directly, without passing it through every level in between.

**The code:**

Create `src/FavoritesContext.jsx`:

```jsx
import { createContext, useContext, useReducer } from "react";

const FavoritesContext = createContext(null);

function savedIdsReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload)
        : [...state, action.payload];
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
}

// Wraps part of the app and makes the favorites state available below it.
export function FavoritesProvider({ children }) {
  const [savedIds, dispatch] = useReducer(savedIdsReducer, []);

  return (
    <FavoritesContext.Provider value={{ savedIds, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// A small custom hook — this is what every component will actually call.
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }
  return context;
}
```

Update `src/App.jsx`:

```jsx
import { FavoritesProvider, useFavorites } from "./FavoritesContext";

function Header() {
  const { savedIds } = useFavorites();
  return <header className="font-bold p-4">Saved properties: {savedIds.length}</header>;
}

function PropertyCard({ id, name }) {
  const { savedIds, dispatch } = useFavorites();
  const isSaved = savedIds.includes(id);

  return (
    <div className="border rounded-lg p-4 w-64">
      <h3 className="font-semibold">{name}</h3>
      <button
        onClick={() => dispatch({ type: "TOGGLE", payload: id })}
        className="mt-2 border rounded px-3 py-1"
      >
        {isSaved ? "♥ Saved" : "♡ Save"}
      </button>
    </div>
  );
}

function App() {
  const properties = [
    { id: "1", name: "Lakeview Hotel" },
    { id: "2", name: "City Center Inn" },
  ];

  return (
    <FavoritesProvider>
      <Header />
      <div className="flex gap-4 p-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} id={property.id} name={property.name} />
        ))}
      </div>
    </FavoritesProvider>
  );
}

export default App;
```

**Walkthrough:**
1. `FavoritesProvider` wraps the whole app once, near the top, and owns the reducer state.
2. Both `Header` and `PropertyCard` call `useFavorites()` directly — neither one receives `savedIds` or `dispatch` as a prop anymore. They reach straight into the shared context.
3. You could now move `Header` into a completely separate `Layout.jsx` file, nested however deep you want, and it would still work with zero extra prop-passing — that's the entire point of Context.

---

### Step 7: Final Step — Persisting It (and Running the Finished App)

**Why we're doing this:** right now, refreshing the page loses every saved property. A real feature should survive a refresh. This is the last piece that makes today's build feel "finished."

**The code:**

Update the `FavoritesProvider` in `src/FavoritesContext.jsx`:

```jsx
import { createContext, useContext, useReducer, useEffect } from "react";

const FavoritesContext = createContext(null);

function savedIdsReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload)
        : [...state, action.payload];
    case "CLEAR_ALL":
      return [];
    default:
      return state;
  }
}

// Read any previously saved ids once, when the app first loads.
function getInitialSavedIds() {
  const stored = localStorage.getItem("savedIds");
  return stored ? JSON.parse(stored) : [];
}

export function FavoritesProvider({ children }) {
  const [savedIds, dispatch] = useReducer(savedIdsReducer, [], getInitialSavedIds);

  // Every time savedIds changes, write the latest value back to localStorage.
  useEffect(() => {
    localStorage.setItem("savedIds", JSON.stringify(savedIds));
  }, [savedIds]);

  return (
    <FavoritesContext.Provider value={{ savedIds, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }
  return context;
}
```

**Walkthrough:**
1. `getInitialSavedIds` runs once, reading anything previously stored in `localStorage` so the app doesn't start empty after a refresh.
2. `useReducer(savedIdsReducer, [], getInitialSavedIds)` — the third argument is a function React calls once, lazily, to compute the *real* starting state.
3. `useEffect` runs after every render where `savedIds` changed, saving the latest value back to `localStorage` so it survives a refresh.

**Run it:**

```bash
npm run dev
```

Open the app, click "Save" on a card, refresh the page — it stays saved. That's the finished feature: `useState` made one button interactive, lifting state up let a sibling component share it, `useReducer` organized the update logic as it grew, Context made it available without prop drilling, and `useEffect` made it persistent.

---

## Part 3 — Common Pitfalls

| Pitfall | What happens | Fix |
|---|---|---|
| Mutating state directly (`array.push(x)`) | React doesn't detect a change, no re-render happens | Always return a new array/object: `setState([...array, x])` |
| Reading state right after calling its setter, in the same function | You get the *old* value — updates aren't instant | Use the functional update form: `setState(prev => ...)` |
| Using an array index as a list `key` when the list can reorder | Items get mixed up or animate incorrectly | Use a stable, unique id from your data as the `key` |
| Storing computed/derived data in state instead of calculating it on render | State gets out of sync with its source | Calculate it directly in the component body, don't duplicate it |
| One giant global Context for everything | Any update re-renders every consumer, even unrelated ones | Split contexts by concern (e.g. `FavoritesContext`, `AuthContext`) |

---

## Part 4 — Practical Exercise

Using the final code from Step 7 as your starting point:

1. Add a third action to the reducer: `REMOVE_ALL_BUT_FIRST`, which keeps only the first saved id.
2. Add a "Clear all" button inside `Header` that dispatches `CLEAR_ALL`.
3. Apply this exact pattern to your real Booking Clone project: move the favorites logic into your actual `PropertyCard` and `Header` components from the homepage you built in the last session.

**Checkpoint questions — write short answers before moving on:**
- Why doesn't clicking "Save" twice quickly ever cause a bug here, even though state updates aren't instant?
- What would silently break if the reducer mutated `state` instead of returning a new array?
- Why does `Header` see the updated count immediately, even though it's not a parent or child of `PropertyCard`?

---

## Part 5 — Recap & Resources

**Recap:**
- State is memory a component owns that can change and trigger a re-render — props alone can't do this.
- React re-renders by re-running your component and comparing the new output to the old one, only touching the real DOM where something changed.
- `useState` → simple independent values. `useReducer` → related state with clear update logic. Context → sharing state across components that aren't directly related, without prop drilling.

**Resources:**
- React docs — State: https://react.dev/learn/state-a-components-memory
- React docs — useReducer: https://react.dev/reference/react/useReducer
- React docs — useContext: https://react.dev/reference/react/useContext
- Vite docs: https://vitejs.dev
