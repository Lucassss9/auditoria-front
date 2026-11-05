import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Evidencia, ItemForaDoEstoque } from '../../../../core/models/auditoria.model';
import { ValidacaoFormulario } from '../../../../core/utils/validacao-formulario';
import { Evidencias } from '../../../../shared/components/evidencias/evidencias';
import { Modal } from '../../../../shared/components/modal/modal';

const UNIDADES = ['un', 'pç', 'kg', 'm', 'm²', 'm³', 'sc', 'rl', 'cj', 'pr', 'vg'];

@Component({
  selector: 'app-form-fora-do-estoque',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Evidencias, Modal],
  templateUrl: './form-fora-do-estoque.html',
  styleUrl: './form-fora-do-estoque.scss',
})
export class FormForaDoEstoque {
  private readonly fb = inject(FormBuilder);

  readonly item = input<ItemForaDoEstoque | null>(null);
  readonly salvar = output<Omit<ItemForaDoEstoque, 'id'> & { id?: string }>();
  readonly cancelar = output<void>();

  protected readonly unidades = UNIDADES;
  protected readonly evidencias = signal<Evidencia[]>([]);

  protected readonly formulario = this.fb.nonNullable.group({
    descricao: ['', [Validators.required, Validators.minLength(3)]],
    codigo: [''],
    unidade: ['un', Validators.required],
    quantidade: ['', [Validators.required]],
    valorUnitario: [''],
    local: [''],
    observacao: [''],
  });

  private readonly validacao = new ValidacaoFormulario(this.formulario);

  constructor() {
    const atual = this.item();

    if (atual) {
      this.formulario.setValue({
        descricao: atual.descricao,
        codigo: atual.codigo ?? '',
        unidade: atual.unidade,
        quantidade: String(atual.quantidade),
        valorUnitario: atual.valorUnitario === null ? '' : String(atual.valorUnitario),
        local: atual.local ?? '',
        observacao: atual.observacao,
      });
      this.evidencias.set([...atual.evidencias]);
    }
  }

  protected enviar(): void {
    const quantidade = this.converter(this.formulario.controls.quantidade.value);

    if (this.formulario.invalid || quantidade === null || quantidade <= 0) {
      this.formulario.controls.quantidade.setErrors(
        quantidade === null || quantidade <= 0 ? { invalida: true } : null,
      );
      this.validacao.marcarTentativa();
      return;
    }

    const valores = this.formulario.getRawValue();
    const valorUnitario = this.converter(valores.valorUnitario);

    this.salvar.emit({
      id: this.item()?.id,
      descricao: valores.descricao.trim(),
      codigo: valores.codigo.trim() || null,
      unidade: valores.unidade,
      quantidade,
      valorUnitario: valores.valorUnitario.trim() ? valorUnitario : null,
      local: valores.local.trim() || null,
      observacao: valores.observacao.trim(),
      evidencias: this.evidencias(),
    });
  }

  protected campoInvalido(nome: 'descricao' | 'quantidade'): boolean {
    return this.validacao.invalido(nome);
  }

  private converter(valor: string): number | null {
    const normalizado = valor.replace(/\s/g, '').replace(',', '.');

    if (!normalizado || !/^\d+(\.\d+)?$/.test(normalizado)) {
      return null;
    }

    return Number(normalizado);
  }
}
