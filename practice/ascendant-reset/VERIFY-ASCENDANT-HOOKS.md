# Ascendant hook text – verification & deploy

The hero subtext (“Energy moves fast here. Structure keeps it effective.” etc.) is **already in the HTML files** in this repo.

## 1. Confirm the files (local)

- Open `practice/ascendant-reset/leo.html` in your editor.
- Go to around line 117. You should see:
  ```html
  <p class="leo-hook">Expression is strong.<br>Structure sustains impact.</p>
  ```
- If you see that, the source files are correct.

## 2. See it in the browser (local)

From the **project root** (the folder that contains `index.html`, `reset-now.html`, `practice/`):

```bash
python3 -m http.server 8000
```

Then open: **http://localhost:8000/reset-now.html** → click **Leo** → you should see “Expression is strong. Structure sustains impact.”

## 3. If you use a live site (Netlify, Vercel, GitHub Pages, etc.)

The live site will show the new text **only after** you deploy the current repo:

1. Save all files.
2. Commit and push (include the ascendant HTML files and build script).
3. Wait for the deploy to finish.
4. Open the live URL, go to Leo, then do a **hard refresh** (Cmd+Shift+R or Ctrl+Shift+R).

If you still see old text, use “View Page Source” on the Leo page and search for “Expression is strong”. If it’s in the source, the browser is caching; try another browser or incognito. If it’s not there, the deploy is serving an old build.
