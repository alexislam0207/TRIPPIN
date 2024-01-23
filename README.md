# Setup (for the team)

## 1. Reinstall packages
(just in case, I got some weird errors when I skipped this step)

Upon switching to this branch, delete your current node modules and package-lock.json, and run `npm install`

## 2. Install the latest development build for your platform:

### Android

To run on your phone: Find the latest android development build at the Expo project page > Builds. Go to the build page, scan the QR Code.

To run on the emulator:
```sh
# Step 1:
sudo npm install -g eas-cli

# Step 2: login using expo account credentials
eas login

# Step 3: confirm you're logged in
eas whoami

# Step 4: install build
eas build:run -p android --latest
```

### IOS

To run on your phone: Haven't tried it, the docs say you'll need a paid apple developer account

To run on the simulator:
```sh
# Step 1:
sudo npm install -g eas-cli

# Step 2: login using expo account credentials
eas login

# Step 3: confirm you're logged in
eas whoami

# Step 4: install build
eas build:run -p ios --latest
```
- Notes: For ios,
   - Haven't tested it myself, but steps 1-3 should be the same as android. Take a look at these [docs](https://docs.expo.dev/build-reference/simulators/#installing-build-on-the-simulator) if you encounter any error at step 4.

This installs the build on your phone/emulator/simulator. The build doesn't have to be reinstalled again until any new plugins are added.

## 3. Start server

Once the build is installed, run as you would normally do with Expo Go using `npx expo start`!

(`npx expo start -c` if you have cache issues)
