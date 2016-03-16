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
    <div className="holder work">
      {pegs}
      <p className="intro">Click to pick up and drop</p>
    </div>
  )
}
