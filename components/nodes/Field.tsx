interface FieldProps {
  field: string | number
}

export default function Field({ field }: FieldProps) {
  return <p style={{ color: '#88deff' }}>&quot;{field}&quot;</p>
}
