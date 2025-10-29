// Delhi Bus Routes Data
const delhiRoutes = [
  {
    id: 1,
    routeNumber: '539A',
    sourceStop: 'Safdurjung Terminal',
    destinationStop: 'NajafGarh Terminal',
    stops: [
      'Safdurjung Terminal',
      'Ambedkar Nagar Terminal / DIP...',
      'Asian Market',
      'Saket Crossing',
      'Maidan Garhi Xing',
      'Saidul-A-Jab',
      'Dhaula Peer',
      'Lado Sarai Crossing',
      'Dhaula Peer / Lado Sarai',
      'Ahinsa Sthal',
      'Qutub Minar Metro Station',
      'NajafGarh Terminal'
    ],
    busType: ['AC', 'Non-AC'],
    fare: {
      AC: 25,
      'Non-AC': 15
    }
  },
  {
    id: 2,
    routeNumber: '966B',
    sourceStop: 'Sultanpuri Terminal',
    destinationStop: 'Nizamuddin Railway Station',
    stops: [
      'Sultanpuri Terminal',
      'Rohini Sector 18',
      'Pitampura TV Tower',
      'Netaji Subhash Place',
      'Shakti Nagar',
      'Old Delhi Railway Station',
      'ITO',
      'Pragati Maidan',
      'Nizamuddin Railway Station'
    ],
    busType: ['AC', 'Non-AC'],
    fare: {
      AC: 30,
      'Non-AC': 20
    }
  },
  {
    id: 3,
    routeNumber: 'CENTRALSECRETARIAT',
    sourceStop: 'Central Secretariat Metro St...',
    destinationStop: 'PM Sangrahalaya (In Gate)',
    stops: [
      'Central Secretariat Metro Station',
      'Udyog Bhawan',
      'Race Course',
      'Teen Murti',
      'PM Sangrahalaya (In Gate)'
    ],
    busType: ['AC'],
    fare: {
      AC: 20,
      'Non-AC': 0
    }
  },
  {
    id: 4,
    routeNumber: '0405(NS)',
    sourceStop: 'Mori Gate Terminal',
    destinationStop: 'Badarpur Border (T)',
    stops: [
      'Mori Gate Terminal',
      'Delhi Gate',
      'ITO',
      'Pragati Maidan',
      'Nizamuddin Railway Station',
      'Ashram',
      'Sarai Kale Khan',
      'Modi Mill',
      'Jaitpur',
      'Badarpur Border (T)'
    ],
    busType: ['Non-AC'],
    fare: {
      AC: 0,
      'Non-AC': 15
    }
  },
  {
    id: 5,
    routeNumber: '408',
    sourceStop: 'Raghubir Nagar F Block',
    destinationStop: 'Nizamuddin Railway Station',
    stops: [
      'Raghubir Nagar F Block',
      'Janakpuri West Metro',
      'Tilak Nagar',
      'Subhash Nagar',
      'Rajouri Garden',
      'Kirti Nagar',
      'Moti Nagar',
      'Patel Nagar',
      'Karol Bagh',
      'Ajmeri Gate',
      'India Gate',
      'Khan Market',
      'Nizamuddin Railway Station'
    ],
    busType: ['AC', 'Non-AC'],
    fare: {
      AC: 25,
      'Non-AC': 15
    }
  },
  {
    id: 6,
    routeNumber: '926A',
    sourceStop: 'Tikri Border Metro Station',
    destinationStop: 'Peera Garhi Depot',
    stops: [
      'Tikri Border Metro Station',
      'Nangloi',
      'Mundka',
      'Ghevra',
      'Paschim Vihar',
      'Punjabi Bagh',
      'Peera Garhi Depot'
    ],
    busType: ['Non-AC'],
    fare: {
      AC: 0,
      'Non-AC': 12
    }
  },
  {
    id: 7,
    routeNumber: '764',
    sourceStop: 'Anand Vihar ISBT',
    destinationStop: 'Dwarka Sector 21',
    stops: [
      'Anand Vihar ISBT',
      'Laxmi Nagar',
      'Nirman Vihar',
      'Preet Vihar',
      'ITO',
      'Barakhamba Road',
      'Connaught Place',
      'Patel Chowk',
      'Dhaula Kuan',
      'Dwarka Sector 9',
      'Dwarka Sector 21'
    ],
    busType: ['AC', 'Non-AC'],
    fare: {
      AC: 35,
      'Non-AC': 20
    }
  },
  {
    id: 8,
    routeNumber: '534',
    sourceStop: 'Mehrauli Terminal',
    destinationStop: 'Old Delhi Railway Station',
    stops: [
      'Mehrauli Terminal',
      'Qutub Minar',
      'Vasant Vihar',
      'Munirka',
      'IIT Delhi',
      'Hauz Khas',
      'Green Park',
      'AIIMS',
      'Safdarjung Hospital',
      'Dhaula Kuan',
      'Karol Bagh',
      'Chandni Chowk',
      'Old Delhi Railway Station'
    ],
    busType: ['AC', 'Non-AC'],
    fare: {
      AC: 30,
      'Non-AC': 18
    }
  }
];

export default delhiRoutes;
