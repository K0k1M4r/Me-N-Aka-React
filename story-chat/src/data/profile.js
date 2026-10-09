// Georgian has no he/she, so the profile asks how characters should address you.
// The value (left) is what the AI gets; the label (right) is shown on screen.
export const GENDERS = [
  { value: 'she/her', label: 'ქალი' },
  { value: 'he/him', label: 'კაცი' },
  { value: 'they/them', label: 'ნეიტრალურად' },
]

export function genderLabel(value) {
  return GENDERS.find((g) => g.value === value)?.label || ''
}
