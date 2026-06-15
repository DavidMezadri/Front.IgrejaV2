import client from '@/api/client';

export interface Versiculo {
  id: number;
  livro: number;
  capitulo: number;
  numero: number;
  texto: string;
  traducaoId: number;
  traducaoAbreviacao?: string;
  dataCriacao: string;
}

export interface BuscaVersiculosParams {
  livro: number;
  capitulo: number;
  traducaoId: number;
  inicio?: number;
  fim?: number;
}

export const bibliaService = {
  // Busca um intervalo de versículos (ex: versículos 1-10 de um capítulo)
  async buscarIntervaloVersiculos(params: BuscaVersiculosParams) {
    const { livro, capitulo, traducaoId, inicio = 1, fim = 10 } = params;

    return client
      .get<Versiculo[]>(
        `/versiculos/livro/${livro}/capitulo/${capitulo}/traducao/${traducaoId}/intervalo`,
        {
          params: {
            inicio,
            fim,
          },
        }
      )
      .then(r => r.data);
  },

  // Busca todos os versículos de um capítulo
  async buscarCapitulo(livro: number, capitulo: number, traducaoId: number) {
    return client
      .get<Versiculo[]>(
        `/versiculos/livro/${livro}/capitulo/${capitulo}/traducao/${traducaoId}`
      )
      .then(r => r.data);
  },

  // Busca todos os versículos de um livro
  async buscarLivro(livro: number, traducaoId: number) {
    return client
      .get<Versiculo[]>(
        `/versiculos/livro/${livro}/traducao/${traducaoId}`
      )
      .then(r => r.data);
  },
};
