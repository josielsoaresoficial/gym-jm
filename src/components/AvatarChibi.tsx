import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export type AvatarMood = 'sleeping' | 'neutral' | 'happy' | 'thinking' | 'excited' | 'serious' | 'sad' | 'crying';

interface AvatarChibiProps {
  isActive: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  mood?: AvatarMood;
}

export const AvatarChibi = ({ 
  isActive, 
  isSpeaking = false, 
  isListening = false,
  isProcessing = false,
  mood = 'neutral' 
}: AvatarChibiProps) => {
  const [blinkState, setBlinkState] = useState(false);
  const [mouthFrame, setMouthFrame] = useState(0);

  // Automatic blinking when active
  useEffect(() => {
    if (!isActive) return;
    
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [isActive]);

  // Mouth animation when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setMouthFrame(0);
      return;
    }

    const mouthInterval = setInterval(() => {
      setMouthFrame(prev => (prev + 1) % 6);
    }, 100);

    return () => clearInterval(mouthInterval);
  }, [isSpeaking]);

  // Get current mood for expression
  const getCurrentMood = (): AvatarMood => {
    if (!isActive) return 'sleeping';
    if (isProcessing) return 'thinking';
    return mood;
  };

  const currentMood = getCurrentMood();

  // Eye expressions based on mood
  const getEyeExpression = () => {
    if (blinkState) return { leftY: 115, rightY: 115, height: 2 }; // Blinking
    
    switch (currentMood) {
      case 'sleeping':
        return { leftY: 115, rightY: 115, height: 3, closed: true };
      case 'happy':
        return { leftY: 112, rightY: 112, height: 14, sparkle: true };
      case 'thinking':
        return { leftY: 116, rightY: 114, height: 10, furrowed: true };
      case 'excited':
        return { leftY: 110, rightY: 110, height: 18, wide: true };
      case 'serious':
        return { leftY: 116, rightY: 116, height: 10 };
      case 'sad':
        return { leftY: 118, rightY: 118, height: 10, droopy: true };
      case 'crying':
        return { leftY: 118, rightY: 118, height: 8, tears: true };
      default:
        return { leftY: 114, rightY: 114, height: 12 };
    }
  };

  // Mouth shapes based on speaking frame
  const getMouthPath = () => {
    if (!isActive) return "M140,145 Q150,148 160,145"; // Sleeping smile
    
    if (isSpeaking) {
      const mouthShapes = [
        "M140,145 Q150,152 160,145", // Open
        "M140,147 Q150,148 160,147", // Closed
        "M138,145 Q150,155 162,145", // Wide open
        "M140,147 Q150,150 160,147", // Slightly open
        "M137,145 Q150,158 163,145", // Very wide
        "M140,146 Q150,149 160,146", // Medium
      ];
      return mouthShapes[mouthFrame];
    }

    switch (currentMood) {
      case 'happy':
        return "M138,145 Q150,158 162,145";
      case 'excited':
        return "M136,143 Q150,165 164,143";
      case 'thinking':
        return "M142,148 Q150,145 158,148";
      case 'serious':
        return "M140,148 Q150,148 160,148";
      case 'sad':
        return "M140,152 Q150,145 160,152";
      case 'crying':
        return "M138,154 Q150,142 162,154";
      default:
        return "M140,145 Q150,152 160,145";
    }
  };

  const eyeExp = getEyeExpression();

  return (
    <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        {/* Background gradient */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a3a5c" />
          <stop offset="100%" stopColor="#0d1f33" />
        </linearGradient>

        {/* Hair gradient */}
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="40%" stopColor="#16213e" />
          <stop offset="60%" stopColor="#0f3460" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>

        {/* Blue hair highlight */}
        <linearGradient id="blueHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f3460" />
          <stop offset="50%" stopColor="#3498db" />
          <stop offset="100%" stopColor="#0f3460" />
        </linearGradient>

        {/* Skin gradient */}
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffeaa7" />
          <stop offset="100%" stopColor="#fdcb6e" />
        </linearGradient>

        {/* Jacket gradient */}
        <linearGradient id="jacketGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d3436" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>

        {/* Headphone gradient */}
        <linearGradient id="headphoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#636e72" />
          <stop offset="50%" stopColor="#2d3436" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>

        {/* Cheek blush */}
        <radialGradient id="cheekBlush">
          <stop offset="0%" stopColor="#fab1a0" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fab1a0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background with stars */}
      <rect x="0" y="0" width="300" height="320" fill="url(#bgGradient)" rx="20" />
      
      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <motion.circle
          key={i}
          cx={30 + (i * 22)}
          cy={20 + (i % 3) * 15}
          r={1 + (i % 2)}
          fill="white"
          opacity={0.6}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Body/Jacket */}
      <motion.g
        animate={isActive ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Jacket base */}
        <path
          d="M90,220 Q90,250 110,280 L190,280 Q210,250 210,220 Q200,200 150,200 Q100,200 90,220"
          fill="url(#jacketGradient)"
        />
        
        {/* Jacket collar left */}
        <path d="M115,200 L100,230 L115,225 Z" fill="#2d3436" />
        
        {/* Jacket collar right */}
        <path d="M185,200 L200,230 L185,225 Z" fill="#2d3436" />
        
        {/* T-shirt visible */}
        <path d="M120,200 L130,235 L170,235 L180,200" fill="#b2bec3" />
        
        {/* "B" badge */}
        <circle cx="125" cy="245" r="12" fill="#636e72" />
        <text x="125" y="250" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">B</text>
        
        {/* Necklace */}
        <path d="M130,200 Q150,215 170,200" stroke="#dfe6e9" strokeWidth="2" fill="none" />
        <circle cx="150" cy="212" r="5" fill="#ffeaa7" stroke="#dfe6e9" strokeWidth="1" />
      </motion.g>

      {/* Head container with breathing animation */}
      <motion.g
        animate={isActive ? { y: [0, -3, 0] } : { rotate: [0, -5, 0] }}
        transition={{ duration: isActive ? 3 : 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '150px 130px' }}
      >
        {/* Face base */}
        <ellipse cx="150" cy="130" rx="55" ry="50" fill="url(#skinGradient)" />

        {/* Hair back */}
        <path
          d="M95,110 Q95,60 150,55 Q205,60 205,110 Q200,90 150,85 Q100,90 95,110"
          fill="url(#hairGradient)"
        />

        {/* Hair spikes */}
        <motion.g
          animate={isActive ? { rotate: [0, 2, 0, -2, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: '150px 70px' }}
        >
          <path d="M120,75 L115,45 L130,70 Z" fill="url(#hairGradient)" />
          <path d="M140,70 L142,35 L155,65 Z" fill="url(#hairGradient)" />
          <path d="M155,68 L165,30 L175,65 Z" fill="url(#blueHighlight)" />
          <path d="M170,72 L185,40 L185,70 Z" fill="url(#hairGradient)" />
          <path d="M100,85 L85,55 L105,80 Z" fill="url(#hairGradient)" />
          <path d="M195,85 L210,55 L195,80 Z" fill="url(#blueHighlight)" />
        </motion.g>

        {/* Hair front bangs */}
        <path
          d="M100,95 Q110,85 125,90 Q135,85 150,88 Q165,85 175,90 Q190,85 200,95 Q195,105 180,100 Q165,105 150,100 Q135,105 120,100 Q105,105 100,95"
          fill="url(#hairGradient)"
        />
        
        {/* Blue streak in bangs */}
        <path d="M155,90 Q160,95 165,90 Q165,100 155,100 Z" fill="url(#blueHighlight)" />

        {/* Headphones band */}
        <path
          d="M85,120 Q85,70 150,65 Q215,70 215,120"
          stroke="url(#headphoneGradient)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />

        {/* Left headphone cup */}
        <ellipse cx="88" cy="130" rx="18" ry="25" fill="url(#headphoneGradient)" />
        <ellipse cx="88" cy="130" rx="12" ry="18" fill="#1a1a2e" />
        
        {/* Right headphone cup */}
        <ellipse cx="212" cy="130" rx="18" ry="25" fill="url(#headphoneGradient)" />
        <ellipse cx="212" cy="130" rx="12" ry="18" fill="#1a1a2e" />

        {/* Microphone arm */}
        <motion.g
          animate={isSpeaking ? { rotate: [0, 3, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ transformOrigin: '88px 145px' }}
        >
          <path d="M88,145 Q95,155 110,160 Q120,162 130,158" stroke="#636e72" strokeWidth="4" fill="none" />
          <ellipse cx="132" cy="157" rx="8" ry="6" fill="#2d3436" />
          <ellipse cx="135" cy="157" rx="4" ry="4" fill="#636e72" />
        </motion.g>

        {/* Cheeks */}
        <ellipse cx="115" cy="140" rx="12" ry="8" fill="url(#cheekBlush)" />
        <ellipse cx="185" cy="140" rx="12" ry="8" fill="url(#cheekBlush)" />

        {/* Eyes */}
        <AnimatePresence mode="wait">
          {eyeExp.closed ? (
            // Sleeping eyes (curved lines)
            <g key="closed">
              <motion.path
                d="M125,115 Q133,120 141,115"
                stroke="#2d3436"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
              <motion.path
                d="M159,115 Q167,120 175,115"
                stroke="#2d3436"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />
            </g>
          ) : (
            // Open eyes
            <g key="open">
              {/* Left eye */}
              <motion.ellipse
                cx="133"
                cy={eyeExp.leftY}
                rx="10"
                ry={eyeExp.height / 2}
                fill="#2d3436"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.2 }}
              />
              <ellipse cx="135" cy={eyeExp.leftY - 2} rx="4" ry="3" fill="white" />
              
              {/* Right eye */}
              <motion.ellipse
                cx="167"
                cy={eyeExp.rightY}
                rx="10"
                ry={eyeExp.height / 2}
                fill="#2d3436"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.2 }}
              />
              <ellipse cx="169" cy={eyeExp.rightY - 2} rx="4" ry="3" fill="white" />

              {/* Sparkles for happy mood */}
              {eyeExp.sparkle && (
                <>
                  <motion.path
                    d="M125,105 L127,108 L125,111 L123,108 Z"
                    fill="white"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  <motion.path
                    d="M175,105 L177,108 L175,111 L173,108 Z"
                    fill="white"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  />
                </>
              )}

              {/* Tears for crying */}
              {eyeExp.tears && (
                <>
                  <motion.ellipse
                    cx="128"
                    cy="130"
                    rx="3"
                    ry="8"
                    fill="#74b9ff"
                    opacity={0.8}
                    animate={{ y: [0, 20], opacity: [0.8, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.ellipse
                    cx="172"
                    cy="130"
                    rx="3"
                    ry="8"
                    fill="#74b9ff"
                    opacity={0.8}
                    animate={{ y: [0, 20], opacity: [0.8, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  />
                </>
              )}
            </g>
          )}
        </AnimatePresence>

        {/* Eyebrows based on mood */}
        {currentMood === 'thinking' && (
          <>
            <path d="M123,102 Q133,98 143,102" stroke="#1a1a2e" strokeWidth="2" fill="none" />
            <path d="M157,100 Q167,96 177,102" stroke="#1a1a2e" strokeWidth="2" fill="none" />
          </>
        )}
        {currentMood === 'serious' && (
          <>
            <path d="M123,105 L143,105" stroke="#1a1a2e" strokeWidth="2" />
            <path d="M157,105 L177,105" stroke="#1a1a2e" strokeWidth="2" />
          </>
        )}
        {(currentMood === 'sad' || currentMood === 'crying') && (
          <>
            <path d="M123,100 Q133,105 143,102" stroke="#1a1a2e" strokeWidth="2" fill="none" />
            <path d="M157,102 Q167,105 177,100" stroke="#1a1a2e" strokeWidth="2" fill="none" />
          </>
        )}

        {/* Mouth */}
        <motion.path
          d={getMouthPath()}
          stroke="#e17055"
          strokeWidth="3"
          strokeLinecap="round"
          fill={isSpeaking && mouthFrame % 2 === 0 ? "#2d3436" : "none"}
          animate={isSpeaking ? {} : { d: getMouthPath() }}
          transition={{ duration: 0.3 }}
        />
      </motion.g>

      {/* ZZZ when sleeping */}
      <AnimatePresence>
        {!isActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.text
              x="220"
              y="70"
              fill="white"
              fontSize="16"
              fontWeight="bold"
              opacity={0.9}
              animate={{ y: [70, 60, 70], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Z
            </motion.text>
            <motion.text
              x="235"
              y="55"
              fill="white"
              fontSize="20"
              fontWeight="bold"
              opacity={0.9}
              animate={{ y: [55, 45, 55], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              Z
            </motion.text>
            <motion.text
              x="252"
              y="38"
              fill="white"
              fontSize="24"
              fontWeight="bold"
              opacity={0.9}
              animate={{ y: [38, 28, 38], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              Z
            </motion.text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Thinking bubbles */}
      <AnimatePresence>
        {currentMood === 'thinking' && isActive && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.circle
              cx="220"
              cy="85"
              r="5"
              fill="white"
              opacity={0.8}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.circle
              cx="235"
              cy="65"
              r="8"
              fill="white"
              opacity={0.8}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
            <motion.text
              x="255"
              y="50"
              fill="#2d3436"
              fontSize="20"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ?
            </motion.text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Sound waves when speaking */}
      {isSpeaking && (
        <g>
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M${245 + i * 12},120 Q${250 + i * 12},130 ${245 + i * 12},140`}
              stroke="#74b9ff"
              strokeWidth="2"
              fill="none"
              opacity={0.8}
              animate={{ 
                opacity: [0, 0.8, 0],
                x: [0, 5, 10]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </g>
      )}

      {/* Listening indicator */}
      {isListening && (
        <motion.g>
          <motion.circle
            cx="150"
            cy="40"
            r="20"
            fill="none"
            stroke="#00cec9"
            strokeWidth="3"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.circle
            cx="150"
            cy="40"
            r="10"
            fill="#00cec9"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.g>
      )}
    </svg>
  );
};
