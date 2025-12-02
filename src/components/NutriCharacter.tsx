import { motion, AnimatePresence } from 'framer-motion';

export type CharacterMood = 'neutral' | 'happy' | 'sad' | 'thinking' | 'excited' | 'angry' | 'crying' | 'serious';
export type CharacterState = 'sleeping' | 'awake' | 'speaking' | 'listening';

interface NutriCharacterProps {
  isActive: boolean;
  isSpeaking: boolean;
  mood: CharacterMood;
  size?: number;
}

const NutriCharacter = ({ isActive, isSpeaking, mood, size = 150 }: NutriCharacterProps) => {
  // Eye shapes based on mood and state
  const getEyeContent = () => {
    if (!isActive) {
      // Sleeping - closed arc eyes
      return (
        <>
          <path d="M75 95 Q85 88 95 95" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M125 95 Q135 88 145 95" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }

    // Eye expressions based on mood
    switch (mood) {
      case 'happy':
      case 'excited':
        return (
          <>
            {/* Happy eyes - U shaped */}
            <path d="M70 95 Q82 82 95 95" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M125 95 Q137 82 150 95" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case 'sad':
      case 'crying':
        return (
          <>
            {/* Sad eyes */}
            <ellipse cx="82" cy="92" rx="12" ry="14" fill="white" />
            <ellipse cx="138" cy="92" rx="12" ry="14" fill="white" />
            <circle cx="82" cy="94" r="8" fill="#1a1a2e" />
            <circle cx="138" cy="94" r="8" fill="#1a1a2e" />
            <circle cx="84" cy="92" r="3" fill="white" />
            <circle cx="140" cy="92" r="3" fill="white" />
            {/* Sad eyebrows */}
            <path d="M68 78 L96 85" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
            <path d="M152 78 L124 85" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
            {mood === 'crying' && (
              <>
                <motion.ellipse
                  cx="75"
                  cy="110"
                  rx="3"
                  ry="6"
                  fill="#87CEEB"
                  animate={{ y: [0, 20], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.5 }}
                />
                <motion.ellipse
                  cx="145"
                  cy="110"
                  rx="3"
                  ry="6"
                  fill="#87CEEB"
                  animate={{ y: [0, 20], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.3, repeatDelay: 0.5 }}
                />
              </>
            )}
          </>
        );
      case 'angry':
        return (
          <>
            {/* Angry eyes */}
            <ellipse cx="82" cy="92" rx="12" ry="14" fill="white" />
            <ellipse cx="138" cy="92" rx="12" ry="14" fill="white" />
            <circle cx="82" cy="94" r="8" fill="#1a1a2e" />
            <circle cx="138" cy="94" r="8" fill="#1a1a2e" />
            <circle cx="84" cy="92" r="3" fill="white" />
            <circle cx="140" cy="92" r="3" fill="white" />
            {/* Angry eyebrows - V shape */}
            <path d="M68 82 L96 88" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />
            <path d="M152 82 L124 88" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Thinking eyes - looking up */}
            <ellipse cx="82" cy="92" rx="12" ry="14" fill="white" />
            <ellipse cx="138" cy="92" rx="12" ry="14" fill="white" />
            <circle cx="85" cy="88" r="8" fill="#1a1a2e" />
            <circle cx="141" cy="88" r="8" fill="#1a1a2e" />
            <circle cx="87" cy="86" r="3" fill="white" />
            <circle cx="143" cy="86" r="3" fill="white" />
          </>
        );
      case 'serious':
        return (
          <>
            {/* Serious eyes - half-lidded */}
            <ellipse cx="82" cy="94" rx="12" ry="10" fill="white" />
            <ellipse cx="138" cy="94" rx="12" ry="10" fill="white" />
            <circle cx="82" cy="94" r="7" fill="#1a1a2e" />
            <circle cx="138" cy="94" r="7" fill="#1a1a2e" />
            <circle cx="84" cy="92" r="2" fill="white" />
            <circle cx="140" cy="92" r="2" fill="white" />
            {/* Flat eyebrows */}
            <path d="M68 82 L96 82" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
            <path d="M124 82 L152 82" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      default:
        // Normal/neutral eyes - large anime style
        return (
          <>
            {/* Eye whites */}
            <ellipse cx="82" cy="92" rx="14" ry="16" fill="white" />
            <ellipse cx="138" cy="92" rx="14" ry="16" fill="white" />
            {/* Pupils */}
            <circle cx="82" cy="94" r="10" fill="#1a1a2e" />
            <circle cx="138" cy="94" r="10" fill="#1a1a2e" />
            {/* Blue iris */}
            <circle cx="82" cy="94" r="7" fill="#0088FF" />
            <circle cx="138" cy="94" r="7" fill="#0088FF" />
            {/* Inner pupil */}
            <circle cx="82" cy="94" r="4" fill="#1a1a2e" />
            <circle cx="138" cy="94" r="4" fill="#1a1a2e" />
            {/* Highlights */}
            <circle cx="86" cy="90" r="4" fill="white" />
            <circle cx="142" cy="90" r="4" fill="white" />
            <circle cx="79" cy="97" r="2" fill="white" opacity="0.6" />
            <circle cx="135" cy="97" r="2" fill="white" opacity="0.6" />
          </>
        );
    }
  };

  // Mouth based on mood and speaking state
  const getMouth = () => {
    if (!isActive) {
      // Sleeping - relaxed smile
      return <path d="M100 125 Q110 132 120 125" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round" />;
    }

    if (isSpeaking) {
      // Animated speaking mouth
      return (
        <motion.g>
          <motion.path
            d="M90 125 Q110 145 130 125 Q120 138 110 138 Q100 138 90 125"
            fill="#1a1a2e"
            animate={{
              d: [
                "M90 125 Q110 145 130 125 Q120 138 110 138 Q100 138 90 125",
                "M95 128 Q110 138 125 128 Q118 133 110 133 Q102 133 95 128",
                "M90 125 Q110 145 130 125 Q120 138 110 138 Q100 138 90 125",
              ]
            }}
            transition={{ repeat: Infinity, duration: 0.3 }}
          />
          {/* Teeth */}
          <path d="M95 125 L125 125 L122 130 L98 130 Z" fill="white" />
          {/* Tongue */}
          <motion.ellipse
            cx="110"
            cy="138"
            rx="8"
            ry="5"
            fill="#FF6B8A"
            animate={{ ry: [5, 3, 5] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
          />
        </motion.g>
      );
    }

    switch (mood) {
      case 'happy':
      case 'excited':
        return (
          <g>
            {/* Big smile with teeth */}
            <path d="M88 122 Q110 150 132 122" fill="#1a1a2e" />
            <path d="M92 122 L128 122 L124 130 L96 130 Z" fill="white" />
            <ellipse cx="110" cy="140" rx="10" ry="6" fill="#FF6B8A" />
          </g>
        );
      case 'sad':
      case 'crying':
        return <path d="M95 135 Q110 125 125 135" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case 'angry':
        return (
          <g>
            <path d="M92 130 L128 130 L125 135 L95 135 Z" fill="#1a1a2e" />
            <path d="M95 130 L125 130" stroke="white" strokeWidth="2" />
          </g>
        );
      case 'thinking':
        return <ellipse cx="120" cy="130" rx="6" ry="4" fill="#1a1a2e" />;
      case 'serious':
        return <path d="M95 130 L125 130" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />;
      default:
        return (
          <g>
            {/* Normal open smile */}
            <path d="M90 125 Q110 145 130 125" fill="#1a1a2e" />
            <path d="M94 125 L126 125 L122 130 L98 130 Z" fill="white" />
            <ellipse cx="110" cy="138" rx="8" ry="5" fill="#FF6B8A" />
          </g>
        );
    }
  };

  return (
    <motion.svg
      viewBox="0 0 220 280"
      width={size}
      height={size * 1.3}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        {/* Background gradient */}
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
        {/* Hair highlight gradient */}
        <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.2" />
        </linearGradient>
        {/* Skin gradient */}
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE4C4" />
          <stop offset="100%" stopColor="#FFDAB9" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="220" height="280" rx="20" fill="url(#bgGrad)" />
      
      {/* Grid pattern */}
      <g opacity="0.1">
        {[...Array(10)].map((_, i) => (
          <line key={`v${i}`} x1={i * 22} y1="0" x2={i * 22} y2="280" stroke="white" strokeWidth="0.5" />
        ))}
        {[...Array(13)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 22} x2="220" y2={i * 22} stroke="white" strokeWidth="0.5" />
        ))}
      </g>

      {/* Body - Black jacket */}
      <path d="M60 200 Q60 170 75 160 L110 155 L145 160 Q160 170 160 200 L160 280 L60 280 Z" fill="#2a2a3e" />
      
      {/* Gray undershirt */}
      <path d="M85 160 L110 155 L135 160 L130 200 L90 200 Z" fill="#4a4a5e" />
      
      {/* Jacket collar */}
      <path d="M75 160 L95 175 L110 165 L125 175 L145 160 L135 160 L110 155 L85 160 Z" fill="#3a3a4e" />
      
      {/* B Emblem on jacket */}
      <circle cx="85" cy="210" r="12" fill="#1a1a2e" stroke="#0066FF" strokeWidth="2" />
      <text x="85" y="215" textAnchor="middle" fill="#0066FF" fontSize="14" fontWeight="bold">B</text>

      {/* Necklace */}
      <path d="M95 165 Q110 175 125 165" stroke="#C0C0C0" strokeWidth="1.5" fill="none" />
      <circle cx="110" cy="175" r="4" fill="#FFD700" />

      {/* Neck */}
      <rect x="95" y="145" width="30" height="20" fill="url(#skinGrad)" />

      {/* Head/Face */}
      <ellipse cx="110" cy="100" rx="55" ry="60" fill="url(#skinGrad)" />

      {/* Cheeks (blush) */}
      <ellipse cx="70" cy="110" rx="10" ry="6" fill="#FFB6C1" opacity="0.4" />
      <ellipse cx="150" cy="110" rx="10" ry="6" fill="#FFB6C1" opacity="0.4" />

      {/* Hair base - black spiky */}
      <path d="M55 90 Q45 60 55 35 Q70 20 90 15 Q110 10 130 15 Q150 20 165 35 Q175 60 165 90 Q160 70 150 65 Q140 60 130 65 Q120 55 110 55 Q100 55 90 65 Q80 60 70 65 Q60 70 55 90 Z" fill="#1a1a2e" />
      
      {/* Hair spikes */}
      <path d="M60 75 L50 45 L65 65 Z" fill="#1a1a2e" />
      <path d="M75 60 L65 25 L85 50 Z" fill="#1a1a2e" />
      <path d="M95 50 L90 10 L105 40 Z" fill="#1a1a2e" />
      <path d="M115 45 L120 5 L125 40 Z" fill="#1a1a2e" />
      <path d="M135 50 L145 15 L145 45 Z" fill="#1a1a2e" />
      <path d="M150 60 L165 30 L155 55 Z" fill="#1a1a2e" />
      <path d="M160 75 L175 50 L165 70 Z" fill="#1a1a2e" />

      {/* Hair blue highlights */}
      <path d="M70 55 Q75 40 85 35 Q80 50 75 55 Z" fill="url(#hairHighlight)" />
      <path d="M100 40 Q105 25 115 20 Q110 35 105 42 Z" fill="url(#hairHighlight)" />
      <path d="M140 50 Q150 35 155 40 Q150 50 145 55 Z" fill="url(#hairHighlight)" />

      {/* Headphones band */}
      <path d="M45 85 Q45 50 110 45 Q175 50 175 85" stroke="#2a2a3e" strokeWidth="8" fill="none" />
      
      {/* Headphone left */}
      <ellipse cx="48" cy="95" rx="15" ry="25" fill="#2a2a3e" />
      <ellipse cx="48" cy="95" rx="10" ry="18" fill="#3a3a4e" />
      <ellipse cx="48" cy="95" rx="6" ry="12" fill="#1a1a2e" />
      
      {/* Headphone right */}
      <ellipse cx="172" cy="95" rx="15" ry="25" fill="#2a2a3e" />
      <ellipse cx="172" cy="95" rx="10" ry="18" fill="#3a3a4e" />
      <ellipse cx="172" cy="95" rx="6" ry="12" fill="#1a1a2e" />

      {/* Microphone arm */}
      <path d="M58 110 Q70 115 75 130" stroke="#2a2a3e" strokeWidth="4" fill="none" />
      <ellipse cx="78" cy="133" rx="8" ry="6" fill="#2a2a3e" />
      <ellipse cx="78" cy="133" rx="5" ry="4" fill="#3a3a4e" />

      {/* Eyes */}
      <g>
        {getEyeContent()}
        
        {/* Blinking animation when awake */}
        {isActive && !['happy', 'excited', 'sad', 'crying'].includes(mood) && (
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, times: [0, 0.02, 0.04] }}
          >
            <rect x="68" y="76" width="28" height="32" fill="url(#skinGrad)" />
            <rect x="124" y="76" width="28" height="32" fill="url(#skinGrad)" />
          </motion.g>
        )}
      </g>

      {/* Eyebrows (normal state) */}
      {isActive && !['sad', 'crying', 'angry', 'serious'].includes(mood) && (
        <>
          <path d="M70 78 Q82 74 94 78" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M126 78 Q138 74 150 78" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Mouth */}
      {getMouth()}

      {/* ZZZ when sleeping */}
      <AnimatePresence>
        {!isActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.text
              x="160"
              y="60"
              fill="#0088FF"
              fontSize="16"
              fontWeight="bold"
              animate={{ y: [60, 50, 60], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Z
            </motion.text>
            <motion.text
              x="175"
              y="45"
              fill="#0088FF"
              fontSize="14"
              fontWeight="bold"
              animate={{ y: [45, 35, 45], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            >
              z
            </motion.text>
            <motion.text
              x="185"
              y="32"
              fill="#0088FF"
              fontSize="12"
              fontWeight="bold"
              animate={{ y: [32, 22, 32], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
            >
              z
            </motion.text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Thinking dots */}
      {mood === 'thinking' && isActive && (
        <motion.g>
          <motion.circle
            cx="160"
            cy="60"
            r="4"
            fill="#0088FF"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.circle
            cx="175"
            cy="55"
            r="4"
            fill="#0088FF"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />
          <motion.circle
            cx="190"
            cy="50"
            r="4"
            fill="#0088FF"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
          />
        </motion.g>
      )}

      {/* Excited sparkles */}
      {mood === 'excited' && isActive && (
        <motion.g>
          <motion.path
            d="M45 50 L50 45 L55 50 L50 55 Z"
            fill="#FFD700"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.path
            d="M175 45 L180 40 L185 45 L180 50 Z"
            fill="#FFD700"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          />
          <motion.path
            d="M190 70 L195 65 L200 70 L195 75 Z"
            fill="#FFD700"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
          />
        </motion.g>
      )}

      {/* Angry steam */}
      {mood === 'angry' && isActive && (
        <motion.g>
          <motion.path
            d="M50 55 Q55 45 50 35"
            stroke="#FF6B6B"
            strokeWidth="3"
            fill="none"
            animate={{ y: [-5, 0, -5], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          <motion.path
            d="M170 55 Q175 45 170 35"
            stroke="#FF6B6B"
            strokeWidth="3"
            fill="none"
            animate={{ y: [-5, 0, -5], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
          />
        </motion.g>
      )}
    </motion.svg>
  );
};

export default NutriCharacter;
