
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { formSchema } from '../schema';
import { Separator } from '@/components/ui/separator';

interface ContentTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ContentTab({ form }: ContentTabProps) {
  return (
    <TabsContent value="content" className="space-y-6">
      <h3 className="text-lg font-medium">Textos do Formulário</h3>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium">Cabeçalho do Formulário</h4>
        
        <FormField
          control={form.control}
          name="formHeaderText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto do Cabeçalho</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: PREENCHA SEUS DADOS ABAIXO" />
              </FormControl>
              <FormDescription>
                Texto que aparece no topo do formulário de checkout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="formHeaderBgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor de Fundo do Cabeçalho</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input type="color" className="w-12 h-10 p-1" {...field} />
                    <Input {...field} placeholder="Ex: #dc2626" />
                  </div>
                </FormControl>
                <FormDescription>
                  Cor de fundo do cabeçalho do formulário.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="formHeaderTextColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor do Texto do Cabeçalho</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input type="color" className="w-12 h-10 p-1" {...field} />
                    <Input {...field} placeholder="Ex: #ffffff" />
                  </div>
                </FormControl>
                <FormDescription>
                  Cor do texto do cabeçalho do formulário.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h4 className="text-md font-medium">Outras Configurações de Texto</h4>
        
        {/* Additional form text settings could be added here */}
      </div>
    </TabsContent>
  );
}
