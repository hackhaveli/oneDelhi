const delhiBusStops = [
  {
    id: 1,
    name: 'Kashmere Gate ISBT',
    lat: 28.6681,
    lng: 77.2285,
    routes: [
      { number: '101', destination: 'Red Fort' },
      { number: '102', destination: 'Connaught Place' },
      { number: '103', destination: 'Rajouri Garden' }
    ]
  },
  {
    id: 2,
    name: 'Connaught Place',
    lat: 28.6280,
    lng: 77.2065,
    routes: [
      { number: '101', destination: 'Kashmere Gate' },
      { number: '201', destination: 'Rajouri Garden' },
      { number: '301', destination: 'Nehru Place' }
    ]
  },
  {
    id: 3,
    name: 'Rajouri Garden',
    lat: 28.6519,
    lng: 77.1211,
    routes: [
      { number: '102', destination: 'Kashmere Gate' },
      { number: '201', destination: 'Connaught Place' },
      { number: '401', destination: 'Dwarka' }
    ]
  },
  {
    id: 4,
    name: 'Nehru Place',
    lat: 28.5480,
    lng: 77.2515,
    routes: [
      { number: '301', destination: 'Connaught Place' },
      { number: '302', destination: 'Lajpat Nagar' },
      { number: '303', destination: 'Kalkaji' }
    ]
  },
  {
    id: 5,
    name: 'Lajpat Nagar',
    lat: 28.5673,
    lng: 77.2411,
    routes: [
      { number: '302', destination: 'Nehru Place' },
      { number: '402', destination: 'Hauz Khas' },
      { number: '502', destination: 'Saket' }
    ]
  },
  {
    id: 6,
    name: 'Hauz Khas',
    lat: 28.5443,
    lng: 77.1926,
    routes: [
      { number: '402', destination: 'Lajpat Nagar' },
      { number: '403', destination: 'Green Park' },
      { number: '404', destination: 'Malviya Nagar' }
    ]
  },
  {
    id: 7,
    name: 'Karol Bagh',
    lat: 28.6517,
    lng: 77.1896,
    routes: [
      { number: '501', destination: 'Rajouri Garden' },
      { number: '502', destination: 'Connaught Place' },
      { number: '503', destination: 'Punjabi Bagh' }
    ]
  },
  {
    id: 8,
    name: 'Punjabi Bagh',
    lat: 28.6685,
    lng: 77.1244,
    routes: [
      { number: '503', destination: 'Karol Bagh' },
      { number: '504', destination: 'Rajouri Garden' },
      { number: '505', destination: 'Paschim Vihar' }
    ]
  }
];

export default delhiBusStops;
