"""
Seasonal Conditions Service
Static deterministic reference — NO database changes required.
"""

# ─── Static seasonal data keyed by city name (lowercase) → month (1–12) ───────
_SEASONAL_DATA = {
    "mumbai": {
        1:  {"season": "Winter", "typical_conditions": "Cool and dry with clear skies", "suitability": "good", "travel_tip": "Best time to visit. Pleasant weather ideal for sightseeing and outdoor activities."},
        2:  {"season": "Winter", "typical_conditions": "Warm and dry, slight increase in temperature", "suitability": "good", "travel_tip": "Great weather. Explore Marine Drive and the Bandra-Worli Sea Link comfortably."},
        3:  {"season": "Pre-Summer", "typical_conditions": "Getting warmer with low humidity", "suitability": "good", "travel_tip": "Still comfortable for travel. Start early in the day to avoid midday heat."},
        4:  {"season": "Summer", "typical_conditions": "Hot and humid", "suitability": "moderate", "travel_tip": "Plan indoor activities during midday. Stay hydrated and carry sun protection."},
        5:  {"season": "Pre-Monsoon", "typical_conditions": "Very hot and humid with occasional pre-monsoon showers", "suitability": "moderate", "travel_tip": "Carry light clothing and an umbrella. Expect some rain towards the end of the month."},
        6:  {"season": "Monsoon", "typical_conditions": "Heavy rainfall, high humidity", "suitability": "not_ideal", "travel_tip": "Expect flooding in low-lying areas. Many coastal activities suspended. Best for budget travel with fewer crowds."},
        7:  {"season": "Monsoon", "typical_conditions": "Heavy rainfall, possible waterlogging", "suitability": "not_ideal", "travel_tip": "Carry waterproofs. Local transport may be disrupted. Indoor attractions recommended."},
        8:  {"season": "Monsoon", "typical_conditions": "Warm and humid with frequent rainfall", "suitability": "moderate", "travel_tip": "Rains typically lighten by mid-August. Carry rain protection and allow flexibility for outdoor plans."},
        9:  {"season": "Late Monsoon", "typical_conditions": "Reducing rainfall, still humid", "suitability": "moderate", "travel_tip": "City is lush and green. Ganesh Chaturthi celebrations add cultural richness."},
        10: {"season": "Post-Monsoon", "typical_conditions": "Cooling down, occasional showers", "suitability": "good", "travel_tip": "Good time to visit. Comfortable temperatures and festive atmosphere."},
        11: {"season": "Winter", "typical_conditions": "Pleasant and dry", "suitability": "good", "travel_tip": "Excellent time to visit. Great weather for exploring the city on foot."},
        12: {"season": "Winter", "typical_conditions": "Cool and dry, festive atmosphere", "suitability": "good", "travel_tip": "Peak tourist season. Book accommodation in advance. Christmas celebrations are vibrant."},
    },
    "goa": {
        1:  {"season": "Winter", "typical_conditions": "Sunny, warm and dry — peak tourist season", "suitability": "good", "travel_tip": "Best month to visit. Beaches are at their finest. Book accommodation well in advance."},
        2:  {"season": "Winter", "typical_conditions": "Warm, sunny and low humidity", "suitability": "good", "travel_tip": "Excellent beach weather. Water sports at their best. Carnival season."},
        3:  {"season": "Pre-Summer", "typical_conditions": "Getting warmer, still pleasant", "suitability": "good", "travel_tip": "Good time to visit with fewer crowds. Enjoy beaches before the heat sets in."},
        4:  {"season": "Summer", "typical_conditions": "Hot and humid", "suitability": "moderate", "travel_tip": "Fewer tourists, lower prices. Some beach shacks begin to close. Start mornings early."},
        5:  {"season": "Pre-Monsoon", "typical_conditions": "Very hot with pre-monsoon showers building", "suitability": "moderate", "travel_tip": "Most beach infrastructure closes. Good for a quiet, authentic Goa experience."},
        6:  {"season": "Monsoon", "typical_conditions": "Heavy rainfall, rough seas", "suitability": "not_ideal", "travel_tip": "Swimming and water sports not permitted. Goa is very green and atmospheric — good for nature lovers."},
        7:  {"season": "Monsoon", "typical_conditions": "Very heavy rainfall", "suitability": "not_ideal", "travel_tip": "Most tourist facilities closed. Only recommended for those specifically seeking the monsoon experience."},
        8:  {"season": "Monsoon", "typical_conditions": "Continued heavy rain but beginning to ease", "suitability": "not_ideal", "travel_tip": "Some beach shacks start reopening by end of August. Waterfalls are spectacular during this time."},
        9:  {"season": "Late Monsoon", "typical_conditions": "Rain reducing, seas still rough", "suitability": "moderate", "travel_tip": "Good time to see Dudhsagar Falls. Fewer crowds. Some facilities reopening."},
        10: {"season": "Post-Monsoon", "typical_conditions": "Dry and pleasant, facilities reopening", "suitability": "good", "travel_tip": "Good time to visit — pleasant weather, lower prices and fewer crowds than peak season."},
        11: {"season": "Winter", "typical_conditions": "Warm and sunny, festive atmosphere building", "suitability": "good", "travel_tip": "Excellent travel conditions. Festival season begins. Book accommodation early for December."},
        12: {"season": "Winter", "typical_conditions": "Perfect beach weather, peak festivity", "suitability": "good", "travel_tip": "Most popular month. New Year celebrations are spectacular. Expect peak prices and crowds."},
    },
    "jaipur": {
        1:  {"season": "Winter", "typical_conditions": "Cold nights, pleasant days", "suitability": "good", "travel_tip": "Excellent time to visit. Comfortable for exploring forts and palaces. Carry warm clothes for evenings."},
        2:  {"season": "Winter", "typical_conditions": "Pleasant temperature, mild and sunny", "suitability": "good", "travel_tip": "Ideal weather for sightseeing. The Elephant Festival typically falls in February/March."},
        3:  {"season": "Spring", "typical_conditions": "Warming up, colorful with Holi festivities", "suitability": "good", "travel_tip": "Holi celebrations in Jaipur are spectacular. Pleasant temperatures for outdoor exploration."},
        4:  {"season": "Pre-Summer", "typical_conditions": "Getting hot, low humidity", "suitability": "moderate", "travel_tip": "Visit monuments early morning. Use afternoon for rest or indoor experiences like shopping."},
        5:  {"season": "Summer", "typical_conditions": "Very hot, temperatures can reach 45°C", "suitability": "not_ideal", "travel_tip": "Plan indoor activities for midday. Hydrate frequently. Avoid outdoor sightseeing between 11am–4pm."},
        6:  {"season": "Summer/Monsoon", "typical_conditions": "Hot with onset of monsoon rains", "suitability": "moderate", "travel_tip": "Rains bring some relief from heat. Forts and palaces look beautiful with occasional rain."},
        7:  {"season": "Monsoon", "typical_conditions": "Regular rainfall, warm and humid", "suitability": "moderate", "travel_tip": "City turns green. Fewer tourists. Some outdoor activities may be limited."},
        8:  {"season": "Monsoon", "typical_conditions": "Moderate rainfall, pleasant temperatures", "suitability": "moderate", "travel_tip": "Teej festival typically falls in August — a vibrant cultural experience. Carry an umbrella."},
        9:  {"season": "Post-Monsoon", "typical_conditions": "Rainfall reducing, pleasant evenings", "suitability": "good", "travel_tip": "Good time to visit. Landscapes are lush. The Jaipur Literature Festival season approaches."},
        10: {"season": "Autumn", "typical_conditions": "Dry and pleasant", "suitability": "good", "travel_tip": "Excellent weather. Diwali celebrations in Rajasthan are particularly vibrant."},
        11: {"season": "Winter", "typical_conditions": "Pleasant days, cool evenings", "suitability": "good", "travel_tip": "Peak tourist season begins. Perfect for exploring the Pink City."},
        12: {"season": "Winter", "typical_conditions": "Cold nights, sunny days", "suitability": "good", "travel_tip": "Pack warm clothes for evenings. Great time for desert camps and cultural experiences."},
    },
    "udaipur": {
        1:  {"season": "Winter", "typical_conditions": "Cold and clear, excellent visibility", "suitability": "good", "travel_tip": "Best time to visit. Lake views are stunning. Carry warm clothing for nights."},
        2:  {"season": "Winter", "typical_conditions": "Mild and sunny", "suitability": "good", "travel_tip": "Ideal for boat rides on Pichola and exploring City Palace without summer heat."},
        3:  {"season": "Spring", "typical_conditions": "Warming up, pleasant for outdoor exploration", "suitability": "good", "travel_tip": "Comfortable temperatures. Great for photography of the lakes and havelis."},
        4:  {"season": "Pre-Summer", "typical_conditions": "Warm, dry days", "suitability": "moderate", "travel_tip": "Start sightseeing early morning. Lakes are still beautiful."},
        5:  {"season": "Summer", "typical_conditions": "Hot and dry", "suitability": "moderate", "travel_tip": "Fewer tourists and lower prices. Avoid midday sun. Early mornings are magical by the lake."},
        6:  {"season": "Early Monsoon", "typical_conditions": "Hot with some early rain", "suitability": "moderate", "travel_tip": "Lakes begin to fill. Dramatic landscapes. Some roads may be affected."},
        7:  {"season": "Monsoon", "typical_conditions": "Regular rainfall, lakes filling up beautifully", "suitability": "good", "travel_tip": "The lakes of Udaipur are most beautiful during monsoon. Romantic atmosphere with misty mornings."},
        8:  {"season": "Monsoon", "typical_conditions": "Lush greenery, lakes full", "suitability": "good", "travel_tip": "Spectacular lake views. Monsoon makes Udaipur uniquely photogenic. Carry rain protection."},
        9:  {"season": "Post-Monsoon", "typical_conditions": "Cooling down, very pleasant", "suitability": "good", "travel_tip": "Excellent time to visit. Green landscapes, full lakes, comfortable temperatures."},
        10: {"season": "Autumn", "typical_conditions": "Dry and pleasant", "suitability": "good", "travel_tip": "Great weather for boat rides and evening walks. Diwali adds special magic."},
        11: {"season": "Winter", "typical_conditions": "Pleasant, ideal for exploration", "suitability": "good", "travel_tip": "Peak season begins. Book ahead. Perfect time for a romantic getaway."},
        12: {"season": "Winter", "typical_conditions": "Cool, clear skies", "suitability": "good", "travel_tip": "Carry warm layers for evenings. New Year events at lake-view properties are memorable."},
    },
    "delhi": {
        1:  {"season": "Winter", "typical_conditions": "Cold with possible fog affecting visibility and transport", "suitability": "good", "travel_tip": "Wrap up warm, especially for early morning sightseeing. Fog may delay flights and trains."},
        2:  {"season": "Winter", "typical_conditions": "Cold but becoming milder", "suitability": "good", "travel_tip": "Good time to explore historical monuments. Weather becomes increasingly pleasant."},
        3:  {"season": "Spring", "typical_conditions": "Warm and pleasant, Holi festivities", "suitability": "good", "travel_tip": "Excellent weather. Holi is celebrated with great energy. Gardens like Lodhi are beautiful."},
        4:  {"season": "Pre-Summer", "typical_conditions": "Getting hot", "suitability": "moderate", "travel_tip": "Still manageable. Plan outdoor sightseeing for early morning hours."},
        5:  {"season": "Summer", "typical_conditions": "Very hot, temperatures exceed 40°C", "suitability": "not_ideal", "travel_tip": "Avoid Delhi in May if possible. If unavoidable, plan entirely indoor activities midday and stay hydrated."},
        6:  {"season": "Summer/Monsoon", "typical_conditions": "Hot and humid, monsoon approaching", "suitability": "moderate", "travel_tip": "Pre-monsoon storms offer some relief. Markets and museums are best during this period."},
        7:  {"season": "Monsoon", "typical_conditions": "Heavy rainfall, flooding in low-lying areas", "suitability": "moderate", "travel_tip": "The heat breaks significantly. Check road conditions before travelling. Some outdoor attractions may be inaccessible."},
        8:  {"season": "Monsoon", "typical_conditions": "Warm and humid with frequent rainfall", "suitability": "moderate", "travel_tip": "Independence Day celebrations on August 15 are spectacular. Carry rain protection and allow travel flexibility."},
        9:  {"season": "Post-Monsoon", "typical_conditions": "Humidity reducing, weather improving", "suitability": "good", "travel_tip": "Pleasant weather returns. Excellent for outdoor sightseeing — India Gate, Humayun's Tomb, etc."},
        10: {"season": "Autumn", "typical_conditions": "Dry and pleasant, ideal for outdoor activities", "suitability": "good", "travel_tip": "Best period to visit Delhi. Diwali typically falls in October/November — a memorable experience."},
        11: {"season": "Autumn/Early Winter", "typical_conditions": "Cool and pleasant", "suitability": "good", "travel_tip": "Peak sightseeing weather. Pollution levels can sometimes increase in November. Check air quality."},
        12: {"season": "Winter", "typical_conditions": "Cold, possible fog towards month end", "suitability": "good", "travel_tip": "Great weather for sightseeing. Christmas and New Year festivities in Connaught Place are vibrant."},
    },
    "manali": {
        1:  {"season": "Deep Winter", "typical_conditions": "Heavy snowfall, sub-zero temperatures", "suitability": "good", "travel_tip": "Excellent for snow activities. Rohtang Pass closed. Carry heavy winter gear and book in advance."},
        2:  {"season": "Winter", "typical_conditions": "Heavy snow, winter sports season peaks", "suitability": "good", "travel_tip": "Great for skiing and snowboarding. Most mountain passes still closed. Solang Valley activities are excellent."},
        3:  {"season": "Late Winter", "typical_conditions": "Snow melting, roads reopening gradually", "suitability": "good", "travel_tip": "Scenic snowmelt landscapes. Rohtang Pass may begin to open. Less crowded than summer."},
        4:  {"season": "Spring", "typical_conditions": "Pleasant, snow on peaks, blooming valleys", "suitability": "good", "travel_tip": "Beautiful landscapes with residual snow and blooming flowers. Excellent for trekking."},
        5:  {"season": "Spring/Summer", "typical_conditions": "Warm, Rohtang Pass opens, peak tourist season begins", "suitability": "good", "travel_tip": "Very popular time. Book accommodation well in advance. Rohtang access requires permits."},
        6:  {"season": "Summer", "typical_conditions": "Pleasant and cool — best overall weather", "suitability": "good", "travel_tip": "Peak season. Ideal temperatures. Very busy — book everything in advance."},
        7:  {"season": "Monsoon", "typical_conditions": "Rainfall, potential landslides on mountain roads", "suitability": "not_ideal", "travel_tip": "Landslide risk on mountain roads. Check road conditions carefully. Rohtang may be closed due to rain."},
        8:  {"season": "Monsoon", "typical_conditions": "Rain and landslide risk", "suitability": "not_ideal", "travel_tip": "Avoid if possible. If travelling, check road status daily and carry extra days in your plan for delays."},
        9:  {"season": "Post-Monsoon", "typical_conditions": "Clearing skies, beautiful landscapes", "suitability": "good", "travel_tip": "Excellent time — clear skies, fewer tourists, lush green landscapes. Great for photography."},
        10: {"season": "Autumn", "typical_conditions": "Cool and dry, golden foliage", "suitability": "good", "travel_tip": "Beautiful autumn colours. Dussehra and Kullu Dussehra festival is spectacular. Book ahead."},
        11: {"season": "Early Winter", "typical_conditions": "Cold, first snowfall", "suitability": "moderate", "travel_tip": "Quiet and magical. Prepare for road closures. Great for those seeking peaceful winter landscapes."},
        12: {"season": "Winter", "typical_conditions": "Heavy snow, cold", "suitability": "good", "travel_tip": "Winter wonderland atmosphere. Ideal for snow activities. Book early as it gets popular."},
    },
    "rishikesh": {
        1:  {"season": "Winter", "typical_conditions": "Cold but clear, quiet season", "suitability": "good", "travel_tip": "Peaceful atmosphere. Yoga retreats and ashrams are excellent in winter. Carry warm clothes."},
        2:  {"season": "Winter", "typical_conditions": "Cold, but warming up through the month", "suitability": "good", "travel_tip": "International Yoga Festival in March approaches. Great time for wellness retreats."},
        3:  {"season": "Spring", "typical_conditions": "Pleasant, ideal for outdoor activities", "suitability": "good", "travel_tip": "Excellent for white-water rafting. Ganga Aarti is particularly beautiful in cool evenings."},
        4:  {"season": "Spring", "typical_conditions": "Warm and pleasant, good rafting conditions", "suitability": "good", "travel_tip": "Best month for adventure activities. River conditions ideal. Perfect weather overall."},
        5:  {"season": "Pre-Monsoon", "typical_conditions": "Getting hot, still manageable", "suitability": "good", "travel_tip": "Good for early morning yoga and meditation. Evenings are pleasant on the ghats."},
        6:  {"season": "Monsoon", "typical_conditions": "Rainfall, river levels rise", "suitability": "moderate", "travel_tip": "Rafting typically suspended for safety. Spiritual and wellness activities continue. Lush green surroundings."},
        7:  {"season": "Monsoon", "typical_conditions": "Heavy rain, river in spate", "suitability": "not_ideal", "travel_tip": "Avoid adventure sports. Focus on ashram experiences, meditation and spiritual activities."},
        8:  {"season": "Monsoon", "typical_conditions": "Continued heavy rain", "suitability": "not_ideal", "travel_tip": "Pilgrimage season — Kanwar Yatra makes Rishikesh very busy. Adventure activities largely unavailable."},
        9:  {"season": "Post-Monsoon", "typical_conditions": "Rain easing, rafting season opening", "suitability": "good", "travel_tip": "Rafting season restarts. Great weather for yoga and outdoor activities. Lush green landscapes."},
        10: {"season": "Autumn", "typical_conditions": "Excellent, comfortable temperatures", "suitability": "good", "travel_tip": "One of the best months. Clear skies, excellent Himalayan views, ideal rafting conditions."},
        11: {"season": "Autumn/Winter", "typical_conditions": "Getting cooler, clear and pleasant", "suitability": "good", "travel_tip": "Great for trekking and yoga. Fewer crowds compared to peak summer."},
        12: {"season": "Winter", "typical_conditions": "Cold, quiet, spiritual atmosphere", "suitability": "good", "travel_tip": "Excellent for spiritual retreats and yoga. Carry warm clothes. Evenings by the Ganga are magical."},
    },
    "kochi": {
        1:  {"season": "Winter", "typical_conditions": "Pleasant and dry — ideal conditions", "suitability": "good", "travel_tip": "Best time to visit. Comfortable temperatures, excellent for backwater cruises and city exploration."},
        2:  {"season": "Winter", "typical_conditions": "Warm, dry and sunny", "suitability": "good", "travel_tip": "Excellent weather. Thrissur Pooram approaches. Chinese fishing nets and Fort Kochi at their best."},
        3:  {"season": "Pre-Summer", "typical_conditions": "Getting warmer and more humid", "suitability": "good", "travel_tip": "Good time to visit before the heat builds. Explore Mattancherry and Jew Town."},
        4:  {"season": "Summer", "typical_conditions": "Hot and humid", "suitability": "moderate", "travel_tip": "Carry light clothes. Early morning sightseeing recommended. Beaches are still enjoyable."},
        5:  {"season": "Pre-Monsoon", "typical_conditions": "Very humid, pre-monsoon showers building", "suitability": "moderate", "travel_tip": "Vishu festival. Some rain beginning. Great for ayurvedic treatments as humidity is therapeutic."},
        6:  {"season": "Monsoon (SW)", "typical_conditions": "Heavy monsoon rainfall", "suitability": "not_ideal", "travel_tip": "Monsoon is spectacular in Kerala but transport is affected. Ayurvedic retreats thrive. Backwaters are beautiful."},
        7:  {"season": "Monsoon", "typical_conditions": "Continued heavy rain", "suitability": "moderate", "travel_tip": "Onam preparations begin. Lush green landscapes. Indoor cultural experiences are excellent."},
        8:  {"season": "Monsoon", "typical_conditions": "Heavy rain, reducing towards month end", "suitability": "moderate", "travel_tip": "Onam festival is a spectacular cultural experience — harvest celebrations, boat races, sadhya feasts."},
        9:  {"season": "Post-Monsoon (NE)", "typical_conditions": "Some showers but easing", "suitability": "good", "travel_tip": "Backwaters are lush and full. Excellent for houseboat cruises. Weather becoming more pleasant."},
        10: {"season": "Northeast Monsoon", "typical_conditions": "Some rainfall from northeast monsoon", "suitability": "moderate", "travel_tip": "Still some rain but warm. Generally manageable. Great for cultural exploration."},
        11: {"season": "Winter", "typical_conditions": "Pleasant, drying out", "suitability": "good", "travel_tip": "Good time to visit. Cochin Carnival approaches. Comfortable temperatures."},
        12: {"season": "Winter", "typical_conditions": "Best weather, Cochin Carnival", "suitability": "good", "travel_tip": "Peak tourist season. Cochin Carnival is spectacular. Book accommodation well in advance."},
    },
    "bengaluru": {
        1:  {"season": "Winter", "typical_conditions": "Pleasant and mild", "suitability": "good", "travel_tip": "Excellent weather. Bangalore's year-round pleasant climate is at its best."},
        2:  {"season": "Winter", "typical_conditions": "Mild and pleasant", "suitability": "good", "travel_tip": "Great time to explore parks, gardens and the city on foot."},
        3:  {"season": "Spring", "typical_conditions": "Warm with occasional showers", "suitability": "good", "travel_tip": "Lalbagh Botanical Garden is beautiful. Comfortable for all outdoor activities."},
        4:  {"season": "Pre-Summer", "typical_conditions": "Warm, occasional thunderstorms", "suitability": "good", "travel_tip": "Typical Bangalore weather. Afternoon thunderstorms are common but brief."},
        5:  {"season": "Early Monsoon", "typical_conditions": "Warm with increasing rainfall", "suitability": "good", "travel_tip": "Bengaluru handles rain well. Tech hub areas remain fully functional."},
        6:  {"season": "Monsoon", "typical_conditions": "Regular rainfall, pleasantly cool", "suitability": "good", "travel_tip": "Bengaluru's monsoon is mild compared to coastal cities. Good time to visit."},
        7:  {"season": "Monsoon", "typical_conditions": "Moderate rainfall, green and lush", "suitability": "good", "travel_tip": "City is beautiful and green. Carry an umbrella but weather is generally manageable."},
        8:  {"season": "Monsoon", "typical_conditions": "Moderate to heavy rainfall", "suitability": "good", "travel_tip": "Pleasant temperatures. Mysore Palace and Coorg day trips are spectacular in monsoon greenery."},
        9:  {"season": "Post-Monsoon", "typical_conditions": "Rains easing, pleasant weather", "suitability": "good", "travel_tip": "Excellent weather. Great time to explore the city and plan Coorg or Mysore trips."},
        10: {"season": "Autumn", "typical_conditions": "Some showers (northeast monsoon) but pleasant", "suitability": "good", "travel_tip": "Good time to visit. Diwali and Dasara (Mysore) celebrations are spectacular."},
        11: {"season": "Winter", "typical_conditions": "Pleasant and dry", "suitability": "good", "travel_tip": "Ideal weather. Comfortable for all activities including day trips to nearby destinations."},
        12: {"season": "Winter", "typical_conditions": "Cool and pleasant", "suitability": "good", "travel_tip": "Best time to visit. Pleasant temperatures all day. Great for outdoor events and festivals."},
    },
    "varanasi": {
        1:  {"season": "Winter", "typical_conditions": "Cold and foggy, misty ghats", "suitability": "good", "travel_tip": "The mist on the Ganga is ethereal. Ganga Aarti is particularly atmospheric. Carry warm clothes."},
        2:  {"season": "Winter", "typical_conditions": "Cold but brightening, good visibility", "suitability": "good", "travel_tip": "Excellent time to visit. Boat rides at sunrise are magical. Less foggy than January."},
        3:  {"season": "Spring", "typical_conditions": "Warm and pleasant", "suitability": "good", "travel_tip": "Maha Shivaratri and Holi are celebrated with exceptional fervour in Varanasi."},
        4:  {"season": "Pre-Summer", "typical_conditions": "Getting hot", "suitability": "good", "travel_tip": "Still manageable. Visit ghats early morning before the heat builds."},
        5:  {"season": "Summer", "typical_conditions": "Very hot and dry", "suitability": "moderate", "travel_tip": "Intense heat. Plan all outdoor activities before 9am. Focus on indoor temple visits and cultural experiences."},
        6:  {"season": "Pre-Monsoon", "typical_conditions": "Hot with some early rains", "suitability": "moderate", "travel_tip": "River level begins to rise. Some relief from heat with occasional rain. Carry an umbrella."},
        7:  {"season": "Monsoon", "typical_conditions": "Heavy rainfall, river level rises significantly", "suitability": "moderate", "travel_tip": "Ghats may be partially submerged. Boat rides give a unique perspective. Carry rain protection."},
        8:  {"season": "Monsoon", "typical_conditions": "Continued heavy rain, flooded ghats", "suitability": "moderate", "travel_tip": "Ganga Mahotsav builds towards season. Lower ghats may be inaccessible. Atmospheric and spiritual experience."},
        9:  {"season": "Post-Monsoon", "typical_conditions": "Rains easing, river levels reducing", "suitability": "good", "travel_tip": "Good time to visit. Pitru Paksha (ancestor memorial rituals) make this a uniquely spiritual time."},
        10: {"season": "Autumn", "typical_conditions": "Pleasant and dry", "suitability": "good", "travel_tip": "Excellent weather. Dev Deepawali in November — when ghats are lit with hundreds of thousands of lamps — is unmissable."},
        11: {"season": "Autumn/Winter", "typical_conditions": "Getting cooler, beautiful crisp weather", "suitability": "good", "travel_tip": "Dev Deepawali (full moon in November) is one of India's most spectacular events. Book early."},
        12: {"season": "Winter", "typical_conditions": "Cold, atmospheric misty mornings", "suitability": "good", "travel_tip": "Peak season. Misty Ganga mornings are iconic. Carry warm clothes. Boat rides at sunrise are exceptional."},
    },
}

# City name normalisation — maps alternate names to the canonical key
_CITY_ALIASES = {
    "new delhi": "delhi",
    "old delhi": "delhi",
    "chandni chowk": "delhi",
    "connaught place": "delhi",
    "bengaluru": "bengaluru",
    "bangalore": "bengaluru",
    "cochin": "kochi",
    "alleppey": "kochi",
    "alappuzha": "kochi",
    "mysore": "bengaluru",
    "mysuru": "bengaluru",
}

_FALLBACK = {
    "season": "Unknown",
    "typical_conditions": "Seasonal conditions data not available.",
    "suitability": "moderate",
    "travel_tip": "Please check local conditions before travelling.",
}


def get_seasonal_conditions(city_name: str, month: int) -> dict:
    """
    Return seasonal conditions for a city and month.
    Falls back gracefully — never raises an exception for missing data.
    """
    if not city_name or not isinstance(month, int) or not (1 <= month <= 12):
        return _FALLBACK.copy()

    key = city_name.lower().strip()

    # Resolve alias
    canonical = _CITY_ALIASES.get(key, key)

    # Check static data
    city_data = _SEASONAL_DATA.get(canonical)
    if city_data and month in city_data:
        return city_data[month].copy()

    return _FALLBACK.copy()
