// Catálogo de cursos da Plataforma Holos (vitrine).
// Fonte: Holos_catalogo_cursos.txt e I10_00_curso.md (Drive, pasta Plataforma Holos).
// Preços e cargas horárias do catálogo são PROPOSTAS: não aparecem no site.
//
// Para ativar a compra de um curso, preencha `kiwify` com o link da Kiwify
// em LINKS_KIWIFY (no fim deste arquivo). Sem link, o curso aparece como "Em breve".

// As três frentes do catálogo (abas). Integração é apresentada na página Sobre,
// como parte da metodologia Lente Holos.
export const CAMINHOS = [
  {
    id: 'corpo',
    nome: 'Corpo',
    lema: 'O cuidado e a expressão da identidade.',
    frase: 'Cuidado, expressão e identidade',
    texto: 'Imagem, autocuidado, sono, respiração e a escuta dos sinais do corpo.',
  },
  {
    id: 'alma',
    nome: 'Alma',
    lema: 'Compreender para transformar.',
    frase: 'Compreender para transformar',
    texto: 'Psicanálise, psicologia e neurociência para compreender emoções e padrões.',
  },
  {
    id: 'espirito',
    nome: 'Espírito',
    lema: 'Sentido, consciência e propósito.',
    frase: 'Sentido, consciência e propósito',
    texto: 'Sabedoria bíblica, discernimento e propósito, numa fé cristã ampla.',
  },
]

export const INTEGRACAO = {
  id: 'integracao',
  nome: 'Integração',
  lema: 'Reconhecer-se por inteiro.',
}

// Primeiros lançamentos, na ordem de prioridade.
export const PRIMEIROS = ['I10', 'E01', 'I13', 'C01', 'I06']

