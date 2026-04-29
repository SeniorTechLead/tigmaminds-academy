/**
 * Tara — recurring student character across reference diagrams.
 * ~12 years old, friendly cartoon style. Long braid is her visual signature.
 *
 * Use as a positioned <g> inside a parent SVG. Default body height is ~120 units;
 * scale via the `scale` prop to fit your scene. Origin (0,0) is at her feet.
 *
 * Pose presets cover the common math-scene needs. For new poses, extend the union.
 */
import type { CSSProperties } from 'react';

export type TaraPose =
  | 'standing'      // arms at sides, looking forward
  | 'lookingUp'     // head tilted up, one hand at brow
  | 'lookingDown'   // head tilted down, hands on hips (e.g. cliff edge)
  | 'pointing'      // arm extended, finger pointing
  | 'walking'       // mid-stride
  | 'thinking';     // hand on chin

interface TaraProps {
  x?: number;            // horizontal position of feet (in parent SVG coords)
  y?: number;            // vertical position of feet
  scale?: number;        // 1 = ~120 units tall
  flip?: boolean;        // mirror horizontally
  pose?: TaraPose;
  style?: CSSProperties;
}

// Skin/hair/clothing palette — warm tones, Indian-coded
const SKIN = '#d9a273';       // medium warm brown
const HAIR = '#1f1410';       // near-black with warmth
const KURTA = '#f97316';      // orange (matches site accent)
const KURTA_DARK = '#c2410c'; // shadow
const LEGGINGS = '#1e3a5f';   // dark navy
const STROKE = '#1f2937';     // outlines

export default function Tara({
  x = 0, y = 0, scale = 1, flip = false, pose = 'standing', style,
}: TaraProps) {
  const transform = `translate(${x}, ${y}) scale(${flip ? -scale : scale}, ${scale})`;

  return (
    <g transform={transform} style={style}>
      <TaraBody pose={pose} />
    </g>
  );
}

function TaraBody({ pose }: { pose: TaraPose }) {
  // Head tilt for "lookingUp" / "lookingDown"
  const headTilt = pose === 'lookingUp' ? -20 : pose === 'lookingDown' ? 18 : 0;
  // Eye direction
  const eyeDir = pose === 'lookingUp' ? 'up' : pose === 'lookingDown' ? 'down' : 'forward';

  return (
    <g>
      {/* Origin is feet. Build upward in NEGATIVE y (SVG y-down: negative = above feet). */}

      {/* Legs */}
      {pose === 'walking' ? (
        <>
          {/* Front leg, slightly forward */}
          <path d="M -4 0 L 2 -34 L 5 -34 L -1 0 Z" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
          {/* Back leg, slightly behind */}
          <path d="M 4 0 L -2 -34 L 1 -34 L 7 0 Z" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
        </>
      ) : (
        <>
          {/* Two legs side by side */}
          <rect x="-7" y="-34" width="6" height="34" rx="2" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" />
          <rect x="1" y="-34" width="6" height="34" rx="2" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" />
        </>
      )}

      {/* Shoes — small dark blobs at feet */}
      <ellipse cx={pose === 'walking' ? 4 : -4} cy="-1" rx="5" ry="2.5" fill={STROKE} />
      <ellipse cx={pose === 'walking' ? -2 : 4} cy="-1" rx="5" ry="2.5" fill={STROKE} />

      {/* Torso — kurta (loose tunic). Slight A-line. */}
      <path
        d="M -13 -34 L -11 -68 L 11 -68 L 13 -34 Z"
        fill={KURTA} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round"
      />
      {/* Kurta neckline trim */}
      <path d="M -5 -68 Q 0 -64 5 -68" fill="none" stroke={KURTA_DARK} strokeWidth="1.2" />
      {/* Kurta side detail (vertical line, hint of fold) */}
      <line x1="0" y1="-68" x2="0" y2="-36" stroke={KURTA_DARK} strokeWidth="0.6" opacity="0.5" />

      {/* Arms — vary by pose. Anchored at shoulders (~y=-66, x=±10). */}
      <Arms pose={pose} />

      {/* Neck */}
      <rect x="-3" y="-72" width="6" height="6" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Head group — rotates as a unit for tilt */}
      <g transform={`rotate(${headTilt}, 0, -72)`}>
        {/* Head — slightly oval, larger than realistic for cartoon read */}
        <ellipse cx="0" cy="-86" rx="13" ry="14.5" fill={SKIN} stroke={STROKE} strokeWidth="1.2" />

        {/* Hair top — curves over the forehead */}
        <path
          d="M -13 -90 Q -10 -100 0 -101 Q 10 -100 13 -90 Q 11 -94 8 -94 Q 4 -97 0 -97 Q -4 -97 -8 -94 Q -11 -94 -13 -90 Z"
          fill={HAIR} stroke={STROKE} strokeWidth="0.8" strokeLinejoin="round"
        />

        {/* Hair side wisps */}
        <path d="M -13 -88 Q -14 -82 -12 -78" fill="none" stroke={HAIR} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 13 -88 Q 14 -82 12 -78" fill="none" stroke={HAIR} strokeWidth="2.5" strokeLinecap="round" />

        {/* Eyes — react to gaze direction */}
        <Eyes dir={eyeDir} />

        {/* Eyebrows — slight arch */}
        <path d={`M -8 ${eyeDir === 'up' ? -94 : -92} Q -5 ${eyeDir === 'up' ? -96 : -93} -2 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.5" strokeLinecap="round" />
        <path d={`M 2 ${eyeDir === 'up' ? -94 : -92} Q 5 ${eyeDir === 'up' ? -96 : -93} 8 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth — small smile, slightly bigger when looking up (curious) */}
        <path
          d={pose === 'lookingUp' ? "M -3 -80 Q 0 -76 3 -80" : "M -2 -80 Q 0 -78 2 -80"}
          fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round"
        />
      </g>

      {/* Braid — drawn AFTER head so it appears behind/beside. Anchored at nape. */}
      {/* Sweeps down behind shoulder. Horizontal flip via `scaleX(-1)` would put braid on other side; we draw on right by default. */}
      <Braid headTilt={headTilt} />
    </g>
  );
}

