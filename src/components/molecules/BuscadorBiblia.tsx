import { useState, useMemo } from 'react';
import { useBuscaVersiculos } from '@/hooks/useBiblia';
import { useQuery } from '@tanstack/react-query';
import client from '@/api/client';

interface BuscadorBibliaProps {
  onSelectVersiculos?: (versiculos: any[]) => void;
}

export const BuscadorBiblia = ({ onSelectVersiculos }: BuscadorBibliaProps) => {
  const [livro, setLivro] = useState<number | ''>('');
  const [capitulo, setCapitulo] = useState<number | ''>('');
  const [traducao, setTraducao] = useState<number>(1);
  const [inicio, setInicio] = useState(1);
  const [fim, setFim] = useState(10);

  // Lista de traduções disponíveis
  const { data: traducoes = [] } = useQuery({
    queryKey: ['traducoes'],
    queryFn: () => client.get('/traducoes').then(r => r.data),
    retry: 1,
  });

  // Busca versículos quando todos os parâmetros estão preenchidos
  const { data: versiculos, isLoading, error } = useBuscaVersiculos(
    livro && capitulo
      ? {
          livro: Number(livro),
          capitulo: Number(capitulo),
          traducaoId: traducao,
          inicio,
          fim,
        }
      : null
  );

  // Nomes dos 66 livros da bíblia
  const livrosNomes = useMemo(
    () => [
      'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
      'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
      '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras',
      'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
      'Eclesiastes', 'Cântico dos Cânticos', 'Isaías', 'Jeremias', 'Lamentações',
      'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós',
      'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque',
      'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
      'Mateus', 'Marcos', 'Lucas', 'João', 'Atos',
      'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
      'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo',
      '2 Timóteo', 'Tito', 'Filemom', 'Hebreus', 'Tiago',
      '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João',
      'Judas', 'Apocalipse',
    ],
    []
  );

  const handleBuscar = () => {
    if (versiculos) {
      onSelectVersiculos?.(versiculos);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h2 className="text-lg font-semibold">Buscador de Bíblia</h2>

      {/* Seleção de Tradução */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tradução
        </label>
        <select
          value={traducao}
          onChange={(e) => setTraducao(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {traducoes.map((trad: any) => (
            <option key={trad.id} value={trad.id}>
              {trad.abreviacao} - {trad.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Seleção de Livro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Livro
          </label>
          <select
            value={livro}
            onChange={(e) => {
              setLivro(e.target.value ? Number(e.target.value) : '');
              setCapitulo('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione um livro</option>
            {livrosNomes.map((nome, idx) => (
              <option key={idx} value={idx + 1}>
                {idx + 1}. {nome}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Capítulo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capítulo
          </label>
          <input
            type="number"
            min="1"
            value={capitulo}
            onChange={(e) => setCapitulo(e.target.value ? Number(e.target.value) : '')}
            placeholder="Ex: 1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Intervalo de Versículos */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Versículo Inicial
          </label>
          <input
            type="number"
            min="1"
            value={inicio}
            onChange={(e) => setInicio(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Versículo Final
          </label>
          <input
            type="number"
            min="1"
            value={fim}
            onChange={(e) => setFim(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Botão de Buscar */}
      <button
        onClick={handleBuscar}
        disabled={!livro || !capitulo || isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isLoading ? 'Buscando...' : 'Buscar Versículos'}
      </button>

      {/* Exibição de Erro */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          Erro ao buscar versículos. Tente novamente.
        </div>
      )}

      {/* Lista de Versículos */}
      {versiculos && versiculos.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">
            {livrosNomes[Number(livro) - 1]} {capitulo}:{inicio}-{fim}
            {versiculos[0]?.traducaoAbreviacao && ` (${versiculos[0].traducaoAbreviacao})`}
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {versiculos.map((versiculo) => (
              <div key={versiculo.id} className="text-sm">
                <strong className="text-blue-600">
                  {versiculo.capitulo}:{versiculo.numero}
                </strong>{' '}
                <span className="text-gray-700">{versiculo.texto}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {versiculos && versiculos.length === 0 && livro && capitulo && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 text-sm">
          Nenhum versículo encontrado para este intervalo.
        </div>
      )}
    </div>
  );
};
