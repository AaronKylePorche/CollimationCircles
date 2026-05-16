# Collimation Circles

Collimation Circles is a local webcam-based collimation aid. It shows your camera feed with adjustable concentric circles, camera controls, image scale, zoom, and named presets.

## Download

1. Open the GitHub page for this project.
2. Click the green `Code` button.
3. Click `Download ZIP`.
4. Save the ZIP file to your Desktop.
5. Right-click the ZIP file and choose `Extract All`.
6. After extraction, you should have a folder on your Desktop named similar to:

```text
CollimationCircles-main
```

The exact folder name may be slightly different if you rename it.

## Install Node.js

This app needs Node.js to run the local server that saves presets.

1. Go to:

```text
https://nodejs.org/
```

2. Download and install the recommended LTS version.
3. After installing Node.js, continue below.

## Start The App

1. Open Command Prompt.
2. Run this command:

```cmd
cd %USERPROFILE%\Desktop\CollimationCircles-main
```

If you renamed the folder, replace `CollimationCircles-main` with your folder name.

3. Start the app:

```cmd
node server.js
```

4. Open your browser and go to:

```text
http://localhost:8001
```

5. Click `Start Camera`.
6. Allow camera permission when the browser asks.

## Stop The App

Go back to the Command Prompt window where `node server.js` is running and press:

```text
Ctrl+C
```

If Command Prompt asks `Terminate batch job (Y/N)?`, type:

```text
Y
```

Then press `Enter`.

## Presets

Named presets are saved inside the `presets` folder. Presets stay on your computer.

## Files

- `index.html`: app page
- `app.js`: app behavior
- `styles.css`: app layout and styling
- `server.js`: local server for the app and presets
- `presets`: local preset storage
