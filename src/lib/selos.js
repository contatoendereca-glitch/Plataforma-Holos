// Selos de Evolução do Profissional — critérios baseados no que já temos:
// conteúdos aprovados enviados + pontos_ajudou (marcados por usuários em
// "Isso me ajudou"). Não usa "indicações" porque essa feature não existe
// ainda no app.
export const SELOS = [
  {
    nivel: 3,
    nome: "Embaixador Holos",
    descricao: "Ajuda a expandir a rede e fortalecer a comunidade.",
    requisitoConteudos: 5,
    requisitoPontos: 15,
  },
  {
    nivel: 2,
    nome: "Facilitador Holos",
    descricao: "Contribui regularmente para a jornada dos usuários.",
    requisitoConteudos: 3,
    requisitoPontos: 5,
  },
  {
    nivel: 1,
    nome: "Colaborador Holos",
    descricao: "Compartilhando conhecimento na Plataforma.",
    requisitoConteudos: 1,
    requisitoPontos: 0,
  },
];

export function calcularSelo(conteudosAprovados, pontosAjudou) {
  for (const selo of SELOS) {
    if (conteudosAprovados >= selo.requisitoConteudos && pontosAjudou >= selo.requisitoPontos) {
      return selo;
    }
  }
  return null;
}

export function proximoSelo(seloAtual) {
  if (!seloAtual) return SELOS[SELOS.length - 1]; // Colaborador é o próximo de "nenhum"
  const idx = SELOS.findIndex((s) => s.nivel === seloAtual.nivel);
  return idx > 0 ? SELOS[idx - 1] : null; // já é o mais alto
}
