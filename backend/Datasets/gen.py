import csv, json

base_images = {
    'beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
    'mountain': 'https://images.unsplash.com/photo-1605649487212-4d4ce38290f6?q=80&w=800&auto=format&fit=crop',
    'heritage': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    'city': 'https://images.unsplash.com/photo-1522206090980-92803b90045d?q=80&w=800&auto=format&fit=crop',
    'temple': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop',
    'nature': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
}

def get_category(city, state):
    c, s = city.lower(), state.lower()
    if any(x in c for x in ['goa', 'kochi', 'chennai', 'mumbai', 'digha', 'kovalam', 'alleppey', 'varkala', 'kanyakumari', 'alibaug', 'palolem', 'baga', 'calangute', 'anjuna', 'candolim', 'margao', 'panaji', 'gokarna']): return 'beach'
    if any(x in c for x in ['manali', 'shimla', 'darjeeling', 'kashmir', 'mussorie', 'nainital', 'ooty', 'kodaikanal', 'munnar', 'wayanad', 'dalhousie', 'spiti', 'kasol', 'auli', 'chail', 'ranikhet']): return 'mountain'
    if any(x in s for x in ['rajasthan', 'gujarat']) or any(x in c for x in ['jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'bikaner', 'agra', 'mysore', 'hampi', 'chittorgarh', 'badami', 'murshidabad', 'bijapur', 'khajuraho']): return 'heritage'
    if any(x in c for x in ['varanasi', 'rishikesh', 'haridwar', 'vrindavan', 'mathura', 'ayodhya', 'amritsar', 'pushkar', 'madurai', 'rameswaram', 'dwarka', 'tirupati']): return 'temple'
    if any(x in c for x in ['delhi', 'bangalore', 'bengaluru', 'pune', 'kolkata', 'hyderabad', 'chandigarh', 'gurugram', 'noida']): return 'city'
    return 'nature'

city_images = {}
try:
    with open('Tourist_Spots_Complete (1).csv', encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            if row.get('city'): city_images[row['city']] = base_images[get_category(row['city'], row.get('state', ''))]
except Exception as e: print(e)

try:
    with open('restaurant_dataset.csv', encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            if row.get('City'): city_images[row['City']] = base_images[get_category(row['City'], row.get('State', ''))]
except Exception as e: print(e)

city_images.update({'GOAA': base_images['beach'], 'Bengaluru': base_images['city'], 'Bangalore': base_images['city'], 'New Delhi': base_images['city'], 'Delhi': base_images['city']})

with open('../../new frontend/src/utils/imageResolver.js', 'w', encoding='utf-8') as f:
    f.write('export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop";\n\n')
    f.write('const CITY_IMAGES = ' + json.dumps(city_images, indent=2) + ';\n\n')
    f.write('export function resolveCityImage(cityName) {\n  if (!cityName) return FALLBACK_IMAGE;\n  const match = Object.keys(CITY_IMAGES).find(c => cityName.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(cityName.toLowerCase()));\n  return match ? CITY_IMAGES[match] : FALLBACK_IMAGE;\n}\n')