// [código, título, resumo]
const LISTA = [
  // ── CORPO
  ['C01', 'Coloração Pessoal: Descubra suas Cores', 'Teoria das cores, subtom, contraste, cartelas sazonais e aplicação das cores na imagem pessoal.'],
  ['C02', 'Coloração Pessoal: Capacitação Técnica', 'Método sazonal expandido, análise cromática, tecidos, harmonização e estudos de caso.'],
  ['C03', 'Consultoria de Imagem e Estilo', 'Estilos pessoais, proporções, modelagens, composição de looks e guarda-roupa.'],
  ['C04', 'Visagismo e Harmonia Facial', 'Proporções faciais, linhas, formas, cabelos, acessórios, maquiagem e harmonia visual.'],
  ['C05', 'Beleza, Estética e Autoestima', 'Autoimagem, padrões de beleza, autocuidado, autoestima e autenticidade.'],
  ['C06', 'Automaquiagem e Beleza Consciente', 'Preparação da pele, produtos, técnicas, cores e maquiagem para diferentes ocasiões.'],
  ['C07', 'Skincare e Cuidados com a Pele', 'Fundamentos da pele, cosméticos, hidratação, fotoproteção e rotina de cuidados.'],
  ['C08', 'Armário Inteligente', 'Armário cápsula, peças essenciais, combinações, acessórios e consumo consciente.'],
  ['C09', 'Linguagem Corporal e Comunicação', 'Gestos, postura, expressões, voz, presença e comunicação não verbal, sem interpretações diagnósticas.'],
  ['C10', 'Consciência Corporal e Emoções', 'Interocepção, sistema nervoso, estresse, sinais corporais e autorregulação.'],
  ['C11', 'Neurociência do Sono', 'Ritmos biológicos, memória, aprendizagem, sono e hábitos saudáveis.'],
  ['C12', 'Alimentação Consciente', 'Fome, saciedade, emoções, atenção durante as refeições e relação saudável com a alimentação.'],
  ['C13', 'Respiração e Serenidade', 'Fisiologia da respiração, relaxamento e práticas seguras de autorregulação.'],
  ['C14', 'Beleza Madura e Envelhecimento Saudável', 'Transformações naturais, imagem pessoal, autocuidado, vitalidade e autoestima.'],
  ['C15', 'A Mulher e as Transformações da Maturidade', 'Transições hormonais, emoções, sono, identidade, relacionamentos e novos projetos.'],
  ['C16', 'Imagem e Identidade', 'Imagem pessoal, percepção social, autenticidade, identidade e expressão visual.'],
  // ── ALMA
  ['A01', 'Introdução à Psicanálise: Freud', 'Inconsciente, estrutura psíquica, pulsões, desenvolvimento, mecanismos de defesa, sonhos e transferência.'],
  ['A02', 'Introdução à Psicologia Analítica: Jung', 'Estrutura da psique, complexos, inconsciente coletivo, arquétipos, tipos psicológicos e individuação.'],
  ['A03', 'Sonhos: O Que Revelam Sobre Nós?', 'Neurociência dos sonhos, Freud, Jung, simbolismo, memória, narrativas bíblicas e diário de sonhos.'],
  ['A04', 'Arquétipos e Identidade', 'Padrões simbólicos, persona, imagens recorrentes, narrativas e identidade.'],
  ['A05', 'Sombra, Persona e Individuação', 'Papéis sociais, aspectos não reconhecidos, projeções, conflitos e amadurecimento.'],
  ['A06', 'PNL: Introdução e Aplicações', 'Linguagem, comunicação, rapport, reenquadramento, objetivos e avaliação crítica das evidências.'],
  ['A07', 'Neurociência Aplicada à Vida', 'Cérebro, sistema nervoso, emoções, memória, atenção, motivação e tomada de decisões.'],
  ['A08', 'Neuroplasticidade e Mudança de Hábitos', 'Aprendizagem, plasticidade cerebral, repetição, recompensas, ambiente e comportamento.'],
  ['A09', 'Inteligência Emocional', 'Reconhecimento emocional, autorregulação, empatia, comunicação e conflitos.'],
  ['A10', 'Psicologia Positiva', 'Bem-estar, modelo PERMA, forças de caráter, gratidão, relacionamentos e sentido.'],
  ['A11', 'Mindfulness e Regulação Emocional', 'Atenção consciente, percepção corporal, automatismos, aceitação e práticas seculares de mindfulness.'],
  ['A12', 'Ansiedade: Compreender para Cuidar', 'Medo, preocupação, antecipação, sistema nervoso, estratégias de regulação e busca de apoio.'],
  ['A13', 'Procrastinação e Autossabotagem', 'Evitação emocional, perfeccionismo, funções executivas, recompensas e planejamento.'],
  ['A14', 'Crenças e Padrões de Pensamento', 'Aprendizagem, crenças, pensamentos automáticos, distorções cognitivas e novas perspectivas.'],
  ['A15', 'Infância e Padrões Emocionais', 'Desenvolvimento, apego, experiências adversas, estratégias de proteção e padrões relacionais.'],
  ['A16', 'Mecanismos de Defesa do Ego', 'Repressão, negação, projeção, racionalização, deslocamento e outras defesas.'],
  ['A17', 'Teoria do Apego e Vínculos Afetivos', 'Segurança afetiva, vínculos, padrões de apego e relacionamentos na vida adulta.'],
  ['A18', 'Dependência Emocional e Autonomia', 'Necessidade de aprovação, medo de abandono, autoestima, limites e autonomia.'],
  ['A19', 'Comunicação Não Violenta', 'Observação, sentimentos, necessidades, pedidos, escuta e resolução de conflitos.'],
  ['A20', 'Temperamento, Personalidade e Caráter', 'Temperamentos clássicos, genética, ambiente, personalidade, valores e modelos contemporâneos.'],
  ['A21', 'Metacognição: Pensar Sobre os Pensamentos', 'Ruminação, preocupação, consciência dos processos mentais e flexibilidade da atenção.'],
  ['A22', 'Desfusão Cognitiva e Flexibilidade Psicológica', 'Pensamentos, aceitação, distanciamento cognitivo, valores e ação comprometida.'],
  ['A23', 'Introdução à Logoterapia', 'Viktor Frankl, vontade de sentido, liberdade, responsabilidade e propósito.'],
  ['A24', 'Filosofia Aplicada à Vida', 'Sócrates, conhecimento, ética, virtudes, escolhas e filosofia cristã.'],
  ['A25', 'Estoicismo e Equilíbrio Emocional', 'Controle, julgamentos, virtudes, disciplina e diálogo crítico com o cristianismo.'],
  ['A26', 'Luto, Perdas e Recomeços', 'Processos de luto, memória, vínculos, sofrimento, acolhimento e esperança.'],
  ['A27', 'Memória, Aprendizagem e Desenvolvimento Humano', 'Memória, atenção, aprendizagem, esquecimento, estratégias de estudo e plasticidade.'],
  ['A28', 'O Poder da Atenção', 'Distrações, foco, multitarefa, sobrecarga cognitiva e atenção consciente.'],
  ['A29', 'Neurociência da Motivação e da Disciplina', 'Sistema de recompensa, motivação, esforço, tomada de decisão e constância.'],
  ['A30', 'Psicologia das Relações Humanas', 'Vínculos, expectativas, comunicação, conflitos, reciprocidade e limites.'],
  // ── ESPÍRITO
  ['E01', 'Princípios que Sustentam a Vida', 'Princípios de sabedoria bíblica sobre responsabilidade, renovação, semeadura, escolhas e propósito.'],
  ['E02', 'Identidade Diante de Deus', 'Imagem e semelhança, graça, pertencimento, dignidade, identidade e coerência.'],
  ['E03', 'Corpo, Alma e Espírito na Bíblia', 'Antropologia bíblica, termos hebraicos e gregos, integralidade e perspectivas cristãs.'],
  ['E04', 'Consciência e Discernimento', 'Consciência moral, pensamentos, intenções, prudência, liberdade e responsabilidade.'],
  ['E05', 'O Fruto do Espírito e a Maturidade Emocional', 'Os nove aspectos do fruto do Espírito, comportamento, relacionamentos e amadurecimento.'],
  ['E06', 'Sabedoria para Viver: Salmos, Provérbios e Eclesiastes', 'Expressão emocional, discernimento, sabedoria, sentido da existência e reflexão cotidiana.'],
  ['E07', 'Jesus e a Transformação Interior', 'Evangelhos, parábolas, intenções, misericórdia, responsabilidade e transformação.'],
  ['E08', 'Renovação da Mente', 'Romanos 12:2, pensamentos, crenças, hábitos, discernimento e coerência.'],
  ['E09', 'Perdão, Arrependimento e Reconciliação', 'Responsabilidade, perdão, reparação, limites, justiça e recomeços.'],
  ['E10', 'Silêncio, Oração e Descanso', 'Oração, contemplação cristã, descanso, presença e reflexão bíblica.'],
  ['E11', 'Propósito e Sentido da Existência', 'Vocação, talentos, valores, serviço, escolhas e projeto de vida.'],
  ['E12', 'Raízes Hebraicas da Fé Cristã', 'História de Israel, Torá, alianças, festas bíblicas e contexto judaico de Jesus.'],
  ['E13', 'Simbolismo e Linguagem da Bíblia', 'Metáforas, parábolas, vestes, elementos culturais, gêneros literários e interpretação contextual.'],
  ['E14', 'Fé, Razão e Ciência', 'Conhecimento científico, filosofia, fé cristã, experiência religiosa e diálogo entre saberes.'],
  ['E15', 'Mulheres da Bíblia: Identidade e Propósito', 'Contextos históricos, narrativas femininas, coragem, sabedoria, escolhas e responsabilidade.'],
  ['E16', 'Sabedoria para os Relacionamentos', 'Amor, respeito, comunicação, limites, reciprocidade e princípios bíblicos.'],
  ['E17', 'O Descanso em uma Vida Acelerada', 'Produtividade, descanso, limites, ansiedade, contentamento e confiança.'],
  ['E18', 'Parábolas: Lições para a Vida', 'Contexto dos ensinamentos de Jesus, interpretação, valores e aplicações contemporâneas.'],
  // ── INTEGRAÇÃO
  ['I01', 'Introdução às Terapias Integrativas', 'Integralidade, práticas complementares, autocuidado, evidências, ética e limites de atuação.'],
  ['I02', 'Psicossomática: Corpo e Emoções', 'Relações corpo-mente, estresse, percepção de sintomas, teorias psicossomáticas e limites interpretativos.'],
  ['I03', 'Aromaterapia: Fundamentos e Segurança', 'Óleos essenciais, olfato, memória, evidências, diluição e contraindicações.'],
  ['I04', 'Arte e Expressão Emocional', 'Criatividade, desenho, pintura, colagem, expressão e reflexão pessoal.'],
  ['I05', 'Música, Memória e Emoções', 'Percepção auditiva, memória, ritmo, emoções, música e expressão da fé.'],
  ['I06', 'Escrita Expressiva e Diário Reflexivo', 'Nomeação emocional, organização dos pensamentos, narrativas pessoais e diário.'],
  ['I07', 'Biblioterapia e Leitura Reflexiva', 'Leitura, identificação, narrativas, significados e roteiros de reflexão.'],
  ['I08', 'Escuta Ativa e Acolhimento', 'Empatia, presença, perguntas abertas, comunicação, ética e encaminhamento.'],
  ['I09', 'Condução de Rodas de Reflexão', 'Planejamento, facilitação de grupos, comunicação, confidencialidade e projeto prático acompanhado.'],
  ['I10', 'Holos Identidade: Quem Sou Eu?', 'Corpo, alma, espírito, condicionamentos, personalidade, identidade diante de Deus e integração.'],
  ['I11', 'Para Dentro: A Jornada do Autoconhecimento', 'Infância, serenidade, busca, consolidação, continuidade e mensagem ao passado.'],
  ['I12', 'A Mente Renovada', 'Neuroplasticidade, crenças, condicionamentos, regulação emocional e renovação bíblica da mente.'],
  ['I13', 'Da Ansiedade à Serenidade', 'Sistema nervoso, pensamentos, emoções, autorregulação, fé e uma jornada prática de 21 dias.'],
  ['I14', 'Da Sombra à Consciência', 'Inconsciente, sombra, defesas, projeções, responsabilidade e amadurecimento.'],
  ['I15', 'Inteira: A Mulher em Suas Múltiplas Dimensões', 'Identidade feminina, corpo, autoimagem, emoções, autonomia, vínculos, fé e propósito.'],
  ['I16', 'Constância: Do Desejo à Ação', 'Procrastinação, motivação, disciplina, hábitos, planejamento e uma jornada prática de 30 dias.'],
  ['I17', 'Relacionamentos com Consciência e Propósito', 'Identidade, vínculos, comunicação, expectativas, limites, perdão e respeito.'],
  ['I18', 'Resiliência: Aprender a Recomeçar', 'Adversidades, flexibilidade psicológica, recursos internos, esperança e reconstrução.'],
  ['I19', 'A Arte de Ser Você', 'Autenticidade, papéis sociais, aprovação, comparação, identidade e valores.'],
  ['I20', 'Consciência: O Despertar da Responsabilidade', 'Consciência psicológica, metacognição, inconsciente, discernimento bíblico e escolhas.'],
  ['I21', 'Acolher sem Absorver', 'Empatia, limites emocionais, sobrecarga, responsabilidade e autocuidado.'],
  ['I22', 'Introdução à Metodologia Holos', 'Fundamentos da Holos, três perspectivas, Lente Holos, Mapa Holos, diário e integração.'],
]

