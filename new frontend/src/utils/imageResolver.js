export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop";

// ─── New State-Wise Local Asset Library ───────────────────────────────────────
// State → representative image (used when only state is known)
const STATE_REPRESENTATIVE = {
  "karnataka":     "/image/Images/karnataka/Mysore Palace.jpg",
  "kerala":        "/image/Images/kerla/Fort Kochi & Chinese Fishing Nets.jpg",
  "maharashtra":   "/image/Images/maharashtra/gate of india.jpg",
  "rajasthan":     "/image/Images/rajesthan/Hawa Mahal.jpg",
  "tamil nadu":    "/image/Images/tamil nadu/Marina Beach.jpg",
  "uttar pradesh": "/image/Images/uttar pradesh/Taj Mahal.jpg",
};

function normaliseState(state) {
  if (!state) return null;
  const s = state.toLowerCase().trim();
  if (s.includes("kerala") || s === "kerla") return "kerala";
  if (s.includes("rajasthan") || s === "rajesthan") return "rajasthan";
  if (s.includes("karnataka")) return "karnataka";
  if (s.includes("maharashtra")) return "maharashtra";
  if (s.includes("tamil") && s.includes("nadu")) return "tamil nadu";
  if (s.includes("uttar") && s.includes("pradesh")) return "uttar pradesh";
  return null;
}

