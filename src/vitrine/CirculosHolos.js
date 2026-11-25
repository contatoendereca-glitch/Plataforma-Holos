import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Três argolas (Corpo, Alma, Espírito) com o medalhão Holos na interseção.
// Cada argola inteira é um link; o medalhão tem prioridade na sobreposição.
// A camada de reflexo ignora o ponteiro, para não roubar cliques.

const R = 140
const VOLTA_MS = 1400
const INTERVALO_MS = 250

// Cada argola tem uma zona de texto (nome + frase em até duas linhas),
// afastada das interseções e do medalhão.
const ANEIS = [
  { id: 'corpo', nome: 'Corpo', cx: 170, cy: 170, lx: 122, mx: 118, ly: 124, frase: ['Cuidado, expressão', 'e identidade'], curta: ['Cuidado,', 'expressão e', 'identidade'] },
  { id: 'alma', nome: 'Alma', cx: 350, cy: 170, lx: 400, mx: 406, ly: 124, frase: ['Compreender', 'para transformar'], curta: ['Compreender', 'para', 'transformar'] },
  { id: 'espirito', nome: 'Espírito', cx: 260, cy: 320, lx: 260, mx: 260, ly: 362, frase: ['Sentido, consciência', 'e propósito'], curta: ['Sentido,', 'consciência e', 'propósito'] },
]
const MED = { cx: 260, cy: 220, r: 76 }

// Reflexo: arco curto com cauda (três traços sobrepostos, com as pontas alinhadas).
const C = 2 * Math.PI * R
const CAMADAS = [
  { len: 130, w: 6, op: 0.16 },
  { len: 58, w: 5.6, op: 0.5 },
  { len: 20, w: 5.4, op: 1 },
]

function Reflexo({ anel, atraso }) {
  return (
    <g
      className="reflexo"
      style={{
        transformOrigin: `${anel.cx}px ${anel.cy}px`,
        animationDuration: `${VOLTA_MS}ms`,
        animationDelay: `${atraso}ms`,
      }}
    >
      {CAMADAS.map((c, i) => (
        <circle
          key={i}
          cx={anel.cx}
          cy={anel.cy}
          r={R}
          fill="none"
          stroke="url(#ouro-reflexo)"
          strokeWidth={c.w}
          strokeLinecap="round"
          strokeOpacity={c.op}
          strokeDasharray={`${c.len} ${C - c.len}`}
          // pontas alinhadas no topo da argola
          strokeDashoffset={C / 4 + c.len}
          filter={i === 2 ? 'url(#brilho)' : undefined}
        />
      ))}
    </g>
  )
}

export default function CirculosHolos() {
  const navigate = useNavigate()
  // Cada número é uma "volta" pedida; mudar o número reinicia a animação.
  const [voltas, setVoltas] = useState({ corpo: 1, alma: 1, espirito: 1 })
  const [tocado, setTocado] = useState(null)

  function girar(id) {
    setVoltas((v) => ({ ...v, [id]: v[id] + 1 }))
  }

  function ir(e, destino) {
    e.preventDefault()
    navigate(destino)
  }

  return (
    <svg
      className="circulos"
      viewBox="0 0 520 490"
      role="group"
      aria-label="Frentes da Plataforma Holos"
    >
      <defs>
        <linearGradient id="ouro-anel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9C98A" />
          <stop offset="0.45" stopColor="#B8873F" />
          <stop offset="1" stopColor="#D9B06A" />
        </linearGradient>
        <linearGradient id="ouro-reflexo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF6DC" />
          <stop offset="1" stopColor="#F2C978" />
        </linearGradient>
        <radialGradient id="ouro-borda" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#F6DDA0" />
          <stop offset="0.55" stopColor="#C9973F" />
          <stop offset="1" stopColor="#8E6526" />
        </radialGradient>
        <filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="sombra" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#140A04" floodOpacity="0.55" />
        </filter>
        <clipPath id="disco">
          <circle cx={MED.cx} cy={MED.cy} r={MED.r - 5} />
        </clipPath>
      </defs>

      {/* Argolas: links com a área inteira do círculo clicável */}
      {ANEIS.map((a) => (
        <a
          key={a.id}
          href={`/cursos?frente=${a.id}`}
          className={`anel-link ${tocado === a.id ? 'tocado' : ''}`}
          aria-label={`Ver cursos de ${a.nome}: ${a.frase.join(' ')}`}
          onClick={(e) => ir(e, `/cursos?frente=${a.id}`)}
          onMouseEnter={() => girar(a.id)}
          onFocus={() => girar(a.id)}
          onPointerDown={() => setTocado(a.id)}
          onPointerUp={() => setTocado(null)}
          onPointerLeave={() => setTocado(null)}
        >
          <circle className="anel-area" cx={a.cx} cy={a.cy} r={R} />
          <circle className="anel-foco" cx={a.cx} cy={a.cy} r={R + 7} />
          <circle className="anel-base" cx={a.cx} cy={a.cy} r={R} />
          <text className="anel-nome" x={a.lx} y={a.ly} textAnchor="middle" aria-hidden="true">
            {a.nome}
          </text>
          <text className="anel-frase so-largo" x={a.lx} y={a.ly + 30} textAnchor="middle" aria-hidden="true">
            {a.frase.map((linha, i) => (
              <tspan key={i} x={a.lx} dy={i === 0 ? 0 : '1.3em'}>{linha}</tspan>
            ))}
          </text>
          <text className="anel-frase so-estreito" x={a.mx} y={a.ly + 30} textAnchor="middle" aria-hidden="true">
            {a.curta.map((linha, i) => (
              <tspan key={i} x={a.mx} dy={i === 0 ? 0 : '1.1em'}>{linha}</tspan>
            ))}
          </text>
        </a>
      ))}

      {/* Reflexos: passam por trás do medalhão e não recebem cliques */}
      <g className="reflexos" aria-hidden="true">
        {ANEIS.map((a, i) => (
          <Reflexo key={`${a.id}-${voltas[a.id]}`} anel={a} atraso={voltas[a.id] === 1 ? i * INTERVALO_MS : 0} />
        ))}
      </g>

      {/* Medalhão Holos: um único link, por cima de tudo */}
      <a
        href="/cursos?frente=integracao"
        className={`medalhao-link ${tocado === 'holos' ? 'tocado' : ''}`}
        aria-label="Ver cursos de Integração"
        onClick={(e) => ir(e, '/cursos?frente=integracao')}
        onPointerDown={() => setTocado('holos')}
        onPointerUp={() => setTocado(null)}
        onPointerLeave={() => setTocado(null)}
      >
        <circle className="medalhao-foco" cx={MED.cx} cy={MED.cy} r={MED.r + 7} />
        <circle className="medalhao-borda" cx={MED.cx} cy={MED.cy} r={MED.r} filter="url(#sombra)" />
        <image
          href="/img/medalhao-arvore.webp"
          x={MED.cx - MED.r + 5}
          y={MED.cy - MED.r + 5}
          width={(MED.r - 5) * 2}
          height={(MED.r - 5) * 2}
          clipPath="url(#disco)"
          preserveAspectRatio="xMidYMid slice"
        />
        <text className="medalhao-nome" x={MED.cx} y={MED.cy + 55} textAnchor="middle" aria-hidden="true">
          Holos
        </text>
      </a>
    </svg>
  )
}
