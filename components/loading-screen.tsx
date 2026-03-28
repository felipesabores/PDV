import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Carregando...</h2>
        <p className="text-gray-500 mt-2">Conectando ao banco de dados</p>
      </div>
    </div>
  )
}

