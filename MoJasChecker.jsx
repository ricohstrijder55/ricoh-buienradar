import { useEffect, useMemo, useState } from "react";

const moImage = "https://imgur.com/a/y8lvVp0";

function getAdvice({ temperature, rain, wind }) {
  const feelsCold = temperature < 15;
  const isRainy = rain > 0.2;
  const isWindy = wind >= 25;

  if (isRainy && feelsCold) {
    return {
      answer: "JA",
      badge: "Mo ziet nattigheid",
      reason: "Mo zegt: regen én fris. Jas aan, geen discussie.",
    };
  }

  if (isRainy) {
    return {
      answer: "JA",
      badge: "Regenalarm",
      reason: "Mo zegt: het kan prima zacht zijn, maar nat is ook irritant. Jas mee.",
    };
  }

  if (feelsCold) {
    return {
      answer: "JA",
      badge: "Frisse bedoeling",
      reason: "Mo zegt: dit is gewoon jasweer. Straks krijg je spijt op de heenweg.",
    };
  }

  if (isWindy) {
    return {
      answer: "JA",
      badge: "Winderige taferelen",
      reason: "Mo zegt: temperatuur lijkt leuk, maar die wind gaat je foppen. Jas aan.",
    };
  }

  return {
    answer: "NEE",
    badge: "Prima supermarktweer",
    reason: "Mo zegt: dit kan prima zonder jas. Niet moeilijk doen en gaan.",
  };
}

export default function MoJasChecker() {
  const [weather, setWeather] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationLabel, setLocationLabel] = useState("Standaard: Nederland");

  async function loadWeather() {
    setLoading(true);
    setError("");

    try {
      const latitude = 52.13;
      const longitude = 5.29;
      setLocationLabel("Standaard: Nederland");

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m&timezone=auto`
      );

      if (!response.ok) {
        throw new Error("Weer ophalen mislukt");
      }

      const data = await response.json();
      const current = data.current;

      const nextWeather = {
        temperature: current.temperature_2m,
        rain: current.precipitation,
        wind: current.wind_speed_10m,
      };

      setWeather(nextWeather);
      setResult(getAdvice(nextWeather));
    } catch (err) {
      setError("Mo kon het weer niet laden. Probeer het zo nog een keer.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather();
  }, []);

  const answerStyle = useMemo(() => {
    if (!result) return "bg-white/5 border-white/10 text-white";

    return result.answer === "JA"
      ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
      : "bg-sky-500/15 border-sky-400/30 text-sky-300";
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-6 relative">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="border-b border-white/10 bg-white/5 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50 mb-1">Mo Weerbericht</p>
            <h1 className="text-2xl md:text-3xl font-black">Moet je vandaag een jas aan?</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {locationLabel}
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="flex flex-col items-center">
            <img
              src={moImage}
              alt="Mo presenteert het jasadvies"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white/20 shadow-xl"
            />
            <p className="mt-4 text-lg md:text-xl font-bold">Mo</p>
            <p className="text-white/60 text-sm">De Piet Paulusma van het boodschappentraject</p>
          </div>

          <div className={`mt-8 rounded-3xl border px-6 py-8 ${answerStyle}`}>
            {loading ? (
              <>
                <p className="text-xs uppercase tracking-[0.35em] opacity-70 mb-3">Weer wordt geladen</p>
                <div className="text-4xl md:text-5xl font-black leading-none">Even wachten...</div>
                <p className="mt-4 text-base md:text-lg text-white/85 max-w-xl mx-auto">
                  Mo checkt het weer in Nederland om te bepalen of jij een jas nodig hebt.
                </p>
              </>
            ) : error ? (
              <>
                <p className="text-xs uppercase tracking-[0.35em] opacity-70 mb-3">Mo is chagrijnig</p>
                <div className="text-3xl md:text-4xl font-black leading-none">Geen advies</div>
                <p className="mt-4 text-base md:text-lg text-white/85 max-w-xl mx-auto">{error}</p>
              </>
            ) : result ? (
              <>
                <p className="text-xs uppercase tracking-[0.35em] opacity-70 mb-3">{result.badge}</p>
                <div className="text-6xl md:text-8xl font-black leading-none">{result.answer}</div>
                <p className="mt-4 text-base md:text-lg text-white/85 max-w-xl mx-auto">{result.reason}</p>
                {weather && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-white/80">
                    <div className="rounded-2xl bg-black/20 px-4 py-3">🌡️ {weather.temperature}°C</div>
                    <div className="rounded-2xl bg-black/20 px-4 py-3">🌧️ {weather.rain} mm</div>
                    <div className="rounded-2xl bg-black/20 px-4 py-3">💨 {weather.wind} km/u</div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          <button
            onClick={loadWeather}
            className="mt-8 rounded-2xl px-6 py-3 bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Check opnieuw met Nederlands weer
          </button>

          <p className="mt-6 text-sm text-white/45">
            Mo gebruikt nu standaard Nederlands weer, zonder locatie-toegang of adminrechten.
          </p>
        </div>
      </div>
    </div>
  );
}
