import { MuscleGroup } from "@/pages/Exercises";
import { motion } from "framer-motion";
import bodyFront from "@/assets/body-front.png";
import bodyBack from "@/assets/body-back.png";

const triggerHapticFeedback = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(10);
  }
};

interface MuscleMapProps {
  view: "front" | "back";
  selectedMuscle: MuscleGroup | null;
  onMuscleSelect: (muscle: MuscleGroup) => void;
}

interface MuscleLabel {
  name: string;
  muscle: MuscleGroup;
  side: "left" | "right";
  top: string;
  lineWidth?: number;
}

const frontLabels: MuscleLabel[] = [
  { name: "Ombros", muscle: "ombros", side: "left", top: "18%", lineWidth: 50 },
  { name: "Bíceps", muscle: "biceps", side: "left", top: "32%", lineWidth: 40 },
  { name: "Oblíquos", muscle: "obliquos", side: "left", top: "46%", lineWidth: 45 },
  { name: "Abdutores", muscle: "abdutores", side: "left", top: "60%", lineWidth: 50 },
  { name: "Quadríceps", muscle: "quadriceps", side: "left", top: "74%", lineWidth: 55 },
  { name: "Peitoral", muscle: "peitoral", side: "right", top: "22%", lineWidth: 55 },
  { name: "Abdômen", muscle: "abdomen", side: "right", top: "38%", lineWidth: 50 },
  { name: "Antebraços", muscle: "antebracos", side: "right", top: "52%", lineWidth: 35 },
  { name: "Adutores", muscle: "adutores", side: "right", top: "66%", lineWidth: 50 },
  { name: "Cardio", muscle: "cardio", side: "right", top: "80%", lineWidth: 60 },
];

const backLabels: MuscleLabel[] = [
  { name: "Trapézio", muscle: "trapezio", side: "right", top: "16%", lineWidth: 50 },
  { name: "Tríceps", muscle: "triceps", side: "left", top: "30%", lineWidth: 40 },
  { name: "Dorsais", muscle: "dorsais", side: "right", top: "32%", lineWidth: 45 },
  { name: "Lombares", muscle: "lombares", side: "left", top: "46%", lineWidth: 50 },
  { name: "Glúteos", muscle: "gluteos", side: "right", top: "52%", lineWidth: 55 },
  { name: "Isquiotibiais", muscle: "isquiotibiais", side: "left", top: "66%", lineWidth: 50 },
  { name: "Cardio", muscle: "cardio", side: "right", top: "70%", lineWidth: 60 },
  { name: "Panturrilhas", muscle: "panturrilhas", side: "left", top: "84%", lineWidth: 55 },
];

export function MuscleMap({ view, selectedMuscle, onMuscleSelect }: MuscleMapProps) {
  const labels = view === "front" ? frontLabels : backLabels;

  return (
    <div className="relative w-full flex items-center justify-center py-8">
      {/* Container with fixed max-width for consistent sizing */}
      <div className="relative w-full max-w-[600px] flex items-center justify-center">
        {/* Body Image - Centered */}
        <div className="relative flex items-center justify-center transition-all duration-300 ease-in-out">
          <img
            src={view === "front" ? bodyFront : bodyBack}
            alt={view === "front" ? "Vista frontal do corpo" : "Vista traseira do corpo"}
            className="w-[85vw] max-w-[320px] sm:w-[280px] md:w-[320px] h-auto object-contain transition-opacity duration-300"
            style={{ maxHeight: "600px" }}
          />
        </div>

        {/* Muscle Labels - Positioned absolutely */}
        <div className="absolute inset-0 pointer-events-none">
          {labels.map((label, index) => (
            <motion.div
              key={label.muscle}
              initial={{ opacity: 0, x: label.side === "left" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`absolute pointer-events-auto ${
                label.side === "left" ? "left-0" : "right-0"
              } cursor-pointer group`}
              style={{ top: label.top }}
              onClick={() => {
                triggerHapticFeedback();
                onMuscleSelect(label.muscle);
              }}
            >
              {/* Label Container */}
              <motion.div 
                className={`flex items-center ${label.side === "left" ? "flex-row" : "flex-row-reverse"} gap-1`}
                whileTap={{ 
                  scale: 1.1,
                  transition: { duration: 0.1 }
                }}
              >
                {/* Label Text */}
                <motion.div
                  className={`text-sm font-medium px-2 py-1 whitespace-nowrap rounded-md ${
                    label.side === "left" ? "text-left" : "text-right"
                  } ${
                    selectedMuscle === label.muscle
                      ? "font-bold text-primary bg-primary/10"
                      : "text-foreground group-hover:font-semibold group-hover:text-primary"
                  } transition-all duration-200`}
                  animate={selectedMuscle === label.muscle ? {
                    scale: [1, 1.05, 1],
                    transition: { duration: 0.3 }
                  } : {}}
                >
                  {label.name}
                </motion.div>

                {/* Connector Line and Point */}
                <div className="relative flex items-center">
                  <motion.div
                    className={`h-[1px] ${
                      selectedMuscle === label.muscle ? "bg-primary" : "bg-muted-foreground group-hover:bg-primary"
                    } transition-colors duration-200`}
                    style={{ width: `${label.lineWidth || 40}px` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                  />
                  <motion.div
                    className={`w-2 h-2 rounded-full ${
                      selectedMuscle === label.muscle ? "bg-primary" : "bg-muted-foreground group-hover:bg-primary"
                    } transition-colors duration-200`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.3, duration: 0.2 }}
                    whileTap={{ scale: 1.5 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
