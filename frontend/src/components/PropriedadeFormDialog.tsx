/**
 * Modal para criar/editar Propriedade
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Propriedade, CreatePropriedadeDTO } from "@/types/propriedade";

interface PropriedadeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreatePropriedadeDTO) => Promise<void>;
  propriedade?: Propriedade | null;
  isLoading?: boolean;
}

export function PropriedadeFormDialog({
  open,
  onOpenChange,
  onSubmit,
  propriedade,
  isLoading = false,
}: PropriedadeFormDialogProps) {
  const [formData, setFormData] = useState<CreatePropriedadeDTO>({
    nome: "",
    responsavel: "",
  });

  const [errors, setErrors] = useState<Partial<CreatePropriedadeDTO>>({});

  // Preencher formulário ao editar
  useEffect(() => {
    if (propriedade) {
      setFormData({
        nome: propriedade.nome,
        responsavel: propriedade.responsavel,
      });
    } else {
      setFormData({ nome: "", responsavel: "" });
    }
    setErrors({});
  }, [propriedade, open]);

  const validate = (): boolean => {
    const newErrors: Partial<CreatePropriedadeDTO> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = "Responsável é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {propriedade ? "Editar Propriedade" : "Nova Propriedade"}
          </DialogTitle>
          <DialogDescription>
            {propriedade
              ? "Atualize as informações da propriedade abaixo."
              : "Preencha os dados da nova propriedade."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Propriedade *</Label>
            <Input
              id="nome"
              placeholder="Ex: Fazenda São João"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              disabled={isLoading}
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável *</Label>
            <Input
              id="responsavel"
              placeholder="Ex: João da Silva"
              value={formData.responsavel}
              onChange={(e) =>
                setFormData({ ...formData, responsavel: e.target.value })
              }
              disabled={isLoading}
              className={errors.responsavel ? "border-red-500" : ""}
            />
            {errors.responsavel && (
              <p className="text-sm text-red-500">{errors.responsavel}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {propriedade ? "Salvar Alterações" : "Criar Propriedade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
