// Small round portrait: the character's image if they have one, otherwise a gradient initial.
export default function Avatar({ character, size = 40 }) {
  const [a, b] = character.colors
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        background: character.image
          ? `center / cover url(${character.image})`
          : `linear-gradient(150deg, ${a}, ${b})`,
      }}
      aria-hidden="true"
    >
      {!character.image && character.name.charAt(0)}
    </div>
  )
}
