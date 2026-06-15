#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para gerar SQL INSERT dos versículos da Bíblia a partir dos JSONs
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime

# Mapeamento dos nomes de livros para números (1-66)
LIVROS_MAPEAMENTO = {
    # Pentateuco
    "gênesis": 1,
    "genesis": 1,
    "êxodo": 2,
    "exodo": 2,
    "levítico": 3,
    "levitico": 3,
    "números": 4,
    "numeros": 4,
    "deuteronômio": 5,
    "deuteronomio": 5,
    # Históricos
    "josué": 6,
    "josue": 6,
    "juízes": 7,
    "juizes": 7,
    "rute": 8,
    "1 samuel": 9,
    "2 samuel": 10,
    "1 reis": 11,
    "2 reis": 12,
    "1 crônicas": 13,
    "1 cronicas": 13,
    "2 crônicas": 14,
    "2 cronicas": 14,
    "esdras": 15,
    "neemias": 16,
    "ester": 17,
    # Poéticos
    "jó": 18,
    "jo": 18,
    "salmos": 19,
    "provérbios": 20,
    "proverbios": 20,
    "eclesiastes": 21,
    "cântico dos cânticos": 22,
    "canticos": 22,
    # Profetas Maiores
    "isaías": 23,
    "isaias": 23,
    "jeremias": 24,
    "lamentações": 25,
    "lamentacoes": 25,
    "lamentações de jeremias": 25,
    "lamentacoes de jeremias": 25,
    "ezequiel": 26,
    "daniel": 27,
    # Profetas Menores
    "oséias": 28,
    "oseias": 28,
    "joel": 29,
    "amós": 30,
    "amos": 30,
    "obadias": 31,
    "jonas": 32,
    "miqueias": 33,
    "naum": 34,
    "habacuque": 35,
    "sofonias": 36,
    "ageu": 37,
    "zacarias": 38,
    "malaquias": 39,
    # Evangelhos
    "mateus": 40,
    "marcos": 41,
    "lucas": 42,
    "joão": 43,
    "joao": 43,
    # Atos
    "atos": 44,
    # Epístolas de Paulo
    "romanos": 45,
    "1 coríntios": 46,
    "1 corintios": 46,
    "2 coríntios": 47,
    "2 corintios": 47,
    "gálatas": 48,
    "galatas": 48,
    "efésios": 49,
    "efesios": 49,
    "filipenses": 50,
    "colossenses": 51,
    "1 tessalonicenses": 52,
    "2 tessalonicenses": 53,
    "1 timóteo": 54,
    "1 timoteo": 54,
    "2 timóteo": 55,
    "2 timoteo": 55,
    "tito": 56,
    "filemom": 57,
    # Hebreus
    "hebreus": 58,
    # Epístolas Gerais
    "tiago": 59,
    "1 pedro": 60,
    "2 pedro": 61,
    "1 joão": 62,
    "1 joao": 62,
    "2 joão": 63,
    "2 joao": 63,
    "3 joão": 64,
    "3 joao": 64,
    "judas": 65,
    # Apocalipse
    "apocalipse": 66,
}

# Mapeamento de diretórios para traduções
TRADUCOES = {
    "biblia_aa": {
        "id": 1,
        "nome": "Almeida Atualizada",
        "abreviacao": "AA",
        "descricao": "Tradução Almeida Atualizada"
    },
    "biblia_acf": {
        "id": 2,
        "nome": "Almeida Corrigida Fiel",
        "abreviacao": "ACF",
        "descricao": "Tradução Almeida Corrigida Fiel"
    },
    "biblia_nvi": {
        "id": 3,
        "nome": "Nova Versão Internacional",
        "abreviacao": "NVI",
        "descricao": "Tradução Nova Versão Internacional"
    }
}


def extrair_nome_livro_do_arquivo(nome_arquivo: str) -> str:
    """Extrai o nome do livro do nome do arquivo, removendo o .json"""
    return nome_arquivo.replace(".json", "").strip()


def normalizar_nome_livro(nome: str) -> str:
    """Normaliza o nome do livro para buscar no mapeamento"""
    return nome.lower().strip()


def buscar_numero_livro(nome_livro: str) -> int:
    """Retorna o número do livro ou None se não encontrado"""
    nome_normalizado = normalizar_nome_livro(nome_livro)
    return LIVROS_MAPEAMENTO.get(nome_normalizado)


def escapar_sql(texto: str) -> str:
    """Escapa caracteres especiais para SQL"""
    if texto is None:
        return "NULL"
    # Escapa aspas simples duplicando-as
    texto_escapado = texto.replace("'", "''")
    return f"'{texto_escapado}'"


def processar_arquivo_biblia(caminho_arquivo: str, traducao_codigo: str) -> List[Tuple]:
    """
    Processa um arquivo JSON de um livro da Bíblia e retorna lista de tuplas
    (livro_numero, capitulo, versículo_numero, texto)
    """
    versiculos_processados = []

    try:
        # Tenta com UTF-8 BOM primeiro, se falhar, tenta sem
        try:
            with open(caminho_arquivo, 'r', encoding='utf-8-sig') as f:
                conteudo = json.load(f)
        except:
            with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                conteudo = json.load(f)

        nome_arquivo = os.path.basename(caminho_arquivo)
        nome_livro = extrair_nome_livro_do_arquivo(nome_arquivo)
        numero_livro = buscar_numero_livro(nome_livro)

        if numero_livro is None:
            print(f"[AVISO] Livro '{nome_livro}' não encontrado no mapeamento")
            return versiculos_processados

        # Estrutura: [{"1": {"1": "texto", "2": "texto"...}}, {"2": {"1": "texto"...}}]
        for capitulo_dict in conteudo:
            for numero_capitulo_str, versiculos_dict in capitulo_dict.items():
                numero_capitulo = int(numero_capitulo_str)

                for numero_versículo_str, texto_versículo in versiculos_dict.items():
                    numero_versículo = int(numero_versículo_str)

                    versiculos_processados.append((
                        numero_livro,
                        numero_capitulo,
                        numero_versículo,
                        texto_versículo
                    ))

        print(f"[OK] Processado: {nome_livro} ({len(versiculos_processados)} versículos)")
        return versiculos_processados

    except json.JSONDecodeError as e:
        print(f"[ERRO] Erro ao decodificar JSON {caminho_arquivo}: {e}")
        return versiculos_processados
    except Exception as e:
        print(f"[ERRO] Erro ao processar {caminho_arquivo}: {e}")
        return versiculos_processados