// Detalhes extras dos cursos que já têm ficha (formato-importacao-cursos).
const DETALHES = {
  I10: {
    subtitulo: 'Corpo, alma e espírito na descoberta de quem somos diante de Deus',
    apresenta: 'Fernanda Lima, com participação da Almiah',
    descricao: [
      'Reconheça como sua história, seu corpo e seus condicionamentos participam da construção da identidade. Pela Lente Holos, reflita sobre quem você é diante de Deus e como viver de maneira mais coerente com essa identidade.',
      'Curso autoral de autoconhecimento da Plataforma Holos. Propõe distinguir identidade, personalidade, papéis sociais e padrões aprendidos, integrando três perspectivas sem confundi-las: neurociência, psicanálise e psicologia, e fé cristã. Oferece instrumentos de auto-observação, discernimento e escolhas conscientes, sem prometer cura ou transformação garantida. O Mapa Holos pessoal sintetiza a aprendizagem.',
      'É a porta de entrada da plataforma: apresenta os grandes temas da Holos e indica cursos para quem quiser se aprofundar.',
    ],
    paraQuem: 'Adultos cristãos de diferentes tradições e simpatizantes interessados em autoconhecimento, identidade, sentido e coerência entre valores e ações.',
    paraQuemNao: 'Pessoas que procuram diagnóstico, tratamento, formação clínica ou habilitação profissional. O curso não substitui terapia nem tratamento de saúde.',
    objetivos: [
      'Distinguir identidade, personalidade, papéis e condicionamentos.',
      'Reconhecer sinais corporais, hábitos e respostas emocionais.',
      'Compreender conceitos introdutórios de Freud e Jung, respeitando suas diferenças.',
      'Identificar padrões aprendidos sem reduzir a pessoa à sua história.',
      'Refletir sobre identidade diante de Deus, discernimento e responsabilidade.',
      'Elaborar um Mapa Holos pessoal e uma ação concreta de integração.',
    ],
    preRequisitos: 'Nenhum conhecimento técnico prévio. Disponibilidade para reflexão e registro no diário, respeitando limites pessoais.',
    modulos: [
      'Boas-vindas',
      'Quem sou eu? Identidade e construção do eu',
      'Espírito: identidade diante de Deus',
      'Corpo: o organismo que aprende e responde',
      'Alma: história pessoal e condicionamentos (Freud)',
      'Personalidade: persona, sombra e individuação (Jung)',
      'Integração: da consciência à ação',
      'Lente Holos',
      'Encerramento: meu Mapa Holos pessoal',
    ],
  },
}

