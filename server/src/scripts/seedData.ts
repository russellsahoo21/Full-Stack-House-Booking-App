// Auto-generated seed data for Wayfound MongoDB Database

export const seedUsers = [
  {
    "_id": "usr-demo-traveler",
    "name": "Kabir Singhania",
    "email": "traveler@wayfound.stay",
    "password": "password123",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "phone": "+91 98201 23456",
    "role": "user",
    "wishlist": [
      "stay-1",
      "stay-2",
      "stay-3"
    ]
  },
  {
    "_id": "usr-demo-host",
    "name": "Aarav & Meera Desai",
    "email": "host@wayfound.stay",
    "password": "password123",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "phone": "+91 98765 43210",
    "role": "host",
    "wishlist": [
      "stay-2"
    ]
  },
  {
    "_id": "usr-demo-admin",
    "name": "Wayfound Curator",
    "email": "admin@wayfound.stay",
    "password": "adminpassword123",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    "phone": "+91 99999 88888",
    "role": "admin",
    "wishlist": []
  }
];

export const seedHosts = [
  {
    "_id": "host-1",
    "name": "Aarav & Meera Desai",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "isSuperhost": true,
    "joinedDate": "Joined April 2019",
    "responseRate": 99,
    "responseTime": "within an hour",
    "bio": "Architects turned slow-living enthusiasts. We designed our stays to reconnect travelers with coastal nature and handcrafted Goan heritage.",
    "rating": 4.96,
    "reviewCount": 248,
    "createdAt": "2019-04-12T10:00:00.000Z"
  },
  {
    "_id": "host-2",
    "name": "Tenzing Norbu",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    "isSuperhost": true,
    "joinedDate": "Joined July 2020",
    "responseRate": 97,
    "responseTime": "within an hour",
    "bio": "Highlander, naturalist, and mountaineer. Born and raised under the snow peaks of the Pir Panjal range.",
    "rating": 4.98,
    "reviewCount": 184,
    "createdAt": "2020-07-15T08:30:00.000Z"
  },
  {
    "_id": "host-3",
    "name": "Maharani Gayatri Singh",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    "isSuperhost": true,
    "joinedDate": "Joined November 2018",
    "responseRate": 100,
    "responseTime": "within a few minutes",
    "bio": "Custodian of our family’s 18th-century lakeside haveli. Devoted to preserving traditional Mewari architecture and culinary arts.",
    "rating": 4.99,
    "reviewCount": 312,
    "createdAt": "2018-11-20T14:15:00.000Z"
  },
  {
    "_id": "host-4",
    "name": "Capt. Thomas Kurien",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "isSuperhost": true,
    "joinedDate": "Joined January 2021",
    "responseRate": 96,
    "responseTime": "within 2 hours",
    "bio": "Former merchant mariner. Now sailing custom-carved luxury teak kettuvallams across the peaceful lagoons of Vembanad Lake.",
    "rating": 4.94,
    "reviewCount": 139,
    "createdAt": "2021-01-08T09:00:00.000Z"
  },
  {
    "_id": "host-5",
    "name": "Rohan & Shweta Nair",
    "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    "isSuperhost": false,
    "joinedDate": "Joined May 2022",
    "responseRate": 94,
    "responseTime": "within an hour",
    "bio": "Coffee estate planters in third generation. We offer tranquil forest cabins with high-speed fiber internet for remote creators.",
    "rating": 4.91,
    "reviewCount": 88,
    "createdAt": "2022-05-18T16:45:00.000Z"
  },
  {
    "_id": "host-6",
    "name": "Stanzin Dorje",
    "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    "isSuperhost": true,
    "joinedDate": "Joined August 2021",
    "responseRate": 98,
    "responseTime": "within an hour",
    "bio": "Astrophotographer and solar energy engineer in Nubra Valley. Passionate about showing guests the Milky Way with zero light pollution.",
    "rating": 4.97,
    "reviewCount": 104,
    "createdAt": "2021-08-01T11:20:00.000Z"
  }
];

