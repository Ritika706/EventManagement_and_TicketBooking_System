// services/api.js — dummy data & booking helpers

export const eventsData = [
  {
    id: 1,
    name: "Sunburn Festival – Electronic Music Night",
    category: "MUSIC",
    dates: ["Thu, 15 May, 2025", "Fri, 16 May, 2025", "Sat, 17 May, 2025"],
    times: ["6:00 PM", "8:00 PM", "10:00 PM"],
    venue: "DY Patil Stadium, Mumbai",
    price: 299,
    totalTickets: 500,
    sold: 342,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    desc: "Experience the biggest electronic music festival in Asia. Featuring world-class DJs, stunning light shows, and an electrifying atmosphere.",
  },
  {
    id: 2,
    name: "DevConf India 2025",
    category: "TECH",
    dates: ["Sun, 8 Jun, 2025", "Mon, 9 Jun, 2025"],
    times: ["10:00 AM", "2:00 PM", "5:00 PM"],
    venue: "HICC Convention, Hyderabad",
    price: 290,
    totalTickets: 300,
    sold: 210,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    desc: "India's biggest developer conference with talks, workshops, and networking with top tech minds.",
  },
  {
    id: 3,
    name: "IPL Finals: Live Screening Party",
    category: "SPORTS",
    dates: ["Wed, 28 May, 2025"],
    times: ["7:00 PM", "7:30 PM"],
    venue: "Jawaharlal Nehru Stadium, Delhi",
    price: 150,
    totalTickets: 1000,
    sold: 876,
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    desc: "Watch the IPL Finals LIVE on a giant screen with thousands of cricket fans. Food, games, and prizes!",
  },
  {
    id: 4,
    name: "Gourmet Food Carnival – Edition 7",
    category: "FOOD",
    dates: ["Sat, 21 Jun, 2025", "Sun, 22 Jun, 2025"],
    times: ["11:00 AM", "3:00 PM", "6:00 PM"],
    venue: "Cubbon Park, Bengaluru",
    price: 210,
    totalTickets: 400,
    sold: 190,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    desc: "A food lover's paradise with 100+ stalls, live cooking shows, and celebrity chefs.",
  },
];

export const getBookings = () => {
  const stored = localStorage.getItem("myBookings");
  if (stored) return JSON.parse(stored);
  const dummy = [
    { id: 1, eventName: "Sunburn Festival", category: "MUSIC", date: "Thu, 15 May, 2025", time: "8:00 PM", venue: "DY Patil Stadium, Mumbai", quantity: 2, totalAmount: 598, bookedAt: "01/04/2025", status: "Confirmed" },
    { id: 2, eventName: "DevConf India 2025", category: "TECH", date: "Sun, 8 Jun, 2025", time: "10:00 AM", venue: "HICC Convention, Hyderabad", quantity: 1, totalAmount: 290, bookedAt: "28/03/2025", status: "Confirmed" },
    { id: 3, eventName: "IPL Finals Screening", category: "SPORTS", date: "Wed, 28 May, 2025", time: "7:00 PM", venue: "JLN Stadium, Delhi", quantity: 3, totalAmount: 450, bookedAt: "25/03/2025", status: "Cancelled" },
  ];
  localStorage.setItem("myBookings", JSON.stringify(dummy));
  return dummy;
};

export const saveBooking = (booking) => {
  const existing = getBookings();
  const updated = [...existing, booking];
  localStorage.setItem("myBookings", JSON.stringify(updated));
  return updated;
};

export const cancelBooking = (id) => {
  const bookings = getBookings();
  const updated = bookings.map(b => b.id === id ? { ...b, status: "Cancelled" } : b);
  localStorage.setItem("myBookings", JSON.stringify(updated));
  return updated;
};

export const categoryColors = {
  MUSIC: "#ff5c1a", TECH: "#00d4ff", SPORTS: "#4ade80",
  FOOD: "#fbbf24", ART: "#c084fc", BUSINESS: "#60a5fa",
};