// Ícones de linha fina, decorativos, para as frentes (bronze escuro via currentColor).

const DESENHOS = {
  // Silhueta frontal de corpo inteiro
  corpo: (
    <>
      <circle cx="16" cy="5.2" r="3" />
      <path d="M12.6 10.4h6.8c1.3 0 2.3 1 2.3 2.3v6.6c0 .6-.5 1.1-1.1 1.1h-1.1v8.6c0 .6-.5 1.1-1.1 1.1h-.9c-.6 0-1.1-.5-1.1-1.1v-6.7h-.8v6.7c0 .6-.5 1.1-1.1 1.1h-.9c-.6 0-1.1-.5-1.1-1.1V20.4h-1.1c-.6 0-1.1-.5-1.1-1.1v-6.6c0-1.3 1-2.3 2.3-2.3z" />
    </>
  ),
  // Perfil humano com balão de fala
  alma: (
    <>
      <path d="M4.5 30v-3.6c-1.6-1.7-2.5-4-2.5-6.6 0-5.3 4.2-9.3 9.6-9.3 4.3 0 7.6 2.6 8.2 6.3l1.9 3.4c.2.4 0 .8-.4.9l-1.5.4v2.6c0 1.4-1.1 2.5-2.5 2.5h-2.7V30" />
      <path d="M20.5 2.5h8c1 0 1.7.8 1.7 1.7v4.4c0 1-.8 1.7-1.7 1.7h-4.1l-2.7 2.3v-2.3h-1.2c-1 0-1.7-.8-1.7-1.7V4.2c0-1 .8-1.7 1.7-1.7z" />
    </>
  ),
  // Bíblia aberta com pequena cruz
  espirito: (
    <>
      <path d="M16 1.8v6.4M13.6 4.1h4.8" />
      <path d="M16 12.2c-3.1-2-7.3-2.6-12.5-2.1v16.4c5.2-.5 9.4.1 12.5 2.1 3.1-2 7.3-2.6 12.5-2.1V10.1c-5.2-.5-9.4.1-12.5 2.1z" />
      <path d="M16 12.2v16.4" />
    </>
  ),
  // Três argolas sobrepostas, duas acima e uma abaixo, centro vazio
  integracao: (
    <>
      <circle cx="11.6" cy="12" r="7.2" />
      <circle cx="20.4" cy="12" r="7.2" />
      <circle cx="16" cy="19.6" r="7.2" />
    </>
  ),
}

export default function IconeFrente({ frente, tamanho = 30, className = '' }) {
  return (
    <svg
      className={`icone-frente ${className}`}
      viewBox="0 0 32 32"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {DESENHOS[frente]}
    </svg>
  )
}