export const seedListings = [
  {
    "_id": "stay-1",
    "title": "The Cliff Sanctuary & Private Plunge Pool",
    "slug": "the-cliff-sanctuary-vagator-goa",
    "tagline": "Private ocean cliffside estate overlooking Little Vagator cove",
    "description": "Perched delicately on the red laterite cliffs of Vagator, The Cliff Sanctuary blends raw Portuguese heritage masonry with minimalist Nordic interior design. Wake to uninterrupted panoramas of the Arabian Sea, private sea-cliff yoga deck, and private plunge pool.",
    "propertyType": "Villa",
    "roomType": "Entire place",
    "category": [
      "beachfront",
      "villas",
      "luxe"
    ],
    "vibe": "beach",
    "location": {
      "city": "Vagator, Goa",
      "state": "Goa",
      "country": "India",
      "area": "North Goa",
      "distanceDesc": "Direct cliff sea-walk",
      "lat": 15.5992,
      "lng": 73.7408
    },
    "price": {
      "perNight": 18500,
      "cleaningFee": 2000,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.97,
      "count": 142,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.8
    },
    "images": [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Ocean view",
      "Private plunge pool",
      "High-speed fiber WiFi",
      "Private chef option",
      "Air conditioning",
      "Dedicated workspace",
      "Free parking"
    ],
    "hostId": "host-1",
    "guestFavorite": true,
    "maxGuests": 6,
    "bedrooms": 3,
    "beds": 3,
    "bathrooms": 3,
    "availableDates": "Nov 14 – 19",
    "sleepingArrangements": [
      {
        "room": "Bedroom 1 (Master)",
        "bedType": "1 King Bed"
      },
      {
        "room": "Bedroom 2",
        "bedType": "1 Queen Bed"
      },
      {
        "room": "Bedroom 3",
        "bedType": "2 Single Beds"
      }
    ],
    "houseRules": [
      "Check-in after 2:00 PM",
      "Checkout before 11:00 AM",
      "No loud outdoor music after 10:00 PM",
      "Smoking allowed on terrace only"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours before check-in.",
    "createdAt": "2023-01-15T09:00:00.000Z"
  },
  {
    "_id": "stay-2",
    "title": "Solang Pine & Cedar A-Frame Glass Chalet",
    "slug": "solang-pine-cedar-a-frame-manali",
    "tagline": "Floor-to-ceiling glass mountain chalet deep within deodar woods",
    "description": "Suspended in the quiet alpine slopes of Solang Valley near Old Manali, this handcrafted timber and glass A-frame chalet frames breathtaking views of 6000m Himalayan peaks. Complete with cast iron wood-stove, skylight stargazing loft, and heated pine floors.",
    "propertyType": "Chalet",
    "roomType": "Entire place",
    "category": [
      "mountains",
      "tiny-homes",
      "pet-friendly"
    ],
    "vibe": "hills",
    "location": {
      "city": "Solang Valley, Manali",
      "state": "Himachal Pradesh",
      "country": "India",
      "area": "Upper Manali",
      "distanceDesc": "4.2 km from Mall Road",
      "lat": 32.3166,
      "lng": 77.1574
    },
    "price": {
      "perNight": 9800,
      "cleaningFee": 1200,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.95,
      "count": 98,
      "accuracy": 4.9,
      "cleanliness": 5,
      "communication": 4.9,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Snow mountain view",
      "Indoor wood fireplace",
      "High-speed Starlink WiFi",
      "Underfloor heating",
      "Kitchenette",
      "Pet friendly",
      "Bonfire pit"
    ],
    "hostId": "host-2",
    "guestFavorite": true,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "availableDates": "Nov 20 – 25",
    "sleepingArrangements": [
      {
        "room": "Stargazing Loft",
        "bedType": "1 King Bed"
      },
      {
        "room": "Ground Living Bedroom",
        "bedType": "1 Queen Sofa Bed"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Pets welcome with advance note",
      "Firewood supplied daily"
    ],
    "cancellationPolicy": "Free cancellation up to 5 days before check-in.",
    "createdAt": "2023-03-22T11:30:00.000Z"
  },
  {
    "_id": "stay-3",
    "title": "Rawla Pichola: 250-Year Heritage Palace Suite",
    "slug": "rawla-pichola-heritage-palace-udaipur",
    "tagline": "Private Rajput royal suite directly above the shimmering lake waters",
    "description": "Immerse in authentic Mewari royalty. Featuring hand-painted fresco ceilings, private marble jharokha (overhanging balcony) looking out to Lake Palace and City Palace, copper bathtubs, and bespoke morning boat excursions.",
    "propertyType": "Haveli",
    "roomType": "Entire place",
    "category": [
      "heritage",
      "lakeside",
      "luxe"
    ],
    "vibe": "heritage",
    "location": {
      "city": "Udaipur",
      "state": "Rajasthan",
      "country": "India",
      "area": "Old City / Lake Pichola",
      "distanceDesc": "Direct Lake Pichola frontage",
      "lat": 24.5764,
      "lng": 73.6835
    },
    "price": {
      "perNight": 24000,
      "cleaningFee": 2500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.99,
      "count": 210,
      "accuracy": 5,
      "cleanliness": 5,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Lake view",
      "Marble jharokha balcony",
      "Butler service",
      "Heritage courtyard pool",
      "Breakfast included",
      "High-speed WiFi",
      "Air conditioning"
    ],
    "hostId": "host-3",
    "guestFavorite": true,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Dec 02 – 07",
    "sleepingArrangements": [
      {
        "room": "Royal Bedroom",
        "bedType": "1 Custom Carved Teak King Bed"
      }
    ],
    "houseRules": [
      "Adults only property",
      "Check-in 2:00 PM",
      "Checkout 12:00 PM",
      "Traditional quiet hours after 11 PM"
    ],
    "cancellationPolicy": "Moderate cancellation: Full refund up to 7 days before check-in.",
    "createdAt": "2022-10-10T14:00:00.000Z"
  },
  {
    "_id": "stay-4",
    "title": "The Malabar Kettuvallam Private Houseboat",
    "slug": "malabar-kettuvallam-houseboat-alleppey",
    "tagline": "Private traditional cedar & coir floating sanctuary on Vembanad Lake",
    "description": "Drift across palm-fringed canals, blooming lotus ponds, and village lagoons on an eco-conscious solar-powered handcrafted teak houseboat. Includes private crew with a dedicated Kerala chef creating fresh karimeen pollichathu on demand.",
    "propertyType": "Houseboat",
    "roomType": "Entire place",
    "category": [
      "lakeside",
      "villas",
      "luxe"
    ],
    "vibe": "beach",
    "location": {
      "city": "Kumarakom, Alleppey",
      "state": "Kerala",
      "country": "India",
      "area": "Vembanad Lake",
      "distanceDesc": "Lakefront private jetty",
      "lat": 9.6175,
      "lng": 76.4301
    },
    "price": {
      "perNight": 21500,
      "cleaningFee": 0,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.96,
      "count": 84,
      "accuracy": 4.9,
      "cleanliness": 5,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Private boat crew & chef",
      "All meals included",
      "Panoramic glass air-conditioned lounge",
      "Sun deck",
      "Kayak provided",
      "WiFi aboard"
    ],
    "hostId": "host-4",
    "guestFavorite": true,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "availableDates": "Oct 28 – Nov 02",
    "sleepingArrangements": [
      {
        "room": "Stern Bedroom",
        "bedType": "1 King Bed"
      },
      {
        "room": "Bow Suite",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 12:00 PM at Jetty",
      "Cruise ends 9:30 AM next day",
      "Life jackets available and mandatory during navigation"
    ],
    "cancellationPolicy": "Strict cancellation policy.",
    "createdAt": "2023-04-14T08:00:00.000Z"
  },
  {
    "_id": "stay-5",
    "title": "The Canopy: Coffee Plantation Treehouse & Studio",
    "slug": "the-canopy-treehouse-coorg",
    "tagline": "Suspended 40 feet high above a 120-acre organic robusta estate",
    "description": "Designed for deep focus, creative sabbaticals, and slow forest bathing. Built around living rosewood and fig trees, this architect-designed treehouse features 300 Mbps fiber internet, ergonomic Herman Miller desk, outdoor rain shower, and fresh estate-ground coffee.",
    "propertyType": "Treehouse",
    "roomType": "Entire place",
    "category": [
      "treehouses",
      "tiny-homes",
      "farm-stays"
    ],
    "vibe": "workation",
    "location": {
      "city": "Madikeri, Coorg",
      "state": "Karnataka",
      "country": "India",
      "area": "Western Ghats",
      "distanceDesc": "18 km from Madikeri town",
      "lat": 12.4244,
      "lng": 75.7382
    },
    "price": {
      "perNight": 8200,
      "cleaningFee": 900,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.93,
      "count": 116,
      "accuracy": 4.9,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 4.8,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "High-speed 300 Mbps WiFi",
      "Ergonomic workspace",
      "Estate coffee bar",
      "Outdoor rain shower",
      "Nature trails",
      "Balcony overlooking canopy"
    ],
    "hostId": "host-5",
    "guestFavorite": true,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 05 – 10",
    "sleepingArrangements": [
      {
        "room": "Main Studio",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 2:00 PM",
      "Checkout 11:00 AM",
      "Not suitable for children under 12 due to treehouse height",
      "Estate plantation walks with guide at 7 AM"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours before check-in.",
    "createdAt": "2023-05-01T12:00:00.000Z"
  },
  {
    "_id": "stay-6",
    "title": "Nubra Valley Celestial Geodesic Stargazer",
    "slug": "nubra-valley-geodesic-stargazer-ladakh",
    "tagline": "Ultra-clear panoramic sky dome at 10,000 ft with automated telescope",
    "description": "Experience the raw grandeur of the Karakoram ranges under Bortle Class 1 dark skies. Insulated glass dome with oxygen enrichment system, motorized telescope mount, pellet heating stove, and Ladakhi yak wool bedding.",
    "propertyType": "Tent",
    "roomType": "Entire place",
    "category": [
      "camping",
      "mountains",
      "tiny-homes"
    ],
    "vibe": "hills",
    "location": {
      "city": "Diskit, Nubra Valley",
      "state": "Ladakh",
      "country": "India",
      "area": "Nubra Valley",
      "distanceDesc": "Overlooking sand dunes & river",
      "lat": 34.5422,
      "lng": 77.5619
    },
    "price": {
      "perNight": 14500,
      "cleaningFee": 1500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.98,
      "count": 73,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Astrophotography telescope",
      "Insulated heated dome",
      "Oxygen-concentrator ready",
      "Organic Himalayan meals included",
      "Satellite WiFi"
    ],
    "hostId": "host-6",
    "guestFavorite": true,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 18 – 23",
    "sleepingArrangements": [
      {
        "room": "Main Dome",
        "bedType": "1 King Bed"
      }
    ],
    "houseRules": [
      "Acclimatization in Leh recommended prior to arrival",
      "Eco-sensitive zone: strictly zero single-use plastic",
      "Check-in 1:00 PM",
      "Checkout 10:00 AM"
    ],
    "cancellationPolicy": "Moderate: Cancel up to 7 days before for 100% refund.",
    "createdAt": "2023-06-19T10:00:00.000Z"
  },
  {
    "_id": "stay-7",
    "title": "The Jaipur Courtyard & Sunken Baori Pool",
    "slug": "jaipur-courtyard-sunken-baori-pool",
    "tagline": "Private pink sandstone sanctuary featuring traditional stepwell pool",
    "description": "Tucked into the royal cantonment beneath Nahargarh ridge, this villa features scalloped Mughal arches, a private turquoise stepwell pool, open-sky courtyard with pomegranate trees, and antique Thikri mirror inlay.",
    "propertyType": "Villa",
    "roomType": "Entire place",
    "category": [
      "heritage",
      "villas",
      "luxe"
    ],
    "vibe": "heritage",
    "location": {
      "city": "Civil Lines, Jaipur",
      "state": "Rajasthan",
      "country": "India",
      "area": "Central Jaipur",
      "distanceDesc": "3.5 km to Hawa Mahal",
      "lat": 26.9124,
      "lng": 75.7873
    },
    "price": {
      "perNight": 27500,
      "cleaningFee": 2000,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.95,
      "count": 156,
      "accuracy": 4.9,
      "cleanliness": 5,
      "communication": 4.9,
      "location": 4.9,
      "value": 4.8
    },
    "images": [
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Private stepwell pool",
      "Courtyard garden",
      "Complimentary royal breakfast",
      "Fiber WiFi",
      "Central AC",
      "Private parking",
      "Heritage library"
    ],
    "hostId": "host-3",
    "guestFavorite": false,
    "maxGuests": 6,
    "bedrooms": 3,
    "beds": 3,
    "bathrooms": 3,
    "availableDates": "Dec 10 – 15",
    "sleepingArrangements": [
      {
        "room": "Chinar Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Gulab Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Amber Room",
        "bedType": "2 Queen Beds"
      }
    ],
    "houseRules": [
      "Check-in 2:00 PM",
      "Checkout 11:00 AM",
      "Parties not allowed",
      "Respectful of quiet residential enclave"
    ],
    "cancellationPolicy": "Free cancellation up to 5 days before arrival.",
    "createdAt": "2023-02-18T15:00:00.000Z"
  },
  {
    "_id": "stay-8",
    "title": "Ananda Riverside Bamboo Loft & Yoga Deck",
    "slug": "ananda-riverside-bamboo-loft-rishikesh",
    "tagline": "Quiet riverbank retreat where the clear Ganges emerges from the foothills",
    "description": "Located in Tapovan upstream from the town bustle, this breezy open-plan bamboo loft looks directly out to the emerald waters of the Ganges. Includes private yoga deck, meditation cushion set, and organic tea collection.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "lakeside",
      "mountains",
      "tiny-homes"
    ],
    "vibe": "hills",
    "location": {
      "city": "Tapovan, Rishikesh",
      "state": "Uttarakhand",
      "country": "India",
      "area": "Upper Tapovan",
      "distanceDesc": "Overlooking the Ganges riverbank",
      "lat": 30.1343,
      "lng": 78.3242
    },
    "price": {
      "perNight": 5800,
      "cleaningFee": 600,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.92,
      "count": 148,
      "accuracy": 4.9,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Direct river view",
      "Private yoga deck & mats",
      "High-speed WiFi",
      "Organic herbal teas",
      "Air conditioning",
      "Kitchenette"
    ],
    "hostId": "host-2",
    "guestFavorite": true,
    "maxGuests": 3,
    "bedrooms": 1,
    "beds": 2,
    "bathrooms": 1,
    "availableDates": "Nov 08 – 13",
    "sleepingArrangements": [
      {
        "room": "Main Studio",
        "bedType": "1 King Bed + 1 Daybed"
      }
    ],
    "houseRules": [
      "Pure vegetarian stay",
      "Alcohol & smoking prohibited on premises",
      "Check-in 1:00 PM",
      "Checkout 11:00 AM"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours before check-in.",
    "createdAt": "2023-07-02T13:40:00.000Z"
  },
  {
    "_id": "stay-9",
    "title": "The Queen’s Necklace: Art Deco Heritage Penthouse",
    "slug": "queens-necklace-art-deco-penthouse-mumbai",
    "tagline": "Historic 1930s sea-facing terrace apartment on Marine Drive",
    "description": "Rare opportunity to live inside Mumbai’s UNESCO-recognized Art Deco promenade. Restored Burma teak accents, wraparound curved balcony with sunset views over Back Bay, and vintage record collection.",
    "propertyType": "Apartment",
    "roomType": "Entire place",
    "category": [
      "beachfront",
      "heritage",
      "luxe"
    ],
    "vibe": "beach",
    "location": {
      "city": "Marine Drive, Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "area": "South Mumbai",
      "distanceDesc": "Direct promenade frontage",
      "lat": 18.9438,
      "lng": 72.8233
    },
    "price": {
      "perNight": 32000,
      "cleaningFee": 3000,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.96,
      "count": 92,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.7
    },
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Sea view terrace",
      "Elevator",
      "500 Mbps WiFi",
      "Vinyl audio system",
      "Dedicated workspace",
      "Full chef kitchen",
      "Washer & dryer"
    ],
    "hostId": "host-1",
    "guestFavorite": true,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "availableDates": "Nov 12 – 16",
    "sleepingArrangements": [
      {
        "room": "Master Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Guest Bedroom",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 3:00 PM",
      "Checkout 12:00 PM",
      "No unauthorized video shoots without prior consent"
    ],
    "cancellationPolicy": "Moderate cancellation policy.",
    "createdAt": "2023-01-28T16:20:00.000Z"
  },
  {
    "_id": "stay-10",
    "title": "Maison Blanche: White Town Colonial Villa",
    "slug": "maison-blanche-white-town-pondicherry",
    "tagline": "Pastel yellow Franco-Tamil colonial manor with bougainvillea patio",
    "description": "Located in the quietest cobble-lined corner of White Town, two minutes stroll from Promenade Beach. Features vaulted high ceilings, vintage louvered windows, checkerboard Italian tile floors, and bicycles to explore the cafes.",
    "propertyType": "Villa",
    "roomType": "Entire place",
    "category": [
      "heritage",
      "beachfront",
      "pet-friendly"
    ],
    "vibe": "beach",
    "location": {
      "city": "White Town, Pondicherry",
      "state": "Puducherry",
      "country": "India",
      "area": "French Quarter",
      "distanceDesc": "200m from Promenade Beach",
      "lat": 11.9338,
      "lng": 79.8338
    },
    "price": {
      "perNight": 11500,
      "cleaningFee": 1200,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.94,
      "count": 167,
      "accuracy": 4.9,
      "cleanliness": 5,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Private courtyard",
      "Vintage bicycles included",
      "Fiber WiFi",
      "Kitchenette with French press",
      "Air conditioning",
      "Pet friendly"
    ],
    "hostId": "host-5",
    "guestFavorite": true,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "availableDates": "Dec 01 – 06",
    "sleepingArrangements": [
      {
        "room": "Bougainvillea Room",
        "bedType": "1 Four-Poster King Bed"
      },
      {
        "room": "Garden Room",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 2:00 PM",
      "Checkout 11:00 AM",
      "Smoking outside in courtyard only"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours before check-in.",
    "createdAt": "2023-03-10T11:00:00.000Z"
  },
  {
    "_id": "stay-11",
    "title": "The Planters Bungalow & Kanchenjunga Vistas",
    "slug": "planters-bungalow-kanchenjunga-darjeeling",
    "tagline": "150-year-old colonial tea planter residency amidst emerald slopes",
    "description": "Overlooking terraced organic tea gardens with the snow-crowned Kanchenjunga massif floating in the morning mist. Cozy up with antique brass coal-irons, roaring stone fireplaces, and estate tea sommelier tastings.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "mountains",
      "heritage",
      "farm-stays"
    ],
    "vibe": "hills",
    "location": {
      "city": "Kurseong, Darjeeling",
      "state": "West Bengal",
      "country": "India",
      "area": "Darjeeling Hills",
      "distanceDesc": "Surrounded by tea gardens",
      "lat": 27.041,
      "lng": 88.2663
    },
    "price": {
      "perNight": 16800,
      "cleaningFee": 1500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.97,
      "count": 88,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.8
    },
    "images": [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Kanchenjunga view",
      "Fireplace with tea service",
      "Private tea tasting tour",
      "Cook and housekeeping staff",
      "Free WiFi",
      "Sun porch"
    ],
    "hostId": "host-2",
    "guestFavorite": true,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "availableDates": "Nov 22 – 27",
    "sleepingArrangements": [
      {
        "room": "Mountain Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Valley Room",
        "bedType": "2 Twin Beds"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Warm footwear recommended indoors"
    ],
    "cancellationPolicy": "Moderate policy.",
    "createdAt": "2023-04-20T10:30:00.000Z"
  },
  {
    "_id": "stay-12",
    "title": "Casa Palm: Barefoot Beachfront Villa",
    "slug": "casa-palm-barefoot-ashwem-goa",
    "tagline": "Step directly off your veranda onto the powder sands of Ashwem",
    "description": "Laidback luxury at its finest. Built with sustainable reclaimed teak, woven bamboo screens, and polished coconut shell tiles. Features open-air garden bath, hammocks swaying between coconut palms, and sunset DJ vinyl deck.",
    "propertyType": "Villa",
    "roomType": "Entire place",
    "category": [
      "beachfront",
      "villas",
      "pet-friendly"
    ],
    "vibe": "beach",
    "location": {
      "city": "Ashwem Beach, Goa",
      "state": "Goa",
      "country": "India",
      "area": "North Goa",
      "distanceDesc": "Step straight onto beach sand",
      "lat": 15.6583,
      "lng": 73.7144
    },
    "price": {
      "perNight": 16200,
      "cleaningFee": 1800,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.95,
      "count": 112,
      "accuracy": 4.9,
      "cleanliness": 5,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Direct sand access",
      "Private plunge pool",
      "Fast WiFi",
      "Surfboards & paddleboards provided",
      "Pet friendly",
      "Outdoor rain shower"
    ],
    "hostId": "host-1",
    "guestFavorite": true,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "availableDates": "Nov 15 – 20",
    "sleepingArrangements": [
      {
        "room": "Ocean Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Garden Cabana",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Rinse sand at outdoor shower before entering",
      "Check-in 2:00 PM",
      "Checkout 11:00 AM"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours before check-in.",
    "createdAt": "2023-05-12T14:15:00.000Z"
  },
  {
    "_id": "stay-13",
    "title": "Villa Botanica: Hidden Riverine Sanctuary",
    "slug": "villa-botanica-siolim-goa",
    "tagline": "Private infinity pool enveloped by lush tropical cashew groves",
    "description": "Designed by a noted Goan landscape architect. A peaceful retreat away from beach crowds along the backwaters of the Chapora river. Black terrazzo floors, towering glass sliding walls, and birdsong all morning.",
    "propertyType": "Villa",
    "roomType": "Entire place",
    "category": [
      "villas",
      "luxe",
      "lakeside"
    ],
    "vibe": "beach",
    "location": {
      "city": "Siolim, Goa",
      "state": "Goa",
      "country": "India",
      "area": "North Goa",
      "distanceDesc": "Chapora riverbank, 10 min to beach",
      "lat": 15.6267,
      "lng": 73.7661
    },
    "price": {
      "perNight": 22000,
      "cleaningFee": 2500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.98,
      "count": 76,
      "accuracy": 5,
      "cleanliness": 5,
      "communication": 5,
      "location": 4.9,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Private 40ft pool",
      "Chef available on request",
      "Dedicated 200 Mbps workspace",
      "Air conditioning",
      "Generator backup",
      "Free parking on premises"
    ],
    "hostId": "host-1",
    "guestFavorite": true,
    "maxGuests": 6,
    "bedrooms": 3,
    "beds": 3,
    "bathrooms": 3,
    "availableDates": "Dec 05 – 10",
    "sleepingArrangements": [
      {
        "room": "River Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Pool Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Garden Room",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 2:00 PM",
      "Checkout 11:00 AM",
      "Pool safety rules apply"
    ],
    "cancellationPolicy": "Moderate policy.",
    "createdAt": "2023-06-01T12:00:00.000Z"
  },
  {
    "_id": "stay-14",
    "title": "The Alibaug Glass Pavilion & Mango Orchard",
    "slug": "alibaug-glass-pavilion-mango-orchard",
    "tagline": "Modern brutalist glass villa surrounded by 200 ancient Alphonso trees",
    "description": "Just a 20-minute speedboat ride from Gateway of India, this architectural wonder merges glass, raw board-marked concrete, and water ponds. Features 25-meter lap pool, sunken living room, and private barbecue lawn.",
    "propertyType": "Villa",
    "roomType": "Entire place",
    "category": [
      "villas",
      "luxe",
      "farm-stays"
    ],
    "vibe": "beach",
    "location": {
      "city": "Awas, Alibaug",
      "state": "Maharashtra",
      "country": "India",
      "area": "Raigad",
      "distanceDesc": "5 mins from Mandwa Jetport",
      "lat": 18.7758,
      "lng": 72.8689
    },
    "price": {
      "perNight": 34000,
      "cleaningFee": 3000,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.97,
      "count": 64,
      "accuracy": 5,
      "cleanliness": 5,
      "communication": 4.9,
      "location": 5,
      "value": 4.8
    },
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "25m swimming pool",
      "Private mango orchard",
      "Chef on site",
      "Sound system",
      "Fiber internet",
      "Air conditioning in all rooms"
    ],
    "hostId": "host-1",
    "guestFavorite": true,
    "maxGuests": 8,
    "bedrooms": 4,
    "beds": 4,
    "bathrooms": 4,
    "availableDates": "Nov 07 – 09",
    "sleepingArrangements": [
      {
        "room": "Master Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Orchard Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Pavilion 1",
        "bedType": "1 Queen Bed"
      },
      {
        "room": "Pavilion 2",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 2:00 PM",
      "Checkout 11:00 AM",
      "Parties allowed with prior security deposit"
    ],
    "cancellationPolicy": "Moderate policy.",
    "createdAt": "2023-04-10T16:00:00.000Z"
  },
  {
    "_id": "stay-15",
    "title": "The Cloud Chalet: Sahyadri Valley Edge",
    "slug": "cloud-chalet-sahyadri-lonavala",
    "tagline": "Perched on the precipice of Tiger Point with rolling monsoon waterfalls",
    "description": "An easy 2-hour drive from Mumbai and Pune. Contemporary glass and stone retreat cantilevered over the dramatic Khandala valley. Watch clouds sweep directly through the glass doors and relax in the heated valley-facing whirlpool.",
    "propertyType": "Chalet",
    "roomType": "Entire place",
    "category": [
      "mountains",
      "villas",
      "tiny-homes"
    ],
    "vibe": "hills",
    "location": {
      "city": "Lonavala",
      "state": "Maharashtra",
      "country": "India",
      "area": "Western Ghats",
      "distanceDesc": "85 km from Mumbai",
      "lat": 18.7557,
      "lng": 73.4091
    },
    "price": {
      "perNight": 19500,
      "cleaningFee": 2000,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.93,
      "count": 128,
      "accuracy": 4.9,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Valley view whirlpool",
      "Cantilevered balcony",
      "Indoor games & pool table",
      "Barbecue grill",
      "Fast WiFi",
      "Cook on request"
    ],
    "hostId": "host-5",
    "guestFavorite": false,
    "maxGuests": 6,
    "bedrooms": 3,
    "beds": 3,
    "bathrooms": 3,
    "availableDates": "Nov 17 – 19",
    "sleepingArrangements": [
      {
        "room": "Cloud Bedroom",
        "bedType": "1 King Bed"
      },
      {
        "room": "Valley Room",
        "bedType": "1 Queen Bed"
      },
      {
        "room": "Loft Room",
        "bedType": "2 Single Beds"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Monsoon season: 4x4 recommended for private lane"
    ],
    "cancellationPolicy": "Free cancellation up to 5 days before check-in.",
    "createdAt": "2023-02-05T09:30:00.000Z"
  },
  {
    "_id": "stay-16",
    "title": "Vaitarna Waters: Cantilevered Lakeside Studio",
    "slug": "vaitarna-waters-lakeside-igatpuri",
    "tagline": "Floor-to-ceiling glass cantilever extending directly above Vaitarna reservoir",
    "description": "Serene solitude just 2.5 hours outside Mumbai. Minimalist glass cube hovering over pristine reservoir waters against rugged Sahyadri cliffs. Perfect for writing retreats, acoustic sunsets, and stargazing.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "lakeside",
      "tiny-homes",
      "pet-friendly"
    ],
    "vibe": "workation",
    "location": {
      "city": "Igatpuri, Nashik",
      "state": "Maharashtra",
      "country": "India",
      "area": "Upper Vaitarna",
      "distanceDesc": "120 km from Mumbai",
      "lat": 19.6967,
      "lng": 73.5594
    },
    "price": {
      "perNight": 8900,
      "cleaningFee": 900,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.96,
      "count": 91,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Direct lake panorama",
      "Kayaks available",
      "Pet friendly",
      "Bonfire circle",
      "Starlink WiFi",
      "Kitchenette with induction"
    ],
    "hostId": "host-5",
    "guestFavorite": true,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 10 – 12",
    "sleepingArrangements": [
      {
        "room": "Main Studio",
        "bedType": "1 King Bed"
      }
    ],
    "houseRules": [
      "Check-in 2:00 PM",
      "Checkout 11:00 AM",
      "Life vests required when taking kayaks into lake"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours before check-in.",
    "createdAt": "2023-07-11T14:40:00.000Z"
  },
  {
    "_id": "stay-17",
    "title": "Turtle Beach Bohemian Haven",
    "slug": "turtle-beach-bohemian-morjim-goa",
    "tagline": "Earthy adobe cottage nestled within shaded coconut groves 3 mins to sea",
    "description": "Natural lime-plaster walls, sunken terrazzo tub under an open skylight, and outdoor daybed for afternoon siestas. Steps away from the protected Olive Ridley turtle nesting beach and quiet sunset shacks.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "beachfront",
      "tiny-homes",
      "pet-friendly"
    ],
    "vibe": "beach",
    "location": {
      "city": "Morjim, Goa",
      "state": "Goa",
      "country": "India",
      "area": "North Goa",
      "distanceDesc": "3 mins walk to Morjim beach",
      "lat": 15.6322,
      "lng": 73.7383
    },
    "price": {
      "perNight": 7500,
      "cleaningFee": 800,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.91,
      "count": 104,
      "accuracy": 4.9,
      "cleanliness": 4.9,
      "communication": 4.9,
      "location": 4.9,
      "value": 5
    },
    "images": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Sunken open-air bath",
      "Pet friendly",
      "WiFi 100 Mbps",
      "Outdoor daybed",
      "Kitchen essentials",
      "Scooter parking"
    ],
    "hostId": "host-1",
    "guestFavorite": false,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 24 – 29",
    "sleepingArrangements": [
      {
        "room": "Main Studio",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Zero beach litter rule"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours.",
    "createdAt": "2023-08-01T10:00:00.000Z"
  },
  {
    "_id": "stay-18",
    "title": "The Orchard Studio: Naggar Valley View",
    "slug": "orchard-studio-naggar-manali",
    "tagline": "Perched in ancient apple trees with panoramic views of snow ridges",
    "description": "Overlooking Nicholas Roerich’s beloved Himalayan heights. Built from traditional kath-kuni stone and deodar cedar. Enjoy crisp Himalayan mountain apples straight from the trees during harvest, local siddu breakfasts, and warm wood burning stoves.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "mountains",
      "farm-stays",
      "treehouses"
    ],
    "vibe": "hills",
    "location": {
      "city": "Naggar, Manali",
      "state": "Himachal Pradesh",
      "country": "India",
      "area": "Kullu Valley",
      "distanceDesc": "18 km before Manali",
      "lat": 32.1466,
      "lng": 77.1689
    },
    "price": {
      "perNight": 5200,
      "cleaningFee": 500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.96,
      "count": 140,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 5
    },
    "images": [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Snow view",
      "Wood burning stove (Bukhari)",
      "High-speed fiber WiFi",
      "Organic apple orchard access",
      "Traditional breakfast available"
    ],
    "hostId": "host-2",
    "guestFavorite": true,
    "maxGuests": 3,
    "bedrooms": 1,
    "beds": 2,
    "bathrooms": 1,
    "availableDates": "Dec 01 – 06",
    "sleepingArrangements": [
      {
        "room": "Main Studio",
        "bedType": "1 King Bed + 1 Single Trundle"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Woodstove operated with provided safety instructions"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours before check-in.",
    "createdAt": "2023-03-05T08:00:00.000Z"
  },
  {
    "_id": "stay-19",
    "title": "The Waterside White Villa & Glass Pool",
    "slug": "waterside-white-villa-fatehsagar-udaipur",
    "tagline": "Modern whitewashed minimalist lakefront villa with transparent acrylic pool",
    "description": "A contemporary contrast to Udaipur’s historic palaces. Set on the quieter shores of Fatehsagar lake facing the Sajjangarh Monsoon Palace hills. Floor-to-ceiling glass sliding walls open up to a glass-edged pool.",
    "propertyType": "Villa",
    "roomType": "Entire place",
    "category": [
      "lakeside",
      "villas",
      "luxe"
    ],
    "vibe": "heritage",
    "location": {
      "city": "Fatehsagar, Udaipur",
      "state": "Rajasthan",
      "country": "India",
      "area": "Lake Fatehsagar",
      "distanceDesc": "Lakefront drive",
      "lat": 24.6042,
      "lng": 73.6738
    },
    "price": {
      "perNight": 28000,
      "cleaningFee": 2500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.97,
      "count": 82,
      "accuracy": 5,
      "cleanliness": 5,
      "communication": 4.9,
      "location": 5,
      "value": 4.8
    },
    "images": [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Glass edge pool",
      "Lake panorama",
      "Private chef and butler",
      "Elevator",
      "Sound system",
      "Air conditioning"
    ],
    "hostId": "host-3",
    "guestFavorite": true,
    "maxGuests": 6,
    "bedrooms": 3,
    "beds": 3,
    "bathrooms": 3,
    "availableDates": "Nov 27 – Dec 02",
    "sleepingArrangements": [
      {
        "room": "Master Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Lake Suite",
        "bedType": "1 King Bed"
      },
      {
        "room": "Garden Room",
        "bedType": "1 Queen Bed"
      }
    ],
    "houseRules": [
      "Check-in 2:00 PM",
      "Checkout 11:00 AM",
      "No smoking indoors"
    ],
    "cancellationPolicy": "Moderate policy.",
    "createdAt": "2023-01-20T11:00:00.000Z"
  },
  {
    "_id": "stay-20",
    "title": "Rainforest Canopy Tree Villa",
    "slug": "rainforest-canopy-tree-villa-wayanad",
    "tagline": "Perched 60 feet up within ancient rainforest giants overlooking cloud mist",
    "description": "Accessible via a private rope suspension bridge, this luxury tree villa sits right in the path of rainforest hornbills and flying squirrels. Built with eco-certified timber, natural springs water, and Kerala Ayurvedic steam room.",
    "propertyType": "Treehouse",
    "roomType": "Entire place",
    "category": [
      "treehouses",
      "mountains",
      "tiny-homes"
    ],
    "vibe": "workation",
    "location": {
      "city": "Vythiri, Wayanad",
      "state": "Kerala",
      "country": "India",
      "area": "Western Ghats",
      "distanceDesc": "Deep within private reserve",
      "lat": 11.5528,
      "lng": 76.0381
    },
    "price": {
      "perNight": 12800,
      "cleaningFee": 1000,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.95,
      "count": 95,
      "accuracy": 4.9,
      "cleanliness": 5,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Suspension bridge entry",
      "Canopy mist view",
      "Ayurvedic treatments available",
      "Kerala meals included",
      "High-speed WiFi"
    ],
    "hostId": "host-4",
    "guestFavorite": true,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 14 – 19",
    "sleepingArrangements": [
      {
        "room": "Canopy Suite",
        "bedType": "1 King Bed"
      }
    ],
    "houseRules": [
      "Adults only",
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Forest quiet hours strictly observed"
    ],
    "cancellationPolicy": "Free cancellation up to 5 days before check-in.",
    "createdAt": "2023-04-18T10:00:00.000Z"
  },
  {
    "_id": "stay-21",
    "title": "The Marwar Organic Farmstay & Stables",
    "slug": "marwar-organic-farmstay-jaipur",
    "tagline": "Pastoral desert farmstead with purebred Marwari horses and organic gardens",
    "description": "Surrounded by the arid Aravalli hills 45 minutes north of Jaipur. Clay-washed cottages, open fire cooking in brass vessels, evening folk singer sessions under starry desert skies, and morning horseback rides through mustard fields.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "farm-stays",
      "heritage",
      "pet-friendly"
    ],
    "vibe": "heritage",
    "location": {
      "city": "Samode, Jaipur",
      "state": "Rajasthan",
      "country": "India",
      "area": "Aravalli Range",
      "distanceDesc": "35 km north of Jaipur",
      "lat": 27.2178,
      "lng": 75.8117
    },
    "price": {
      "perNight": 6900,
      "cleaningFee": 700,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.93,
      "count": 110,
      "accuracy": 4.9,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 4.9,
      "value": 5
    },
    "images": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Horseback riding",
      "Organic farm to table meals",
      "Pet friendly",
      "Bonfire circle",
      "Starry sky terrace",
      "WiFi in common areas"
    ],
    "hostId": "host-3",
    "guestFavorite": false,
    "maxGuests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 2,
    "availableDates": "Nov 19 – 24",
    "sleepingArrangements": [
      {
        "room": "Cottage 1",
        "bedType": "1 King Bed"
      },
      {
        "room": "Cottage 2",
        "bedType": "1 King Bed"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Pets must be on leash near horse paddocks"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours.",
    "createdAt": "2023-06-15T09:00:00.000Z"
  },
  {
    "_id": "stay-22",
    "title": "Shivpuri Rapids: Luxury Safari Dome",
    "slug": "shivpuri-rapids-luxury-safari-dome-rishikesh",
    "tagline": "Riverside glamping dome on white sand river beaches of upper Ganges",
    "description": "High-thread-count linens, private ensuite bathroom, air conditioning, and a wooden deck extending straight over white river sands where the turquoise Ganges rushes past.",
    "propertyType": "Tent",
    "roomType": "Entire place",
    "category": [
      "camping",
      "lakeside",
      "tiny-homes"
    ],
    "vibe": "hills",
    "location": {
      "city": "Shivpuri, Rishikesh",
      "state": "Uttarakhand",
      "country": "India",
      "area": "Upper Ganges",
      "distanceDesc": "14 km from Lakshman Jhula",
      "lat": 30.1388,
      "lng": 78.3892
    },
    "price": {
      "perNight": 6400,
      "cleaningFee": 500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.89,
      "count": 94,
      "accuracy": 4.8,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.9
    },
    "images": [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "White sand beach access",
      "Air conditioning & heating",
      "Ensuite luxury bath",
      "Rafting launch point",
      "Bonfire with live music"
    ],
    "hostId": "host-2",
    "guestFavorite": false,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 12 – 15",
    "sleepingArrangements": [
      {
        "room": "Main Pod",
        "bedType": "1 King Bed"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 10:30 AM",
      "River swimming only with life jackets"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours.",
    "createdAt": "2023-05-25T11:00:00.000Z"
  },
  {
    "_id": "stay-23",
    "title": "Pangong Mirage: Heated Lakefront Glass Residence",
    "slug": "pangong-mirage-heated-lakefront-ladakh",
    "tagline": "Perched directly above the color-shifting azure waters of Pangong Tso",
    "description": "At 14,000 feet, where the world is blue water, golden rock, and crystal air. Passive solar heating, triple-glazed floor-to-ceiling glass walls, warm butter tea service, and nighttime celestial views of the Milky Way core.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "lakeside",
      "mountains",
      "tiny-homes"
    ],
    "vibe": "hills",
    "location": {
      "city": "Lukung, Pangong Tso",
      "state": "Ladakh",
      "country": "India",
      "area": "Pangong Lake",
      "distanceDesc": "Direct lake shoreline",
      "lat": 33.7595,
      "lng": 78.6674
    },
    "price": {
      "perNight": 17200,
      "cleaningFee": 1500,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.96,
      "count": 67,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 5,
      "value": 4.8
    },
    "images": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Triple-glazed lakefront glass",
      "Solar central heating",
      "Oxygen system on standby",
      "All hearty meals included",
      "Stargazing terrace"
    ],
    "hostId": "host-6",
    "guestFavorite": true,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 04 – 07",
    "sleepingArrangements": [
      {
        "room": "Lake Bedroom",
        "bedType": "1 King Bed"
      }
    ],
    "houseRules": [
      "Acclimatization essential",
      "Check-in 1:00 PM",
      "Checkout 10:00 AM"
    ],
    "cancellationPolicy": "Moderate policy.",
    "createdAt": "2023-04-10T12:00:00.000Z"
  },
  {
    "_id": "stay-24",
    "title": "The Old Roastery: Cauvery Riverfront Studio",
    "slug": "old-roastery-cauvery-riverfront-coorg",
    "tagline": "Rustic brick industrial loft converted from a 1940s coffee drying barn",
    "description": "Set right on the banks of the young Cauvery river. High open timber trusses, cast iron clawfoot tub, artisanal espresso machine with freshly roasted beans from the estate, and private riverside deck for peaceful evening bonfires.",
    "propertyType": "Cottage",
    "roomType": "Entire place",
    "category": [
      "farm-stays",
      "lakeside",
      "tiny-homes",
      "pet-friendly"
    ],
    "vibe": "workation",
    "location": {
      "city": "Siddapur, Coorg",
      "state": "Karnataka",
      "country": "India",
      "area": "Southern Coorg",
      "distanceDesc": "Private Cauvery river frontage",
      "lat": 12.3025,
      "lng": 75.8942
    },
    "price": {
      "perNight": 7800,
      "cleaningFee": 800,
      "serviceFeePercent": 12,
      "currency": "INR"
    },
    "rating": {
      "average": 4.94,
      "count": 108,
      "accuracy": 5,
      "cleanliness": 4.9,
      "communication": 5,
      "location": 4.9,
      "value": 5
    },
    "images": [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85"
    ],
    "amenities": [
      "Clawfoot soaking tub",
      "Artisanal espresso bar",
      "Fiber WiFi 200 Mbps",
      "Pet friendly",
      "Riverside bonfire",
      "Canoe available"
    ],
    "hostId": "host-5",
    "guestFavorite": false,
    "maxGuests": 2,
    "bedrooms": 1,
    "beds": 1,
    "bathrooms": 1,
    "availableDates": "Nov 16 – 21",
    "sleepingArrangements": [
      {
        "room": "Main Studio",
        "bedType": "1 King Bed"
      }
    ],
    "houseRules": [
      "Check-in 1:00 PM",
      "Checkout 11:00 AM",
      "Pets allowed"
    ],
    "cancellationPolicy": "Free cancellation up to 48 hours.",
    "createdAt": "2023-06-28T14:00:00.000Z"
  }
];

export const seedReviews = [
  {
    "_id": "rev-101",
    "listingId": "stay-1",
    "userId": "usr-1",
    "userName": "Pooja Bhattacharya",
    "userAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "date": "November 2024",
    "comment": "An absolute masterpiece of a villa. Hearing the waves hit the cliffs while sitting on the plunge pool terrace was unforgettable. The local chef prepared authentic Goan fish curry for us every evening.",
    "cleanliness": 5,
    "accuracy": 5,
    "communication": 5,
    "locationRating": 5,
    "value": 4.9
  },
  {
    "_id": "rev-102",
    "listingId": "stay-1",
    "userId": "usr-2",
    "userName": "Julian Vance",
    "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "date": "September 2024",
    "comment": "Wayfound nailed this recommendation. It felt so discreet and serene compared to usual tourist spots. High-speed WiFi worked seamlessly for my remote calls.",
    "cleanliness": 5,
    "accuracy": 5,
    "communication": 5,
    "locationRating": 5,
    "value": 4.8
  },
  {
    "_id": "rev-103",
    "listingId": "stay-1",
    "userId": "usr-3",
    "userName": "Ananya Sharma",
    "userAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "rating": 4.9,
    "date": "August 2024",
    "comment": "The Portuguese architectural restoration is breathtaking. Meera and Aarav are exceptional hosts who gave us secret beach access tips.",
    "cleanliness": 5,
    "accuracy": 4.9,
    "communication": 5,
    "locationRating": 4.9,
    "value": 4.8
  },
  {
    "_id": "rev-201",
    "listingId": "stay-2",
    "userId": "usr-4",
    "userName": "Vikram Singhania",
    "userAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "rating": 5,
    "date": "October 2024",
    "comment": "Waking up to snow peaks right in front of the glass bedroom was surreal. Cedar scent, crackling fireplace, and steaming hot mountain tea. Pure bliss.",
    "cleanliness": 5,
    "accuracy": 5,
    "communication": 5,
    "locationRating": 5,
    "value": 5
  }
];

export const seedExperiences = [
  {
    "_id": "exp-1",
    "title": "Mewari Royal Culinary Masterclass",
    "tagline": "Cook 200-year-old royal recipes inside a private Lake Pichola haveli kitchen",
    "category": "Culinary",
    "location": "Udaipur, Rajasthan",
    "duration": "3.5 hours",
    "groupSize": "Max 6 guests",
    "pricePerPerson": 3500,
    "rating": 4.98,
    "reviewCount": 94,
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=85"
    ],
    "description": "Step behind the sandstone jharokhas of a 19th-century royal haveli overlooking Lake Pichola. In this intimate, hands-on masterclass, you will learn the secrets of Mewari royal gastronomy handed down through five generations of palace chefs. From slow-roasted Laal Maas infused with Mathania chillies to delicately fragrant ker sangri and saffron baati, every dish is cooked in authentic hand-hammered brass vessels over slow embers.",
    "hostName": "Maharani Gayatri Singh",
    "hostAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    "hostBio": "Born into the Sisodia lineage of Mewar, Gayatri has spent 20 years reviving lost royal palace recipes and culinary treatises. She has hosted ambassadors, food historians, and Michelin-starred chefs in her family haveli.",
    "venueName": "Haveli Karni Vilas",
    "venueType": "Heritage Lakefront Haveli",
    "venueDescription": "Built in 1842, Haveli Karni Vilas features courtyards paved with white Makrana marble, stained-glass arches, and a restored royal hearth kitchen that opens onto a private lakefront terrace.",
    "highlights": [
      "Traditional hand-hammered brass cooking vessels",
      "5-course royal banquet dinner paired with organic wines",
      "Secret family spice blends gifted in sealed copper jars",
      "Private rooftop sunset tasting overlooking Lake Pichola"
    ],
    "included": [
      "All heirloom cooking ingredients and organic spices",
      "Welcome cold-pressed almond thandai on arrival",
      "Full multi-course seated banquet dinner",
      "Custom engraved recipe booklet & spice starter box",
      "Apron and brass tasting spoon"
    ],
    "itinerary": [
      {
        "step": 1,
        "title": "Heritage Courtyard Welcome & Herbal Infusions",
        "time": "30 mins",
        "description": "Gather in the marble courtyard for introductions, rose-water hand wash, and freshly brewed cardamom thandai while exploring antique spice mortars."
      },
      {
        "step": 2,
        "title": "Spice Grinding & Slow-Ember Simmering",
        "time": "1 hour 45 mins",
        "description": "Stone-grind fiery Mathania chillies, temper hand-pressed mustard oils in heavy brass deghchis, and master the art of slow dum cooking."
      },
      {
        "step": 3,
        "title": "Royal Terrace Banquet & Lake Pichola Dusk",
        "time": "1 hour 15 mins",
        "description": "Ascend to the torch-lit lakefront terrace to savor your 5-course royal creations under the stars with curated regional wine pairings."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-e1",
        "author": "Priya Narayanan",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "October 2026",
        "comment": "Without doubt the highlight of our Rajasthan journey. Gayatri is captivating, and cooking inside this ancestral haveli feels like stepping into a royal museum. The Laal Maas was extraordinary!"
      },
      {
        "id": "rev-e2",
        "author": "Marcus Vance",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "September 2026",
        "comment": "Incredible setting overlooking the lake. The brass cookware, the rooftop dining, and the warmth of the hospitality made this unforgettable. Highly recommend!"
      }
    ]
  },
  {
    "_id": "exp-2",
    "title": "Nubra Celestial Astrophotography & Stargazing",
    "tagline": "Track the Milky Way core with automated 14-inch Schmidt-Cassegrain telescopes",
    "category": "Adventure",
    "location": "Nubra Valley, Ladakh",
    "duration": "4 hours",
    "groupSize": "Max 8 guests",
    "pricePerPerson": 4200,
    "rating": 4.99,
    "reviewCount": 128,
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?auto=format&fit=crop&w=1200&q=85"
    ],
    "description": "At an altitude of 10,000 feet with Class 1 Bortle dark skies, the Nubra desert is one of the most pristine celestial viewing windows on Earth. Join local astrophysicist Stanzin Dorje at his private high-altitude star camp. Using computerized motorized telescopes and cooled astrophotography sensors, you will capture the swirling spiral arms of the Andromeda Galaxy and the radiant dust lanes of the Milky Way.",
    "hostName": "Stanzin Dorje",
    "hostAvatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    "hostBio": "National Geographic grantee and Himalayan astronomy advocate. Stanzin set up Ladakh’s first village-level community observatories and has documented celestial wonders for over 12 years.",
    "venueName": "Nubra Celestial Star Dome Sanctuary",
    "venueType": "High-Altitude Glass Observatory & Yurt",
    "venueDescription": "Perched in the sand dunes of Hunder with zero ambient artificial light, featuring an insulated wooden heating yurt and outdoor observation pads.",
    "highlights": [
      "Bortle Class 1 dark sky with zero light pollution",
      "14-inch motorized Schmidt-Cassegrain telescope views",
      "Raw RAW+JPEG astrophotography captures delivered on SSD",
      "Yak-wool blankets & steaming Kashmiri kahwa in a heated yurt"
    ],
    "included": [
      "High-altitude telescope access and laser pointer navigation",
      "DSLR adapter rings for your own camera or use of observatory sensors",
      "Continuous hot Kashmiri kahwa and yak-cheese snacks",
      "Heated yurt lounge access with oxygen concentrator available"
    ],
    "itinerary": [
      {
        "step": 1,
        "title": "Twilight Constellation Walk & Sky Map Calibration",
        "time": "45 mins",
        "description": "Observe twilight over the snow-capped Karakoram range while learning Ladakhi ancient nomadic celestial lore and calibrating star charts."
      },
      {
        "step": 2,
        "title": "Deep-Space Telescope Tracking & Nebula Viewing",
        "time": "2 hours",
        "description": "Peer through specialized oculars to inspect Saturn’s rings, the Orion Nebula, and distant star clusters millions of light-years away."
      },
      {
        "step": 3,
        "title": "Astrophotography Exposure & Warm Yurt Debrief",
        "time": "1 hour 15 mins",
        "description": "Set long-exposure sensors to capture your personal Milky Way portraits, then warm up by the bukhari wood stove with hot kahwa."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-e3",
        "author": "Arjun Mehta",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "November 2026",
        "comment": "Seeing Saturn’s rings so sharply through Stanzin’s telescope literally brought tears to my eyes. The photos we received are stunning desktop wallpapers. A once-in-a-lifetime experience."
      }
    ]
  },
  {
    "_id": "exp-3",
    "title": "Sunrise Dolphin & Bioluminescence Kayaking",
    "tagline": "Paddle through calm Chapora river estuaries into the open Arabian sea",
    "category": "Nature",
    "location": "Morjim, Goa",
    "duration": "2.5 hours",
    "groupSize": "Max 10 guests",
    "pricePerPerson": 2200,
    "rating": 4.95,
    "reviewCount": 215,
    "image": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85"
    ],
    "description": "Launch your lightweight sea kayak into the tranquil waters of Morjim before first light. As your paddle cuts the glass-smooth estuary, bioluminescent plankton glows in glowing emerald ripples. Break through the gentle sandbar into the Arabian Sea just as the sun sets the Goan horizon on fire, with pods of wild Indo-Pacific humpback dolphins surfacing nearby.",
    "hostName": "Aarav Desai",
    "hostAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "hostBio": "Certified ACA Coastal Kayak Instructor and lifelong Goan marine naturalist committed to low-impact mangrove conservation and sustainable ecotourism.",
    "venueName": "Morjim Estuary Boathouse & Sandbar",
    "venueType": "Private Coastal Estuary Launch",
    "venueDescription": "A private thatched boathouse tucked away along the Chapora mangrove banks with direct tidal water access and private changing facilities.",
    "highlights": [
      "Pre-dawn bioluminescent paddle through pristine mangrove creeks",
      "Wild humpback dolphin encounters in open waters",
      "Freshly baked Goan poi breakfast and organic fruit on a secluded sandbar",
      "GoPro 4K video clips of your paddle provided"
    ],
    "included": [
      "Top-tier composite sea kayaks, lightweight paddles, and USCG life jackets",
      "Waterproof dry bags for phones and cameras",
      "Artisanal Goan breakfast (choriz/cheese poi, fresh tropical fruit, coconut water)",
      "High-resolution photos & video taken by your guide"
    ],
    "itinerary": [
      {
        "step": 1,
        "title": "Moonlit Estuary Briefing & Safety Launch",
        "time": "30 mins",
        "description": "Meet at the quiet Morjim boathouse, gear up, and practice basic stroke technique before sliding into glassy waters glowing with bioluminescence."
      },
      {
        "step": 2,
        "title": "Open-Sea Dolphin Tracking at Sunrise",
        "time": "1 hour 15 mins",
        "description": "Paddle past the sandbar as dawn breaks. Float in peaceful stillness as local dolphin pods surface to hunt in the early morning calm."
      },
      {
        "step": 3,
        "title": "Sandbar Breakfast & Mangrove Return",
        "time": "45 mins",
        "description": "Pull up onto a tide-formed sandbar for warm poi, tender coconuts, and a refreshing swim before a relaxed cruise back through mangrove creeks."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-e4",
        "author": "Sneha Kapadia",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "December 2026",
        "comment": "We saw at least eight dolphins playing within 15 meters of our kayaks! Aarav is wonderful, patient, and knowledgeable. The poi breakfast on the sandbar was heavenly."
      }
    ]
  },
  {
    "_id": "exp-4",
    "title": "First-Flush Tea Sommelier & Forest Foraging",
    "tagline": "Walk 150-year-old terraced tea gardens and taste rare single-estate flushes",
    "category": "Culture",
    "location": "Kurseong, Darjeeling",
    "duration": "3 hours",
    "groupSize": "Max 8 guests",
    "pricePerPerson": 2800,
    "rating": 4.96,
    "reviewCount": 86,
    "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85"
    ],
    "description": "Immerse yourself in misty Himalayan valleys with third-generation tea master Tenzing Norbu. Wander through bio-dynamic tea bushes established in 1859, learn the delicate art of two leaves and a bud, and visit the heritage wood-fired drying lofts. Conclude with a cupping session of prized Muscatel and Silver Needle teas overlooking Mount Kanchenjunga.",
    "hostName": "Tenzing Norbu",
    "hostAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "hostBio": "Master Tea Taster certified by the Darjeeling Planters Association with 25 years of tea estate craftsmanship across Kurseong and Mirik valleys.",
    "venueName": "Makaibari Heritage Tea Bungalow",
    "venueType": "Colonial Tea Estate Bungalow",
    "venueDescription": "A preserved 1880s teakwood colonial bungalow with wrap-around verandas facing pine-clad Himalayan ridges and organic tea slopes.",
    "highlights": [
      "Plucking masterclass with veteran estate pickers",
      "Factory cupping session tasting 6 single-estate flushes",
      "Curated tasting flight paired with Himalayan cheeses",
      "Exclusive 100g gift canister of rare moonlight-plucked tea"
    ],
    "included": [
      "Private guided estate walk and factory processing tour",
      "Professional ISO tea cupping session with 6 tea varieties",
      "Traditional Lepcha tea-time pastries and artisanal honey",
      "Handcrafted gift tin of single-estate white tea"
    ],
    "itinerary": [
      {
        "step": 1,
        "title": "Misty Garden Walk & Plucking Practice",
        "time": "1 hour",
        "description": "Walk through organic high-altitude slopes as mountain mist rises. Strap on traditional bamboo baskets to learn delicate plucking techniques."
      },
      {
        "step": 2,
        "title": "Heritage Factory Roasting & Rolling",
        "time": "45 mins",
        "description": "Follow fresh green tea leaves through withering, rolling tables, oxidation chambers, and wood-fired ovens emitting rich floral aromas."
      },
      {
        "step": 3,
        "title": "Sommelier Cupping & Tasting Flight",
        "time": "1 hour 15 mins",
        "description": "Slurp, swirl, and savor rare imperial first-flush teas in porcelain cupping bowls, identifying notes of Muscat grape, peach, and mountain wildflower."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-e5",
        "author": "Rohan Deshmukh",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "August 2026",
        "comment": "Tenzing’s deep knowledge of tea terroir rivals the finest French wine sommeliers. The views of the valley from the tasting room are breathtaking."
      }
    ]
  },
  {
    "_id": "exp-5",
    "title": "Vembanad Backwaters Village Canoe & Fishing",
    "tagline": "Glide through untouched narrow waterways on a non-motorized wooden canoe",
    "category": "Nature",
    "location": "Alleppey, Kerala",
    "duration": "3 hours",
    "groupSize": "Max 4 guests",
    "pricePerPerson": 1900,
    "rating": 4.94,
    "reviewCount": 167,
    "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85"
    ],
    "description": "Leave the loud motorized houseboats behind and step aboard an authentic hand-carved anjili wood canoe. Gently punted through quiet village waterways overhung with wild ferns, hibiscus, and coconut palms, you will discover traditional duck farming, coir rope spinning, and the ancient art of casting Chinese fishing nets at dusk.",
    "hostName": "Capt. Thomas Kurien",
    "hostAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "hostBio": "Born and raised in the Kuttanad wetlands. Captain Thomas has navigated the Vembanad delta for 35 years and is dedicated to preserving non-motorized heritage waterway access.",
    "venueName": "Kuttanad Water Heritage Landing",
    "venueType": "Traditional Kerala Nalukettu & Water Docks",
    "venueDescription": "A 100-year-old timber Nalukettu home situated where three quiet village canals converge, surrounded by lotus ponds and paddy fields below sea level.",
    "highlights": [
      "Silent non-motorized canoe exploration into narrow canals",
      "Hands-on Chinese fishing net lifting",
      "Fresh steamed banana leaf Kerala lunch & sweet coconut water",
      "Village coir weaving and pottery demonstrations"
    ],
    "included": [
      "Private canoe and experienced local boatman",
      "All fishing tackle and net demonstration fees",
      "Homestyle Kerala meal (steamed rice, fish moilee or veg stew, pazham pori)",
      "Tender coconut refreshment and spice tea"
    ],
    "itinerary": [
      {
        "step": 1,
        "title": "Nalukettu Welcome & Canal Boarding",
        "time": "30 mins",
        "description": "Sip fresh tender coconut water on the riverside porch before boarding a cushioned, shade-canopied wooden canoe."
      },
      {
        "step": 2,
        "title": "Silent Canal Meander & Chinese Net Lifting",
        "time": "1 hour 45 mins",
        "description": "Glide silently under arched bridges while kingfishers dive. Help local fishermen lower and haul enormous cantilevered Chinese nets."
      },
      {
        "step": 3,
        "title": "Homestead Banana Leaf Feast",
        "time": "45 mins",
        "description": "Disembark at the family homestead to feast on fragrant spiced fish curry, red rice, and crispy appams served on fresh plantain leaves."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-e6",
        "author": "Ananya Nair",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "So much better than being on a huge diesel houseboat! Quiet, peaceful, and authentic. Captain Thomas’s family made the most delicious meal of our entire Kerala vacation."
      }
    ]
  },
  {
    "_id": "exp-6",
    "title": "Rishikesh Ganga Aarti & Sound Bowl Bath",
    "tagline": "Private sunset sound bowl resonance meditation on quiet white river sandbanks",
    "category": "Wellness",
    "location": "Tapovan, Rishikesh",
    "duration": "2 hours",
    "groupSize": "Max 12 guests",
    "pricePerPerson": 1600,
    "rating": 4.97,
    "reviewCount": 190,
    "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85"
    ],
    "description": "Escape the crowded main ghats and gather on a secluded white sandbank where the jade-green Ganges emerges from the Himalayan foothills. Led by certified sound therapist Devika Singhal, experience the deep acoustic vibrations of 7 full-chakra Tibetan singing bowls, tuned gongs, and Vedic mantras as dusk turns the water to liquid silver.",
    "hostName": "Devika Singhal",
    "hostAvatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    "hostBio": "Sound meditation practitioner certified by the International Academy of Sound Healing with a decade of retreat facilitation in Rishikesh and Dharamshala.",
    "venueName": "Ganga White Sandbank Ashram Sanctuary",
    "venueType": "Riverside Meditation Shala & River Beach",
    "venueDescription": "A private riverside stone ashram with steps leading directly to pristine white sandbars along the crystal-clear upper Ganges.",
    "highlights": [
      "Deep resonance sound immersion with 7 bronze Tibetan singing bowls",
      "Gentle pranayama breathwork guided by the river breeze",
      "Personal brass diya floating ceremony with marigolds on the Ganges",
      "Warm Ayurvedic tulsi-ginger herbal infusion by lantern light"
    ],
    "included": [
      "High-density yoga mats, organic cotton bolsters, and warm shawls",
      "Brass diya offering plate and organic marigold flowers",
      "Steaming herbal tulsi tea and organic jaggery sweets",
      "Curated sound frequency recording sent after the session"
    ],
    "itinerary": [
      {
        "step": 1,
        "title": "Riverside Grounding & Breath Alignment",
        "time": "30 mins",
        "description": "Settle onto cushioned mats on the white river beach. Center your mind with Nadi Shodhana breathwork attuned to the sound of flowing water."
      },
      {
        "step": 2,
        "title": "Chakra Sound Bowl Immersion",
        "time": "1 hour",
        "description": "Recline as vibrating bronze bowls are positioned around you. Let pure harmonics wash away physical tension and quiet the nervous system."
      },
      {
        "step": 3,
        "title": "Sunset Diya Floating & Chanting Ceremony",
        "time": "30 mins",
        "description": "Light a floral brass diya, make a personal wish, and float it across the twilight waters of the Ganges while chanting peace mantras."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-e7",
        "author": "Siddharth Roy",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "September 2026",
        "comment": "One of the most profound, tranquil moments of my life. Away from all the commercial tourist noise, hearing those bowls by the gentle river at sunset is unforgettable."
      }
    ]
  }
];

export const seedServices = [
  {
    "_id": "srv-1",
    "title": "Private In-Villa Chef & Banquet",
    "category": "Culinary",
    "tagline": "Multi-course regional feasts prepared and plated directly in your sanctuary kitchen",
    "description": "Transform your private dining room or seaside veranda into an exclusive culinary theater. Our master chefs arrive equipped with farm-fresh organic produce, artisanal spices, and specialized copper cookware. Whether you crave a royal Mewari thali with slow-cooked dal baati, fragrant coastal Goan sea-bass coconut curries, or wood-fired Mediterranean tapas, each meal is designed exclusively around your dietary preferences and schedule. Seamless table service, wine pairing suggestions, and spotless kitchen restoration are entirely taken care of.",
    "priceTag": "From ₹3,500 / meal + groceries",
    "basePrice": 3500,
    "rating": 4.97,
    "reviewCount": 128,
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
    ],
    "providerName": "Chef Kabir & Artisanal Culinary Guild",
    "providerAvatar": "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
    "providerBio": "Trained at Le Cordon Bleu and seasoned through 14 years across boutique luxury heritage palaces in Udaipur and Goa. Passionate about hyper-local heirloom ingredients and private sanctuary dining.",
    "features": [
      "Custom curated menus",
      "Organic local market sourcing",
      "Table dressing and post-meal cleanup"
    ],
    "included": [
      "Pre-meal consultation & tailored menu design",
      "Chef and kitchen assistant arriving 90 mins prior",
      "Professional table setting & curated banquet plating",
      "Dietary accommodations (Vegan, Jain, Gluten-free)",
      "Spotless kitchen clean-up and appliance sanitization",
      "Fresh botanical table centerpieces"
    ],
    "offerings": [
      {
        "title": "Imperial Heritage Banquet",
        "subtitle": "4 Courses · Regional Indian Royal Cuisine",
        "description": "Featuring saffron-scented biryanis, slow-simmered smoked curries, clay-pot breads, and artisanal rabri.",
        "price": "₹4,500 / session"
      },
      {
        "title": "Coastal Seafood Platter & Grill",
        "subtitle": "3 Courses · Fresh Catch of the Day",
        "description": "Locally caught pomfret, king prawns, butter-garlic calamari, and fragrant coconut coriander rice.",
        "price": "₹3,800 / session"
      },
      {
        "title": "Mediterranean Poolside Sundowner",
        "subtitle": "Tapas & Mezze Banquet",
        "description": "Artisanal burrata, wood-charred flatbreads, grilled halloumi skewers, citrus dips, and olive oils.",
        "price": "₹3,500 / session"
      }
    ],
    "howItWorks": [
      {
        "step": 1,
        "title": "Select Date & Dietary Preferences",
        "description": "Share your villa location, party size, dietary preferences, and preferred dining time."
      },
      {
        "step": 2,
        "title": "Bespoke Menu Customization",
        "description": "Chef Kabir connects with you directly via WhatsApp to curate the evening tasting sequence."
      },
      {
        "step": 3,
        "title": "Fresh Market Sourcing & Setup",
        "description": "The culinary team sources the morning catch and arrives 90 minutes before dining with all gear."
      },
      {
        "step": 4,
        "title": "Dinner & Spotless Kitchen Restoration",
        "description": "Sit back, savor every course, and return to an immaculate, sparkling-clean kitchen."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-1",
        "author": "Arjun & Sanjana Singhania",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "October 2026",
        "comment": "Chef Kabir made our anniversary dinner at Villa Mar Azul genuinely unforgettable. The slow-cooked Goan prawn balchão was the best we have ever had in India.",
        "villa": "Villa Mar Azul, Anjuna"
      },
      {
        "id": "rev-2",
        "author": "Dr. Michael Chen",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "September 2026",
        "comment": "Spotless clean kitchen, discrete and polished hospitality, and the kids loved their custom pasta courses while we enjoyed the coastal banquet.",
        "villa": "Casa Saffron, North Goa"
      },
      {
        "id": "rev-3",
        "author": "Pooja Venkatesh",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "August 2026",
        "comment": "We booked for 8 guests for a family reunion in Udaipur. Everything was executed with five-star precision. Highly recommended!",
        "villa": "Haveli Pichola, Udaipur"
      }
    ]
  },
  {
    "_id": "srv-2",
    "title": "Traditional Ayurvedic Spa & Abhyanga",
    "category": "Wellness",
    "tagline": "Certified Ayurvedic practitioners bringing warm herbal oils and brass vessels to you",
    "description": "Immerse your senses in profound therapeutic restoration without leaving your villa sanctuary. Trained practitioners from certified Kerala wellness centers arrive with teak therapy accessories, warm brass dispensers, and bespoke herbal decoctions. Sessions blend traditional Abhyanga synchronized strokes, warm Shirodhara forehead oil flow, and botanical floral rinses designed to balance your dosha constitution after long travel or high-stress work weeks.",
    "priceTag": "From ₹2,800 / 60 min session",
    "basePrice": 2800,
    "rating": 4.99,
    "reviewCount": 96,
    "image": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512290900672-1f028e3b3e23?auto=format&fit=crop&w=1200&q=85"
    ],
    "providerName": "Vaidya Ananya & Kerala Wellness Sanstha",
    "providerAvatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    "providerBio": "Certified Bachelor of Ayurvedic Medicine & Surgery (BAMS) from Kottakkal. 11 years leading holistic mind-body wellness retreats across Kerala and the Western Ghats.",
    "features": [
      "Customized dosha consultation",
      "Wild-harvested herbal oils",
      "Portable luxury therapy beds"
    ],
    "included": [
      "Pre-treatment dosha assessment (Vata, Pitta, Kapha)",
      "High-grade organic cold-pressed sesame and brahmi oils",
      "Sanitized portable plush therapy table with warm linens",
      "Herbal face mist and hot towel rejuvenation",
      "Aromatherapeutic natural room diffuser setup",
      "Complimentary post-therapy herbal digestive tea"
    ],
    "offerings": [
      {
        "title": "Full-Body Abhyanga & Marma Therapy",
        "subtitle": "75 Minutes · Complete Rejuvenation",
        "description": "Rhythmic warm herbal oil strokes targeted at vital pressure points to stimulate lymphatic drainage.",
        "price": "₹2,800 / person"
      },
      {
        "title": "Royal Shirodhara & Scalp Elixir",
        "subtitle": "60 Minutes · Deep Neurological Calm",
        "description": "A soothing continuous stream of warm medicated oil across the third eye chakra to dissolve anxiety.",
        "price": "₹3,400 / person"
      },
      {
        "title": "Couples Sanctuary Retreat Package",
        "subtitle": "90 Minutes · Two Therapists",
        "description": "Side-by-side synchronized body treatments followed by botanical facial mask and herbal foot reflexology.",
        "price": "₹5,800 / couple"
      }
    ],
    "howItWorks": [
      {
        "step": 1,
        "title": "Reserve Preferred Session",
        "description": "Choose your desired time and villa setting (poolside, garden patio, or master suite)."
      },
      {
        "step": 2,
        "title": "Therapist Arrival & Setup",
        "description": "Practitioners arrive 20 minutes early with warm oils, linen, ambient music, and portable massage tables."
      },
      {
        "step": 3,
        "title": "Dosha Alignment & Therapy",
        "description": "Unwind completely as therapeutic strokes release tension, restore circulation, and calm the mind."
      },
      {
        "step": 4,
        "title": "Herbal Infusion & Post-Care",
        "description": "Conclude with a warm digestive tonic and herbal guidance for lasting relaxation during your stay."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-w1",
        "author": "Elena Rostova",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "October 2026",
        "comment": "The Shirodhara session on our villa veranda listening to the ocean was pure bliss. Ananya and her assistant are authentic Ayurvedic masters.",
        "villa": "Cliffside Nirvana, Goa"
      },
      {
        "id": "rev-w2",
        "author": "Rohan Mehra",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "September 2026",
        "comment": "After a 7-hour drive from Bangalore, this was the greatest relief. Professional, hygienic, and completely rejuvenating.",
        "villa": "Misty Pines Chalet, Coorg"
      }
    ]
  },
  {
    "_id": "srv-3",
    "title": "Executive Chauffeur & Airport Concierge",
    "category": "Transport",
    "tagline": "Flawless airport meet-and-greet and dedicated luxury sedan transfers",
    "description": "Leave the stress of airport queues, erratic luggage transfers, and unfamiliar roads behind. Your dedicated chauffeur awaits your arrival right outside the terminal gate with an identification placard, chilled lemongrass towels, and premium bottled spring water. Travel in pristine Mercedes, BMW, or high-end electric executive sedans outfitted with Wi-Fi, smartphone chargers, and climate-controlled comfort directly to your villa doorstep.",
    "priceTag": "From ₹2,200 / airport transfer",
    "basePrice": 2200,
    "rating": 4.98,
    "reviewCount": 142,
    "image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=85"
    ],
    "providerName": "Wayfound Executive Mobility Fleet",
    "providerAvatar": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    "providerBio": "Premium licensed fleet service with 100% background-checked, multilingual chauffeurs trained in executive guest protocol and defensive driving.",
    "features": [
      "Flight tracking for delays",
      "Premium electric and luxury sedans",
      "Child seats available upon request"
    ],
    "included": [
      "Real-time flight tracking & zero fee for delayed arrivals",
      "Terminal gate meet & greet with luggage handling",
      "Chilled mineral water & refreshing organic wet wipes",
      "High-speed in-cabin Wi-Fi & multi-device fast chargers",
      "Toll charges, airport parking fees & fuel included",
      "Complimentary booster or baby seat on request"
    ],
    "offerings": [
      {
        "title": "One-Way Airport Arrival Transfer",
        "subtitle": "Airport to Villa Sanctuary",
        "description": "Door-to-door VIP escort from runway arrival straight to your villa check-in.",
        "price": "₹2,200 flat rate"
      },
      {
        "title": "Full-Day Dedicated Chauffeur Service",
        "subtitle": "8 Hours / 80 Kilometers",
        "description": "Dedicated luxury car and chauffeur at your beck and call for shopping, cafes, and sightseeing.",
        "price": "₹4,900 / day"
      },
      {
        "title": "Roundtrip Airport Package",
        "subtitle": "Arrival & Departure Escort",
        "description": "Complete peace of mind covering both your arrival welcome and scheduled departure drop-off.",
        "price": "₹3,900 bundle"
      }
    ],
    "howItWorks": [
      {
        "step": 1,
        "title": "Provide Flight & Villa Details",
        "description": "Input your flight number, arrival time, and destination stay in your reservation."
      },
      {
        "step": 2,
        "title": "Chauffeur Assigned & Flight Monitored",
        "description": "We track your flight live. Your chauffeur contacts you via SMS/WhatsApp with vehicle details."
      },
      {
        "step": 3,
        "title": "Terminal Gate Welcome",
        "description": "Step past baggage claim to find your chauffeur holding your custom Wayfound name board."
      },
      {
        "step": 4,
        "title": "Smooth Luxury Transit",
        "description": "Relax in air-conditioned leather seating and arrive refreshed at your villa property."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-t1",
        "author": "Vikram & Natasha Sethi",
        "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "October 2026",
        "comment": "Our flight to Goa was delayed by 2 hours at midnight, but our driver Rajesh was waiting right on time with a warm smile and cold drinks. Phenomenal service.",
        "villa": "Villa Azure, Candolim"
      },
      {
        "id": "rev-t2",
        "author": "Alistair Campbell",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "September 2026",
        "comment": "Pristine vehicle, child seat installed safely for our toddler, and silky smooth driving through the hills of Manali.",
        "villa": "Cedar View Lodge, Manali"
      }
    ]
  },
  {
    "_id": "srv-4",
    "title": "Pre-Arrival Pantry & Bar Provisioning",
    "category": "Concierge",
    "tagline": "Step into a refrigerator fully stocked with your favorite artisanal essentials",
    "description": "Nothing surpasses unlocking your holiday villa and finding the refrigerator chilling your favorite sparkling wines, the counters laden with fresh sourdough, ripe avocados, local organic mangoes, and artisanal cheese boards. Our concierge team personally curates your grocery order from verified organic markets and local gourmet purveyors, arranging everything neatly into pantry and fridge hours before you turn the front key.",
    "priceTag": "₹950 service fee + grocery receipts",
    "basePrice": 950,
    "rating": 4.95,
    "reviewCount": 88,
    "image": "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=85",
    "images": [
      "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1550989460-0adc9554f529?auto=format&fit=crop&w=1200&q=85"
    ],
    "providerName": "Wayfound In-Villa Pantry Curators",
    "providerAvatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    "providerBio": "Local sourcing specialists connected with organic farms, bakeries, and fine importers across Goa, Rajasthan, and Himachal.",
    "features": [
      "Specialty dietary curation",
      "Chilled beverages on arrival",
      "Itemized store receipts provided"
    ],
    "included": [
      "Personal grocery shopper dedicated to your list",
      "Cold-chain transport to ensure dairy and meats remain fresh",
      "Beautiful fridge and pantry arrangement prior to check-in",
      "Fresh fruit basket on the dining table as welcome gesture",
      "100% itemized store and farm receipts provided with zero markup",
      "Emergency restocking service available during your stay"
    ],
    "offerings": [
      {
        "title": "Artisanal Breakfast Basket",
        "subtitle": "Sourdough, Eggs, Butter & Jams",
        "description": "Fresh local sourdough loaf, organic free-range eggs, farm butter, artisanal guava jam, and French roast coffee.",
        "price": "₹1,200 + grocery cost"
      },
      {
        "title": "Sundowner Wine & Gourmet Cheese Board",
        "subtitle": "Curated Aperitivo Setup",
        "description": "Chilled prosecco or chosen vintage, aged smoked cheddar, truffle gouda, mixed nuts, grapes, and crackers.",
        "price": "₹1,500 + grocery cost"
      },
      {
        "title": "Full Villa Pantry Restock",
        "subtitle": "Up to 30 Custom Grocery Items",
        "description": "Complete custom shopping list covering snacks, sodas, baby food, fruits, cereals, and organic veggies.",
        "price": "₹950 flat fee + receipts"
      }
    ],
    "howItWorks": [
      {
        "step": 1,
        "title": "Submit Your Grocery Wishlist",
        "description": "Send us your custom grocery list or pick from our curated starter baskets."
      },
      {
        "step": 2,
        "title": "Local Farm & Purveyor Sourcing",
        "description": "Our shopper visits local organic markets, bakeries, and specialty merchants on check-in day."
      },
      {
        "step": 3,
        "title": "Villa Access & Neat Stocking",
        "description": "Coordinated directly with the property host to chill beverages and stage the pantry prior to your arrival."
      },
      {
        "step": 4,
        "title": "Receipts & Zero Hassle Check-In",
        "description": "Walk in, pour a chilled drink, and find original merchant receipts waiting on the counter."
      }
    ],
    "reviewsList": [
      {
        "id": "rev-p1",
        "author": "Sameer & Gayatri Kapoor",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "October 2026",
        "comment": "Arriving at 11 PM with two cranky toddlers and finding organic milk, fresh bread, and cold beers already in the fridge was worth 10 times the fee.",
        "villa": "Villa Sienna, Assagao"
      },
      {
        "id": "rev-p2",
        "author": "Jessica Miller",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        "rating": 5,
        "date": "August 2026",
        "comment": "The fruit basket and cheese selection were out of this world. Super professional and transparent receipts.",
        "villa": "Royal Lake Pavilion, Udaipur"
      }
    ]
  }
];
