import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ExportButtons({ tickets }) {
  const [exporting, setExporting] = useState(false);

  // Export to Excel
  const exportToExcel = () => {
    setExporting(true);
    try {
      // Prepare data for Excel
      const exportData = tickets.map(ticket => ({
        'ID': ticket.id,
        'Resource Name': ticket.resourceName,
        'Category': ticket.category,
        'Description': ticket.description,
        'Priority': ticket.priority,
        'Status': ticket.status,
        'Preferred Contact': ticket.preferredContact || 'N/A',
        'Created At': new Date(ticket.createdAt).toLocaleString(),
        'Assigned Technician': ticket.assignedTechnician || 'Not Assigned',
        'Resolution Notes': ticket.resolutionNotes || 'N/A'
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Auto-size columns
      const colWidths = [
        { wch: 8 },  // ID
        { wch: 20 }, // Resource Name
        { wch: 15 }, // Category
        { wch: 40 }, // Description
        { wch: 10 }, // Priority
        { wch: 12 }, // Status
        { wch: 20 }, // Preferred Contact
        { wch: 20 }, // Created At
        { wch: 20 }, // Assigned Technician
        { wch: 30 }  // Resolution Notes
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tickets Report');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, `tickets_report_${new Date().toISOString().slice(0, 19)}.xlsx`);
      
      alert('Excel report downloaded successfully!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel');
    }
    setExporting(false);
  };

  // Export to PDF
  const exportToPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF('landscape');
      
      // Add title
      doc.setFontSize(18);
      doc.text('Tickets Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
      doc.text(`Total Tickets: ${tickets.length}`, 14, 32);
      
      // Prepare table data
      const tableData = tickets.map(ticket => [
        ticket.id || 'N/A',
        ticket.resourceName || 'N/A',
        ticket.category || 'N/A',
        ticket.priority || 'N/A',
        ticket.status || 'N/A',
        ticket.preferredContact || 'N/A',
        ticket.assignedTechnician || 'Not Assigned',
        new Date(ticket.createdAt).toLocaleDateString()
      ]);

      // Add table
      doc.autoTable({
        startY: 40,
        head: [['ID', 'Resource', 'Category', 'Priority', 'Status', 'Contact', 'Technician', 'Created']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243], textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 25 }
        }
      });
      
      // Save PDF
      doc.save(`tickets_report_${new Date().toISOString().slice(0, 19)}.pdf`);
      alert('PDF report downloaded successfully!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error exporting to PDF');
    }
    setExporting(false);
  };

  return (
    <div className="export-buttons">
      <button 
        onClick={exportToExcel} 
        disabled={exporting || tickets.length === 0}
        className="export-btn excel-btn"
      >
        📊 Export to Excel
      </button>
      <button 
        onClick={exportToPDF} 
        disabled={exporting || tickets.length === 0}
        className="export-btn pdf-btn"
      >
        📄 Export to PDF
      </button>
    </div>
  );
}

export default ExportButtons;