def gerar_sql_traducoes() -> str:
    """Gera SQL INSERT para as traduções"""
    sql = "-- =============================================================================\n"
    sql += "-- INSERT: Traduções\n"
    sql += "-- =============================================================================\n\n"

    for dir_name, info in TRADUCOES.items():
        sql += f"INSERT INTO traducoes (id, nome, abreviacao, descricao, data_criacao, deletado) VALUES\n"
        sql += f"({info['id']}, {escapar_sql(info['nome'])}, {escapar_sql(info['abreviacao'])}, {escapar_sql(info['descricao'])}, CURRENT_TIMESTAMP, false)\n"
        sql += f"ON CONFLICT (id) DO NOTHING;\n\n"

    return sql


def gerar_sql_versiculos(versiculos_por_traducao: Dict[str, List[Tuple]]) -> str:
    """Gera SQL INSERT para os versículos"""
    sql = "-- =============================================================================\n"
    sql += "-- INSERT: Versículos\n"
    sql += "-- Nota: ON CONFLICT DO NOTHING permite rodar script múltiplas vezes sem duplicar\n"
    sql += "-- =============================================================================\n\n"

    total_versiculos = 0

    for dir_name, versiculos in versiculos_por_traducao.items():
        traducao_id = TRADUCOES[dir_name]["id"]
        traducao_nome = TRADUCOES[dir_name]["abreviacao"]

        sql += f"-- Inserindo versículos da tradução {traducao_nome}\n"

        if versiculos:
            sql += "INSERT INTO versiculos (livro, capitulo, numero, texto, traducao_id, data_criacao, deletado) VALUES\n"

            valores = []
            for livro, capitulo, numero, texto in versiculos:
                valor = f"({livro}, {capitulo}, {numero}, {escapar_sql(texto)}, {traducao_id}, CURRENT_TIMESTAMP, false)"
                valores.append(valor)

            sql += ",\n".join(valores) + "\n"
            sql += "ON CONFLICT (livro, capitulo, numero, traducao_id) DO NOTHING;\n\n"
            total_versiculos += len(versiculos)

    sql += f"-- Total de versículos que podem ser inseridos: {total_versiculos}\n"
    return sql


def main():
    """Função principal"""
    # Suporta caminhos absolutos
    caminho_biblia = Path("C:\\Users\\david\\source\\repos\\Front.IgrejaV2\\BibliaJSON-master\\BibliaJSON-master")

    if not caminho_biblia.exists():
        print(f"[ERRO] Diretório {caminho_biblia} não encontrado")
        return

    print(f"[INICIO] Iniciando processamento de arquivos de Bíblia...")
    print(f"[DIR] Diretório: {caminho_biblia}\n")

    versiculos_por_traducao = {}

    # Processar cada tradução
    for dir_traducao in TRADUCOES.keys():
        caminho_traducao = caminho_biblia / dir_traducao

        if not caminho_traducao.exists():
            print(f"[AVISO] Diretório {caminho_traducao} não encontrado")
            continue

        print(f"\n[TRADUCAO] Processando tradução: {TRADUCOES[dir_traducao]['nome']}")
        print(f"   Diretório: {caminho_traducao}")

        versiculos_traducao = []

        # Listar todos os arquivos JSON
        arquivos_json = sorted(caminho_traducao.glob("*.json"))
        print(f"   Arquivos encontrados: {len(arquivos_json)}\n")

        for arquivo_json in arquivos_json:
            versiculos = processar_arquivo_biblia(str(arquivo_json), dir_traducao)
            versiculos_traducao.extend(versiculos)

        versiculos_por_traducao[dir_traducao] = versiculos_traducao
        print(f"\n   [OK] Total de versículos da {TRADUCOES[dir_traducao]['abreviacao']}: {len(versiculos_traducao)}\n")

    # Gerar SQL
    print("\n" + "="*80)
    print("[SQL] Gerando SQL...")
    print("="*80 + "\n")

    sql_completo = gerar_sql_traducoes()
    sql_completo += "\n"
    sql_completo += gerar_sql_versiculos(versiculos_por_traducao)

    # Salvar em arquivo
    arquivo_saida = Path("C:/Users/david/source/repos/IgrejaV2/IgrejaV2.Infraestrutura/Scripts/04_InserirVersiculos.sql")
    arquivo_saida.parent.mkdir(parents=True, exist_ok=True)

    with open(arquivo_saida, 'w', encoding='utf-8') as f:
        f.write(sql_completo)

    print(f"[OK] SQL gerado com sucesso!")
    print(f"[ARQUIVO] Arquivo salvo em: {arquivo_saida}")
    print(f"[TOTAL] Total de versículos: {sum(len(v) for v in versiculos_por_traducao.values())}")


if __name__ == "__main__":
    main()
