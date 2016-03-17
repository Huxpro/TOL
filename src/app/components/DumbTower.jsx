/**
 *  Dumb Tower
 *  Dumb displayment of TOL
 */

export default (props) => {

  let pegs = props.model.map((peg, i) => {
    return (
      <div
        className = "peg"
        key={"peg" + i}
      >
        {peg.map((bead) => {
          if (!bead) return null;
          return <div key={"bead" + i} className={"bead bead-" + bead} />
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
