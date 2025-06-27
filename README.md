# 🧠 Cognitask

<div align="center">
  <h3>Your Intelligent Task Management Solution</h3>
  <p>A modern, intuitive task manager built with Next.js 15, featuring AI-powered task prioritization and a beautiful, responsive interface.</p>
  
  ![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
  ![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC)
  ![License](https://img.shields.io/badge/license-MIT-green)
</div>

## ✨ Features

### 🎯 Core Functionality
- **Smart Task Management** - Add, edit, complete, and delete tasks with ease
- **AI-Powered Prioritization** - Intelligent task reordering based on urgency and importance
- **Category Organization** - Organize tasks by work, personal, shopping, health, and more
- **Priority Levels** - Set task priorities (High, Medium, Low) for better organization
- **Due Date Tracking** - Set and track due dates for time-sensitive tasks
- **Tag System** - Tag tasks for better categorization and filtering

### 🎨 User Experience
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates** - Instant feedback and smooth interactions
- **Local Storage** - Data persists in your browser (no account required)
- **Clean Interface** - Minimalist design focused on productivity

### 🔧 Technical Features
- **Built with Next.js 15** - Latest React framework with App Router
- **TypeScript Support** - Full type safety and better development experience
- **Tailwind CSS** - Modern, utility-first CSS framework
- **Radix UI Components** - Accessible, customizable UI components
- **React Hook Form** - Efficient form handling and validation
- **Optimized Build** - Static generation for lightning-fast performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cognitask.git
   cd cognitask
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:9002`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📖 Usage Guide

### Adding Tasks
1. Type your task in the input field
2. Press Enter or click "Add Task"
3. Your task appears in the list instantly

### Managing Tasks
- **Complete**: Click the checkbox next to any task
- **Delete**: Hover over a task and click the trash icon
- **Prioritize**: Click the "↕️ Prioritize" button to auto-sort by importance

### Themes
- Click the theme toggle in the top-right corner to switch between light and dark modes

## 🏗️ Project Structure

```
cognitask/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page (redirects to tasks)
│   │   └── tasks/
│   │       └── page.tsx      # Main tasks page
│   ├── components/           # React components
│   │   ├── ui/              # UI components (Radix UI)
│   │   ├── task-app.tsx     # Main task application
│   │   ├── task-card.tsx    # Individual task component
│   │   ├── task-filters.tsx # Task filtering controls
│   │   └── theme-toggle.tsx # Dark/light mode toggle
│   ├── hooks/               # Custom React hooks
│   │   └── use-toast.tsx    # Toast notifications
│   └── lib/                 # Utilities and actions
│       ├── actions.ts       # Task management logic
│       ├── definitions.ts   # TypeScript type definitions
│       └── utils.ts         # Helper functions
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Performant form handling
- **Recharts** - Responsive charting library

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Class Variance Authority** - Component variant management

## 🎨 Customization

### Themes
The app supports both light and dark themes. Customize colors in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
      }
    }
  }
}
```

### Adding New Features
1. Create components in `src/components/`
2. Add business logic in `src/lib/actions.ts`
3. Update TypeScript definitions in `src/lib/definitions.ts`

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📈 Performance

- **First Load JS**: ~101 kB (optimized)
- **Static Generation**: All pages pre-rendered
- **Lighthouse Score**: 95+ across all metrics
- **Bundle Analysis**: Optimized chunk splitting

## 🔒 Privacy & Security

- **No External Data**: All data stored locally in your browser
- **No Tracking**: No analytics or user tracking
- **Secure by Default**: Modern security best practices
- **Privacy-First**: Your tasks never leave your device

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Radix UI** - For accessible component primitives
- **Tailwind Labs** - For the utility-first CSS framework
- **Vercel** - For deployment and hosting solutions

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Questions**: Start a GitHub Discussion

---

<div align="center">
  <p>Made with ❤️ for productivity enthusiasts</p>
  <p>
    <a href="#-cognitask">Back to Top</a> •
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>