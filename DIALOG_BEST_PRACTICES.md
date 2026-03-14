# PrimeNG Dynamic Dialog - Mejores Prácticas

## Configuración Recomendada Según Documentación Oficial

### 1. **Abrir el Dialog desde otro componente (ej: historial-accion.ts)**

```typescript
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogAccion } from '../../components/dialog-accion/dialog-accion';

export class HistorialAccion {
  private dialogService = inject(DialogService);
  
  abrirDialogCrear() {
    const dialogRef: DynamicDialogRef = this.dialogService.open(DialogAccion, {
      // Configuración obligatoria/recomendada
      header: 'Nueva Acción',
      modal: true,                    // ✅ IMPORTANTE: Fondo modal bloqueante
      width: '50vw',                  // Ancho responsivo
      closable: true,                 // ✅ Permite cerrar con botón X
      contentStyle: { overflow: 'auto' },  // ✅ Scroll si contenido es largo
      
      // Configuración responsive (IMPORTANTE)
      breakpoints: {
        '960px': '75vw',              // Tablets
        '640px': '90vw'               // Móviles
      },
      
      // Para pasar datos al dialog
      data: {
        modo: 'crear'
      }
    });

    // ✅ IMPORTANTE: Escuchar el cierre del dialog
    dialogRef.onClose.subscribe((resultado) => {
      if (resultado) {
        // El dialog cerró exitosamente con datos
        console.log('Dialog cerrado con:', resultado);
        // Actualizar tabla o lista
        this.cargarAcciones();
      } else {
        // El dialog fue cancelado
        console.log('Dialog fue cancelado sin guardar');
      }
    });
  }

  abrirDialogEditar(accion: accionInterface) {
    const dialogRef: DynamicDialogRef = this.dialogService.open(DialogAccion, {
      header: 'Editar Acción',
      modal: true,
      width: '50vw',
      closable: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      
      // Pasar la acción a editar
      data: {
        accion: accion,
        modo: 'editar'
      }
    });

    dialogRef.onClose.subscribe((resultado) => {
      if (resultado) {
        // Actualizar la tabla/lista
        this.cargarAcciones();
      }
    });
  }
}
```

### 2. **Configuración en el Componente del Dialog (dialog-accion.ts)**

Cambios aplicados:
- ✅ `ChangeDetectionStrategy.OnPush` - Mejor rendimiento
- ✅ `DynamicDialogRef` - Para controlar el dialog (cerrar, pasar datos)
- ✅ `DynamicDialogConfig` - Para acceder a los datos pasados

```typescript
export class DialogAccion {
  protected readonly dialogRef = inject(DynamicDialogRef);
  protected readonly dynamicDialogConfig = inject(DynamicDialogConfig);

  constructor() {
    // Acceder a los datos pasados desde el componente padre
    const dialogData = this.dynamicDialogConfig.data;
    if (dialogData?.accion) {
      // Modo edición
      this.isEditMode.set(true);
      this.cargarAccionEnFormulario(dialogData.accion);
    }
  }

  protected guardarAccion() {
    if (this.formGroup().invalid) return;
    
    // Después de guardar exitosamente:
    this.dialogRef.close(response.data);  // Cierra y devuelve datos
    
    // O si fue cancelado:
    // this.dialogRef.close();  // Cierra sin devolver datos
  }

  protected cancelar() {
    this.dialogRef.close();
  }
}
```

### 3. **Template del Dialog (dialog-accion.html)**

Puntos clave:
- ✅ El contenedor debe permitir scroll (overflow: auto)
- ✅ Los botones de acción al final
- ✅ Validación de campos visible

```html
<form [formGroup]="formGroup()" class="space-y-4">
  <!-- Contenido del formulario -->
  <!-- ... campos ... -->

  <!-- Botones de acción -->
  <div class="flex gap-3 justify-end pt-4 border-t border-surface-700">
    <p-button label="Cancelar" severity="secondary" (onClick)="cancelar()" />
    <p-button label="Guardar" (onClick)="guardarAccion()" />
  </div>
</form>
```

---

## ✅ Checklist de Validación

- [ ] Dialog tiene `modal: true`
- [ ] Dialog tiene `closable: true`
- [ ] Dialog tiene `contentStyle: { overflow: 'auto' }`
- [ ] Dialog tiene `breakpoints` para responsivo
- [ ] Componente tiene `ChangeDetectionStrategy.OnPush`
- [ ] Se escucha `onClose.subscribe()` desde el componente padre
- [ ] Se usan `DynamicDialogRef.close()` para cerrar
- [ ] Se pasan datos con la propiedad `data` en la configuración

---

## 📚 Referencias Oficiales

- **Documentación PrimeNG DynamicDialog**: https://primeng.org/dynamicdialog
- **Dialog Component**: https://primeng.org/dialog
- **Angular Change Detection**: https://angular.dev/guide/change-detection

---

## Próximas Mejoras

1. **Migrar a Signal Forms**: El `RegistroAccionService.formAccion()` aún usa Reactive Forms
   - Actualizar a usar `form()` y `signal()` de `@angular/forms/signals`
   - Similar a como se hizo en el componente de login

2. **Agregar validaciones en tiempo real**: Usar linkedSignal para cálculos automáticos (ya implementado)

3. **Mejorar accesibilidad**: Agregar ARIA labels en el dialog
