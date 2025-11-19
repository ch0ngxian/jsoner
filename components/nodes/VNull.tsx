import Field from './Field'

interface VNullProps {
  field?: string | number
  value?: any
  showEndComma?: boolean
}

export default function VNull({ field, showEndComma = true }: VNullProps) {
  return (
    <div className="flex">
      {field && (
        <>
          <Field field={field} />
          <p className="pr-1">:</p>
        </>
      )}
      <p style={{ color: '#369eda' }}>
        null{showEndComma && <span style={{ color: '#d4d4d4' }}>,</span>}
      </p>
    </div>
  )
}
