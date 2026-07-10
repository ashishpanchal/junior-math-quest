# 🏆 Math Treasure Hunt

A fun and colorful mobile math game for children aged 5-8 years old. Kids go on a treasure hunt by solving simple maths questions. Each correct answer helps them move closer to a treasure chest!

## 🎮 Features

### Game Worlds
1. 🌴 **Jungle Treasure** - Explore the wild jungle and find hidden gems
2. 🏴‍☠️ **Pirate Island** - Sail the seas and discover pirate gold
3. 🚀 **Space Gems** - Blast off to space and collect cosmic gems
4. 🦕 **Dinosaur Valley** - Travel back in time with friendly dinos
5. 🍭 **Candy Castle** - Enter the sweetest castle in the land
6. 🐠 **Underwater Pearls** - Dive deep to find magical pearls

### Math Skills
- Addition (2 + 3 = ?)
- Subtraction (7 - 2 = ?)
- Counting objects (⭐⭐⭐⭐)
- Number comparison (Which is bigger: 8 or 5?)
- Missing numbers (What comes after 12?)
- Shape counting

### Difficulty Levels
| | Easy | Medium | Hard |
|---|---|---|---|
| Numbers | 1-10 | 1-20 | 1-20 |
| Options | 3 | 4 | 4 |
| Questions | 5 per level | 8 per level | 10 per level |
| Timer | No | No | Bonus only |

### Rewards System
- ⭐ Stars (1-3 per level)
- 🪙 Coins (5 per correct answer)
- 🏆 Achievements & Badges
- 🔓 Unlock new worlds

### Safety Features (COPPA Compliant)
- ✅ No ads
- ✅ No login required
- ✅ No chat features
- ✅ No external links
- ✅ No in-app purchases
- ✅ No data collection
- ✅ All data stored locally on device
- ✅ Parent-gated settings

## 🛠️ Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** - Full type safety
- **Expo Router** - File-based navigation
- **React Native Reanimated** - Smooth animations
- **React Native Gesture Handler** - Touch interactions
- **Expo AV** - Sound effects & music
- **Expo Haptics** - Haptic feedback
- **AsyncStorage** - Local progress saving
- **Expo Linear Gradient** - Beautiful gradients

## 📁 Project Structure

```
math-treasure-hunt/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root navigation layout
│   ├── index.tsx           # Splash screen
│   ├── home.tsx            # Home/main menu
│   ├── profile.tsx         # Player profile
│   ├── worlds.tsx          # World selection
│   ├── levels.tsx          # Level selection
│   ├── game.tsx            # Main game screen
│   ├── reward.tsx          # Level completion reward
│   ├── achievements.tsx    # Achievements display
│   └── settings.tsx        # Parent settings
├── components/             # Reusable UI components
│   ├── AnimatedCharacter.tsx
│   ├── AnswerButton.tsx
│   ├── CoinDisplay.tsx
│   ├── Confetti.tsx
│   ├── GameButton.tsx
│   ├── LevelButton.tsx
│   ├── ProgressBar.tsx
│   ├── StarRating.tsx
│   ├── TreasureChest.tsx
│   └── WorldCard.tsx
├── constants/              # App constants & theme
│   ├── gameData.ts
│   ├── theme.ts
│   └── index.ts
├── hooks/                  # Custom React hooks
│   ├── useGameEngine.ts
│   ├── useGameProgress.ts
│   └── index.ts
├── types/                  # TypeScript type definitions
│   └── index.ts
├── utils/                  # Utility functions
│   ├── haptics.ts
│   ├── questionGenerator.ts
│   ├── sound.ts
│   ├── storage.ts
│   └── index.ts
├── assets/                 # Images, sounds, fonts
│   └── sounds/
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration
├── babel.config.js
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`
- Expo Go app on your phone (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/ashishpanchal/junior-math-quest.git
cd junior-math-quest

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running on Device

1. Install **Expo Go** from App Store or Google Play
2. Run `npx expo start`
3. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)

## 📱 EAS Build Setup

### Configure EAS

```bash
# Login to Expo
npx eas login

# Configure project for EAS Build
npx eas build:configure
```

### iOS Build

```bash
# Development build (for testing with Expo Dev Client)
npx eas build --platform ios --profile development

# Preview build (internal distribution)
npx eas build --platform ios --profile preview

# Production build (App Store)
npx eas build --platform ios --profile production
```

### Android Build

```bash
# Development build
npx eas build --platform android --profile development

# Preview build (APK for internal testing)
npx eas build --platform android --profile preview

# Production build (AAB for Google Play)
npx eas build --platform android --profile production
```

### Build Both Platforms

```bash
npx eas build --platform all --profile production
```

## 🎨 Customization

### Replace Placeholder Assets

The app uses emoji/text placeholders for:
- App icon (`assets/icon.png`) - Replace with 1024x1024 PNG
- Splash icon (`assets/splash-icon.png`) - Replace with 200x200 PNG
- Adaptive icon (`assets/adaptive-icon.png`) - Replace with 1024x1024 PNG
- Sound effects (`assets/sounds/`) - Add .mp3 files

### Add Sound Effects

Place sound files in `assets/sounds/` and update `utils/sound.ts`:
- `correct.mp3` - Success sound
- `wrong.mp3` - Gentle wrong answer
- `level-complete.mp3` - Level completion fanfare
- `treasure.mp3` - Treasure chest opening
- `button.mp3` - Button press
- `coin.mp3` - Coin collect
- `background.mp3` - Background music (loop)

## 🎯 Roadmap (v2)

- [ ] More question types (patterns, sequencing)
- [ ] Animated treasure map between levels
- [ ] Character customization
- [ ] Multiple language support
- [ ] Multiplication/division (for ages 8+)
- [ ] Teacher/parent dashboard
- [ ] Cloud sync for progress

## 📄 License

MIT License - See LICENSE file for details.

## 🙏 Credits

Built with love for little mathematicians everywhere! 🧮❤️
