interface FieldProps {
  field: string | number
}

export default function Field({ field }: FieldProps) {
  return <p style={{ color: 'var(--json-key)' }}>&quot;{field}&quot;</p>
}
