import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Sale, DailySummary } from '../types';
import { formatCurrency, formatDate } from './index';

export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const exportToCSV = (data: Sale[], filename: string) => {
  const headers = [
    'Fecha',
    'Producto',
    'Cantidad',
    'Precio Unitario',
    'Total',
    'Ganancia',
    'Método de Pago',
    'Notas'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(sale => [
      formatDate(new Date(sale.date)),
      `"${sale.productName}"`,
      sale.quantity,
      sale.unitPrice,
      sale.totalPrice,
      sale.profit,
      sale.paymentMethod,
      `"${sale.notes || ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};