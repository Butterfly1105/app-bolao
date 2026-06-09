import { formatDate, formatTime, formatDateTime } from './utils'
import { STAGE_LABELS, MatchStage } from '@/types'

export async function generatePredictionsPDF(
  matches: any[],
  profile: any,
  predictions: Map<string, any>
): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header verde
  doc.setFillColor(22, 163, 74)
  doc.rect(0, 0, pageWidth, 40, 'F')

  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('BOLÃO DA COPA 2026 🏆', pageWidth / 2, 16, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Participante: ${profile?.name ?? 'Participante'}`, pageWidth / 2, 26, { align: 'center' })
  doc.text(`Gerado em: ${formatDateTime(new Date().toISOString())}`, pageWidth / 2, 33, { align: 'center' })

  // Linha decorativa dourada
  doc.setFillColor(245, 158, 11)
  doc.rect(0, 40, pageWidth, 3, 'F')

  let yPos = 50

  // Estatísticas
  const predCount = predictions.size
  const totalPts = Array.from(predictions.values()).reduce((s, p) => s + (p.points_earned ?? 0), 0)

  doc.setFillColor(240, 253, 244)
  doc.roundedRect(14, yPos, pageWidth - 28, 22, 3, 3, 'F')
  doc.setTextColor(22, 163, 74)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total de Palpites: ${predCount}`, 22, yPos + 8)
  doc.text(`Pontos Acumulados: ${totalPts}`, 22, yPos + 16)
  doc.text(`Data: ${formatDateTime(new Date().toISOString())}`, pageWidth / 2, yPos + 8)

  yPos += 30

  // Agrupar por fase
  const stageOrder: MatchStage[] = ['group', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final']

  for (const stage of stageOrder) {
    const stageMatches = matches.filter(m => m.stage === stage)
    const stageWithPreds = stageMatches.filter(m => predictions.has(m.id))
    if (stageWithPreds.length === 0) continue

    // Título da fase
    doc.setFillColor(22, 163, 74)
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')

    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.roundedRect(14, yPos, pageWidth - 28, 9, 2, 2, 'F')
    doc.text(STAGE_LABELS[stage].toUpperCase(), pageWidth / 2, yPos + 6, { align: 'center' })
    yPos += 12

    const tableData = stageWithPreds.map(match => {
      const pred = predictions.get(match.id)
      const homeName = match.home_team?.name ?? match.home_team_placeholder ?? '?'
      const awayName = match.away_team?.name ?? match.away_team_placeholder ?? '?'
      const homeFlag = match.home_team?.flag_emoji ?? ''
      const awayFlag = match.away_team?.flag_emoji ?? ''
      const palpite = pred ? `${pred.home_score} x ${pred.away_score}` : '-'
      const resultado = match.status === 'finished'
        ? `${match.home_score} x ${match.away_score}`
        : 'Aguardando'
      const pts = pred?.points_earned !== undefined ? `${pred.points_earned} pts` : '-'

      return [
        `${formatDate(match.match_date)} ${formatTime(match.match_date)}`,
        `${homeFlag} ${homeName}`,
        palpite,
        `${awayFlag} ${awayName}`,
        resultado,
        pts,
      ]
    })

    autoTable(doc, {
      startY: yPos,
      head: [['Data/Hora', 'Mandante', 'Palpite', 'Visitante', 'Resultado', 'Pts']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        textColor: [31, 41, 55],
      },
      headStyles: {
        fillColor: [240, 253, 244],
        textColor: [22, 163, 74],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 24 },
        2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 20, halign: 'center' },
        5: { cellWidth: 14, halign: 'center', fontStyle: 'bold', textColor: [22, 163, 74] },
      },
      margin: { left: 14, right: 14 },
    })

    yPos = (doc as any).lastAutoTable.finalY + 8
  }

  // Footer
  const pageCount = (doc.internal as any).getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Bolão da Copa 2026 • ${profile?.name ?? ''} • Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  doc.save(`bolao-copa-2026-${profile?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'palpites'}.pdf`)
}

export function sharePDFWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const url = isMobile
    ? `whatsapp://send?text=${encoded}`
    : `https://web.whatsapp.com/send?text=${encoded}`
  window.open(url, '_blank')
}
