// Ambiente Mundial 2026 superpuesto a la portada: guirnalda de banderines con
// balon y cartel colgando de la misma cuerda. Todo dentro del SVG para que
// escale igual en cualquier resolucion.
// Banderas: España, México, USA, Canadá + banderines amarillos de marca.
const W = 1920;
const ROPE_Y = 12;
const DIP = 95;
const FLAG_W = 64;
const FLAG_H = 78;
const SCALE = 0.85;

type FlagKind = 'es' | 'mx' | 'us' | 'ca' | 'ts';
const SEQ: FlagKind[] = ['es', 'ts', 'mx', 'ts', 'us', 'ts', 'ca', 'ts', 'es', 'ts', 'mx', 'ts', 'us', 'ts', 'ca'];

// Punto y pendiente sobre la cuerda (bezier cuadratica M0,Y Q W/2,Y+DIP W,Y)
function ropePoint(t: number) {
  const y = ROPE_Y * (1 - t) * (1 - t) + 2 * (1 - t) * t * (ROPE_Y + DIP) + ROPE_Y * t * t;
  const x = W * t;
  const dy = 2 * (1 - t) * DIP - 2 * t * DIP;
  const angle = Math.max(-10, Math.min(10, Math.atan2(dy, W) * (180 / Math.PI) * 6));
  return { x, y, angle };
}

function FlagContent({ kind }: { kind: FlagKind }) {
  const w = FLAG_W, h = FLAG_H;
  switch (kind) {
    case 'es':
      return (
        <>
          <rect width={w} height={h * 0.27} fill="#c60b1e" />
          <rect y={h * 0.27} width={w} height={h * 0.46} fill="#ffc400" />
          <rect y={h * 0.73} width={w} height={h * 0.27} fill="#c60b1e" />
        </>
      );
    case 'mx':
      return (
        <>
          <rect width={w / 3} height={h} fill="#006847" />
          <rect x={w / 3} width={w / 3} height={h} fill="#fff" />
          <rect x={(w / 3) * 2} width={w / 3} height={h} fill="#ce1126" />
        </>
      );
    case 'us':
      return (
        <>
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <rect key={i} y={(h / 7) * i} width={w} height={h / 7} fill={i % 2 === 0 ? '#b22234' : '#fff'} />
          ))}
          <rect width={w * 0.48} height={h * 0.42} fill="#3c3b6e" />
          <circle cx={w * 0.13} cy={h * 0.12} r={2} fill="#fff" />
          <circle cx={w * 0.30} cy={h * 0.12} r={2} fill="#fff" />
          <circle cx={w * 0.21} cy={h * 0.24} r={2} fill="#fff" />
          <circle cx={w * 0.38} cy={h * 0.24} r={2} fill="#fff" />
        </>
      );
    case 'ca':
      return (
        <>
          <rect width={w} height={h} fill="#fff" />
          <rect width={w * 0.25} height={h} fill="#d52b1e" />
          <rect x={w * 0.75} width={w * 0.25} height={h} fill="#d52b1e" />
          <path
            d={`M${w / 2},${h * 0.16} l4,8 7,-3 -2,8 7,2 -6,6 4,7 -8,-1 -2,9 -4,-7 -4,7 -2,-9 -8,1 4,-7 -6,-6 7,-2 -2,-8 7,3 z`}
            fill="#d52b1e"
          />
        </>
      );
    case 'ts':
      return (
        <>
          <rect width={w} height={h} fill="#FFC200" />
          <rect width={w} height={h * 0.16} fill="#000" />
          <text x={w / 2} y={h * 0.56} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={15} fill="#000">TS</text>
        </>
      );
  }
}

export default function MundialBunting() {
  const ball = ropePoint(0.40625);

  return (
    <div className="hero-bunting" aria-hidden="true">
      <svg className="bunting-svg" viewBox={`0 0 ${W} 240`} width="100%" preserveAspectRatio="xMidYMin meet">
        <defs>
          <clipPath id="bunting-tri">
            <polygon points={`0,0 ${FLAG_W},0 ${FLAG_W / 2},${FLAG_H}`} />
          </clipPath>
        </defs>
        <path d={`M0,${ROPE_Y} Q${W / 2},${ROPE_Y + DIP} ${W},${ROPE_Y}`} fill="none" stroke="#111" strokeWidth={3} />

        {SEQ.map((kind, i) => {
          const t = (i + 1) / (SEQ.length + 1);
          const { x, y, angle } = ropePoint(t);
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${angle}) scale(${SCALE}) translate(${-FLAG_W / 2},2)`}>
              <g clipPath="url(#bunting-tri)">
                <FlagContent kind={kind} />
                {/* sombra lateral para dar volumen */}
                <polygon points={`0,0 ${FLAG_W},0 ${FLAG_W / 2},${FLAG_H}`} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={2} />
              </g>
            </g>
          );
        })}

        {/* Balon colgando de la cuerda */}
        <g className="bunting-ball-g">
          <line x1={ball.x} y1={ball.y} x2={ball.x} y2={ball.y + 72} stroke="#111" strokeWidth={2} />
          <text x={ball.x} y={ball.y + 102} textAnchor="middle" fontSize={46}>⚽</text>
        </g>
      </svg>
    </div>
  );
}
