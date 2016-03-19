/**
 *  Modal
 *  Modal Component of TOL
 */

import { Link } from 'react-router'
import DelayButton from './DelayButton'


export default class Modal extends React.Component{
  constructor(props){
    super(props)
  }

  getNextStage(){
    return Number(this.props.params.stage) + 1
  }

  saveUser(e){
    e.preventDefault();

    let _name       = e.target[0].value;
    let _sex        = e.target[1].value;
    let _cognitive  = e.target[2].value;
    let _group      = e.target[3].value;

    let _user = {
      name: _name,
      sex:  _sex,
      cognitive: _cognitive,
      group: _group
    }

    __tol__.setState({
      user: _user
    })

    __tol__.user = _user;

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
            请在下方输入你的信息
          </p>
          <form onSubmit={this.saveUser}>
            <input required type="number" placeholder="学号"/>
            <select>
              <option>男</option>
              <option>女</option>
            </select>
            <select>
              <option>场独立</option>
              <option>场依存</option>
            </select>
            <select>
              <option>实验组</option>
              <option>对照组</option>
            </select>
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
            用鼠标点击左图三根柱子使小球抬起，<br />
            再次点击一根柱子使小球落下。
          </p>
          <p>
            <br />
            <em>你的目标是使左边的小球由起始状变为右图的最终状态。</em>
          </p>
          <Link to="/instruction/3">
            <button> Got it! </button>
          </Link>
        </div>
      ),
      "instruction3": (
        <div>
          <p>
            <em>注意：</em>每次只能移动一个小球，且最高的柱子上可以放置三个小球，中间的柱子可以放置两个小球，最矮的柱子只能放置一个小球。
          </p>
          <p>
            <br/>
            你可以在接下来的测试关卡试着进行操作
          </p>
          <Link to="/A/0">
            <button>进入测试关卡</button>
          </Link>
        </div>
      ),
      "testCompleted": (
        <div>
          <p>
            看来你已经学会了如何操作！
          </p>
          <p>接下来我们将进入正式实验</p>
          <Link to={`/A/${this.getNextStage()}`}>
            <button>进入正式实验</button>
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
      ),
      "halfCompleted": (
        <div>
          <p>
            第一轮游戏完成！
          </p>
          <p>
            请举手示意！
          </p>
          <Link to="/A/11">
            <DelayButton delay={3000}>进入第二轮</DelayButton>
          </Link>
        </div>
      ),
      "gameCompleted": (
        <div>
          <p>
            两轮游戏完成！
            感谢你的参与！
          </p>
          <p>
            请举手示意！
          </p>
          <Link to="/instruction/1">
            <DelayButton delay={1000}>查看结果</DelayButton>
          </Link>
          <Link to="/instruction/1">
            <DelayButton delay={3000}>重新开始</DelayButton>
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
