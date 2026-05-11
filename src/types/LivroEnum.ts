export enum LivroEnum {
  // Antigo Testamento - Pentateuco
  Genesis = 1,
  Exodo = 2,
  Levitico = 3,
  Numeros = 4,
  Deuteronomio = 5,

  // Antigo Testamento - Históricos
  Josue = 6,
  Juizes = 7,
  Rute = 8,
  Primeiro_Samuel = 9,
  Segundo_Samuel = 10,
  Primeiro_Reis = 11,
  Segundo_Reis = 12,
  Primeiro_Cronicas = 13,
  Segundo_Cronicas = 14,
  Esdras = 15,
  Neemias = 16,
  Ester = 17,

  // Antigo Testamento - Poéticos
  Jo = 18,
  Salmos = 19,
  Proverbios = 20,
  Eclesiastes = 21,
  Cantico_dos_Canticos = 22,

  // Antigo Testamento - Profetas Maiores
  Isaias = 23,
  Jeremias = 24,
  Lamentacoes = 25,
  Ezequiel = 26,
  Daniel = 27,

  // Antigo Testamento - Profetas Menores
  Oseias = 28,
  Joel = 29,
  Amos = 30,
  Obadias = 31,
  Jonas = 32,
  Miqueias = 33,
  Naum = 34,
  Habacuque = 35,
  Sofonias = 36,
  Ageu = 37,
  Zacarias = 38,
  Malaquias = 39,

  // Novo Testamento - Evangelhos
  Mateus = 40,
  Marcos = 41,
  Lucas = 42,
  Joao = 43,

  // Novo Testamento - Atos e Cartas de Paulo
  Atos = 44,
  Romanos = 45,
  Primeira_Corintios = 46,
  Segunda_Corintios = 47,
  Galatas = 48,
  Efesios = 49,
  Filipenses = 50,
  Colossenses = 51,
  Primeira_Tessalonicenses = 52,
  Segunda_Tessalonicenses = 53,
  Primeira_Timoteo = 54,
  Segunda_Timoteo = 55,
  Tito = 56,
  Filemom = 57,

  // Novo Testamento - Hebreus
  Hebreus = 58,

  // Novo Testamento - Cartas Gerais
  Tiago = 59,
  Primeira_Pedro = 60,
  Segunda_Pedro = 61,
  Primeira_Joao = 62,
  Segunda_Joao = 63,
  Terceira_Joao = 64,
  Judas = 65,

  // Novo Testamento - Apocalipse
  Apocalipse = 66,
}

// Helper para converter enum para array de opções
export const livroOptions = Object.entries(LivroEnum)
  .filter(([key]) => isNaN(Number(key)))
  .map(([nome, id]) => ({
    id: id as number,
    nome: nome.replace(/_/g, ' '),
  }))
