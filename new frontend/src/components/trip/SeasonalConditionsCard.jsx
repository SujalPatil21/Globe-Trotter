import { useState, useEffect, useRef, useMemo } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { masterApi } from '../../api';

function SeasonIcon({ season, className }) {
  const s = (season || '').toLowerCase();
  if (s.includes('winter') || s.includes('snow')) return <Snowflake className={className} />;
  if (s.includes('monsoon') || s.includes('rain')) return <CloudRain className={className} />;
  if (s.includes('summer')) return <Thermometer className={className} />;
  if (s.includes('spring') || s.includes('post') || s.includes('autumn')) return <Wind className={className} />;
  if (s.includes('good') || s.includes('pleasant')) return <Sun className={className} />;
  return <Cloud className={className} />;
}

const SUITABILITY_CONFIG = {
  good: {
    label: 'GOOD CONDITIONS',
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  moderate: {
    label: 'MODERATE CONDITIONS',
    icon: Info,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  not_ideal: {
    label: 'NOT IDEAL',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
};

export default function SeasonalConditionsCard({ cityName, cityId, travelDate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const cacheRef = useRef({});

  // Extract month from travel date
  const dateObj = travelDate ? new Date(travelDate + 'T00:00:00') : null;
  const month = dateObj ? dateObj.getMonth() + 1 : null;
  
  const monthName = useMemo(() => {
    return dateObj ? dateObj.toLocaleString('en-US', { month: 'long' }) : '';
  }, [dateObj]);

  useEffect(() => {
    if (!cityId || !month) return;

    const cacheKey = `${cityId}-${month}`;
    if (cacheRef.current[cacheKey]) {
      setData(cacheRef.current[cacheKey]);
      return;
    }

    setLoading(true);
    setError(false);
    masterApi.getSeasonalConditions(cityId, month)
      .then(res => {
        cacheRef.current[cacheKey] = res;
        setData(res);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cityId, month]);

  if (!cityId || !month) return null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-charcoal/5 border border-charcoal/5 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-charcoal/40 mb-1">
          Typical Seasonal Conditions
        </h3>
        <p className="font-display text-2xl font-bold text-charcoal">
          {cityName}
        </p>
        <p className="text-charcoal/60 font-medium">
          {monthName}
        </p>
      </div>

      <div className="flex-grow flex flex-col">
        {loading && (
          <div className="space-y-4 animate-pulse mt-4">
            <div className="h-4 bg-charcoal/5 rounded-full w-1/3" />
            <div className="h-3 bg-charcoal/5 rounded-full w-full" />
            <div className="h-3 bg-charcoal/5 rounded-full w-4/5" />
          </div>
        )}

        {error && !loading && (
          <div className="mt-4 text-charcoal/50 text-sm font-medium">
            Seasonal conditions data unavailable.<br /><br />
            Please check local conditions before travelling.
          </div>
        )}

        {data && !loading && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <SeasonIcon season={data.season} className="w-5 h-5 text-charcoal" />
              <p className="font-bold text-lg text-charcoal">{data.season}</p>
            </div>
            
            <p className="text-charcoal/80 font-medium leading-relaxed mb-6">
              {data.typical_conditions}
            </p>

            {data.suitability && SUITABILITY_CONFIG[data.suitability] && (
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider border ${SUITABILITY_CONFIG[data.suitability].bg} ${SUITABILITY_CONFIG[data.suitability].color} ${SUITABILITY_CONFIG[data.suitability].border}`}>
                  {SUITABILITY_CONFIG[data.suitability].label}
                </span>
              </div>
            )}

            {data.travel_tip && (
              <div className="mt-auto pt-6 border-t border-charcoal/10">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal/40 mb-2">
                  Travel Tip
                </p>
                <p className="text-sm text-charcoal/70 font-medium leading-relaxed">
                  {data.travel_tip}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
