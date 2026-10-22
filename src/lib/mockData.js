export const products = [
    {
        id: "p1", name: "iPhone 16 Pro", brand: "Apple", category: "Phones",
        storage: "256GB", colour: "Black Titanium", price: 425000,
        originalPrice: 460000, avgRating: 4.8, reviewCount: 38,
        image: "/iphone16pro.jpg",
        specs: "A18 Pro chip, ProMotion OLED, 48MP ProRaw camera, titanium frame",
        badge: "NEW"
    },
    {
        id: "p2", name: "Galaxy S24 Ultra", brand: "Samsung", category: "Phones",
        storage: "512GB", colour: "Titanium Gray", price: 449000,
        originalPrice: 489000, avgRating: 4.7, reviewCount: 54,
        image: "/samsung_s24.jpg",
        specs: "Snapdragon 8 Gen 3, 200MP Quad camera, built-in S Pen, 5000mAh",
        badge: "HOT"
    },
    {
        id: "p3", name: "Pixel 9 Pro", brand: "Google", category: "Phones",
        storage: "256GB", colour: "Obsidian", price: 275000,
        originalPrice: 299000, avgRating: 4.6, reviewCount: 22,
        image: "/pixel9pro.jpg",
        specs: "Google Tensor G4, 7 years updates, 50MP camera, AI features",
        badge: "NEW"
    },
    {
        id: "p4", name: "Anker 65W GaN Charger", brand: "Anker", category: "Chargers",
        storage: null, colour: "Black", price: 14500,
        originalPrice: 18000, avgRating: 4.9, reviewCount: 112,
        image: "/accessories.jpg",
        specs: "USB-C PD 3.0, 65W max, folds flat, compatible with laptops",
        badge: null
    },
    {
        id: "p5", name: "Spigen Ultra Hybrid Case", brand: "Spigen", category: "Cases",
        storage: null, colour: "Crystal Clear", price: 5500,
        originalPrice: 7200, avgRating: 4.5, reviewCount: 89,
        image: "/accessories.jpg",
        specs: "Military-grade protection, scratch-resistant back, flexible bumper",
        badge: null
    },
    {
        id: "p6", name: "OnePlus 12", brand: "OnePlus", category: "Phones",
        storage: "256GB", colour: "Silky Black", price: 218000,
        originalPrice: 245000, avgRating: 4.6, reviewCount: 33,
        image: "/pixel9pro.jpg",
        specs: "Snapdragon 8 Gen 3, Hasselblad 50MP, 100W SUPERVOOC charging",
        badge: "SALE"
    },
    {
        id: "p7", name: "Samsung Galaxy A55", brand: "Samsung", category: "Phones",
        storage: "128GB", colour: "Awesome Lilac", price: 89000,
        originalPrice: null, avgRating: 4.3, reviewCount: 41,
        image: "/samsung_s24.jpg",
        specs: "Exynos 1480, 50MP OIS camera, 5000mAh, IP67 water resistant",
        badge: null
    },
    {
        id: "p8", name: "Belkin Screen Protector", brand: "Belkin", category: "Accessories",
        storage: null, colour: null, price: 4200,
        originalPrice: 5500, avgRating: 4.4, reviewCount: 67,
        image: "/accessories.jpg",
        specs: "Tempered glass, UltraGlass 2 technology, easy install tray",
        badge: null
    },
];
export const repairTickets = [
    {
        id: "REP-104", userId: "u1", device: "iPhone 15 Pro", brand: "Apple",
        issue: "Cracked Screen", mode: "Walk-in",
        status: "Repairing", stages: ["Received", "Diagnosing", "Repairing", "Quality Tested", "Ready"],
        currentStage: 2, diagnosticNotes: "Touch IC slightly damaged too, replacing simultaneously.",
        estimatedCost: 28000, estimateApproved: null,
        createdAt: "2024-11-14", slotDate: "2024-11-15", slotTime: "10:30"
    },
    {
        id: "REP-103", userId: "u1", device: "Samsung S22", brand: "Samsung",
        issue: "Battery Replacement", mode: "Mail-in",
        status: "Quality Tested", stages: ["Received", "Diagnosing", "Repairing", "Quality Tested", "Ready"],
        currentStage: 3, diagnosticNotes: "Battery capacity at 68%, replaced with OEM unit.",
        estimatedCost: 12000, estimateApproved: true,
        createdAt: "2024-11-10", waybill: "QM-WB-8821"
    }
];
export const orders = [
    {
        id: "ORD-5521", items: [
            { name: "iPhone 16 Pro 256GB Black", qty: 1, price: 425000, image: "/iphone16pro.jpg" },
            { name: "Anker 65W GaN Charger", qty: 1, price: 14500, image: "/accessories.jpg" }
        ],
        total: 439500, paymentMethod: "PayHere", paymentStatus: "Paid",
        orderStatus: "Shipped", courierTracking: "DHL-4421881",
        createdAt: "2024-11-12"
    },
    {
        id: "ORD-5489", items: [
            { name: "Galaxy S24 Ultra 512GB", qty: 1, price: 449000, image: "/samsung_s24.jpg" }
        ],
        total: 449000, paymentMethod: "COD", paymentStatus: "Pending",
        orderStatus: "Processing", createdAt: "2024-11-08"
    }
];
export const reviews = [
    {
        id: "r1", productId: "p1", user: "Kasun M.", rating: 5,
        comment: "Arrived sealed and fast dispatch. The titanium frame feels incredibly premium. Camera system is the best I have used.",
        date: "18 Oct 2024", isVerifiedBuyer: true,
        storeReply: "Thank you, Kasun! Enjoy your new iPhone 16 Pro! ðŸ™Œ"
    },
    {
        id: "r2", productId: "p1", user: "Dilini P.", rating: 5,
        comment: "Battery life is amazing â€” easily gets through a full day with heavy usage. ProRes video is incredible.",
        date: "22 Oct 2024", isVerifiedBuyer: true, storeReply: null
    },
    {
        id: "r3", productId: "p1", user: "Ruwan S.", rating: 4,
        comment: "Great phone overall. The Dynamic Island is more useful than I expected. Minus one star since the box didn't include a charger.",
        date: "5 Nov 2024", isVerifiedBuyer: true, storeReply: null
    }
];
export const timeSlots = [
    { time: "09:00", booked: false }, { time: "09:30", booked: true },
    { time: "10:00", booked: false }, { time: "10:30", booked: false },
    { time: "11:00", booked: true }, { time: "11:30", booked: false },
    { time: "12:00", booked: false }, { time: "12:30", booked: false },
    { time: "13:00", booked: true }, { time: "13:30", booked: false },
    { time: "14:00", booked: false }, { time: "14:30", booked: false },
    { time: "15:00", booked: true }, { time: "15:30", booked: false },
    { time: "16:00", booked: false }, { time: "16:30", booked: false },
];
export const repairAdminQueue = [
    { id: "REP-104", customer: "Kasun M.", device: "iPhone 15 Pro", mode: "Walk-in", status: "Repairing", priority: "High" },
    { id: "REP-103", customer: "Dilini P.", device: "Samsung S22", mode: "Mail-in", status: "Quality Tested", priority: "Normal" },
    { id: "REP-102", customer: "Ruwan S.", device: "Pixel 7", mode: "Walk-in", status: "Diagnosing", priority: "Normal" },
    { id: "REP-101", customer: "Nimal J.", device: "iPhone 13", mode: "Mail-in", status: "Received", priority: "Low" },
    { id: "REP-100", customer: "Amaya K.", device: "OnePlus 11", mode: "Walk-in", status: "Ready", priority: "Normal" },
];
export const adminOrders = [
    { id: "ORD-5521", customer: "Kasun M.", items: 2, total: "LKR 439,500", payment: "PayHere", status: "Shipped" },
    { id: "ORD-5489", customer: "Dilini P.", items: 1, total: "LKR 449,000", payment: "COD", status: "Processing" },
    { id: "ORD-5455", customer: "Ruwan S.", items: 3, total: "LKR 28,700", payment: "PayHere", status: "Delivered" },
    { id: "ORD-5441", customer: "Nimal J.", items: 1, total: "LKR 89,000", payment: "PayHere", status: "Processing" },
    { id: "ORD-5420", customer: "Amaya K.", items: 2, total: "LKR 19,000", payment: "COD", status: "Delivered" },
];
export const auditLogs = [
    { time: "14:22", action: "DELETED", actor: "Admin 'Kamal'", target: "product", item: "Spigen Case", id: "#8412", color: "#ef4444" },
    { time: "13:55", action: "ADDED", actor: "Admin 'Kamal'", target: "product", item: "iPhone 16 Pro 512GB", id: "#8413", color: "#10b981" },
    { time: "11:30", action: "ROLE_CHANGE", actor: "Super Admin", target: "user", item: "Nuwan â†’ Technician role", id: "#U041", color: "#7c3aed" },
    { time: "10:14", action: "FAILED_LOGIN", actor: "Unknown", target: "auth", item: "3 attempts from 45.33.x.x", id: null, color: "#f59e0b" },
    { time: "09:22", action: "IDOR_BLOCKED", actor: "User #U205", target: "order", item: "ORD-5489 (not owned)", id: null, color: "#ef4444" },
    { time: "08:00", action: "ADDED", actor: "Admin 'Kamal'", target: "product", item: "Samsung A55 128GB", id: "#8410", color: "#10b981" },
];
export const staffList = [
    { id: "A1", name: "Kamal Perera", email: "kamal@quantummobile.lk", role: "Admin", specialisation: "Sales", status: "Active", lastLogin: "Today 14:30" },
    { id: "A2", name: "Nuwan Silva", email: "nuwan@quantummobile.lk", role: "Admin", specialisation: "Technician", status: "Active", lastLogin: "Today 12:15" },
    { id: "A3", name: "Priya Fernando", email: "priya@quantummobile.lk", role: "Admin", specialisation: "Sales", status: "Inactive", lastLogin: "3 days ago" },
];
export const MOCK_PRODUCTS = products;

