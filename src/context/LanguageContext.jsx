import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const dictionary = {
  en: {
    portalName: "Delala Meet",
    portalSubtitle: "Ethiopian Broker & Merchant Network System",
    home: "Home",
    marketplace: "Marketplace",
    dashboards: "Dashboards",
    mainRegistrarDashboard: "Main Registrar Admin",
    userDashboard: "My User Dashboard",
    aboutNav: "About Us",
    contactNav: "Contact Us",
    login: "Login",
    signup: "Register / Request Access",
    logout: "Logout",
    welcome: "Welcome",
    
    // Hero & Search
    heroTitle: "Ethiopia's Premier Broker & Merchant Portal",
    heroDesc: "Connecting brokers, merchants, direct sellers, companies, hotel & cafeteria services, and buyers across land, livestock, commodities, housing, rental shops, barber shops, household equipment, and hospitality.",
    searchPlaceholder: "Search by title, seller, location or keyword...",
    allCategories: "All Categories",
    allConditions: "All Conditions",
    allSellers: "All Seller Types",
    priceRange: "Price Filter",
    minPrice: "Min Price (ETB)",
    maxPrice: "Max Price (ETB)",
    filterResults: "Filter Items",
    resetFilters: "Reset Filters",
    featuredDiscounted: "Featured & Discounted Offers",
    
    // Categories
    catLand: "Land (sqm)",
    catCattle: "Cattle / Livestock",
    catFurniture: "Furniture",
    catFruitsCereals: "Fruits & Cereals",
    catRentHouses: "Rent Houses",
    catHomesSell: "Homes for Sell",
    catShopsSell: "Shops for Sell",
    catRentalShops: "Rental Shops",
    catRentalBarber: "Rental Barber Shops",
    catBarberEquip: "Barber Equipment",
    catHouseholdEquip: "Household Equipment",
    catHotelCafe: "Hotel & Cafeteria Services",
    catOthers: "Others",
    
    // Roles
    roleBroker: "Broker",
    roleMerchant: "Merchant",
    roleSeller: "Direct Seller",
    roleCompany: "Company",
    roleHotCaf: "Hotel & Cafeteria",
    roleCasual: "Casual User",
    roleAdmin: "Main Registrar Admin",

    // Product details & Ratings
    originalPrice: "Original Price",
    discountedPrice: "Discounted Price",
    discountPercent: "Discount Percentage (%)",
    save: "Save",
    landSize: "Land / Space Size",
    sqm: "sq. meters",
    condition: "Condition",
    condOriginal: "Original",
    condUsed: "Used",
    condNew: "New",
    condRefurbished: "Refurbished",
    address: "Address / Location",
    googleMaps: "Open Google Maps Location",
    postedBy: "Posted By",
    phone: "Phone Number",
    email: "Email Address",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    expiryDate: "Availability Until",
    status: "Status",
    statusActive: "Active",
    statusSold: "Sold",
    statusExpired: "Expired",
    viewDetails: "View Details",
    contactSeller: "Contact Seller",

    // Ratings & Reviews
    customerReviews: "Customer Ratings & Reviews",
    rateProduct: "Rate & Review This Product",
    yourRating: "Your Rating (1 - 5 Stars)",
    yourComment: "Write Your Review / Comment...",
    submitReview: "Submit Review",
    noReviewsYet: "No customer reviews yet. Be the first to rate this product!",
    
    // Bookmarks
    myBookmarks: "My Bookmarks & Favorites",
    bookmarkItem: "Bookmark Item",
    removeBookmark: "Remove Bookmark",
    
    // Pagination
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    showingItems: "Showing 10 items per page",
    noProductsFound: "No products match your search or filter criteria.",
    
    // Post Product Form
    postProductTitle: "Post New Business / Product Listing",
    editProductTitle: "Edit Product Listing",
    productName: "Product / Business Title",
    productImage: "Product Image URL / Upload",
    productDesc: "Full Description & Specifications",
    submitListing: "Publish Listing",
    updateListing: "Update Listing",
    cancel: "Cancel",
    
    // Auth & Passwords
    loginTitle: "Portal Login",
    usernameLabel: "Username (e.g. MRA/1001, BROKER/1002, HOTCAF/1007)",
    passwordLabel: "Password / PIN",
    loginSubmit: "Sign In",
    signupTitle: "Request Broker / User Portal Access",
    fullName: "Full Name",
    requestedRole: "Account Type / Role",
    signupSubmit: "Submit Signup Request",
    signupNotice: "Your signup request will be submitted to the Main Registrar Admin for review. Upon approval, your unique ID credentials and default 4-digit PIN will be generated.",
    showPassword: "Show Password",
    hidePassword: "Hide Password",
    forgotPassword: "Forgot Password? Request Admin Reset",
    changePasswordTitle: "Password & Security Settings",
    newPasswordLabel: "New Custom Password",
    updatePasswordBtn: "Update Password",
    
    // MRA Dashboard
    mraTitle: "Main Registrar Admin Dashboard",
    mraDesc: "Manage all portal users, external signup requests, full product listings, ratings, contact messages, and site settings.",
    totalPostedProducts: "Total Products Posted",
    totalFilteredProducts: "Total Filtered Products",
    totalSoldProducts: "Total Sold Products",
    totalSoldFiltered: "Total Sold Filtered Products",
    signupRequestsTab: "External Signup Requests",
    usersManagementTab: "User Directory & Credentials",
    productsCatalogTab: "Master Products Catalog",
    systemSettingsTab: "Portal Settings & Host Contacts",
    allDashboardsTab: "Inspect All User Dashboards",
    contactInboxTab: "Contact Messages Inbox",
    ratingsTab: "Product Ratings & Reviews",
    passwordRequestsTab: "Password Reset Requests",
    
    // Table Headers & Actions
    applicantName: "Applicant Name",
    statusHeader: "Status",
    actionsHeader: "Actions",
    profilePic: "Profile",
    usernameHeader: "Username",
    defaultPinHeader: "Default PIN",
    itemHeader: "Item",
    askingPriceHeader: "Asking Price",
    sellerHeader: "Seller",
    locationHeader: "Location",
    senderName: "Sender Name",
    phoneAndEmail: "Phone & Email",
    subjectHeader: "Subject",
    messageContent: "Message Content",
    sentDate: "Sent Date",
    customerHeader: "Customer",
    starRatingHeader: "Star Rating",
    reviewCommentHeader: "Written Review Comment",
    submittedDate: "Submitted Date",
    
    // Status Badges
    statusPending: "Pending",
    statusApproved: "Approved",
    statusRejected: "Rejected",
    statusNew: "New",
    statusSeen: "Seen",
    statusUnseen: "Unseen",
    statusOld: "Old",
    statusReset: "Reset",
    statusDismissed: "Dismissed",

    // Actions
    approve: "Approve Request",
    reject: "Reject",
    createUser: "Create User Directly",
    promotePartnerAdmin: "Promote to Admin",
    edit: "Edit",
    delete: "Delete",
    markAsSold: "Mark as Sold",
    postOnBehalf: "Post Item on Behalf of User",
    uploadProfilePic: "Upload Profile Picture",
    saveSettings: "Save Portal Settings"
  },
  am: {
    portalName: "ደላላ Meet",
    portalSubtitle: "የኢትዮጵያ የደላሎች እና መርቻንቶች መረብ ሥርዓት",
    home: "መነሻ ገጽ",
    marketplace: "የገበያ ቦታ",
    dashboards: "ዳሽቦርዶች",
    mainRegistrarDashboard: "ዋና መዝጋቢ አድሚን",
    userDashboard: "የእኔ ዳሽቦርድ",
    aboutNav: "ስለ እኛ",
    contactNav: "አግኙን",
    login: "ግጣይ / ግባ",
    signup: "ተመዝገብ / ጥያቄ ላክ",
    logout: "ውጣ",
    welcome: "እንኳን ደህና መጡ",
    
    // Hero & Search
    heroTitle: "የኢትዮጵያ መሪ የደላሎች እና ነጋዴዎች ፖርታል",
    heroDesc: "ደላሎችን፣ ነጋዴዎችን፣ የቀጥታ ሻጮችን፣ ኩባንያዎችን፣ የሆቴል እና ካፌ አገልግሎቶችን እና ገዢዎችን በመሬት፣ ከብቶች፣ እቃዎች፣ ቤቶች፣ የሚከራዩ ሱቆች፣ የፀጉር ቤቶች፣ የቤት መገልገያዎች እና የሆቴል አገልግሎቶች ያገናኛል።",
    searchPlaceholder: "በምርት ስም፣ ሻጭ፣ ቦታ ወይም ቁልፍ ቃል ፈልግ...",
    allCategories: "ሁሉም ምድቦች",
    allConditions: "ሁሉም ሁኔታዎች",
    allSellers: "ሁሉም የሻጭ ዓይነቶች",
    priceRange: "የዋጋ ማጣሪያ",
    minPrice: "አነስተኛ ዋጋ (ብር)",
    maxPrice: "ከፍተኛ ዋጋ (ብር)",
    filterResults: "አጣራ",
    resetFilters: "ማጣሪያ አጽዳ",
    featuredDiscounted: "ተመራጭ እና የቅናሽ እቃዎች",
    
    // Categories
    catLand: "መሬት (በካሬ ሜትር)",
    catCattle: "ከብቶች / እንስሳት (በሬ፣ ላም፣ ፈረስ፣ በግ)",
    catFurniture: "የቤትና የቢሮ እቃዎች",
    catFruitsCereals: "ፍራፍሬ እና እህሎች (ጤፍ)",
    catRentHouses: "የሚከራዩ ቤቶች",
    catHomesSell: "የሚሸጡ ቤቶች",
    catShopsSell: "የሚሸጡ ሱቆች",
    catRentalShops: "የሚከራዩ ሱቆች",
    catRentalBarber: "የሚከራዩ የፀጉር ቤቶች",
    catBarberEquip: "የፀጉር ቤት እቃዎች እና መሳሪያዎች",
    catHouseholdEquip: "የቤት ውስጥ መገልገያ እቃዎች",
    catHotelCafe: "የሆቴል እና ካፌ አገልግሎቶች",
    catOthers: "ሌሎች",
    
    // Roles
    roleBroker: "ደላላ",
    roleMerchant: "ነጋዴ",
    roleSeller: "የቀጥታ ሻጭ",
    roleCompany: "ኩባንያ",
    roleHotCaf: "የሆቴል እና ካፌ አገልግሎት",
    roleCasual: "መደበኛ ተጠቃሚ",
    roleAdmin: "ዋና መዝጋቢ አድሚን",

    // Product details & Ratings
    originalPrice: "ዋና ዋጋ",
    discountedPrice: "የተቀነሰ ዋጋ",
    discountPercent: "የቅናሽ ፐርሰንት (%)",
    save: "ቆጥብ",
    landSize: "የመሬት / የቦታ ስፋት",
    sqm: "ካሬ ሜትር",
    condition: "ሁኔታ",
    condOriginal: "ኦሪጅናል / አዲስ",
    condUsed: "ያገለገለ",
    condNew: "አዲስ",
    condRefurbished: "የታደሰ",
    address: "አድራሻ / ቦታ",
    googleMaps: "ጉግል ካርታ ክፈት",
    postedBy: "ለገበያ ያቀረበው",
    phone: "ስልክ ቁጥር",
    email: "ኢሜይል",
    telegram: "ቴሌግራም",
    whatsapp: "ዋትስአፕ",
    expiryDate: "የሚቆይበት ቀን",
    status: "ሁኔታ",
    statusActive: "በገበያ ላይ ያለ",
    statusSold: "የተሸጠ",
    statusExpired: "ጊዜው ያለፈበት",
    viewDetails: "ዝርዝር ተመልከት",
    contactSeller: "ሻጩን አነጋግር",

    // Ratings & Reviews
    customerReviews: "የደንበኞች አስተያየት እና ደረጃ",
    rateProduct: "ደረጃ እና አስተያየት ይስጡ",
    yourRating: "ደረጃዎ (ከ 1 - 5 ኮከቦች)",
    yourComment: "አስተያየትዎን ይጻፉ...",
    submitReview: "አስተያየት ላክ",
    noReviewsYet: "ምንም አስተያየት አልተሰጠም። የመጀመሪያው ይሁኑ!",
    
    // Bookmarks
    myBookmarks: "የእኔ የተቀመጡ እቃዎች (Bookmarks)",
    bookmarkItem: "አስቀምጥ",
    removeBookmark: "አስወግድ",
    
    // Pagination
    page: "ገጽ",
    of: "ከ",
    previous: "ቀዳሚ",
    next: "ቀጣይ",
    showingItems: "በአንድ ገጽ 10 እቃዎች ይታያሉ",
    noProductsFound: "በፈለጉት መስፈርት የተገኘ ምርት የለም።",
    
    // Post Product Form
    postProductTitle: "አዲስ ምርት / ንግድ መዝግብ",
    editProductTitle: "ምርት አሻሽል",
    productName: "የምርት / የንግድ ስም",
    productImage: "የምርት ፎቶ URL / ስቀል",
    productDesc: "ሙሉ ማብራሪያ እና ዝርዝር",
    submitListing: "ለገበያ አቅርብ",
    updateListing: "መረጃ አፕዴት አድርግ",
    cancel: "ሰርዝ",
    
    // Auth & Passwords
    loginTitle: "ወደ ፖርታሉ ግባ",
    usernameLabel: "የተጠቃሚ ስም (ምሳሌ MRA/1001, BROKER/1002, HOTCAF/1007)",
    passwordLabel: "ፓስወርድ / ፒን",
    loginSubmit: "ግባ",
    signupTitle: "የደላላ / የተጠቃሚ መለያ ጥያቄ ማቅረቢያ",
    fullName: "ሙሉ ስም",
    requestedRole: "የመለያ አይነት (ሮል)",
    signupSubmit: "የምዝገባ ጥያቄ ላክ",
    signupNotice: "የምዝገባ ጥያቄዎ ለዋና መዝጋቢ አድሚን ይላካል። ጥያቄው ሲጸድቅ ልዩ Username እና የ 4-ዲጂት ፒን ፓስወርድ ይሰጥዎታል።",
    showPassword: "ፓስወርድ አሳይ",
    hidePassword: "ፓስወርድ ደብቅ",
    forgotPassword: "ፓስወርድ ረስተዋል? የአድሚን ሪሴት ጥያቄ ላክ",
    changePasswordTitle: "የፓስወርድ እና ሴኪዩሪቲ ሴቲንግ",
    newPasswordLabel: "አዲስ የራስዎ ፓስወርድ",
    updatePasswordBtn: "ፓስወርድ ቀይር",
    
    // MRA Dashboard
    mraTitle: "የዋና መዝጋቢ አድሚን ዳሽቦርድ",
    mraDesc: "ሁሉንም ተጠቃሚዎች፣ የውጭ ምዝገባ ጥያቄዎችን፣ የገበያ እቃዎችን፣ የተሸጡ እቃዎችን፣ ደረጃዎችን እና መልዕክቶችን ይቆጣጠሩ።",
    totalPostedProducts: "ጠቅላላ የተመዘገቡ ምርቶች",
    totalFilteredProducts: "የተጣሩ ምርቶች",
    totalSoldProducts: "ጠቅላላ የተሸጡ ምርቶች",
    totalSoldFiltered: "የተጣሩ የተሸጡ ምርቶች",
    signupRequestsTab: "የውጭ ተጠቃሚዎች የምዝገባ ጥያቄዎች",
    usersManagementTab: "የተጠቃሚዎች ዝርዝር እና መለያዎች",
    productsCatalogTab: "የምርቶች ማስተር ካታሎግ",
    systemSettingsTab: "የሲስተም ሴቲንግ እና አድራሻዎች",
    allDashboardsTab: "ሁሉንም የተጠቃሚ ዳሽቦርዶች ተመልከት",
    contactInboxTab: "የደንበኞች መልዕክቶች ኢንቦክስ",
    ratingsTab: "የምርቶች ደረጃ እና አስተያየቶች",
    passwordRequestsTab: "የፓስወርድ ሪሴት ጥያቄዎች",
    
    // Table Headers & Actions
    applicantName: "የአመልካች ስም",
    statusHeader: "ሁኔታ",
    actionsHeader: "ድርጊቶች",
    profilePic: "ፕሮፋይል",
    usernameHeader: "የተጠቃሚ ስም",
    defaultPinHeader: "ዲፎልት ፒን",
    itemHeader: "ምርት",
    askingPriceHeader: "የተጠየቀ ዋጋ",
    sellerHeader: "ሻጭ",
    locationHeader: "ቦታ",
    senderName: "የላኪው ስም",
    phoneAndEmail: "ስልክ እና ኢሜይል",
    subjectHeader: "ርዕስ",
    messageContent: "የመልዕክቱ ይዘት",
    sentDate: "የተላከበት ቀን",
    customerHeader: "ደንበኛ",
    starRatingHeader: "የኮከብ ደረጃ",
    reviewCommentHeader: "የተጻፈ አስተያየት",
    submittedDate: "የተሰጠበት ቀን",
    
    // Status Badges
    statusPending: "በመጠባበቅ ላይ",
    statusApproved: "ጽድቋል",
    statusRejected: "ውድቅ ተደርጓል",
    statusNew: "አዲስ",
    statusSeen: "ታይቷል",
    statusUnseen: "ልታይም",
    statusOld: "ቆየት ያለ",
    statusReset: "ተቀይሯል",
    statusDismissed: "ተሰርዟል",

    // Actions
    approve: "ጥያቄውን አጽድቅ",
    reject: "ውድቅ አድርግ",
    createUser: "በቀጥታ ተጠቃሚ ፍጠር",
    promotePartnerAdmin: "ወደ አድሚን አሳድግ",
    edit: "አስተካክል",
    delete: "ሰርዝ",
    markAsSold: "ተሸጧል ብለህ መዝግብ",
    postOnBehalf: "በተጠቃሚው ስም ምርት መዝግብ",
    uploadProfilePic: "የፕሮፋይል ፎቶ ስቀል",
    saveSettings: "ሴቲንግ ሴቭ አድርግ"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('delala_lang') || 'en';
  });

  const toggleLanguage = () => {
    setLang(prev => {
      const nextLang = prev === 'en' ? 'am' : 'en';
      localStorage.setItem('delala_lang', nextLang);
      return nextLang;
    });
  };

  const t = (key) => {
    return dictionary[lang]?.[key] || dictionary['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
