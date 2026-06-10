import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md">

        {/* Bola animada */}
        <div className="text-7xl mb-6 inline-block animate-bounce">⚽</div>

        {/* Placar estilo estádio */}
        <div className="bg-black/60 border border-yellow-400/30 rounded-2xl px-8 py-5 mb-8 inline-block w-full">
          <div className="text-yellow-400 text-[10px] font-bold tracking-widest uppercase mb-3">
            Placar Final
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-white/60 text-xs font-semibold mb-1">Você</div>
              <div className="text-6xl font-black text-white tabular-nums">4</div>
            </div>
            <div className="text-yellow-400 text-3xl font-black">×</div>
            <div className="text-center">
              <div className="text-white/60 text-xs font-semibold mb-1">Página</div>
              <div className="text-6xl font-black text-green-400 tabular-nums">04</div>
            </div>
          </div>
          <div className="mt-3 text-white/30 text-[11px] tracking-widest uppercase">
            Erro 404 · Página não encontrada
          </div>
        </div>

        {/* Mensagem */}
        <div className="mb-2">
          <span className="text-2xl">🟥</span>
          <h1 className="text-white text-xl font-bold inline ml-2">Cartão Vermelho!</h1>
        </div>
        <p className="text-green-200 text-sm mb-1">
          Esta página entrou em offside e foi expulsa do campo.
        </p>
        <p className="text-green-400/50 text-xs mb-8">
          O árbitro revisou o VAR e confirmou: a URL não existe.
        </p>

        {/* Botão */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-xl transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-300/30"
        >
          ⚽ Voltar ao vestiário
        </Link>
      </div>
    </div>
  )
}
