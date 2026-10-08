// The picture area of a card. Uses character.image if you add one,
// otherwise a gradient with a big faded initial.
export default function Cover({ character, className = '', children }) {
  const style = { '--c1': character.colors[0], '--c2': character.colors[1] }
  if (character.image) style.backgroundImage = `url(${character.image})`

  return (
    <div className={'cover-art ' + (character.image ? 'has-image ' : '') + className} style={style}>
      {!character.image && (
        <span className="cover-monogram" aria-hidden="true">{character.name.charAt(0)}</span>
      )}
      <div className="cover-shade" aria-hidden="true" />
      {children}
    </div>
  )
}
