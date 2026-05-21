// lib/i18n.ts

export const strings = {
  en: {
    appTitle: "TrustScan",
    appTagline: "Not sure if that message is real? Let AI take a look.",
    appSubtagline: "Instantly evaluate suspicious messages, email screenshots, or weird links for common phishing constructs. Stay informed, stay secure.",
    badgeText: "Linguistic Pattern Analysis Support",
    
    // Tabs & Inputs
    tabText: "Text / Message",
    tabUrl: "Suspicious URL",
    tabImage: "Screenshot",
    textPlaceholder: "Paste the suspicious message, email content, or SMS here...",
    urlPlaceholder: "Paste a suspicious link (e.g. https://secure-login-bank-alert.com)",
    textMinLengthNotice: "* Enter at least 10 characters. Your message content is only processed in-memory and will never be saved.",
    urlValidationNotice: "* Enter a full, valid URL starting with http:// or https://. The link is analyzed structurally without visiting the active host.",
    imageUploadClick: "Click to upload or drag & drop screenshot",
    imageUploadSpecs: "PNG, JPG, or WEBP up to 5MB",
    imageOcrNotice: "* Screenshots of spam SMS, WhatsApp, bank alerts, or notifications. OCR extracts characters securely for pattern checking.",
    
    // Buttons
    analyseButton: "Analyze Message",
    analysing: "Analyzing...",
    scanAnother: "Scan Another Message",
    shareButton: "Share Result",
    shareToastSuccess: "Result URL copied to clipboard!",
    shareToastError: "Failed to copy link.",
    eli5Button: "Explain this to me simply",
    eli5ButtonLoading: "Simplifying...",
    eli5ButtonBack: "Show technical analysis",
    translateToPidginButton: "Translate report to Pidgin 🇳🇬",
    translateToEnglishButton: "Translate report to English 🇬🇧",
    translating: "Translating...",
    
    // Verdicts & Result Details
    verdictLabelSafe: "Looks Safe",
    verdictLabelSuspicious: "Suspicious — proceed with caution",
    verdictLabelHighRisk: "High Risk — likely scam pattern",
    aiSummaryTitle: "AI Analysis Summary",
    flagsTitle: "Linguistic Scam Flags",
    noFlagsMessage: "No critical linguistic threat patterns detected.",
    noFlagsDetail: "The message structures appear safe from pressure language or direct financial coercion.",
    whatToDoTitle: "What should I do?",
    
    // Navbar & History Drawer
    navHome: "Scan",
    navLibrary: "Library",
    navAbout: "How It Works",
    historyButton: "Recent Scans",
    historyDrawerTitle: "Your Recent Scans",
    historyDrawerSub: "Stored on this device only. Never sent to our servers.",
    historyEmptyState: "No scam patterns recorded this week. Ready for your first scan!",
    historyEmptyHistory: "You have no scanned history on this browser yet.",
    historyClearAll: "Clear all history",
    historyDeleteLabel: "Delete from history",
    historyBadgeCount: "Recent",
    
    // Library Feed
    libTitle: "Recent Scam Patterns",
    libTagline: "Explore a public, anonymized index of malicious linguistics tracked by our scanning system. Original inputs (texts and images) are strictly deleted immediately; only aggregate patterns are recorded to educate the community.",
    libBadge: "Active Threat Catalog",
    libSearchPlaceholder: "Search by scam type (e.g. Bank alert, Job offer) or flags...",
    libNoMatchTitle: "No Matching Scams",
    libNoMatchDetail: "We couldn't find any records for \"{query}\". Try using simple words like bank, reward, link or prize.",
    libFooterTitle: "Help Protect the Community",
    libFooterDetail: "By running scans on suspicious messages, our system logs anonymized structures in this library. This helps others query matching threats and stay alert of active phishing tactics.",
    
    // Common & About
    learnMore: "Learn More",
    goBackHome: "Go Back Home",
    reportNotFound: "Report Not Found",
    reportNotFoundDetail: "The requested scan ID does not exist. Results expire after 30 days."
  },
  pidgin: {
    appTitle: "TrustScan",
    appTagline: "You no sure if that message real? Make AI check am for you.",
    appSubtagline: "Instantly check fake messages, email screenshot, or funny link to see if na scam. No fall for their shege.",
    badgeText: "Linguistic Pattern Analysis Support",
    
    // Tabs & Inputs
    tabText: "Message Text",
    tabUrl: "Suspicious Link",
    tabImage: "Screenshot",
    textPlaceholder: "Paste the message, email content, or SMS wey you receive here...",
    urlPlaceholder: "Paste the link wey you suspéct (e.g. https://secure-login-bank-alert.com)",
    textMinLengthNotice: "* Write at least 10 letters. We no dey save your message, na just to check am inside memory.",
    urlValidationNotice: "* Put the complete URL starting with http:// or https://. We dey check how the link look, we no dey open the main site.",
    imageUploadClick: "Click to upload or drag & drop the screenshot here",
    imageUploadSpecs: "PNG, JPG, or WEBP up to 5MB",
    imageOcrNotice: "* Screenshots of spam SMS, WhatsApp, bank alert or notify. System go extract the text to check the patterns.",
    
    // Buttons
    analyseButton: "Check Am Now",
    analysing: "E dey check am...",
    scanAnother: "Check Another Message",
    shareButton: "Share This Result",
    shareToastSuccess: "Result link don copy to your clipboard!",
    shareToastError: "E fail to copy the link.",
    eli5Button: "Explain am for simple English 🧒",
    eli5ButtonLoading: "E dey make am simple...",
    eli5ButtonBack: "Show normal AI analysis",
    translateToPidginButton: "Translate this report to Pidgin 🇳🇬",
    translateToEnglishButton: "Translate this report to English 🇬🇧",
    translating: "E dey translate...",
    
    // Verdicts & Result Details
    verdictLabelSafe: "E Look Clean",
    verdictLabelSuspicious: "E Get Shege — shine your eye",
    verdictLabelHighRisk: "E Be Scam — dem wan cheat you",
    aiSummaryTitle: "AI Analysis Summary",
    flagsTitle: "Linguistic Scam Flags",
    noFlagsMessage: "No shege or scam pattern detected inside.",
    noFlagsDetail: "The message structure look clean. No rush language or threat to tap your money.",
    whatToDoTitle: "Wetin you go do now?",
    
    // Navbar & History Drawer
    navHome: "Check Scam",
    navLibrary: "Library",
    navAbout: "How E Dey Work",
    historyButton: "Recent Checks",
    historyDrawerTitle: "Your Recent Checks",
    historyDrawerSub: "E dey inside this browser only. We no dey send am to server.",
    historyEmptyState: "No scam pattern save for here this week. Start check now!",
    historyEmptyHistory: "You never check any message for this browser yet.",
    historyClearAll: "Clear all history",
    historyDeleteLabel: "Delete from history",
    historyBadgeCount: "Recent",
    
    // Library Feed
    libTitle: "Recent Scam Patterns",
    libTagline: "Check public, clean list of scam patterns wey our system don trace. We don immediately delete the original messages and screenshots; na only the pattern we dey save to help people train their eyes.",
    libBadge: "Active Threat Catalog",
    libSearchPlaceholder: "Search scam types (e.g. Bank alert, Job offer) or flags...",
    libNoMatchTitle: "We No Find Match",
    libNoMatchDetail: "We no find any record wey match \"{query}\". Try search with simple words like bank, promo, link or money.",
    libFooterTitle: "Help Protect Community",
    libFooterDetail: "As you dey check suspicious messages, our system dey save the anonymous patterns for this library. E go help others query threats and know scammers' format.",
    
    // Common & About
    learnMore: "Read More",
    goBackHome: "Go Back Home",
    reportNotFound: "We No Find the Report",
    reportNotFoundDetail: "The scan ID wey you put no dey exist. Scan result dey expire after 30 days."
  }
};

export type Language = 'en' | 'pidgin';
