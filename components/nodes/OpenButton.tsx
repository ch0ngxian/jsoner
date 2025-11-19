interface OpenButtonProps {
  count?: number
  onClick: () => void
}

export default function OpenButton({ count, onClick }: OpenButtonProps) {
  return (
    <button className="mx-1 px-1 hover:bg-gray-700 rounded" onClick={onClick}>
      {count != null ? (
        <div className="px-1 rounded" style={{ color: '#d98e73' }}>
          {count}
        </div>
      ) : (
        <p>...</p>
      )}
    </button>
  )
}
