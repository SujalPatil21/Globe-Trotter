import csv, json, urllib.request, urllib.parse

base_images = {
    'beach': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
    'mountain': 'https://images.unsplash.com/photo-1605649487212-4d4ce38290f6?q=80&w=800&auto=format&fit=crop',
    'heritage': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop',
    'city': 'https://images.unsplash.com/photo-1522206090980-92803b90045d?q=80&w=800&auto=format&fit=crop',
    'temple': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop',
    'nature': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
}

def get_category(city):
    c = city.lower()
    if any(x in c for x in ['goa', 'kochi', 'chennai', 'mumbai', 'kovalam', 'alleppey', 'varkala', 'kanyakumari', 'alibaug', 'gokarna']): return 'beach'
    if any(x in c for x in ['manali', 'shimla', 'darjeeling', 'kashmir', 'mussorie', 'nainital', 'ooty', 'munnar', 'wayanad', 'dalhousie']): return 'mountain'
    if any(x in c for x in ['jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'bikaner', 'agra', 'mysore', 'hampi', 'chittorgarh', 'aurangabad']): return 'heritage'
    if any(x in c for x in ['varanasi', 'rishikesh', 'haridwar', 'vrindavan', 'mathura', 'ayodhya', 'amritsar', 'pushkar', 'madurai']): return 'temple'
    if any(x in c for x in ['delhi', 'bangalore', 'pune', 'kolkata', 'hyderabad', 'chandigarh']): return 'city'
    return 'nature'

import time

def get_wiki_image(city_name):
    headers = {'User-Agent': 'GlobeTrotterBot/1.0 (contact@example.com) Mozilla/5.0'}
    try:
        search = urllib.parse.quote(city_name + ' India')
        url = f'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles={search}'
        req = urllib.request.Request(url, headers=headers)
        time.sleep(0.6)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id in pages:
                if 'original' in pages[page_id]:
                    return pages[page_id]['original']['source']
        
        # Fallback to just city name
        search = urllib.parse.quote(city_name)
        url = f'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles={search}'
        req = urllib.request.Request(url, headers=headers)
        time.sleep(0.6)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id in pages:
                if 'original' in pages[page_id]:
                    return pages[page_id]['original']['source']
    except Exception as e:
        print(f'Failed {city_name}: {e}')
    return None

cities = set()
try:
    with open('Tourist_Spots_Complete (1).csv', encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            if row.get('city'): cities.add(row['city'])
    with open('restaurant_dataset.csv', encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            if row.get('City'): cities.add(row['City'])
except Exception as e:
    print(e)

# Overrides for local images based on user prompt
overrides = {
    'Agra': '/image/Taj Mahal.jpg',
    'Goa': '/image/GOA1.jpg',
    'GOAA': '/image/GOA1.jpg',
    'Jaipur': '/image/Jaipur 1.jpg',
    'Kochi': '/image/Kerala Backwaters Bliss_ A Tranquil Houseboat Cruise.jpeg',
    'Alleppey': '/image/Kerala Backwaters Bliss_ A Tranquil Houseboat Cruise.jpeg',
    'Munnar': '/image/Kerala Backwaters Bliss_ A Tranquil Houseboat Cruise.jpeg',
    'Wayanad': '/image/Kerala Backwaters Bliss_ A Tranquil Houseboat Cruise.jpeg',
    'Kumarakom': '/image/Kerala Backwaters Bliss_ A Tranquil Houseboat Cruise.jpeg',
    'Leh': '/image/ladak 1.jpg',
    'Ladakh': '/image/LADAK2.jpg',
    'Bengaluru': base_images['city'],
    'Bangalore': base_images['city'],
    'New Delhi': base_images['city'],
    'Delhi': base_images['city']
}

city_images = {}
for i, city in enumerate(list(cities)):
    if city in overrides:
        city_images[city] = overrides[city]
    else:
        # Try wiki
        img = get_wiki_image(city)
        if img and img.endswith(('.jpg', '.jpeg', '.png')):
            city_images[city] = img
        else:
            city_images[city] = base_images[get_category(city)]
    print(f'Mapped {i+1}/{len(cities)}: {city}')

# Add aliases from overrides
for k, v in overrides.items():
    city_images[k] = v

with open('../../new frontend/src/utils/imageResolver.js', 'w', encoding='utf-8') as f:
    f.write('export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop";\n\n')
    f.write('const CITY_IMAGES = ' + json.dumps(city_images, indent=2) + ';\n\n')
    f.write('export function resolveCityImage(cityName) {\n  if (!cityName) return FALLBACK_IMAGE;\n  const match = Object.keys(CITY_IMAGES).find(c => cityName.toLowerCase() === c.toLowerCase());\n  if (match) return CITY_IMAGES[match];\n  const partial = Object.keys(CITY_IMAGES).find(c => cityName.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(cityName.toLowerCase()));\n  return partial ? CITY_IMAGES[partial] : FALLBACK_IMAGE;\n}\n')
print('DONE')
