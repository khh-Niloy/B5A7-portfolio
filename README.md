# 🚀 Modern Portfolio Website

A stunning, fully-featured portfolio website built with Next.js 15, featuring a modern design, comprehensive form validation, and a complete content management system.

## 🌐 Live Demo

**[View Live Portfolio](https://b5a7-portfolio.vercel.app/)**

## ✨ Features

### 🎨 **Frontend Features**
- **Modern UI/UX**: Beautiful, responsive design with dark theme
- **Interactive Animations**: Smooth transitions and hover effects using Framer Motion
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Dynamic Content**: Real-time content updates without page refresh
- **SEO Optimized**: Built with Next.js 15 for optimal performance

### 📝 **Content Management**
- **About Section**: Personal information, education, and journey timeline
- **Projects Showcase**: Detailed project cards with images, descriptions, and tech stacks
- **Blog System**: Full-featured blog with categories and rich content
- **Skills Management**: Organized skill categories with visual representations
- **Experience Timeline**: Professional experience with detailed descriptions

### 🔐 **Authentication & Security**
- **Secure Login System**: Protected dashboard access
- **Session Management**: Persistent user sessions
- **Form Validation**: Comprehensive client and server-side validation
- **Error Handling**: User-friendly error messages and feedback

### 🛠️ **Developer Experience**
- **TypeScript**: Full type safety throughout the application
- **Form Validation**: Zod schemas with react-hook-form integration
- **Toast Notifications**: Real-time success/error feedback
- **Error Boundaries**: Graceful error handling and recovery
- **Code Quality**: ESLint configuration and best practices

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Forms**: React Hook Form + Zod validation

### **Backend & API**
- **API Routes**: Next.js Server Actions
- **Authentication**: Custom JWT-based system
- **File Upload**: Next.js file handling
- **Data Validation**: Zod schemas
- **Error Handling**: Centralized error management

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Turbopack (Next.js 15)
- **Version Control**: Git

### **Key Libraries**
```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "framer-motion": "^12.23.22",
  "react-hook-form": "^7.64.0",
  "zod": "^4.1.11",
  "react-hot-toast": "^2.6.0"
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_BASE_API=your_api_endpoint
   # Add other required environment variables
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard routes
│   │   └── dashboard/           # Admin panel
│   ├── (main)/                  # Public routes
│   ├── login/                   # Authentication
│   └── not-found.tsx           # 404 page
├── components/                  # Reusable components
│   ├── modules/                # Feature-specific components
│   │   ├── About/              # About section components
│   │   ├── Blog/               # Blog components
│   │   ├── Dashboard/          # Admin components
│   │   ├── Projects/           # Project components
│   │   └── Tech/               # Skills components
│   └── ui/                     # Base UI components
├── actions/                     # Server Actions
├── helper/                      # API helper functions
├── lib/                         # Utility libraries
│   ├── validation.ts           # Zod schemas
│   ├── error-handler.ts        # Error handling
│   └── utils.ts                # General utilities
├── interfaces/                  # TypeScript interfaces
└── public/                      # Static assets
```

## 🎯 Key Features Explained

### **Form Validation System**
- **Client-side**: Real-time validation with react-hook-form + Zod
- **Server-side**: API validation with comprehensive error handling
- **User Experience**: Clear error messages and success feedback

### **Content Management Dashboard**
- **About Management**: Personal info, education, experience
- **Project Management**: Add, edit, delete projects with images
- **Blog Management**: Full CRUD operations for blog posts
- **Skills Management**: Organize skills by categories

### **Responsive Design**
- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Perfect layout for tablets
- **Desktop Experience**: Rich desktop interactions

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🌟 Performance Features

- **Static Generation**: Optimized static pages where possible
- **Dynamic Rendering**: Interactive pages rendered on-demand
- **Image Optimization**: Next.js Image component for optimal loading
- **Code Splitting**: Automatic code splitting for better performance
- **Bundle Analysis**: Optimized bundle sizes

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on all inputs
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Next.js protection
- **Secure Headers**: Configured security headers
- **Environment Variables**: Sensitive data in environment variables

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for the deployment platform
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations

## 📞 Support

If you have any questions or need help:

- **Email**: your-email@example.com
- **GitHub Issues**: [Create an issue](https://github.com/your-username/portfolio/issues)
- **Documentation**: Check the inline code comments

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database
- **DigitalOcean**: VPS deployment option

---

**Built with ❤️ using Next.js 15 and modern web technologies**

*Last updated: December 2024*
