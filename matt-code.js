// matt-code.js (Updated Official Version)

const mattCode = {
  c0: {
    r0: {
      websiteName: "Matt Code Platform",
      websiteNotes: "Unified system blueprint",
      project: "doaashow",
      timeDate: () => new Date().toLocaleString()
    }
  },

  c1: {
    r0: "Design & Displays",
    r1: "Logo",
    r2: "Navigation",
    r3: "Color Scheme"
  },

  c2: {
    r0: "Main Content",
    r1: "Home",
    r2: "About",
    r3: "Contact"
  },

  c3: {
    r0: "User Interactions",
    r1: "Login",
    r2: "Register",
    r3: "Forgot Password"
  },

  c4: {
    r0: "Game / Features",
    r1: "Start",
    r2: "Pause",
    r3: "Settings"
  },

  c5: {
    r0: "Settings",
    r1: "Display Options",
    r2: "Audio Options",
    r3: "Video Options",
    r4: "Accessibility Options",
    r5: "Help",
    r6: "Feedback",
    r7: "Setting Options",
    r8: "Notification Settings",
    r9: "Account Settings",
    r10: "Security Settings",
    r11: "Advanced Settings"
  },

  c6: {
    r0: "Social",
    r1: "Groups",
    r2: "Create Group",
    r3: "Join Group",
    r4: "Group Settings",
    r5: "Pages",
    r6: "Create Page",
    r7: "View Pages",
    r8: "Page Settings",
    r9: "Users",
    r10: "User Profiles",
    r11: "User Settings"
  },

  c7: {
    r0: "Media",
    r1: "Watch",
    r2: "Watch Videos",
    r3: "Watch Live Streams",
    r4: "Watch Settings",
    r5: "Video",
    r6: "Upload Video",
    r7: "View Videos",
    r8: "Video Settings",
    r9: "Audio",
    r10: "Upload Audio",
    r11: "View Audio",
    r12: "Audio Settings"
  },

  c8: {
    r0: "Marketplace",
    r1: "Buy",
    r2: "Sell",
    r3: "Auctions",
    r4: "Shopping Cart",
    r5: "Order History",
    r6: "Groups",
    r7: "Create Marketplace Group",
    r8: "Join Marketplace Group",
    r9: "Marketplace Group Settings"
  },

  c9: {
    r0: "Chatbot / AI Integration",
    r1: "Greetings",
    r2: "Responses",
    r3: "Intents"
  },

  c10: {
    r0: "Search & Filter",
    r1: "Search Bar",
    r2: "Filter Options",
    r3: "Results Display"
  },

  c11: {
    r0: "Extensions",
    r1: "Social Media Integration",
    r2: "Payment Gateway",
    r3: "Email Marketing",
    r4: "Analytics Tracking",
    r5: "SEO Optimization"
  },

  c12: {
    r0: "Additional Extensions",
    r1: "Forum / Discussion Board",
    r2: "E-commerce Functionality",
    r3: "Membership / Subscription Model",
    r4: "API Integrations"
  },

  c13: {
    r0: "Recently Added",
    r1: "View Recently Added",
    r2: "Manage Recently Added",
    r3: "Settings for Recently Added"
  },

  c14: {
    r0: "Groups",
    r1: "Create Group",
    r2: "Join Group",
    r3: "Group Settings"
  },

  c15: {
    r0: "Pages",
    r1: "Create Page",
    r2: "View Pages",
    r3: "Page Settings"
  },

  c16: {
    r0: "Users",
    r1: "User Profiles",
    r2: "User Settings"
  },

  // Variable mappings
  vars: {
    header: { c: 0, r: 0 },
    title: { c: 0, r: 0 },
    body: { c: 0, r: 0 },
    item1: { c: 1, r: 1 },
    item2: { c: 1, r: 2 },
    startCategory: { c: 1, r: 0 },
    menu: { c: 10, r: 0 },
    settings: { c: 5, r: 0 },
    options: { c: 5, r: 1 },
    fullScreenOption: { c: 5, r: 4 }
  }
};

// Helper to read matt code cells
function mc(c, r) {
  const col = mattCode[`c${c}`];
  if (!col) return null;
  return col[`r${r}`] ?? null;
}

export { mattCode, mc };
