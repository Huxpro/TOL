/**
 *  Dumb Tower
 *  Dumb displayment of TOL
 */

export default (props) => {

  let pegs = props.model.map((peg) => {
    return (
      <div className = "peg">
        {peg.map((bead) => {
          if (!bead) return null;
          return <div className={"bead bead-" + bead} />
        })}
      </div>
    )
  })

  return (
    <div className="holder goal">
      {pegs}
      <p className="intro"> Goal State </p>
    </div>
  )
}
