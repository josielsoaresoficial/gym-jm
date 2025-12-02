import { motion } from 'framer-motion';
import { Character, CharacterMood, CharacterState } from '@/hooks/useCharacter';

interface CharacterBaseProps {
  character: Character;
  mood: CharacterMood;
  state: CharacterState;
  isSpeaking: boolean;
  size?: number;
}

const CharacterBase = ({ character, mood, state, isSpeaking, size = 200 }: CharacterBaseProps) => {
  const isAsleep = state === 'sleeping';
  
  // Eye animations based on mood and state
  const getEyeShape = () => {
    if (isAsleep) return { type: 'closed', shape: 'arc' };
    switch (mood) {
      case 'happy':
      case 'excited':
        return { type: 'happy', shape: 'u-shape' };
      case 'sad':
      case 'crying':
        return { type: 'sad', shape: 'droopy' };
      case 'angry':
        return { type: 'angry', shape: 'slanted' };
      case 'thinking':
        return { type: 'thinking', shape: 'looking-up' };
      case 'serious':
        return { type: 'serious', shape: 'half-closed' };
      default:
        return { type: 'normal', shape: 'round' };
    }
  };

  // Mouth shapes for different moods
  const getMouthPath = () => {
    if (isAsleep) return "M 85 120 Q 100 115 115 120"; // Relaxed
    if (isSpeaking) return "M 85 118 Q 100 130 115 118"; // Open
    switch (mood) {
      case 'happy':
      case 'excited':
        return "M 80 115 Q 100 135 120 115"; // Big smile
      case 'sad':
        return "M 85 125 Q 100 115 115 125"; // Frown
      case 'crying':
        return "M 85 125 Q 100 112 115 125"; // Deeper frown
      case 'angry':
        return "M 85 120 L 100 125 L 115 120"; // Gritted
      case 'thinking':
        return "M 90 120 Q 100 118 105 120"; // Small pursed
      case 'serious':
        return "M 85 120 L 115 120"; // Straight line
      default:
        return "M 85 118 Q 100 125 115 118"; // Slight smile
    }
  };

  // Eyebrow positions based on mood
  const getEyebrowTransform = () => {
    switch (mood) {
      case 'angry':
        return { left: 'rotate(15deg)', right: 'rotate(-15deg)' };
      case 'sad':
      case 'crying':
        return { left: 'rotate(-10deg)', right: 'rotate(10deg)' };
      case 'excited':
        return { left: 'translateY(-5px)', right: 'translateY(-5px)' };
      case 'thinking':
        return { left: 'rotate(-5deg) translateY(-3px)', right: 'rotate(5deg)' };
      default:
        return { left: 'rotate(0deg)', right: 'rotate(0deg)' };
    }
  };

  const eyeInfo = getEyeShape();
  const mouthPath = getMouthPath();
  const eyebrowTransform = getEyebrowTransform();

  // Mouth speaking animation
  const mouthVariants = {
    speaking: {
      d: [
        "M 85 118 Q 100 125 115 118",
        "M 85 115 Q 100 135 115 115",
        "M 85 118 Q 100 128 115 118",
        "M 85 115 Q 100 138 115 115",
        "M 85 118 Q 100 125 115 118",
      ],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        ease: "linear" as const
      }
    },
    idle: {
      d: mouthPath
    }
  };

  // Blinking animation
  const blinkVariants = {
    open: { scaleY: 1 },
    blink: { 
      scaleY: [1, 0.1, 1],
      transition: { duration: 0.15 }
    }
  };

  // Render eyes based on state
  const renderEyes = () => {
    if (isAsleep) {
      return (
        <>
          <path d="M 70 85 Q 80 80 90 85" stroke={character.hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 110 85 Q 120 80 130 85" stroke={character.hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }

    if (eyeInfo.type === 'happy' || eyeInfo.type === 'excited') {
      return (
        <>
          <path d="M 70 88 Q 80 80 90 88" stroke={character.hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 110 88 Q 120 80 130 88" stroke={character.hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          {mood === 'excited' && (
            <>
              <motion.circle cx="80" cy="82" r="3" fill="#FFD700" animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
              <motion.circle cx="120" cy="82" r="3" fill="#FFD700" animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
            </>
          )}
        </>
      );
    }

    if (eyeInfo.type === 'sad' || eyeInfo.type === 'crying') {
      return (
        <>
          <motion.g variants={blinkVariants} initial="open" animate="open" style={{ transformOrigin: '80px 85px' }}>
            <ellipse cx="80" cy="85" rx="10" ry="12" fill="white" />
            <circle cx="80" cy="88" r="6" fill={character.hairColor} />
            <circle cx="82" cy="86" r="2" fill="white" />
          </motion.g>
          <motion.g variants={blinkVariants} initial="open" animate="open" style={{ transformOrigin: '120px 85px' }}>
            <ellipse cx="120" cy="85" rx="10" ry="12" fill="white" />
            <circle cx="120" cy="88" r="6" fill={character.hairColor} />
            <circle cx="122" cy="86" r="2" fill="white" />
          </motion.g>
          {mood === 'crying' && (
            <>
              <motion.ellipse cx="75" cy="100" rx="3" ry="5" fill="#87CEEB" animate={{ y: [0, 20], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
              <motion.ellipse cx="125" cy="100" rx="3" ry="5" fill="#87CEEB" animate={{ y: [0, 20], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
            </>
          )}
        </>
      );
    }

    if (eyeInfo.type === 'angry') {
      return (
        <>
          <motion.g style={{ transformOrigin: '80px 85px' }}>
            <ellipse cx="80" cy="85" rx="10" ry="8" fill="white" />
            <circle cx="80" cy="85" r="5" fill={character.hairColor} />
            <circle cx="81" cy="84" r="2" fill="white" />
          </motion.g>
          <motion.g style={{ transformOrigin: '120px 85px' }}>
            <ellipse cx="120" cy="85" rx="10" ry="8" fill="white" />
            <circle cx="120" cy="85" r="5" fill={character.hairColor} />
            <circle cx="121" cy="84" r="2" fill="white" />
          </motion.g>
        </>
      );
    }

    if (eyeInfo.type === 'thinking') {
      return (
        <>
          <motion.g animate={{ x: 3, y: -3 }} style={{ transformOrigin: '80px 85px' }}>
            <ellipse cx="80" cy="85" rx="10" ry="12" fill="white" />
            <circle cx="82" cy="83" r="6" fill={character.hairColor} />
            <circle cx="84" cy="81" r="2" fill="white" />
          </motion.g>
          <motion.g animate={{ x: 3, y: -3 }} style={{ transformOrigin: '120px 85px' }}>
            <ellipse cx="120" cy="85" rx="10" ry="12" fill="white" />
            <circle cx="122" cy="83" r="6" fill={character.hairColor} />
            <circle cx="124" cy="81" r="2" fill="white" />
          </motion.g>
        </>
      );
    }

    if (eyeInfo.type === 'serious') {
      return (
        <>
          <motion.g style={{ transformOrigin: '80px 85px' }}>
            <ellipse cx="80" cy="85" rx="10" ry="7" fill="white" />
            <circle cx="80" cy="86" r="5" fill={character.hairColor} />
            <circle cx="81" cy="85" r="2" fill="white" />
          </motion.g>
          <motion.g style={{ transformOrigin: '120px 85px' }}>
            <ellipse cx="120" cy="85" rx="10" ry="7" fill="white" />
            <circle cx="120" cy="86" r="5" fill={character.hairColor} />
            <circle cx="121" cy="85" r="2" fill="white" />
          </motion.g>
        </>
      );
    }

    // Normal eyes with blinking
    return (
      <>
        <motion.g
          variants={blinkVariants}
          initial="open"
          animate="open"
          whileInView="blink"
          viewport={{ once: false }}
          style={{ transformOrigin: '80px 85px' }}
        >
          <ellipse cx="80" cy="85" rx="10" ry="12" fill="white" />
          <circle cx="80" cy="85" r="6" fill={character.hairColor} />
          <circle cx="82" cy="83" r="2" fill="white" />
        </motion.g>
        <motion.g
          variants={blinkVariants}
          initial="open"
          animate="open"
          style={{ transformOrigin: '120px 85px' }}
        >
          <ellipse cx="120" cy="85" rx="10" ry="12" fill="white" />
          <circle cx="120" cy="85" r="6" fill={character.hairColor} />
          <circle cx="122" cy="83" r="2" fill="white" />
        </motion.g>
      </>
    );
  };

  // Render accessory based on character
  const renderAccessory = () => {
    switch (character.accessory) {
      case 'headphones':
        return (
          <g>
            <path d="M 55 70 Q 55 40 100 35 Q 145 40 145 70" stroke="#333" strokeWidth="6" fill="none" />
            <ellipse cx="55" cy="75" rx="12" ry="15" fill="#333" />
            <ellipse cx="145" cy="75" rx="12" ry="15" fill="#333" />
            <ellipse cx="55" cy="75" rx="8" ry="10" fill="#666" />
            <ellipse cx="145" cy="75" rx="8" ry="10" fill="#666" />
            <path d="M 55 90 Q 60 100 55 105" stroke="#333" strokeWidth="3" fill="none" />
            <circle cx="52" cy="108" r="5" fill="#333" />
          </g>
        );
      case 'chef-hat':
        return (
          <g>
            <ellipse cx="100" cy="30" rx="35" ry="20" fill="white" stroke="#ddd" strokeWidth="2" />
            <rect x="65" y="30" width="70" height="25" fill="white" stroke="#ddd" strokeWidth="2" />
            <path d="M 65 55 L 65 35 Q 100 45 135 35 L 135 55" fill="white" />
          </g>
        );
      case 'glasses':
        return (
          <g>
            <circle cx="80" cy="85" r="18" fill="none" stroke={character.primaryColor} strokeWidth="3" />
            <circle cx="120" cy="85" r="18" fill="none" stroke={character.primaryColor} strokeWidth="3" />
            <path d="M 98 85 L 102 85" stroke={character.primaryColor} strokeWidth="3" />
            <path d="M 62 85 L 50 80" stroke={character.primaryColor} strokeWidth="3" />
            <path d="M 138 85 L 150 80" stroke={character.primaryColor} strokeWidth="3" />
          </g>
        );
      case 'bandana':
        return (
          <g>
            <path d="M 50 60 Q 100 50 150 60 L 145 70 Q 100 65 55 70 Z" fill={character.primaryColor} />
            <path d="M 145 65 Q 160 75 155 90" stroke={character.primaryColor} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 148 68 Q 165 80 158 98" stroke={character.secondaryColor} strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'scarf':
        return (
          <g>
            <path d="M 60 130 Q 100 140 140 130 L 140 145 Q 100 155 60 145 Z" fill={character.primaryColor} />
            <path d="M 130 140 L 135 170" stroke={character.primaryColor} strokeWidth="15" strokeLinecap="round" />
            <path d="M 130 140 L 145 165" stroke={character.primaryColor} strokeWidth="15" strokeLinecap="round" />
          </g>
        );
      case 'antenna':
        return (
          <g>
            <rect x="95" y="25" width="10" height="20" fill="#4A4A4A" rx="2" />
            <motion.circle 
              cx="100" cy="20" r="8" 
              fill={character.secondaryColor}
              animate={{ 
                boxShadow: ['0 0 10px ' + character.secondaryColor, '0 0 20px ' + character.secondaryColor],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <circle cx="100" cy="20" r="5" fill={character.accentColor} />
          </g>
        );
      default:
        return null;
    }
  };

  // Render outfit
  const renderOutfit = () => {
    switch (character.outfit) {
      case 'lab-coat':
        return (
          <g>
            <path d="M 60 130 L 50 200 L 150 200 L 140 130 Q 100 145 60 130" fill="white" stroke="#ddd" strokeWidth="2" />
            <rect x="70" y="140" width="15" height="8" rx="2" fill={character.primaryColor} />
            <text x="72" y="147" fontSize="6" fill="white">ID</text>
            <circle cx="130" cy="160" r="4" fill="#ddd" />
            <circle cx="130" cy="175" r="4" fill="#ddd" />
          </g>
        );
      case 'chef-uniform':
        return (
          <g>
            <path d="M 60 130 L 50 200 L 150 200 L 140 130 Q 100 145 60 130" fill="white" stroke="#ddd" strokeWidth="2" />
            <circle cx="100" cy="145" r="4" fill="#333" />
            <circle cx="100" cy="160" r="4" fill="#333" />
            <circle cx="100" cy="175" r="4" fill="#333" />
          </g>
        );
      case 'sports':
        return (
          <g>
            <path d="M 60 130 L 55 200 L 145 200 L 140 130 Q 100 145 60 130" fill={character.primaryColor} />
            <path d="M 70 140 L 130 140" stroke="white" strokeWidth="3" />
            <path d="M 75 155 L 125 155" stroke="white" strokeWidth="2" />
          </g>
        );
      case 'apron':
        return (
          <g>
            <path d="M 60 130 L 55 200 L 145 200 L 140 130 Q 100 145 60 130" fill={character.secondaryColor} />
            <path d="M 70 135 L 70 200 L 130 200 L 130 135 Q 100 150 70 135" fill={character.primaryColor} />
            <ellipse cx="100" cy="165" rx="15" ry="12" fill={character.secondaryColor} />
          </g>
        );
      case 'tech':
        return (
          <g>
            <path d="M 60 130 L 55 200 L 145 200 L 140 130 Q 100 145 60 130" fill="#2a2a3e" />
            <motion.path 
              d="M 70 150 L 130 150" 
              stroke={character.accentColor} 
              strokeWidth="2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.path 
              d="M 75 165 L 125 165" 
              stroke={character.secondaryColor} 
              strokeWidth="2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
            <motion.circle 
              cx="100" cy="180" r="8" 
              fill="none" 
              stroke={character.accentColor} 
              strokeWidth="2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </g>
        );
      default:
        return (
          <path d="M 60 130 L 55 200 L 145 200 L 140 130 Q 100 145 60 130" fill={character.primaryColor} />
        );
    }
  };

  return (
    <motion.svg 
      viewBox="0 0 200 220" 
      width={size} 
      height={size * 1.1}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <defs>
        <linearGradient id={`bg-${character.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={character.primaryColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={character.secondaryColor} stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="100" cy="110" r="90" fill={`url(#bg-${character.id})`} />

      {/* Body/Outfit */}
      {renderOutfit()}

      {/* Neck */}
      <ellipse cx="100" cy="130" rx="25" ry="15" fill={character.skinColor} />

      {/* Head */}
      <ellipse cx="100" cy="85" rx="55" ry="50" fill={character.skinColor} />
      
      {/* Cheeks */}
      <ellipse cx="65" cy="100" rx="10" ry="6" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="135" cy="100" rx="10" ry="6" fill="#FFB6C1" opacity="0.5" />

      {/* Hair */}
      <path 
        d={`M 45 75 Q 45 35 100 30 Q 155 35 155 75 Q 150 55 100 50 Q 50 55 45 75`}
        fill={character.hairColor}
      />
      {/* Hair highlights */}
      <path 
        d="M 70 45 Q 80 35 90 45"
        stroke={character.primaryColor}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Eyebrows */}
      <motion.path 
        d="M 65 70 L 90 72" 
        stroke={character.hairColor} 
        strokeWidth="3" 
        strokeLinecap="round"
        style={{ transform: eyebrowTransform.left, transformOrigin: '77px 71px' }}
      />
      <motion.path 
        d="M 110 72 L 135 70" 
        stroke={character.hairColor} 
        strokeWidth="3" 
        strokeLinecap="round"
        style={{ transform: eyebrowTransform.right, transformOrigin: '122px 71px' }}
      />

      {/* Eyes */}
      {renderEyes()}

      {/* Nose */}
      <ellipse cx="100" cy="100" rx="4" ry="3" fill={character.skinColor} filter="brightness(0.95)" />

      {/* Mouth */}
      <motion.path
        d={mouthPath}
        stroke="#D2691E"
        strokeWidth="3"
        fill={isSpeaking ? "#8B0000" : "none"}
        strokeLinecap="round"
        variants={mouthVariants}
        animate={isSpeaking ? "speaking" : "idle"}
      />

      {/* Accessory */}
      {renderAccessory()}

      {/* ZZZ when sleeping */}
      {isAsleep && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.text
            x="140"
            y="40"
            fontSize="16"
            fill={character.primaryColor}
            fontWeight="bold"
            animate={{ 
              y: [40, 30, 40],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Z
          </motion.text>
          <motion.text
            x="155"
            y="30"
            fontSize="12"
            fill={character.primaryColor}
            fontWeight="bold"
            animate={{ 
              y: [30, 20, 30],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
          >
            z
          </motion.text>
          <motion.text
            x="165"
            y="22"
            fontSize="10"
            fill={character.primaryColor}
            fontWeight="bold"
            animate={{ 
              y: [22, 15, 22],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
          >
            z
          </motion.text>
        </motion.g>
      )}

      {/* Mood-specific extras */}
      {mood === 'thinking' && !isAsleep && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <circle cx="160" cy="50" r="8" fill="white" stroke="#ddd" />
          <circle cx="150" cy="65" r="5" fill="white" stroke="#ddd" />
          <circle cx="145" cy="75" r="3" fill="white" stroke="#ddd" />
          <text x="156" y="54" fontSize="10">?</text>
        </motion.g>
      )}

      {mood === 'excited' && !isAsleep && (
        <motion.g>
          <motion.path
            d="M 30 60 L 35 50 L 40 60"
            stroke={character.accentColor}
            strokeWidth="2"
            fill="none"
            animate={{ y: [-5, 0, -5], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          <motion.path
            d="M 160 60 L 165 50 L 170 60"
            stroke={character.accentColor}
            strokeWidth="2"
            fill="none"
            animate={{ y: [-5, 0, -5], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
          />
        </motion.g>
      )}
    </motion.svg>
  );
};

export default CharacterBase;
