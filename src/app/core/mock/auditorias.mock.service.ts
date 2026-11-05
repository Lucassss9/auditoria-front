import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Auditoria,
  Comunicado,
  ItemAuditoria,
  ItemForaDoEstoque,
  NovaAuditoria,
} from '../models/auditoria.model';
import { AuditoriasService } from '../services/auditorias.service';
import { novoId } from '../utils/texto';
import { FILIAIS_MOCK, OBRAS_MOCK } from './mock-cadastros';
import { MockStore } from './mock-store';
import { responder } from './responder';

@Injectable()
export class AuditoriasMockService extends AuditoriasService {
  private readonly store = inject(MockStore);

  listar(): Observable<Auditoria[]> {
    const ordenadas = [...this.store.auditorias()].sort(
      (a, b) => new Date(b.iniciadaEm).getTime() - new Date(a.iniciadaEm).getTime(),
    );
    return responder(ordenadas);
  }

  buscarPorId(id: string): Observable<Auditoria | null> {
    return responder(this.store.auditorias().find((item) => item.id === id) ?? null);
  }

  criar(dados: NovaAuditoria): Observable<Auditoria> {
    const obra = OBRAS_MOCK.find((item) => item.id === dados.obraId);

    if (!obra) {
      throw new Error('Obra não encontrada');
    }

    const filial = FILIAIS_MOCK.find((item) => item.id === obra.filialId) ?? null;
    const estoque = this.store.estoque();
    const agora = new Date().toISOString();

    const itens: ItemAuditoria[] = dados.insumos
      .map(({ insumoId, lista }) => {
        const insumo = estoque.find((item) => item.id === insumoId);

        if (!insumo) {
          return null;
        }

        const item: ItemAuditoria = {
          id: novoId('item'),
          codigo: insumo.codigo,
          descricao: insumo.descricao,
          categoria: insumo.categoria,
          unidade: insumo.unidade,
          quantidadeSistema: insumo.quantidade,
          valorUnitarioReferencia: insumo.valorUnitario,
          lista,
          quantidadeReal: null,
          situacao: 'NAO_CONFERIDO',
          motivoNaoContagem: null,
          local: null,
          observacao: '',
          evidencias: [],
        };

        return item;
      })
      .filter((item): item is ItemAuditoria => item !== null);

    const auditoria: Auditoria = {
      id: novoId('a'),
      obraId: obra.id,
      obraNome: obra.nome,
      filialNome: filial ? `${filial.codigo} - ${filial.nome}` : null,
      responsavel: dados.responsavel,
      status: 'EM_ANDAMENTO',
      iniciadaEm: agora,
      concluidaEm: null,
      referencia: {
        origem: 'Relatório de estoque — dados de demonstração',
        capturadoEm: agora,
        totalItens: itens.length,
      },
      itens,
      foraDoEstoque: [],
      comunicado: null,
    };

    this.store.auditorias.update((atuais) => [auditoria, ...atuais]);

    return responder(auditoria);
  }

  atualizarItem(
    auditoriaId: string,
    itemId: string,
    mudancas: Partial<ItemAuditoria>,
  ): Observable<Auditoria> {
    const auditoria = this.store.exigirAuditoria(auditoriaId);

    const atualizada: Auditoria = {
      ...auditoria,
      itens: auditoria.itens.map((item) => (item.id === itemId ? { ...item, ...mudancas } : item)),
    };

    return responder(this.store.substituirAuditoria(atualizada));
  }

  salvarItemForaDoEstoque(
    auditoriaId: string,
    item: Omit<ItemForaDoEstoque, 'id'> & { id?: string },
  ): Observable<Auditoria> {
    const auditoria = this.store.exigirAuditoria(auditoriaId);
    const salvo: ItemForaDoEstoque = { ...item, id: item.id ?? novoId('fe') };

    const existe = auditoria.foraDoEstoque.some((registro) => registro.id === salvo.id);

    const atualizada: Auditoria = {
      ...auditoria,
      foraDoEstoque: existe
        ? auditoria.foraDoEstoque.map((registro) => (registro.id === salvo.id ? salvo : registro))
        : [...auditoria.foraDoEstoque, salvo],
    };

    return responder(this.store.substituirAuditoria(atualizada));
  }

  removerItemForaDoEstoque(auditoriaId: string, itemId: string): Observable<Auditoria> {
    const auditoria = this.store.exigirAuditoria(auditoriaId);

    const atualizada: Auditoria = {
      ...auditoria,
      foraDoEstoque: auditoria.foraDoEstoque.filter((registro) => registro.id !== itemId),
    };

    return responder(this.store.substituirAuditoria(atualizada));
  }

  concluir(auditoriaId: string): Observable<Auditoria> {
    const auditoria = this.store.exigirAuditoria(auditoriaId);

    const atualizada: Auditoria = {
      ...auditoria,
      status: 'CONCLUIDA',
      concluidaEm: new Date().toISOString(),
    };

    return responder(this.store.substituirAuditoria(atualizada));
  }

  cancelar(auditoriaId: string): Observable<Auditoria> {
    const auditoria = this.store.exigirAuditoria(auditoriaId);

    const atualizada: Auditoria = {
      ...auditoria,
      status: 'CANCELADA',
      concluidaEm: new Date().toISOString(),
    };

    return responder(this.store.substituirAuditoria(atualizada));
  }

  salvarComunicado(auditoriaId: string, comunicado: Comunicado): Observable<Auditoria> {
    const auditoria = this.store.exigirAuditoria(auditoriaId);
    const atualizada: Auditoria = { ...auditoria, comunicado };
    return responder(this.store.substituirAuditoria(atualizada));
  }
}