function Eyes({ dir }: { dir: 'forward' | 'up' | 'down' }) {
  // Pupil offset based on gaze
  const pupilDx = 0;
  const pupilDy = dir === 'up' ? -1.5 : dir === 'down' ? 1.5 : 0;

  return (
    <g>
      {/* Left eye — eye white */}
      <ellipse cx="-5" cy="-89" rx="2.5" ry="2.8" fill="white" stroke={STROKE} strokeWidth="0.8" />
      {/* Right eye */}
      <ellipse cx="5" cy="-89" rx="2.5" ry="2.8" fill="white" stroke={STROKE} strokeWidth="0.8" />
      {/* Pupils — black dots, shift with gaze */}
      <circle cx={-5 + pupilDx} cy={-89 + pupilDy} r="1.3" fill={STROKE} />
      <circle cx={5 + pupilDx} cy={-89 + pupilDy} r="1.3" fill={STROKE} />
      {/* Eye highlight — tiny white dot for life */}
      <circle cx={-4.5 + pupilDx} cy={-89.5 + pupilDy} r="0.4" fill="white" />
      <circle cx={5.5 + pupilDx} cy={-89.5 + pupilDy} r="0.4" fill="white" />
    </g>
  );
}

function Braid({ headTilt }: { headTilt: number }) {
  // Anchor at back of head; braid sweeps down right side.
  // When head tilts up, braid swings slightly forward; we approximate with a curve.
  const sway = headTilt < 0 ? 4 : headTilt > 0 ? -2 : 0;

  return (
    <g>
      {/* Braid main shape — thick curved tapered strand */}
      <path
        d={`M 8 -78 Q ${14 + sway} -68 ${12 + sway} -55 Q ${10 + sway} -42 ${6 + sway} -32`}
        fill="none" stroke={HAIR} strokeWidth="6" strokeLinecap="round"
      />
      {/* Braid texture — small horizontal bands */}
      <line x1={11 + sway} y1="-65" x2={13 + sway} y2="-65" stroke="#000" strokeWidth="0.8" opacity="0.4" />
      <line x1={11 + sway} y1="-55" x2={13 + sway} y2="-55" stroke="#000" strokeWidth="0.8" opacity="0.4" />
      <line x1={9 + sway} y1="-45" x2={11 + sway} y2="-45" stroke="#000" strokeWidth="0.8" opacity="0.4" />
      {/* Tie at end */}
      <ellipse cx={6 + sway} cy="-31" rx="2.5" ry="1.5" fill="#dc2626" stroke={STROKE} strokeWidth="0.6" />
    </g>
  );
}

function Arms({ pose }: { pose: TaraPose }) {
  // Shoulders at (-10, -66) and (10, -66)
  const skinFill = SKIN;
  const sleeveFill = KURTA;

  if (pose === 'lookingUp') {
    // Right hand up to brow (shading eyes), left arm at side
    return (
      <g>
        {/* Left arm — relaxed at side */}
        <path d="M -10 -66 L -14 -50 L -16 -38" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {/* Right arm — bent up to forehead/brow */}
        <path d="M 10 -66 L 14 -78 L 6 -88" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="6" cy="-88" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'lookingDown') {
    // Hands on hips
    return (
      <g>
        <path d="M -10 -66 L -14 -56 L -10 -46" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-10" cy="-46" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <path d="M 10 -66 L 14 -56 L 10 -46" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="10" cy="-46" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'pointing') {
    // Right arm extended out and slightly up, finger pointing. Left arm at side.
    return (
      <g>
        <path d="M -10 -66 L -14 -50 L -16 -38" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <path d="M 10 -66 L 22 -68 L 32 -64" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        {/* Hand + pointing finger */}
        <circle cx="32" cy="-64" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <line x1="32" y1="-64" x2="38" y2="-63" stroke={skinFill} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  }

  if (pose === 'thinking') {
    // Right hand to chin
    return (
      <g>
        <path d="M -10 -66 L -14 -50 L -16 -38" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-16" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <path d="M 10 -66 L 8 -76 L 2 -78" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="2" cy="-78" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'walking') {
    return (
      <g>
        {/* Arms swing opposite to legs */}
        <path d="M -10 -66 L -6 -54 L -2 -42" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="-2" cy="-42" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        <path d="M 10 -66 L 6 -54 L 2 -42" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="2" cy="-42" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  // standing
  return (
    <g>
      <path d="M -10 -66 L -13 -50 L -14 -38" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
      <circle cx="-14" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      <path d="M 10 -66 L 13 -50 L 14 -38" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
      <circle cx="14" cy="-38" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
    </g>
  );
}
