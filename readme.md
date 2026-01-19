## Run the demo

Install dependencies + running vite.

```bash
npm i
npx vite
```

Visit `http://localhost:5173/`

## Using local wavesurfer dependency

Remove remote

```bash
npm remove wavesurfer.js
```

Then install your local one, e.g.

```bash
npm i -D ../wavesurfer/.
```

If you update/build the local code, Vite should be able to detect and refresh to reflect the changes (good for instant testing).
