import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const Countdown = () => {
  const targetDate = new Date("2026-06-11T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {timeUnits.map((unit) => (
        <Card key={unit.label} className="p-3 text-center bg-gradient-to-br from-card to-muted/50 border-2 hover:border-accent transition-all hover:scale-105">
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {unit.value}
          </div>
          <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
            {unit.label}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Countdown;
