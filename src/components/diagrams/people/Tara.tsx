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
  | 'standing'      // arms at sides, neutral
  | 'lookingUp'     // head tilted up, one hand shading brow
  | 'lookingUpProfile' // legacy alias — same as direction='right' + pose='lookingUp'
  | 'lookingDown'   // head tilted down (cliff edge etc.)
  | 'pointing'      // arm extended forward
  | 'walking'       // mid-stride
  | 'thinking';     // hand on chin

/**
 * direction sets which way the character faces:
 *   'front' — towards the reader (good for "presenting" scenes)
 *   'right' — body in profile, facing right (most "watching/interacting" scenes)
 *   'left'  — body in profile, facing left (mirror of right)
 *
 * Default is 'right' because most scenes have the character watching/pointing
 * at something to their side. Use 'front' explicitly for present-to-reader scenes.
 */
export type TaraDirection = 'front' | 'left' | 'right';

interface TaraProps {
  x?: number;            // horizontal position of feet (in parent SVG coords)
  y?: number;            // vertical position of feet
  scale?: number;        // 1 = ~120 units tall
  flip?: boolean;        // (legacy) mirror horizontally — equivalent to direction='left'
  pose?: TaraPose;
  direction?: TaraDirection;
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
  x = 0, y = 0, scale = 1, flip = false, pose = 'standing', direction, style,
}: TaraProps) {
  // Resolve direction: explicit prop > legacy flip > default 'right' (most scenes
  // have the character on the left of the SVG looking at something on the right).
  // Use direction="front" explicitly for present-to-reader scenes.
  const dir: TaraDirection = direction ?? (flip ? 'left' : 'right');
  // legacy lookingUpProfile pose forces right-profile look-up
  const isLegacyProfile = pose === 'lookingUpProfile';
  const effectiveDir: TaraDirection = isLegacyProfile ? 'right' : dir;
  const effectivePose = isLegacyProfile ? 'lookingUp' : pose;

  // Build the inner transform: scale + horizontal flip for 'left'.
  const xs = effectiveDir === 'left' ? -scale : scale;
  const transform = `translate(${x}, ${y}) scale(${xs}, ${scale})`;

  return (
    <g transform={transform} style={style}>
      {effectiveDir === 'front'
        ? <TaraBody pose={effectivePose} />
        : <TaraProfile pose={effectivePose} />}
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
      {/* Kurta neckline — V-shape trim in darker thread */}
      <path d="M -5 -68 L 0 -62 L 5 -68" fill="none" stroke={KURTA_DARK} strokeWidth="1.4" strokeLinejoin="round" />
      {/* Decorative trim band at the hem */}
      <line x1="-13" y1="-37" x2="13" y2="-37" stroke={KURTA_DARK} strokeWidth="1.2" />
      <line x1="-13" y1="-39" x2="13" y2="-39" stroke="#fbbf24" strokeWidth="0.6" />

      {/* Arms — vary by pose. Anchored at shoulders (~y=-66, x=±10). */}
      <Arms pose={pose} />

      {/* Neck */}
      <rect x="-3" y="-72" width="6" height="6" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Twin pigtail braids — drawn BEFORE head so the head sits on top.
          They hang in FRONT of the shoulders (over the chest) — common for school-age
          Indian girls. Anchored just below the ears at (±12, -82). */}
      <PigtailBraids headTilt={headTilt} />

      {/* Head group — rotates as a unit for tilt */}
      <g transform={`rotate(${headTilt}, 0, -72)`}>
        {/* Head — slightly oval, larger than realistic for cartoon read */}
        <ellipse cx="0" cy="-86" rx="13" ry="14.5" fill={SKIN} stroke={STROKE} strokeWidth="1.2" />

        {/* Hair — covers crown with a clear hairline arc; soft fringe over the brow */}
        <path
          d="M -13 -88 Q -13 -101 0 -102 Q 13 -101 13 -88 Q 13 -93 8 -94 Q 4 -96 0 -94 Q -4 -96 -8 -94 Q -13 -93 -13 -88 Z"
          fill={HAIR} stroke={STROKE} strokeWidth="0.9" strokeLinejoin="round"
        />
        {/* Centre parting — thin line down the crown */}
        <line x1="0" y1="-101" x2="0" y2="-94" stroke="#3a2a20" strokeWidth="0.7" />
        {/* Tucked-back hair behind ears — small dark patches */}
        <path d="M -13 -86 Q -14 -80 -12 -76" fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />
        <path d="M 13 -86 Q 14 -80 12 -76" fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />

        {/* Small stud earrings — gold dots at the lobes */}
        <circle cx="-12" cy="-82" r="1.3" fill="#fbbf24" stroke={STROKE} strokeWidth="0.5" />
        <circle cx="12" cy="-82" r="1.3" fill="#fbbf24" stroke={STROKE} strokeWidth="0.5" />

        {/* Eyes — react to gaze direction (large almond-ish for young girl read) */}
        <Eyes dir={eyeDir} />

        {/* Eyebrows — slight arch, thin */}
        <path d={`M -9 ${eyeDir === 'up' ? -94 : -92} Q -6 ${eyeDir === 'up' ? -97 : -94} -3 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round" />
        <path d={`M 3 ${eyeDir === 'up' ? -94 : -92} Q 6 ${eyeDir === 'up' ? -97 : -94} 9 ${eyeDir === 'up' ? -94 : -92}`} fill="none" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round" />

        {/* Small nose hint */}
        <path d="M 0 -84 Q 1 -82 0 -81" fill="none" stroke={STROKE} strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />

        {/* Mouth — small smile, slightly bigger when looking up (curious) */}
        <path
          d={pose === 'lookingUp' ? "M -3 -78 Q 0 -75 3 -78" : "M -2 -78 Q 0 -76 2 -78"}
          fill="none" stroke="#7c2d12" strokeWidth="1.3" strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Eyes({ dir }: { dir: 'forward' | 'up' | 'down' }) {
  // Pupil offset based on gaze
  const pupilDy = dir === 'up' ? -1.6 : dir === 'down' ? 1.6 : 0;

  return (
    <g>
      {/* Left eye — slightly wider almond shape for young-girl read */}
      <ellipse cx="-5.5" cy="-89" rx="3" ry="3.2" fill="white" stroke={STROKE} strokeWidth="0.9" />
      {/* Right eye */}
      <ellipse cx="5.5" cy="-89" rx="3" ry="3.2" fill="white" stroke={STROKE} strokeWidth="0.9" />
      {/* Pupils — large dark irises */}
      <circle cx={-5.5} cy={-89 + pupilDy} r="1.7" fill="#1f1410" />
      <circle cx={5.5} cy={-89 + pupilDy} r="1.7" fill="#1f1410" />
      {/* Eye highlight — small white dot for life */}
      <circle cx={-5} cy={-89.5 + pupilDy} r="0.6" fill="white" />
      <circle cx={6} cy={-89.5 + pupilDy} r="0.6" fill="white" />
      {/* Eyelashes — three short strokes above each eye */}
      <path d="M -8 -92 L -8.5 -93.5 M -5.5 -92.5 L -5.5 -94 M -3 -92 L -2.5 -93.5" stroke={STROKE} strokeWidth="0.7" strokeLinecap="round" />
      <path d="M 3 -92 L 2.5 -93.5 M 5.5 -92.5 L 5.5 -94 M 8 -92 L 8.5 -93.5" stroke={STROKE} strokeWidth="0.7" strokeLinecap="round" />
    </g>
  );
}

/**
 * Twin pigtail braids hanging from below each ear, draping in front of the
 * shoulders. Each braid has a thick stroke, chevron-style segment marks
 * (V-shapes that read as plait weave), and a red ribbon tie at the end.
 *
 * The braids ignore headTilt — they hang from the body, not the head, so
 * they shouldn't rotate when the head tilts.
 */
function PigtailBraids({ headTilt: _headTilt }: { headTilt: number }) {
  // Anchor points just below each ear (after head finishes around y=-72).
  // Left braid: starts at (-12, -75), curves outward then down to chest level.
  // Right braid: mirror.
  return (
    <g>
      {/* LEFT BRAID — from (-12, -75) draping over the left shoulder, ending at chest */}
      <path
        d="M -12 -76 Q -16 -64 -16 -52 Q -16 -40 -13 -32"
        fill="none" stroke={HAIR} strokeWidth="5.5" strokeLinecap="round"
      />
      {/* Chevron segment marks — V-shapes pointing down for braid weave */}
      <path d="M -18 -64 L -16 -62 L -14 -64" fill="none" stroke="#3a2a20" strokeWidth="0.9" />
      <path d="M -18 -54 L -16 -52 L -14 -54" fill="none" stroke="#3a2a20" strokeWidth="0.9" />
      <path d="M -17 -44 L -15 -42 L -13 -44" fill="none" stroke="#3a2a20" strokeWidth="0.9" />
      {/* Tapered tip — thinner stroke at the bottom */}
      <path d="M -13 -36 L -13 -32" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />
      {/* Red ribbon — small bow */}
      <ellipse cx="-13" cy="-30" rx="3" ry="1.5" fill="#dc2626" stroke={STROKE} strokeWidth="0.6" />
      <path d="M -16 -30 L -14 -32 L -14 -28 Z M -10 -30 L -12 -32 L -12 -28 Z"
        fill="#dc2626" stroke={STROKE} strokeWidth="0.4" />

      {/* RIGHT BRAID — mirror image */}
      <path
        d="M 12 -76 Q 16 -64 16 -52 Q 16 -40 13 -32"
        fill="none" stroke={HAIR} strokeWidth="5.5" strokeLinecap="round"
      />
      <path d="M 14 -64 L 16 -62 L 18 -64" fill="none" stroke="#3a2a20" strokeWidth="0.9" />
      <path d="M 14 -54 L 16 -52 L 18 -54" fill="none" stroke="#3a2a20" strokeWidth="0.9" />
      <path d="M 13 -44 L 15 -42 L 17 -44" fill="none" stroke="#3a2a20" strokeWidth="0.9" />
      <path d="M 13 -36 L 13 -32" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="13" cy="-30" rx="3" ry="1.5" fill="#dc2626" stroke={STROKE} strokeWidth="0.6" />
      <path d="M 10 -30 L 12 -32 L 12 -28 Z M 16 -30 L 14 -32 L 14 -28 Z"
        fill="#dc2626" stroke={STROKE} strokeWidth="0.4" />
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

/**
 * Side-on profile of Tara, facing RIGHT (mirrored to face left via outer scale).
 * Pose controls head tilt, eye direction, and arm positions:
 *   - 'standing': arms at sides, head level, eyes forward
 *   - 'lookingUp': head tilted back, near hand shading brow, eye looks up
 *   - 'lookingDown': head tilted forward, hands at sides, eye looks down
 *   - 'pointing': near arm extended forward, head level
 *   - 'thinking': near hand to chin, head slightly down, eye thoughtful
 *   - 'walking': mid-stride legs, arms swinging
 */
function TaraProfile({ pose }: { pose: TaraPose }) {
  const headTilt = pose === 'lookingUp' ? -18 : pose === 'lookingDown' ? 14 : pose === 'thinking' ? 6 : 0;
  const eyeDir: 'forward' | 'up' | 'down' = pose === 'lookingUp' ? 'up' : pose === 'lookingDown' ? 'down' : 'forward';

  return (
    <g>
      {/* Legs */}
      {pose === 'walking' ? (
        <>
          <path d="M -2 0 L 2 -34 L 5 -34 L 1 0 Z" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" />
          <path d="M 5 0 L 1 -34 L -2 -34 L 2 0 Z" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" strokeLinejoin="round" opacity="0.85" />
        </>
      ) : (
        <>
          <rect x="-5" y="-34" width="6" height="34" rx="2" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" />
          <rect x="2" y="-34" width="6" height="34" rx="2" fill={LEGGINGS} stroke={STROKE} strokeWidth="1" />
        </>
      )}
      <ellipse cx="-2" cy="-1" rx="6" ry="2.5" fill={STROKE} />
      <ellipse cx="6" cy="-1" rx="6" ry="2.5" fill={STROKE} />

      {/* Torso — narrow side profile of the kurta */}
      <path d="M -7 -34 L -5 -68 L 7 -68 L 9 -34 Z" fill={KURTA} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Decorative trim band at the hem */}
      <line x1="-7" y1="-37" x2="9" y2="-37" stroke={KURTA_DARK} strokeWidth="1.2" />
      <line x1="-7" y1="-39" x2="9" y2="-39" stroke="#fbbf24" strokeWidth="0.6" />

      {/* FRONT pigtail braid — drapes over the front shoulder, visible from this angle */}
      <path d="M 8 -75 Q 12 -64 11 -52 Q 10 -42 7 -34"
        fill="none" stroke={HAIR} strokeWidth="5" strokeLinecap="round" />
      <path d="M 9 -64 L 11 -62 L 13 -64" fill="none" stroke="#3a2a20" strokeWidth="0.8" />
      <path d="M 8 -54 L 10 -52 L 12 -54" fill="none" stroke="#3a2a20" strokeWidth="0.8" />
      <ellipse cx="7" cy="-32" rx="2.5" ry="1.3" fill="#dc2626" stroke={STROKE} strokeWidth="0.5" />

      {/* Arms vary by pose */}
      <ProfileArms pose={pose} />

      {/* Neck — visible only on the front side */}
      <path d="M 1 -72 L 1 -66 L 5 -66 L 5 -72 Z" fill={SKIN} stroke={STROKE} strokeWidth="0.8" />

      {/* Head — profile, facing right */}
      <g transform={`rotate(${headTilt}, 4, -86)`}>
        {/* Head silhouette */}
        <path
          d="M -8 -100 Q -10 -90 -8 -82 Q -6 -78 -2 -76 Q 4 -74 10 -76 Q 14 -78 14 -84 Q 14 -94 10 -100 Q 4 -104 -2 -103 Q -6 -103 -8 -100 Z"
          fill={SKIN} stroke={STROKE} strokeWidth="1.2" strokeLinejoin="round"
        />
        {/* Hair top + back */}
        <path
          d="M -8 -100 Q -10 -104 -2 -107 Q 6 -108 12 -103 Q 14 -100 13 -96 Q 11 -98 8 -97 Q 4 -98 0 -96 Q -3 -97 -7 -96 Z"
          fill={HAIR} stroke={STROKE} strokeWidth="0.9" strokeLinejoin="round"
        />
        <path d="M -8 -96 Q -8 -90 -7 -86" fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />

        {/* BACK pigtail braid */}
        <path
          d="M -8 -94 Q -14 -88 -15 -78 Q -16 -68 -13 -58 Q -11 -52 -10 -48"
          fill="none" stroke={HAIR} strokeWidth="5" strokeLinecap="round"
        />
        <path d="M -16 -78 L -14 -76 L -12 -78" fill="none" stroke="#3a2a20" strokeWidth="0.8" />
        <path d="M -15 -68 L -13 -66 L -11 -68" fill="none" stroke="#3a2a20" strokeWidth="0.8" />
        <ellipse cx="-10" cy="-46" rx="2.5" ry="1.3" fill="#dc2626" stroke={STROKE} strokeWidth="0.5" />

        {/* Eye — pupil position shifts with gaze direction */}
        {(() => {
          const px = 7 + (eyeDir === 'down' ? -0.4 : 0);
          const py = -92.5 + (eyeDir === 'up' ? -1.2 : eyeDir === 'down' ? 1.2 : 0);
          return (
            <>
              <ellipse cx="6" cy="-91" rx="2.7" ry="3" fill="white" stroke={STROKE} strokeWidth="0.9" />
              <circle cx={px} cy={py} r="1.6" fill="#1f1410" />
              <circle cx={px + 0.4} cy={py - 0.5} r="0.5" fill="white" />
              {/* Eyelashes */}
              <path d="M 4 -94 L 3.5 -95.5 M 6.5 -94 L 6.5 -96 M 8.5 -94 L 9 -95.5" stroke={STROKE} strokeWidth="0.7" strokeLinecap="round" />
            </>
          );
        })()}

        {/* Eyebrow */}
        <path
          d={eyeDir === 'up' ? "M 3 -96 Q 6 -98 9 -96" : "M 3 -95 Q 6 -97 9 -95"}
          fill="none" stroke={HAIR} strokeWidth="1.4" strokeLinecap="round"
        />

        {/* Nose */}
        <path d="M 11 -88 Q 13 -85 11 -82" fill="none" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />

        {/* Mouth — slight smile, opens wider when "lookingUp" or "thinking" */}
        <path
          d={pose === 'lookingUp' ? "M 7 -78 Q 9 -75 11 -78" : pose === 'lookingDown' ? "M 7 -77 Q 9 -78 11 -77" : "M 7 -78 Q 9 -76 11 -78"}
          fill="none" stroke="#7c2d12" strokeWidth="1.3" strokeLinecap="round"
        />

        {/* Ear + earring stud */}
        <path d="M -3 -88 Q -5 -86 -3 -82" fill="none" stroke={STROKE} strokeWidth="0.8" />
        <circle cx="-3" cy="-83" r="1.2" fill="#fbbf24" stroke={STROKE} strokeWidth="0.5" />
      </g>
    </g>
  );
}

/** Arm rendering for the side-profile body (facing right). */
function ProfileArms({ pose }: { pose: TaraPose }) {
  // Far arm — drawn behind the torso, slightly transparent so it reads as "back arm"
  // Near arm — drawn in front, fully opaque
  // Both anchor at shoulder approx (3, -68) for near, (1, -68) for far.
  const sleeveFill = KURTA;
  const skinFill = SKIN;

  if (pose === 'lookingUp') {
    return (
      <g>
        {/* Far arm — at side */}
        <path d="M -3 -66 L -5 -50 L -6 -38" fill="none" stroke={sleeveFill} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <circle cx="-6" cy="-38" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" opacity="0.9" />
        {/* Near arm — bent up to brow */}
        <path d="M 6 -66 L 14 -78 L 8 -90" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="8" cy="-90" r="3.5" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'pointing') {
    return (
      <g>
        {/* Far arm — at side */}
        <path d="M -3 -66 L -5 -50 L -6 -38" fill="none" stroke={sleeveFill} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <circle cx="-6" cy="-38" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" opacity="0.9" />
        {/* Near arm — extended forward and slightly up */}
        <path d="M 6 -66 L 18 -68 L 30 -64" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="30" cy="-64" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
        {/* Pointing finger */}
        <line x1="30" y1="-64" x2="36" y2="-63" stroke={skinFill} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  }

  if (pose === 'thinking') {
    return (
      <g>
        {/* Far arm — folded across waist */}
        <path d="M -3 -66 L -2 -52 L 3 -50" fill="none" stroke={sleeveFill} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <circle cx="3" cy="-50" r="2.8" fill={skinFill} stroke={STROKE} strokeWidth="0.8" opacity="0.9" />
        {/* Near arm — hand to chin */}
        <path d="M 6 -66 L 12 -76 L 10 -82" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="10" cy="-82" r="3.2" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'lookingDown') {
    return (
      <g>
        <path d="M -3 -66 L -3 -52 L -2 -42" fill="none" stroke={sleeveFill} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <circle cx="-2" cy="-42" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" opacity="0.9" />
        <path d="M 6 -66 L 7 -52 L 7 -42" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="7" cy="-42" r="3.2" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  if (pose === 'walking') {
    return (
      <g>
        {/* Far arm — swinging back */}
        <path d="M -3 -66 L -7 -56 L -7 -44" fill="none" stroke={sleeveFill} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <circle cx="-7" cy="-44" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" opacity="0.9" />
        {/* Near arm — swinging forward */}
        <path d="M 6 -66 L 10 -54 L 10 -42" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
        <circle cx="10" cy="-42" r="3.2" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
      </g>
    );
  }

  // 'standing' — both arms hang at sides
  return (
    <g>
      <path d="M -3 -66 L -4 -52 L -4 -40" fill="none" stroke={sleeveFill} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <circle cx="-4" cy="-40" r="3" fill={skinFill} stroke={STROKE} strokeWidth="0.8" opacity="0.9" />
      <path d="M 6 -66 L 7 -52 L 7 -40" fill="none" stroke={sleeveFill} strokeWidth="6" strokeLinecap="round" />
      <circle cx="7" cy="-40" r="3.2" fill={skinFill} stroke={STROKE} strokeWidth="0.8" />
    </g>
  );
}
