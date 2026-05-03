// Dados mock alinhados aos DTOs reais da API IgrejaV2
// Endpoints reais: /api/auth, /api/eventos, /api/tipos-evento, /api/pessoas,
// /api/familias, /api/presencas, /api/usuarios

window.IGREJA_DATA = (function () {
  // Tipos de evento (TipoEventoResponseDto)
  // PublicoAlvoEnum: 0 Geral, 1 Lideranças, 2 Crianças, 3 Jovens, 4 Adultos, 5 Idosos
  const tiposEvento = [
    { id: 1, nome: "Culto de Celebração", descricao: "Culto público dominical", publicoAlvo: 0, requerPresenca: false, ativo: true },
    { id: 2, nome: "Culto de Oração", descricao: "Encontro semanal de intercessão", publicoAlvo: 0, requerPresenca: true, ativo: true },
    { id: 3, nome: "Estudo Bíblico", descricao: "Estudo das Escrituras", publicoAlvo: 4, requerPresenca: true, ativo: true },
    { id: 4, nome: "Ministério Jovem", descricao: "Encontro semanal da juventude", publicoAlvo: 3, requerPresenca: true, ativo: true },
    { id: 5, nome: "Escola Dominical", descricao: "Classes por faixa etária", publicoAlvo: 0, requerPresenca: true, ativo: true },
    { id: 6, nome: "Reunião de Liderança", descricao: "Pastoral e ministros", publicoAlvo: 1, requerPresenca: true, ativo: true },
    { id: 7, nome: "Encontro Infantil", descricao: "Para crianças até 11 anos", publicoAlvo: 2, requerPresenca: true, ativo: true },
    { id: 8, nome: "Café com Idosos", descricao: "Comunhão da terceira idade", publicoAlvo: 5, requerPresenca: true, ativo: true },
  ];

  // Helper para construir Date sem fuso (mês 0-indexado)
  const dt = (y, m, d, h = 0, min = 0) => new Date(y, m - 1, d, h, min).toISOString();

  // Mês de referência: maio/2026
  const Y = 2026, M = 5;

  // Eventos (EventoResponseDto)
  const eventos = [
    { id: 1, nome: "Culto de Celebração", descricao: "Pregação: Pr. Daniel Almeida — “A graça que sustenta”.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,3,9,0), dataFim: dt(Y,M,3,11,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 2, nome: "Culto de Celebração — Noite", descricao: "Pregação: Pra. Helena Costa — “Servir como Cristo serviu”.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,3,19,0), dataFim: dt(Y,M,3,21,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 3, nome: "Escola Dominical", descricao: "Classes por idade. Tema do trimestre: Cartas de Paulo.", tipoEventoId: 5, tipoEventoNome: "Escola Dominical", dataInicio: dt(Y,M,3,8,0), dataFim: dt(Y,M,3,8,50), local: "Salas de aula", capacidadeMaxima: 200, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 4, nome: "Encontro Infantil", descricao: "Histórias bíblicas, dinâmicas e lanche.", tipoEventoId: 7, tipoEventoNome: "Encontro Infantil", dataInicio: dt(Y,M,3,9,0), dataFim: dt(Y,M,3,11,0), local: "Sala Kids", capacidadeMaxima: 60, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 5, nome: "Culto de Oração", descricao: "Quartas. Intercessão guiada e ceia simples.", tipoEventoId: 2, tipoEventoNome: "Culto de Oração", dataInicio: dt(Y,M,6,19,30), dataFim: dt(Y,M,6,21,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 6, nome: "Estudo Bíblico — Romanos", descricao: "5ª aula da série em Romanos. Capítulo 8.", tipoEventoId: 3, tipoEventoNome: "Estudo Bíblico", dataInicio: dt(Y,M,7,20,0), dataFim: dt(Y,M,7,21,30), local: "Sala de Estudos", capacidadeMaxima: 80, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 7, nome: "Ministério Jovem — JOIA", descricao: "Louvor, comunhão e palavra com a juventude.", tipoEventoId: 4, tipoEventoNome: "Ministério Jovem", dataInicio: dt(Y,M,9,19,30), dataFim: dt(Y,M,9,22,0), local: "Salão Anexo", capacidadeMaxima: 150, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 8, nome: "Culto de Celebração", descricao: "Apresentação de novos membros e Santa Ceia.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,10,9,0), dataFim: dt(Y,M,10,11,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 9, nome: "Culto de Celebração — Noite", descricao: "Tema: famílias firmadas em Cristo.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,10,19,0), dataFim: dt(Y,M,10,21,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 10, nome: "Reunião de Liderança", descricao: "Pastoral, diaconato e ministros.", tipoEventoId: 6, tipoEventoNome: "Reunião de Liderança", dataInicio: dt(Y,M,12,20,0), dataFim: dt(Y,M,12,22,0), local: "Sala Pastoral", capacidadeMaxima: 30, requerInscricao: true, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 11, nome: "Culto de Oração", descricao: "Intercessão pelas famílias.", tipoEventoId: 2, tipoEventoNome: "Culto de Oração", dataInicio: dt(Y,M,13,19,30), dataFim: dt(Y,M,13,21,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 12, nome: "Estudo Bíblico — Romanos", descricao: "6ª aula. Romanos 9.", tipoEventoId: 3, tipoEventoNome: "Estudo Bíblico", dataInicio: dt(Y,M,14,20,0), dataFim: dt(Y,M,14,21,30), local: "Sala de Estudos", capacidadeMaxima: 80, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 13, nome: "Café com Idosos", descricao: "Comunhão e devocional para a 3ª idade.", tipoEventoId: 8, tipoEventoNome: "Café com Idosos", dataInicio: dt(Y,M,15,15,0), dataFim: dt(Y,M,15,17,0), local: "Salão Comunitário", capacidadeMaxima: 60, requerInscricao: true, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 14, nome: "Ministério Jovem — JOIA", descricao: "Noite de testemunhos.", tipoEventoId: 4, tipoEventoNome: "Ministério Jovem", dataInicio: dt(Y,M,16,19,30), dataFim: dt(Y,M,16,22,0), local: "Salão Anexo", capacidadeMaxima: 150, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 15, nome: "Culto de Celebração", descricao: "Domingo de Pentecostes.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,17,9,0), dataFim: dt(Y,M,17,11,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 16, nome: "Culto de Celebração — Noite", descricao: "Pentecostes — celebração noturna.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,17,19,0), dataFim: dt(Y,M,17,21,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 17, nome: "Culto de Oração", descricao: "Vigília de oração até 23h.", tipoEventoId: 2, tipoEventoNome: "Culto de Oração", dataInicio: dt(Y,M,20,19,30), dataFim: dt(Y,M,20,23,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 18, nome: "Estudo Bíblico — Romanos", descricao: "7ª aula. Romanos 12.", tipoEventoId: 3, tipoEventoNome: "Estudo Bíblico", dataInicio: dt(Y,M,21,20,0), dataFim: dt(Y,M,21,21,30), local: "Sala de Estudos", capacidadeMaxima: 80, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 19, nome: "Retiro de Casais", descricao: "Fim de semana fora da cidade. Inscrições abertas.", tipoEventoId: 3, tipoEventoNome: "Estudo Bíblico", dataInicio: dt(Y,M,22,18,0), dataFim: dt(Y,M,24,15,0), local: "Sítio Boa Vista — Atibaia/SP", capacidadeMaxima: 80, requerInscricao: true, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 20, nome: "Culto de Celebração", descricao: "Pregação: Pr. Daniel Almeida.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,24,9,0), dataFim: dt(Y,M,24,11,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },

    { id: 21, nome: "Culto de Oração", descricao: "Intercessão pela cidade.", tipoEventoId: 2, tipoEventoNome: "Culto de Oração", dataInicio: dt(Y,M,27,19,30), dataFim: dt(Y,M,27,21,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 22, nome: "Estudo Bíblico — Romanos", descricao: "8ª aula (encerramento). Romanos 16.", tipoEventoId: 3, tipoEventoNome: "Estudo Bíblico", dataInicio: dt(Y,M,28,20,0), dataFim: dt(Y,M,28,21,30), local: "Sala de Estudos", capacidadeMaxima: 80, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 23, nome: "Ministério Jovem — JOIA", descricao: "Louvor + ceia partilhada.", tipoEventoId: 4, tipoEventoNome: "Ministério Jovem", dataInicio: dt(Y,M,30,19,30), dataFim: dt(Y,M,30,22,0), local: "Salão Anexo", capacidadeMaxima: 150, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
    { id: 24, nome: "Culto de Celebração", descricao: "Último domingo do mês.", tipoEventoId: 1, tipoEventoNome: "Culto de Celebração", dataInicio: dt(Y,M,31,9,0), dataFim: dt(Y,M,31,11,0), local: "Templo principal", capacidadeMaxima: 600, requerInscricao: false, ativo: true, dataCriacao: dt(Y,4,1) },
  ];

  // Avisos / mural
  const avisos = [
    { id: 1, titulo: "Inscrições abertas — Retiro de Casais", resumo: "22 a 24 de maio, em Atibaia. Vagas limitadas.", data: dt(Y,4,28), categoria: "Inscrição" },
    { id: 2, titulo: "Campanha do agasalho", resumo: "Doações até 31 de maio na recepção do templo.", data: dt(Y,4,25), categoria: "Ação social" },
    { id: 3, titulo: "Nova série de estudos: Romanos", resumo: "Toda 5ª-feira às 20h, na sala de estudos.", data: dt(Y,4,20), categoria: "Estudo" },
    { id: 4, titulo: "Mudança no horário do culto de oração", resumo: "A partir de junho, passará a iniciar às 19h30.", data: dt(Y,4,18), categoria: "Aviso geral" },
  ];

  // Pedidos de oração (campo livre, vinculado a Pessoa via PessoaId)
  const oracoes = [
    { id: 1, pessoaNome: "Marina S.", pedido: "Tratamento de saúde da minha mãe — força e fé.", data: dt(Y,4,29), publico: true },
    { id: 2, pessoaNome: "Equipe Pastoral", pedido: "Pelo retiro de casais e pelas famílias inscritas.", data: dt(Y,4,28), publico: true },
    { id: 3, pessoaNome: "Anônimo", pedido: "Direção espiritual em uma decisão importante.", data: dt(Y,4,27), publico: true },
    { id: 4, pessoaNome: "Lucas R.", pedido: "Por uma nova oportunidade profissional.", data: dt(Y,4,26), publico: true },
  ];

  // Sermões / pregações
  const sermoes = [
    { id: 1, titulo: "A graça que sustenta", pregador: "Pr. Daniel Almeida", serie: "Cartas de Paulo", data: dt(Y,4,26), duracao: "42 min", referencia: "Romanos 5" },
    { id: 2, titulo: "Servir como Cristo serviu", pregador: "Pra. Helena Costa", serie: "Avulso", data: dt(Y,4,19), duracao: "38 min", referencia: "Filipenses 2" },
    { id: 3, titulo: "Famílias firmadas", pregador: "Pr. Daniel Almeida", serie: "Avulso", data: dt(Y,4,12), duracao: "44 min", referencia: "Efésios 5" },
    { id: 4, titulo: "O fruto que permanece", pregador: "Pr. Tiago Mendes", serie: "Avulso", data: dt(Y,4,5), duracao: "40 min", referencia: "João 15" },
    { id: 5, titulo: "Andai como filhos da luz", pregador: "Pra. Helena Costa", serie: "Cartas de Paulo", data: dt(Y,3,28), duracao: "39 min", referencia: "Efésios 5" },
    { id: 6, titulo: "A aliança em Cristo", pregador: "Pr. Daniel Almeida", serie: "Cartas de Paulo", data: dt(Y,3,21), duracao: "43 min", referencia: "Hebreus 8" },
  ];

  // Ministérios — derivados de TipoEvento, mas com líder e um pequeno texto
  const ministerios = [
    { id: 1, nome: "Louvor & Adoração", lider: "Mariana Lopes", encontro: "Quartas, 20h", descricao: "Equipe de músicos, vocais e técnica para os cultos." },
    { id: 2, nome: "Juventude (JOIA)", lider: "Pedro Vargas", encontro: "Sábados, 19h30", descricao: "Encontros semanais, comunhão e missão para jovens 15–29." },
    { id: 3, nome: "Infantil (Kids)", lider: "Aline Ferreira", encontro: "Domingos, 9h", descricao: "Ensino bíblico para crianças de 3 a 11 anos." },
    { id: 4, nome: "Casais", lider: "Pr. Daniel & Joana", encontro: "1º sábado do mês", descricao: "Encontros mensais, retiros e aconselhamento." },
    { id: 5, nome: "Ação Social", lider: "Roberto Tavares", encontro: "Plantão semanal", descricao: "Distribuição de cestas, agasalhos e visitas." },
    { id: 6, nome: "Intercessão", lider: "Cláudia Rangel", encontro: "Diário (online)", descricao: "Rede de oração da congregação." },
  ];

  // Programação semanal fixa
  const semanal = [
    { dia: "Domingo", itens: [
      { hora: "08:00", titulo: "Escola Dominical", local: "Salas" },
      { hora: "09:00", titulo: "Culto manhã", local: "Templo" },
      { hora: "19:00", titulo: "Culto noite", local: "Templo" },
    ]},
    { dia: "Quarta",  itens: [{ hora: "19:30", titulo: "Culto de Oração", local: "Templo" }] },
    { dia: "Quinta",  itens: [{ hora: "20:00", titulo: "Estudo Bíblico", local: "Sala de Estudos" }] },
    { dia: "Sábado",  itens: [{ hora: "19:30", titulo: "Ministério Jovem (JOIA)", local: "Anexo" }] },
  ];

  // Pessoas e famílias (admin)
  const pessoas = [
    { id: 1, nome: "Daniel Almeida", dataNascimento: "1979-03-12", sexo: 1, email: "daniel@igreja.org", telefone: "(11) 98888-0001", dataBatismo: "2001-04-15", membroDesde: "2003-08-10", estadoCivil: 2, familiaId: 1, ativo: true },
    { id: 2, nome: "Joana Almeida", dataNascimento: "1981-07-04", sexo: 2, email: "joana@igreja.org", telefone: "(11) 98888-0002", dataBatismo: "2000-12-10", membroDesde: "2003-08-10", estadoCivil: 2, familiaId: 1, ativo: true },
    { id: 3, nome: "Helena Costa", dataNascimento: "1986-11-22", sexo: 2, email: "helena@igreja.org", telefone: "(11) 98888-0003", dataBatismo: "2008-06-01", membroDesde: "2010-02-20", estadoCivil: 2, familiaId: 2, ativo: true },
    { id: 4, nome: "Lucas Ramos", dataNascimento: "1995-02-14", sexo: 1, email: "lucas@igreja.org", telefone: "(11) 98888-0004", dataBatismo: "2014-09-12", membroDesde: "2015-01-05", estadoCivil: 1, familiaId: null, ativo: true },
    { id: 5, nome: "Marina Souza", dataNascimento: "1992-08-30", sexo: 2, email: "marina@igreja.org", telefone: "(11) 98888-0005", dataBatismo: "2011-11-20", membroDesde: "2012-03-04", estadoCivil: 1, familiaId: 3, ativo: true },
    { id: 6, nome: "Pedro Vargas", dataNascimento: "1990-05-19", sexo: 1, email: "pedro@igreja.org", telefone: "(11) 98888-0006", dataBatismo: "2009-10-04", membroDesde: "2010-04-12", estadoCivil: 2, familiaId: 4, ativo: true },
  ];
  const familias = [
    { id: 1, nome: "Família Almeida",  responsavelId: 1, responsavelNome: "Daniel Almeida", totalMembros: 4, ativo: true },
    { id: 2, nome: "Família Costa",    responsavelId: 3, responsavelNome: "Helena Costa",   totalMembros: 3, ativo: true },
    { id: 3, nome: "Família Souza",    responsavelId: 5, responsavelNome: "Marina Souza",   totalMembros: 2, ativo: true },
    { id: 4, nome: "Família Vargas",   responsavelId: 6, responsavelNome: "Pedro Vargas",   totalMembros: 3, ativo: true },
  ];

  // Versículos para a "Bíblia online" (apenas alguns para mock)
  const versiculoDoDia = {
    referencia: "Salmos 23:1",
    texto: "O Senhor é o meu pastor; nada me faltará.",
  };

  // Igreja (estática)
  const igreja = {
    nome: "Comunidade da Graça",
    lema: "Uma igreja para a cidade.",
    endereco: "Rua das Acácias, 248 — Centro, São Paulo/SP",
    telefone: "(11) 3000-0000",
    email: "contato@comunidadedagraca.org",
  };

  return { tiposEvento, eventos, avisos, oracoes, sermoes, ministerios, semanal, pessoas, familias, versiculoDoDia, igreja };
})();
