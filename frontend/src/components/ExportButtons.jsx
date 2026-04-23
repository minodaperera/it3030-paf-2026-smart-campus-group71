import { useState } from 'react';

function ExportButtons({ tickets, addToast }) {
  const [exporting, setExporting] = useState(false);

  const exportToExcel = () => {
    setExporting(true);
    import('xlsx').then(XLSX => {
      const exportData = tickets.map(ticket => ({
        'ID': ticket.id,
        'Resource Name': ticket.resourceName,
        'Category': ticket.category,
        'Description': ticket.description,
        'Priority': ticket.priority,
        'Status': ticket.status,
        'Preferred Contact': ticket.preferredContact || 'N/A',
        'Created At': ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A',
        'Assigned Technician': ticket.assignedTechnician || 'Not Assigned'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tickets Report');
      XLSX.writeFile(wb, `tickets_report_${new Date().toISOString().slice(0, 19)}.xlsx`);
      addToast('Excel report downloaded successfully!', 'success');
      setExporting(false);
    }).catch(err => {
      console.error('Excel export error:', err);
      addToast('Error exporting to Excel', 'error');
      setExporting(false);
    });
  };

  const exportToPDF = () => {
    setExporting(true);
    
    Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]).then(([jspdfModule, autoTableModule]) => {
      const { default: jsPDF } = jspdfModule;
      const { default: autoTable } = autoTableModule;
      
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      
      doc.setFontSize(18);
      doc.text('Tickets Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
      doc.text(`Total Tickets: ${tickets.length}`, 14, 32);
      
      const tableData = tickets.map(ticket => [
        ticket.id || 'N/A',
        ticket.resourceName || 'N/A',
        ticket.category || 'N/A',
        ticket.priority || 'N/A',
        ticket.status || 'N/A',
        ticket.preferredContact || 'N/A',
        ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'
      ]);

      autoTable(doc, {
        head: [['ID', 'Resource', 'Category', 'Priority', 'Status', 'Contact', 'Created Date']],
        body: tableData,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: 80, fontSize: 9 },
        alternateRowStyles: { fillColor: [240, 248, 255] },
        margin: { top: 40, left: 10, right: 10 }
      });
      
      doc.save(`tickets_report_${new Date().toISOString().slice(0, 19)}.pdf`);
      addToast('PDF report downloaded successfully!', 'success');
      setExporting(false);
    }).catch(err => {
      console.error('PDF export error:', err);
      addToast('Error exporting to PDF', 'error');
      setExporting(false);
    });
  };

  return (
    <div className="export-buttons">
      <button onClick={exportToExcel} disabled={exporting || tickets.length === 0} className="export-btn excel-btn">
        📊 Export to Excel
      </button>
      <button onClick={exportToPDF} disabled={exporting || tickets.length === 0} className="export-btn pdf-btn">
        📄 Export to PDF
      </button>
    </div>
  );
}

export default ExportButtons;