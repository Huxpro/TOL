/**
 *  Modal
 *  Modal Component of TOL
 */

import { Link } from 'react-router'

export default class Modal extends React.Component{
  constructor(props){
    super(props)
  }

  getNextStage(){
    return Number(this.props.params.stage) + 1
  }

  saveUser(e){
    e.preventDefault();

    let _user = e.target[0].value;
    __tol__.setState({
      user: _user
    })

    // TODO: use API to remove this hardcode
    location.hash = "#/instruction/2"
  }

  render(){
    if(!this.props.type) return <div className="modal cached" />;

    let modalMap = {
      "instruction1": (
        <div>
          <p>
            嘿，欢迎参加伦敦塔测试！
          </p>
          <p>
            请在下方输入你的学号
          </p>
          <form onSubmit={this.saveUser}>
            <input type="number" />
            <button type="submit"> Done! </button>
          </form>
        </div>
      ),
      "instruction2": (
        <div>
          <p>
            接下来，你会看到两张图。
          </p>
          <p>
            用鼠标拖动左图三根柱子上的小球使小球由起始状变为右图的最终状态。
          </p>
          <p>
            <em>注意：</em>每次只能移动一个小球，且最高的柱子上可以放置三个小球，中间的柱子可以放置两个小球，最矮的柱子只能放置一个小球。
          </p>
          <Link to="/instruction/3">
            <button> Got it! </button>
          </Link>
        </div>
      ),
      "instruction3": (
        <div>
          <p>
            例如，你会看到如下两张图。你需要像动画中一样移动小球使之成为右图所显示的最终状态。
          </p>
          <Link to="/A/0">
            <button> Got it! </button>
          </Link>
        </div>
      ),
      "stageCompleted": (
        <div>
          <p>
            成功啦～！
          </p>
          <Link to={`/A/${this.getNextStage()}`}>
            <button>进入下一关</button>
          </Link>
        </div>
      )
    }

    return (
      <div className="modal">
        {modalMap[this.props.type]}
      </div>
    )
  }
}
