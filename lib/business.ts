// All of Shea's business details in one place. Change them here and every page updates.

export const BUSINESS = {
  name: "Aim & More",
  owner: "Shea",

  hours: {
    days: "Mon – Sat",
    time: "10:00 – 19:00",
    closed: "Sunday closed",
  },

  address: {
    line1: "Pandit Paltan Tewarieweg #242",
    line2: "Corner of Livorno 4e Dwarsstraat",
    city: "Paramaribo, Suriname",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Pandit+Paltan+Tewarieweg+242+Paramaribo+Suriname",
  },
  homeServiceNote: "Home-service massages available for 2 or more people.",

  phone: {
    display: "+597 717 3636",
    tel: "+5977173636",
    whatsapp: "https://wa.me/5977173636",
  },
  email: "yourstruly.luxx@gmail.com",

  socials: {
    instagram: { label: "@aimnmore", url: "https://www.instagram.com/aimnmore" },
    tiktok: { label: "@AIMnMore", url: "https://www.tiktok.com/@aimnmore" },
    facebook: {
      label: "AIM &more",
      url: "https://www.facebook.com/share/1NrYnm1wHF/",
    },
  },

  policies: [
    "Arriving 10 minutes late or more: SRD 50 late fee.",
    "30 minutes late: the appointment is cancelled.",
    "Please cancel or reschedule at least 24 hours in advance.",
  ],

  payment: {
    methods: "Cash, bank transfer or Uni5Pay+",
    bank: "Hakrinbank",
    account: "26 128 666 8",
    accountName: "Renelyx Da Silva Lima",
    reference: "Aimenmore + treatment (e.g. “aimenmore brazilian”)",
  },
} as const;
