interface CloseButtonProps {
  onClick: () => void
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      className="ml-2 flex rounded border border-gray-600 text-gray-600 h-4 w-4 items-center justify-center text-xs hover:bg-gray-700 hover:border-gray-400 hover:text-gray-400"
      onClick={onClick}
    >
      <span>-</span>
    </button>
  )
}
