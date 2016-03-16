/**
 *  Dumb Tower
 *  Dumb displayment of TOL
 */

export default (props) => {
  return (
    <div className="holder goal">
      <div className="peg" >
        <div className="bead bead-r" />
        <div className="bead bead-g" />
        <div className="bead bead-b" />
      </div>
      <div className="peg" >
        <div className="bead bead-g" />
        <div className="bead bead-b" />
      </div>
      <div className="peg" >
        <div className="bead bead-b" />
      </div>
      <p className="intro"> Goal State </p>
    </div>
  )
}
