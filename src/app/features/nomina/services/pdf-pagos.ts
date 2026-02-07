import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DetNomina } from '@app/core/models/nomina';

@Injectable({
  providedIn: 'root',
})
export class PdfPagos {
  private readonly currencyFormatter = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  async generatePagosPdf(params: {
    items: DetNomina[];
    totals: { cuota: number; capital: number; interes: number };
    filters: { periodo?: string; estado?: string; nombre?: string };
  }): Promise<void> {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const margin = 8;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 8;

    const logoDataUrl = await this.loadSvgAsPng('/logo_main.svg', 120, 100);
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', margin, y, 24, 20);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Nuevo', margin + 26, y + 9);
    doc.setTextColor(243, 156, 18);
    doc.text('Amanecer', margin + 26, y + 17);
    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Nomina de Pagos', pageWidth / 2, y + 28, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(this.getSubtitle(params.filters), pageWidth / 2, y + 35, { align: 'center' });

    y += 42;

    const body = params.items.map((item) => ({
      nombre: item.nombrecompleto ?? '',
      cuota: this.formatCurrency(item.cuota || 0),
      capital: this.formatCurrency(item.capital || 0),
      interes: this.formatCurrency(item.interes || 0),
      cuotapagar: item.cuotapagar ?? '',
    }));

    autoTable(doc, {
      columns: [
        { header: 'Nombre Cliente', dataKey: 'nombre' },
        { header: 'Cuota', dataKey: 'cuota' },
        { header: 'Capital', dataKey: 'capital' },
        { header: 'Interes', dataKey: 'interes' },
        { header: 'Periodo', dataKey: 'cuotapagar' },
      ],
      body,
      foot: [
        {
          nombre: 'Totales',
          cuota: this.formatCurrency(params.totals.cuota),
          capital: this.formatCurrency(params.totals.capital),
          interes: this.formatCurrency(params.totals.interes),
          cuotapagar: '',
        },
      ],
      startY: y,
      theme: 'grid',
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 30,
        fontStyle: 'bold',
        fontSize: 12,
        halign: 'center',
        lineWidth: 0.2,
      },
      bodyStyles: {
        fontSize: 10,
        lineWidth: 0.2,
        textColor: 0,
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: 30,
        fontStyle: 'bold',
        fontSize: 12,
        halign: 'right',
        lineWidth: 0.2,
      },
      columnStyles: {
        nombre: { cellWidth: 70, halign: 'left' },
        cuota: { halign: 'right' },
        capital: { halign: 'right' },
        interes: { halign: 'right' },
        cuotapagar: { halign: 'center', cellWidth: 22 },
      },
      margin: { left: margin, right: margin, top: 0, bottom: 0 },
    });

    doc.save('nomina-pagos.pdf');
  }

  private formatCurrency(value: number): string {
    return this.currencyFormatter.format(value || 0);
  }

  private getSubtitle(filters: { periodo?: string }): string {
    const periodo = filters.periodo ? filters.periodo : 'Todos';
    return `Pagos Pendientes del Periodo ${periodo}`;
  }

  private async loadSvgAsPng(svgUrl: string, width: number, height: number): Promise<string | null> {
    try {
      const response = await fetch(svgUrl);
      if (!response.ok) {
        return null;
      }
      const svgText = await response.text();
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      return await this.renderSvgToPng(svgDataUrl, width, height);
    } catch {
      return null;
    }
  }

  private renderSvgToPng(svgDataUrl: string, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => reject(new Error('Logo load failed'));
      image.src = svgDataUrl;
    });
  }
}
