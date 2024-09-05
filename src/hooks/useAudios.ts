import { useRef } from "react";

export default function useAudios() {
  const spinAudio = useRef(
    new Audio(
      "https://cdn.manekopet.xyz/sound-effects/wheel-of-fortune-spin.wav"
    )
  );
  const spinNothing = useRef(
    new Audio(
      "https://cdn.manekopet.xyz/sound-effects/wheel-of-fortune-lost-won-nothing.mp3"
    )
  );
  const spinWin = useRef(
    new Audio(
      "https://cdn.manekopet.xyz/sound-effects/wheel-of-fortune-result.wav"
    )
  );
  const attackAudio = useRef(
    new Audio("https://cdn.manekopet.xyz/sound-effects/attack-player.mp3")
  );
  const openArcadesAudio = useRef(
    new Audio("https://cdn.manekopet.xyz/sound-effects/open-arcade.wav")
  );

  const levelUp = useRef(
    new Audio("https://cdn.manekopet.xyz/sound-effects/sound-level-up.wav")
  );

  return {
    spinAudio,
    spinNothing,
    spinWin,
    attackAudio,
    openArcadesAudio,
    levelUp,
  };
}