// ─── City-Specific Image Map ──────────────────────────────────────────────────
// Keys MUST be lowercase. Each city gets a UNIQUE image.
const CITY_IMAGE_MAP = {

  // ── Uttar Pradesh (local assets) ──────────────────────────────────────────
  "agra":         "/image/Images/uttar pradesh/Taj Mahal.jpg",
  "varanasi":     "/image/Images/uttar pradesh/Dashashwamedh Ghat.jpg",
  "lucknow":      "/image/Images/uttar pradesh/Bara Imambara.jpg",
  "vrindavan":    "/image/Images/uttar pradesh/Kashi Vishwanath Temple.jpg",
  "mathura":      "/image/Images/uttar pradesh/Agra Fort.jpg",
  "ayodhya":      "/image/Images/uttar pradesh/e40118b51e95b5130251019cdce8cd00.jpg",
  "prayagraj":    "/image/Images/uttar pradesh/Blue Lassi Shop.jpg",
  "allahabad":    "/image/Images/uttar pradesh/Blue Lassi Shop.jpg",
  "kushinagar":   "/image/Images/uttar pradesh/Kashi Vishwanath Temple.jpg",
  "jhansi":       "/image/Images/uttar pradesh/Agra Fort.jpg",

  // ── Rajasthan (local assets) ───────────────────────────────────────────────
  "jaipur":       "/image/Images/rajesthan/Hawa Mahal.jpg",
  "udaipur":      "/image/Images/rajesthan/City Palace Udaipur.jpg",
  "jodhpur":      "/image/Images/rajesthan/Mehrangarh Fort.jpg",
  "jaisalmer":    "/image/Images/rajesthan/Amber Fort.jpg",
  "bikaner":      "/image/Images/rajesthan/Laxmi Misthan Bhandar.jpg",
  "pushkar":      "/image/Images/rajesthan/Lake Pichola.jpg",
  "ajmer":        "/image/Images/rajesthan/Amber Fort.jpg",
  "chittorgarh":  "/image/Images/rajesthan/Mehrangarh Fort.jpg",
  "mount abu":    "/image/Images/rajesthan/Lake Pichola.jpg",

  // ── Karnataka (local assets) ───────────────────────────────────────────────
  "bangalore":    "/image/Images/karnataka/Bangalore Palace.jpg",
  "bengaluru":    "/image/Images/karnataka/Bangalore Palace.jpg",
  "mysore":       "/image/Images/karnataka/Mysore Palace.jpg",
  "mysuru":       "/image/Images/karnataka/Mysore Palace.jpg",
  "coorg":        "/image/Images/karnataka/Abbey Falls.jpg",
  "chikmagalur":  "/image/Images/karnataka/Lalbagh Botanical Garden.jpg",
  "hampi":        "/image/Images/karnataka/Chamundi Hills.jpg",
  "udupi":        "/image/Images/karnataka/MTR (Mavalli Tiffin Room).jpg",
  "badami":       "/image/Images/karnataka/Chamundi Hills.jpg",
  "vijayapura":   "/image/Images/karnataka/Lalbagh Botanical Garden.jpg",
  "hubli":        "/image/Images/karnataka/Abbey Falls.jpg",

  // ── Kerala (local assets) ──────────────────────────────────────────────────
  "kochi":        "/image/Images/kerla/Fort Kochi & Chinese Fishing Nets.jpg",
  "cochin":       "/image/Images/kerla/Fort Kochi & Chinese Fishing Nets.jpg",
  "munnar":       "/image/Images/kerla/Munnar Tea Gardens.jpg",
  "alleppey":     "/image/Images/kerla/Alleppey Backwaters Houseboat.jpg",
  "alappuzha":    "/image/Images/kerla/Alleppey Backwaters Houseboat.jpg",
  "kumarakom":    "/image/Images/kerla/Kumarakom Bird Sanctuary.jpg",
  "wayanad":      "/image/Images/kerla/Eravikulam National Park.jpg",
  "thekkady":     "/image/Images/kerla/Eravikulam National Park.jpg",
  "kozhikode":    "/image/Images/kerla/Kayees Rahmathulla Cafe.jpg",
  "thrissur":     "/image/Images/kerla/Mattancherry Palace.jpg",
  "varkala":      "/image/Images/kerla/Fort Kochi & Chinese Fishing Nets.jpg",
  "kovalam":      "/image/Images/kerla/Alleppey Backwaters Houseboat.jpg",

  // ── Maharashtra (local assets) ─────────────────────────────────────────────
  "mumbai":       "/image/Images/maharashtra/gate of india.jpg",
  "pune":         "/image/Images/maharashtra/shaniwar wada.jpg",
  "nashik":       "/image/Images/maharashtra/Sula Vineyards.jpg",
  "aurangabad":   "/image/Images/maharashtra/Sinhagad Fort viewpoint.jpg",
  "lonavala":     "/image/Images/maharashtra/Sinhagad Fort viewpoint.jpg",
  "mahabaleshwar":"/image/Images/maharashtra/Vaishali.jpg",
  "kolhapur":     "/image/Images/maharashtra/sidhi vinayk.jpg",
  "alibaug":      "/image/Images/maharashtra/bademiya.jpg",
  "nagpur":       "/image/Images/maharashtra/Vaishali.jpg",

  // ── Tamil Nadu (local assets) ──────────────────────────────────────────────
  "chennai":      "/image/Images/tamil nadu/Marina Beach.jpg",
  "madurai":      "/image/Images/tamil nadu/Meenakshi Amman Temple.jpg",
  "ooty":         "/image/Images/tamil nadu/Ooty Botanical Garden.jpg",
  "udhagamandalam":"/image/Images/tamil nadu/Doddabetta Peak.png",
  "coimbatore":   "/image/Images/tamil nadu/Murugan Idli Shop.jpg",
  "thanjavur":    "/image/Images/tamil nadu/Kapaleeshwarar Temple.jpg",
  "kanyakumari":  "/image/Images/tamil nadu/Nahar's Nilgiris Bakery.jpg",
  "rameswaram":   "/image/Images/tamil nadu/Meenakshi Amman Temple.jpg",
  "mahabalipuram":"/image/Images/tamil nadu/Kapaleeshwarar Temple.jpg",
  "kodaikanal":   "/image/Images/tamil nadu/Doddabetta Peak.png",

  // ── Goa (local) ────────────────────────────────────────────────────────────
  "goa":          "/image/GOA1.jpg",
  "goaa":         "/image/GOA1.jpg",
  "old goa":      "/image/GOA1.jpg",
  "panaji":       "/image/GOA1.jpg",
  "margao":       "/image/GOA1.jpg",
  "calangute":    "/image/GOA1.jpg",
  "baga":         "/image/GOA1.jpg",
  "anjuna":       "/image/GOA1.jpg",
  "candolim":     "/image/GOA1.jpg",
  "palolem":      "/image/GOA1.jpg",
  "vasco da gama":"/image/GOA1.jpg",
  "gokarna":      "/image/GOA1.jpg",

  // ── Ladakh (local) ─────────────────────────────────────────────────────────
  "leh":          "/image/ladak 1.jpg",
  "ladakh":       "/image/LADAK2.jpg",

  // ── Delhi NCT — each gets a UNIQUE Unsplash image ─────────────────────────
  "delhi":           "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop", // India Gate
  "new delhi":       "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop", // India Gate
  "old delhi":       "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",   // Jama Masjid
  "chandni chowk":   "https://images.unsplash.com/photo-1582721478779-0ae163c05a60?q=80&w=800&auto=format&fit=crop", // Chandni Chowk street
  "connaught place":  "https://images.unsplash.com/photo-1526711657229-e7e080ed7aa1?q=80&w=800&auto=format&fit=crop", // CP roundabout
  "dwarka":           "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop", // Dwarka temple
  "gurugram (ncr)":   "https://images.unsplash.com/photo-1623043453741-19f1044af022?q=80&w=800&auto=format&fit=crop", // Gurugram skyline
  "gurugram":         "https://images.unsplash.com/photo-1623043453741-19f1044af022?q=80&w=800&auto=format&fit=crop",
  "noida (ncr)":      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop", // Noida cityscape
  "noida":            "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop",
  "faridabad (ncr)":  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop", // city street
  "faridabad":        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
  "south delhi (hauz khas)":"https://images.unsplash.com/photo-1526711657229-e7e080ed7aa1?q=80&w=800&auto=format&fit=crop",
  "connaught place":  "https://images.unsplash.com/photo-1526711657229-e7e080ed7aa1?q=80&w=800&auto=format&fit=crop",

  // ── Himachal Pradesh ───────────────────────────────────────────────────────
  "manali":      "https://images.unsplash.com/photo-1536012483689-64c7e4783952?q=80&w=800&auto=format&fit=crop",
  "shimla":      "https://images.unsplash.com/photo-1597075287290-9a4e3ae5a9f1?q=80&w=800&auto=format&fit=crop",
  "dharamshala": "https://images.unsplash.com/photo-1605649487212-4d4ce38290f6?q=80&w=800&auto=format&fit=crop",
  "dalhousie":   "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
  "kasol":       "https://images.unsplash.com/photo-1566837497312-7be4a627f576?q=80&w=800&auto=format&fit=crop",
  "kullu":       "https://images.unsplash.com/photo-1536012483689-64c7e4783952?q=80&w=800&auto=format&fit=crop",
  "spiti valley":"https://images.unsplash.com/photo-1566837497312-7be4a627f576?q=80&w=800&auto=format&fit=crop",
  "chail":       "https://images.unsplash.com/photo-1597075287290-9a4e3ae5a9f1?q=80&w=800&auto=format&fit=crop",
  "bir billing": "https://images.unsplash.com/photo-1566837497312-7be4a627f576?q=80&w=800&auto=format&fit=crop",

  // ── Uttarakhand ───────────────────────────────────────────────────────────
  "rishikesh":   "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop",
  "haridwar":    "https://images.unsplash.com/photo-1610053012874-1a15e1dad2a3?q=80&w=800&auto=format&fit=crop",
  "nainital":    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
  "mussoorie":   "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
  "dehradun":    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
  "auli":        "https://images.unsplash.com/photo-1566837497312-7be4a627f576?q=80&w=800&auto=format&fit=crop",
  "ranikhet":    "https://images.unsplash.com/photo-1536012483689-64c7e4783952?q=80&w=800&auto=format&fit=crop",
  "kausani":     "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
  "ramnagar (jim corbett)":"https://images.unsplash.com/photo-1568574643881-30dae949e66f?q=80&w=800&auto=format&fit=crop",

  // ── Jammu & Kashmir ───────────────────────────────────────────────────────
  "kashmir":     "https://images.unsplash.com/photo-1566837497312-7be4a627f576?q=80&w=800&auto=format&fit=crop",
  "srinagar":    "https://images.unsplash.com/photo-1566837497312-7be4a627f576?q=80&w=800&auto=format&fit=crop",
  "gulmarg":     "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
  "pahalgam":    "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",

  // ── Punjab ────────────────────────────────────────────────────────────────
  "amritsar":    "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800&auto=format&fit=crop",
  "chandigarh":  "https://images.unsplash.com/photo-1585016495481-91613e005b40?q=80&w=800&auto=format&fit=crop",
  "ludhiana":    "https://images.unsplash.com/photo-1573829605778-e307d67e3d5b?q=80&w=800&auto=format&fit=crop",
  "jalandhar":   "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800&auto=format&fit=crop",
  "patiala":     "https://images.unsplash.com/photo-1585016495481-91613e005b40?q=80&w=800&auto=format&fit=crop",
  "kapurthala":  "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800&auto=format&fit=crop",
  "bathinda":    "https://images.unsplash.com/photo-1573829605778-e307d67e3d5b?q=80&w=800&auto=format&fit=crop",
  "pathankot":   "https://images.unsplash.com/photo-1605649487212-4d4ce38290f6?q=80&w=800&auto=format&fit=crop",
  "anandpur sahib":"https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=800&auto=format&fit=crop",

  // ── West Bengal ───────────────────────────────────────────────────────────
  "kolkata":     "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800&auto=format&fit=crop",
  "darjeeling":  "https://images.unsplash.com/photo-1605649487212-4d4ce38290f6?q=80&w=800&auto=format&fit=crop",
  "siliguri":    "https://images.unsplash.com/photo-1568574643881-30dae949e66f?q=80&w=800&auto=format&fit=crop",
  "murshidabad": "https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800&auto=format&fit=crop",
  "shantiniketan":"https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=800&auto=format&fit=crop",
  "sundarbans":  "https://images.unsplash.com/photo-1568574643881-30dae949e66f?q=80&w=800&auto=format&fit=crop",
  "digha":       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
  "mirik":       "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
  "kalimpong":   "https://images.unsplash.com/photo-1605649487212-4d4ce38290f6?q=80&w=800&auto=format&fit=crop",

  // ── Hyderabad / Telangana ─────────────────────────────────────────────────
  "hyderabad":   "https://images.unsplash.com/photo-1605043702213-9db5b0b8b74c?q=80&w=800&auto=format&fit=crop",

  // ── Gujarat ───────────────────────────────────────────────────────────────
  "ahmedabad":   "https://images.unsplash.com/photo-1609240873034-9fe72c9a78d4?q=80&w=800&auto=format&fit=crop",
  "surat":       "https://images.unsplash.com/photo-1609240873034-9fe72c9a78d4?q=80&w=800&auto=format&fit=crop",
  "dwarka":      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop",

  // ── Odisha ────────────────────────────────────────────────────────────────
  "bhubaneswar": "https://images.unsplash.com/photo-1590076085467-9ab810d05a88?q=80&w=800&auto=format&fit=crop",
  "puri":        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
  "konark":      "https://images.unsplash.com/photo-1590076085467-9ab810d05a88?q=80&w=800&auto=format&fit=crop",
};

// ─── Main resolver ─────────────────────────────────────────────────────────────
// Priority: city-exact → city-partial → state-representative → fallback
export function resolveCityImage(cityName, stateName) {
  if (!cityName) return FALLBACK_IMAGE;

  const key = cityName.toLowerCase().trim();

  // 1. Exact city match
  if (CITY_IMAGE_MAP[key]) return CITY_IMAGE_MAP[key];

  // 2. Partial city match (city name contains map key or vice versa)
  const partial = Object.keys(CITY_IMAGE_MAP).find(
    k => key.includes(k) || k.includes(key)
  );
  if (partial) return CITY_IMAGE_MAP[partial];

  // 3. State-representative image
  if (stateName) {
    const stateKey = normaliseState(stateName);
    if (stateKey && STATE_REPRESENTATIVE[stateKey]) return STATE_REPRESENTATIVE[stateKey];
  }

  // 4. Final fallback
  return FALLBACK_IMAGE;
}
