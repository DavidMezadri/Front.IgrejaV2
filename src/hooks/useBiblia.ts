import { useQuery } from '@tanstack/react-query';
import { bibliaService, BuscaVersiculosParams, Versiculo } from '@/services/bibliaService';

export const useBuscaVersiculos = (params: BuscaVersiculosParams | null) => {
  return useQuery<Versiculo[]>({
    queryKey: ['versiculos', params?.livro, params?.capitulo, params?.traducaoId, params?.inicio, params?.fim],
    queryFn: async () => {
      if (!params) return [];
      return bibliaService.buscarIntervaloVersiculos(params);
    },
    enabled: !!params,
    retry: 1,
  });
};

export const useBuscaCapitulo = (livro: number | null, capitulo: number | null, traducaoId: number | null) => {
  return useQuery<Versiculo[]>({
    queryKey: ['capitulo', livro, capitulo, traducaoId],
    queryFn: async () => {
      if (!livro || !capitulo || !traducaoId) return [];
      return bibliaService.buscarCapitulo(livro, capitulo, traducaoId);
    },
    enabled: !!livro && !!capitulo && !!traducaoId,
    retry: 1,
  });
};

export const useBuscaLivro = (livro: number | null, traducaoId: number | null) => {
  return useQuery<Versiculo[]>({
    queryKey: ['livro', livro, traducaoId],
    queryFn: async () => {
      if (!livro || !traducaoId) return [];
      return bibliaService.buscarLivro(livro, traducaoId);
    },
    enabled: !!livro && !!traducaoId,
    retry: 1,
  });
};
