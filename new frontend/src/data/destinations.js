const img = (id) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

export const DESTINATIONS = [
  {
    name: 'Goa',
    country: 'India',
    metadata: 'Beaches · Nightlife · Heritage',
    image: img('photo-1512343879784-a960bf40e7f2'),
  },
  {
    name: 'Kerala',
    country: 'India',
    metadata: 'Backwaters · Houseboats · Ayurveda',
    image: img('photo-1593693397690-362cb9666fc2'),
  },
  {
    name: 'Ladakh',
    country: 'India',
    metadata: 'Monasteries · Lakes · High Passes',
    image: img('photo-1570789210967-2cac24afeb00'),
  },
  {
    name: 'Manali',
    country: 'India',
    metadata: 'Snow Peaks · Adventure · Valleys',
    image: img('photo-1626621341517-bbf3d9990a23'),
  },
];