// Cursos que são introdução teórica a abordagens clínicas.
const INTRODUCAO_TEORICA = ['A01', 'A02']

// Links de compra da Kiwify. Ex.: I10: 'https://pay.kiwify.com.br/xxxx'
const LINKS_KIWIFY = {}

const FRENTE_DA_LETRA = { C: ['corpo'], A: ['alma'], E: ['espirito'], I: ['integracao'] }

// Cursos de Integração (I) aparecem somente na frente Integração.
// Capas dos cursos (imagens em public/img). Enquanto um curso não tem foto própria,
// o card mostra o ícone da frente. Quando a foto chegar, basta incluí-la aqui
// (como em A01 e A02) e o ícone é substituído automaticamente.
const CAPAS = {
  A01: '/img/capa-a01.webp',
  A02: '/img/capa-a02.webp',
}

export const STATUS_PADRAO = 'Em breve'

export const CURSOS = LISTA.map(([codigo, titulo, resumo]) => ({
  codigo,
  titulo,
  resumo,
  frentes: FRENTE_DA_LETRA[codigo[0]],
  integracao: codigo[0] === 'I',
  capa: CAPAS[codigo] || null,
  primeiro: PRIMEIROS.includes(codigo),
  introducaoTeorica: INTRODUCAO_TEORICA.includes(codigo),
  kiwify: LINKS_KIWIFY[codigo] || null,
  status: LINKS_KIWIFY[codigo] ? 'Inscrições abertas' : STATUS_PADRAO,
  ...(DETALHES[codigo] || {}),
}))

