export async function exportPDF(filename: string, elementId = 'contentWrap') {
  const el = document.getElementById(elementId)
  if (!el) return
  const html2pdf = (await import('html2pdf.js')).default
  const opt = {
    margin: [10,10,10,10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  }
  html2pdf().set(opt).from(el).save()
}