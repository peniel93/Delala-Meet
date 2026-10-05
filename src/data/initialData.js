// Initial Ethiopian Delala Meet Marketplace Data

export const INITIAL_SYSTEM_SETTINGS = {
  portal_title_en: "Delala Meet (ደላላ Meet) Portal",
  portal_title_am: "የደላላ Meet የደላሎች እና መርቻንቶች መረብ",
  logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80",
  hero_bg_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&auto=format&fit=crop&q=80",
  
  // Host Contact & Office Info
  office_address: "Bole Road, Near Friendship Building, Addis Ababa, Ethiopia",
  office_google_maps_url: "https://maps.google.com/?q=8.9806,38.7578",
  portal_phone: "+251 911 000000",
  portal_email: "info@delalameet.et",
  copyright_text: "© 2026 Delala Meet (ደላላ Meet) Portal. All rights reserved.",

  // Registration Fee & Payment Instructions
  signup_fee_amount: 500,
  bank_account_info: "Commercial Bank of Ethiopia (CBE): 1000123456789 (Delala Meet PLC) / Telebirr: +251 911 000000",

  // About Us Page Settings
  about_title_en: "About Delala Meet Portal",
  about_title_am: "ስለ ደላላ Meet ፖርታል",
  about_text_en: "Delala Meet is Ethiopia's leading digital portal connecting brokers, merchants, direct sellers, companies, hotel & cafeteria services, and buyers across land, livestock, furniture, housing, rental shops, barber shops, household equipment, and hospitality.",
  about_text_am: "ደላላ Meet ኢትዮጵያ ውስጥ ደላሎችን፣ ነጋዴዎችን፣ የቀጥታ ሻጮችን፣ ኩባንያዎችን፣ የሆቴልና ካፌ አገልግሎት ሰጪዎችን እና ገዢዎችን በመሬት፣ በከብቶች፣ በእቃዎች፣ በቤቶች፣ በሚከራዩ ሱቆች፣ በፀጉር ቤቶች፣ በቤት መገልገያዎች እና በሆቴል አገልግሎቶች የሚያገናኝ መሪ ዲጂታል ፖርታል ነው።",
  about_image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",

  // Social Media Links
  telegram_url: "https://t.me/delalameet",
  instagram_url: "https://instagram.com/delalameet",
  facebook_url: "https://facebook.com/delalameet",
  whatsapp_url: "https://wa.me/251911000000",
  youtube_url: "https://youtube.com/c/delalameet",
  linkedin_url: "https://linkedin.com/company/delalameet",
  discord_url: "https://discord.gg/delalameet",
  twitter_url: "https://x.com/delalameet",
  tiktok_url: "https://tiktok.com/@delalameet"
};