export function buscarCurso(codigo) {
  return CURSOS.find((c) => c.codigo.toLowerCase() === String(codigo).toLowerCase())
}

export function buscarCaminho(id) {
  return id === INTEGRACAO.id ? INTEGRACAO : CAMINHOS.find((c) => c.id === id)
}

// Cursos de uma frente: primeiros lançamentos antes, depois pela ordem do catálogo.
export function cursosDaFrente(id) {
  return CURSOS.filter((c) => c.frentes.includes(id)).sort(
    (a, b) => Number(b.primeiro) - Number(a.primeiro) || PRIMEIROS.indexOf(a.codigo) - PRIMEIROS.indexOf(b.codigo)
  )
}

export const METODOLOGIA = [
  'Boas-vindas e orientação',
  'Seis módulos de conteúdo',
  'Aulas narradas e materiais visuais',
  'Curiosidades e intervenções da Almiah',
  'Mini-Lente Holos ao final de cada módulo',
  'Módulo-assinatura Lente Holos',
  'Apostilas e referências bibliográficas',
  'Mapas mentais',
  'Diário reflexivo',
  'Atividades e avaliações',
  'Mapa Holos pessoal',
  'Certificado de conclusão de curso livre',
]

export const PERGUNTAS_DIARIO = [
  ['Corpo', 'O que meu corpo percebeu?'],
  ['Alma', 'O que minha alma reconheceu?'],
  ['Espírito', 'O que meu espírito escolhe?'],
  ['Integração', 'Qual pequena ação posso realizar?'],
]
