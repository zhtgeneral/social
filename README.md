# Social media app

### What it does

The mobile app allows users to create, like, share, and comment on posts and create personal profiles.

The UI is styled for mobile devices and works in realtime.

### How to recreate

##### Third party steps

Expo, React Native

- `npx create-expo-app@latest`

Run app:

- run `npx expo start`
- IOS on separate device:
  - Download ExpoGO  
  - Scan QR code
- Virtual Android device:
  - Download Android studio
  - Add `C:\Users\<user>\AppData\Local\Android\Sdk\platform-tools` and `C:\Users\<user>\AppData\Local\Android\Sdk\emulator` to PATH env variable (restart required)
  - Run with command `a` after expo has started
- Web:
  - Set `"output": "single"` instead of `"output": "static"` in app.json ([example](/app.json))
  - Run with command `w` after expo has started

Supabase:

- Create project on Supabase dashboard
- Setup database:
  - `npm install supabase`
  - `npx supabase login`
  - `npx supabase init`
  - Create schema and relations on Supabase dashboard
  - `npx supabase gen types --lang=typescript --project-id "<project id>" --schema public > database.types.ts` ([example](/types/database.types.ts), [example](/types/supabase.d.ts))

- create Supabase instance
  - `npm install @supabase/supabase-js`
  - Copy and paste `supabase url` and `anon key` into environment variables
  - setup auth ([example](/lib/Supabase.ts))

- setup Auth:
  - create global context for auth state, user state, and set function ([example](/context/AuthContext.tsx))

- setup RLS for tables allowing all for authenticated (leave out RLS if reading deleted data in app is needed)
  
Storybook:

- `npx storybook@next init` to init
- `npm install @storybook/react` to install dependencies
- Create `metro.config.js`  (copy from this project `npx create-expo-app --template expo-template-storybook AwesomeStorybook`):
  - Set `enabled` to check the `EXPO_PUBLIC_STORYBOOK_ENABLED` environment variable
  - Set `onDisabledRemoveStorybook` to true ([example](/metro.config.js))
- In app's default entry point, check if  `EXPO_PUBLIC_STORYBOOK_ENABLED` is true:
  - If true, set the app entry point to Storybook's default export and call `registerRootComponent` on the entry point
  - Otherwise export default the entry point and expo router automatically registers it as root component ([example](/app/index.tsx))
- Create script to run visual unit tests in storybook:
  - first `npm install cross-env`
  - add `"storybook": "cross-env EXPO_PUBLIC_STORYBOOK_ENABLED='true' expo start"` in `package.json` under `"scripts"`
- Create unit tests in `./.storybook` with file names as `*.stories.tsx`:
  - Create meta object with the default values for the component's props
  - Export objects for different variants of the component

Jest:

- Setup mocks:
  - Create `jest.setup.js` file and call `"jest.mock('@<package>/<module>')"` to mock a library ([example](/jest.setup.js))
  - In `package.json` or optional replacement `jest.config.js`, add `"<rootDir>/jest.setup.js"` under `setupFiles`. ([example](/package.json))
  - Create `__mocks__\@<package>\<module>.js` file
  - Export mocks as objects using default export ([example](/__mocks__/@react-native-async-storage/async-storage.js))
- Setup ENV (TODO):

##### The rest of the implementation

- Create loading states ([example](/components/Loading.tsx), [example](/app/index.tsx))
- Create icons using online svgs ([example](/assets/icons/index.tsx), [example](/assets/icons/Heart.tsx))
- Create backend services ([example](/services/imageService.ts), [example](/services/userService.ts))
- Create realtime channels:
  - Use supabase's `channel` `on` `subscribe` in a use effect hooks ([example](/app/(main)/home.tsx))
  - Create handlers for payloads
- Use MVP State management:
  - Use controller component for handling states ([example](/app/(main)/postDetails.tsx))
  - Use view component for handling view
  - Use backend for handling model
- Use `react-native-pell-rich-editor` for rich text editor
- Use `expo-av` for videos (deprecated but works)
- Use `moment` to format dates
- Create custom theme ([example](/constants/theme.ts))