export const INITIAL_USERS = [
  {
    id: "u-mra-1001",
    username: "MRA/1001",
    default_pin: "1234",
    custom_password: null,
    full_name: "Main Registrar Admin",
    phone: "+251 911 000000",
    email: "admin@delalameet.et",
    address: "Addis Ababa, Ethiopia",
    role: "Main Registrar Admin",
    profile_pic_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "u-broker-1002",
    username: "BROKER/1002",
    default_pin: "4829",
    custom_password: null,
    full_name: "Abebe Bikila",
    phone: "+251 911 123456",
    email: "abebe@delala.et",
    address: "Bole, Addis Ababa",
    role: "Broker",
    profile_pic_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "u-merchant-1003",
    username: "MERCHANT/1003",
    default_pin: "9381",
    custom_password: null,
    full_name: "Makeda Kebede",
    phone: "+251 922 654321",
    email: "makeda@merchant.et",
    address: "Mercato, Addis Ababa",
    role: "Merchant",
    profile_pic_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "u-seller-1004",
    username: "SELLER/1004",
    default_pin: "2048",
    custom_password: null,
    full_name: "Yared Tadesse",
    phone: "+251 933 998877",
    email: "yared@directseller.com",
    address: "Hawassa, Sidama",
    role: "Direct Seller",
    profile_pic_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "u-company-1005",
    username: "COMPANY/1005",
    default_pin: "7712",
    custom_password: null,
    full_name: "Ethio Agro Trading PLC",
    phone: "+251 911 554433",
    email: "info@ethioagro.com",
    address: "Adama, Oromia",
    role: "Company",
    profile_pic_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "u-hotcaf-1007",
    username: "HOTCAF/1007",
    default_pin: "3344",
    custom_password: null,
    full_name: "Bole Star Hotel & Cafe PLC",
    phone: "+251 911 889900",
    email: "info@bolestarhotel.et",
    address: "Bole Medhanialem, Addis Ababa",
    role: "Hotel & Cafeteria",
    profile_pic_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "u-casual-1006",
    username: "CASUAL/1006",
    default_pin: "1122",
    custom_password: null,
    full_name: "Helen Haile",
    phone: "+251 944 112233",
    email: "helen@gmail.com",
    address: "CMC, Addis Ababa",
    role: "Casual User",
    profile_pic_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_SIGNUP_REQUESTS = [
  {
    id: "req-101",
    full_name: "Solomon Tekle",
    phone: "+251 912 334455",
    email: "solomon@broker.et",
    address: "Piassa, Addis Ababa",
    requested_role: "Broker",
    status: "Pending",
    payment_slip_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    payment_slip_file_name: "cbe_deposit_receipt_101.jpg",
    payment_fee_amount: 500,
    payment_status: "Slip Uploaded",
    created_at: "2026-08-05T10:30:00Z"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "p-01",
    title: "Prime Residential Land in Bole Atlas (500 sqm)",
    description: "500 sqm prime land for villa building near main asphalt road with clear title deed.",
    category: "Land",
    condition: "Original",
    original_price: 12000000,
    discounted_price: 10800000,
    discount_percent: 10,
    land_sqm: 500,
    address: "Bole Atlas, Addis Ababa",
    google_maps_url: "https://maps.google.com/?q=8.9806,38.7578",
    posted_by_name: "Abebe Bikila (Broker)",
    phone: "+251911123456",
    email: "abebe@delala.et",
    telegram_link: "https://t.me/abebedela",
    whatsapp_link: "https://wa.me/251911123456",
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    status: "Active",
    expiry_date: "2026-09-30",
    user_id: "u-broker-1002"
  },
  {
    id: "p-02",
    title: "Luxury Boutique Hotel & Cafeteria Package",
    description: "15 deluxe guest suites, outdoor garden cafe, full kitchen equipment, high-speed Wi-Fi, 24/7 security. Prime location near Bole airport.",
    category: "Hotel and Cafeteria Services",
    condition: "New",
    original_price: 150000,
    discounted_price: 135000,
    discount_percent: 10,
    land_sqm: 450,
    address: "Bole Medhanialem, Addis Ababa",
    google_maps_url: "https://maps.google.com/?q=8.9980,38.7850",
    posted_by_name: "Bole Star Hotel & Cafe PLC (Hotel & Cafeteria)",
    phone: "+251911889900",
    email: "info@bolestarhotel.et",
    telegram_link: "https://t.me/bolestarhotel",
    whatsapp_link: "https://wa.me/251911889900",
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    status: "Active",
    expiry_date: "2026-10-31",
    user_id: "u-hotcaf-1007"
  },
  {
    id: "p-03",
    title: "Fully Furnished Rental Barber Shop in Kazanchis",
    description: "4-station modern barber salon for monthly rent. Includes hydraulic chairs, mirrors, water heaters, and LED lighting setup.",
    category: "Rental Barber Shops",
    condition: "New",
    original_price: 35000,
    discounted_price: 29750,
    discount_percent: 15,
    land_sqm: 45,
    address: "Kazanchis, Addis Ababa",
    google_maps_url: "https://maps.google.com/?q=9.0200,38.7600",
    posted_by_name: "Abebe Bikila (Broker)",
    phone: "+251911123456",
    email: "abebe@delala.et",
    telegram_link: "https://t.me/abebedela",
    whatsapp_link: "https://wa.me/251911123456",
    image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
    status: "Active",
    expiry_date: "2026-10-15",
    user_id: "u-broker-1002"
  },
  {
    id: "p-04",
    title: "Professional Hydraulic Barber Chairs & Hair Trimmers Set",
    description: "Imported heavy-duty hydraulic barber chairs (3 units) + Wahl professional cordless clippers and sterilizers.",
    category: "Barber Equipment",
    condition: "New",
    original_price: 120000,
    discounted_price: 102000,
    discount_percent: 15,
    land_sqm: null,
    address: "Mercato, Addis Ababa",
    google_maps_url: "https://maps.google.com/?q=9.0333,38.7333",
    posted_by_name: "Makeda Kebede (Merchant)",
    phone: "+251922654321",
    email: "makeda@merchant.et",
    telegram_link: "https://t.me/makedatrade",
    whatsapp_link: "https://wa.me/251922654321",
    image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80",
    status: "Active",
    expiry_date: "2026-09-25",
    user_id: "u-merchant-1003"
  },
  {
    id: "p-05",
    title: "Complete Smart Household Kitchen & Laundry Equipment Set",
    description: "Double door Samsung Inverter Refrigerator, 8kg Front Load Washing Machine, and Microwave Oven package.",
    category: "Household Equipment",
    condition: "Original",
    original_price: 165000,
    discounted_price: 148500,
    discount_percent: 10,
    land_sqm: null,
    address: "CMC Michael, Addis Ababa",
    google_maps_url: "https://maps.google.com/?q=9.0150,38.8300",
    posted_by_name: "Yared Tadesse",
    phone: "+251933998877",
    email: "yared@directseller.com",
    telegram_link: "https://t.me/yaredtrade",
    whatsapp_link: "https://wa.me/251933998877",
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    status: "Active",
    expiry_date: "2026-09-30",
    user_id: "u-seller-1004"
  },
  {
    id: "p-06",
    title: "High-Footfall Commercial Rental Shop in Mercato",
    description: "35 sqm ground level shop for monthly rental in bustling Mercato commercial corridor.",
    category: "Rental Shops",
    condition: "Original",
    original_price: 28000,
    discounted_price: 23800,
    discount_percent: 15,
    land_sqm: 35,
    address: "Mercato Dubai Tera, Addis Ababa",
    google_maps_url: "https://maps.google.com/?q=9.0333,38.7333",
    posted_by_name: "Makeda Kebede (Merchant)",
    phone: "+251922654321",
    email: "makeda@merchant.et",
    telegram_link: "https://t.me/makedatrade",
    whatsapp_link: "https://wa.me/251922654321",
    image_url: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=800&auto=format&fit=crop&q=80",
    status: "Active",
    expiry_date: "2026-09-15",
    user_id: "u-merchant-1003"
  }
];

export const INITIAL_RATINGS = [
  {
    id: "r-1",
    product_id: "p-01",
    user_id: "u-merchant-1003",
    user_name: "Makeda Kebede",
    rating: 5,
    comment: "Excellent plot location in Bole with authentic documentation! Highly recommend Abebe Bikila.",
    created_at: "2026-08-06T12:00:00Z"
  },
  {
    id: "r-2",
    product_id: "p-02",
    user_id: "u-broker-1002",
    user_name: "Abebe Bikila",
    rating: 5,
    comment: "Top notch hotel facility and lounge area near Bole Medhanialem.",
    created_at: "2026-08-07T09:30:00Z"
  }
];

export const INITIAL_MESSAGES = [
  {
    id: "msg-101",
    sender_name: "Dawit Wolde",
    phone: "+251 911 887766",
    email: "dawit@gmail.com",
    subject: "Inquiry regarding Commercial Land in Modjo",
    message: "Hello Delala Meet team, I am interested in listing 3000 sqm commercial land in Modjo. Please contact me.",
    status: "New",
    created_at: "2026-08-07T11:15:00Z"
  }
];
