interface CloseButtonProps {
  onClick: () => void
}

export default function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      className="ml-2 flex rounded h-4 w-4 items-center justify-center text-xs collapse-btn"
      onClick={onClick}
    >
      <span>-</span>
    </button>
  )
}
