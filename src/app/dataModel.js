/*
 *  Data Models
 *
 *  Backend API Doc:
 *  https://www.teambition.com/project/55e54cd43ba0a0ea6eda1f57/posts/post/55f4839db935a57a34b4f574
 */

const STORAGE_KEY = '__wsTokenTest__';      // Test Env
//const STORAGE_KEY = '__wsToken__';          // Production Env

/* ---------- API ---------- */
// Online
//const API = "https://api.wesafari.cn/";
// Dev
const API = "http://api-dev.wesafari.cn/"

// LOADING
const LOADING = {
  show: ()=>{
    if(window.__wsApp__) window.__wsApp__.setState({loading: true})
  },
  dismiss: ()=>{
    if(window.__wsApp__) window.__wsApp__.setState({loading: false})
  }
}

// PROGRESS
const PROGRESS = {
  show: (_value)=>{
    if(window.__wsApp__) window.__wsApp__.setState({progress: _value})
  },
  dismiss: ()=>{
    if(window.__wsApp__) window.__wsApp__.setState({progress: null})
  }
}

function _getSearchFromObject(param, key) {
  if(param == null) return '';
  let _search = '?';
  for (let key in param) {
    _search += `${key}=${encodeURIComponent(param[key])}&`
  }
  return _search.slice(0, -1);
};

function parseJSON(response) {
  return response.json()
}

function checkStatus(response){
  if (response.ok) {          // 2xx
    return response;
  }else{                      // 4xx 5xx
    // create Error Object and throw back to catch.
    let error = new Error(response.statusText)
    error.status   = response.status
    error.response = response
    throw error
  }
}

// Common Request
function _request(_method, _api, _params, _onSuccess, _onError){
  LOADING.show();

  let _options = {
    method: _method,
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',       // Intelligently determined
      'X-Access-Token': UserModel.fetchToken()  // Admin Token.
    },
    body: (_method == 'get') ? null : JSON.stringify(_params)
  };

  // GET: set params to URL query.
  if(_method.toLowerCase() == 'get')
    _api += _getSearchFromObject(_params)


  // Fetch API
  // docs: http://github.github.io/fetch/
  // use polyfill: whatwg-fetch and es6-promise
  fetch(_api, _options)
    .then(checkStatus)      // handle 4xx or 5xx
    .then(parseJSON)
    .then((data) => {
      _onSuccess(data);
    })
    //fetch promise won't be rejected in case of HTTP 4xx or 5xx server responses.
    //but network error or another reason why the HTTP request couldn't be fulfilled
    //
    //In our case, we manually throw a err when HTTP 4xx or 5xx
    .catch((err) => {
      console.log(err);
      // if 401 Unauthorized, goto login.
      if(err.status == 401){
        location.hash = "login";
        alert("登录过期，请重新登录！")
        return;
      }
      // parse raw response to JSON.
      err.response.json()
        .then((data) => {
          // alert error messages
          console.log(data);
          if(data.message) alert(data.message)
        })
    })
    .then(()=>{
      LOADING.dismiss();
    })
}

// Upload Image
function _upload(_api, _formdata, _onSuccess, _onError){
  LOADING.show();
  // Manual XHR & FormData
  let oReq = new XMLHttpRequest();
  oReq.open("POST", _api);
  oReq.setRequestHeader("X-Access-Token",UserModel.fetchToken())
  oReq.onload = (e) => {
    LOADING.dismiss();
    let ret = JSON.parse(oReq.responseText)
    if (oReq.status == 200) {
      _onSuccess(ret);
    } else {
      let err = ret;
      console.log(err);
      if(err.message) alert(err.message)
      //_onError(err);
    }
  };
  oReq.upload.onprogress = updateProgress;
  oReq.send(_formdata);
}

// Upload Image
function _upload_qiniu(_api, _formdata, _onSuccess, _onError){
  PROGRESS.show(1);
  // Manual XHR & FormData
  let oReq = new XMLHttpRequest();
  oReq.open("POST", _api);
  // TODO：需要增加一次登录验证！（不能保证 GET 后会不会有 TOKEN 过期情况）
  //oReq.setRequestHeader("X-Access-Token",'b24244038556055acc930b28.57246253')
  oReq.onload = (e) => {
    let ret = JSON.parse(oReq.responseText)
    PROGRESS.dismiss();
    if (oReq.status == 200) {
      _onSuccess(ret);

    } else {
      let err = ret;
      console.log(err);
      if(err.message) alert(err.message)
      //_onError(err);
    }
  };
  oReq.upload.onprogress = updateProgress;
  oReq.send(_formdata);
}

function updateProgress(evt) {
  console.log('updateProgress');
  if (evt.lengthComputable) {
      let percentComplete = evt.loaded / evt.total;
      let percent = (percentComplete * 100).toFixed(2)
      PROGRESS.show(percent);
      console.log(percent + "%");
  } else {
      // Unable to compute progress information since the total size is unknown
      console.log('unable to complete');
  }
}

/* --------------- DataCenter Singleton ---------------- */

// 新鲜事
let FeedsModel = {
  // 获取 Feeds 流
  get:  (_success, _error) => {
    _request('get',  `${API}feeds/`, null, _success, _error)
  },
  // 推送节点
  postNode: (_params, _success, _error) => {
    _request('post',  `${API}feeds/`, _params, _success, _error )
  },
  // 推送视频
  postVideo: (_params, _success, _error) => {
    _request('post',  `${API}feeds/`, _params, _success, _error )
  }
}

// 节点列表
let NodesModel = {
  // 获取节点列表
  get:  (_params, _success, _error) => {
    _request('get',  `${API}nodes/`, _params, _success, _error)
  },
  // 新建节点
  post: (_params, _success, _error) => {
    _request('post', `${API}nodes/`, _params, _success, _error)
  }
}

// 单个节点
let NodeModel = {
  // 获取单个节点
  get:  (_id, _success, _error) => {
    _request('get',  `${API}nodes/${_id}`, null, _success, _error)
  },
  // 删除节点
  delete: (_id, _success, _error) => {
    _request('delete',  `${API}nodes/${_id}`, null, _success, _error)
  },
  // 更新单个节点
  post: (_id, _params, _success, _error) => {
    _request('post', `${API}nodes/${_id}`, _params, _success, _error)
  },
  // 更新视频
  postVideo: (_id, _params, _success, _error) => {
    _request('post', `${API}nodes/${_id}/videos`, _params, _success, _error)
  },
  // DELETE /nodes/:node_id/videos/:video_id
  deleteVideo: (_node_id, _video_id, _success, _error) => {
    _request('delete',  `${API}nodes/${_node_id}/videos/${_video_id}`, null, _success, _error)
  },
  // 更新图片
  postImg: (_id, _file, _success, _error) => {
    _upload(`${API}nodes/${_id}/image`, _file, _success, _error)
  }
}

// 视频列表
let VideosModel = {
  // 获取节点列表
  get:  (_params, _success, _error) => {
    _request('get',  `${API}videos/`, _params, _success, _error)
  },
  // 新建节点
  post: (_params, _success, _error) => {
    _request('post', `${API}videos/`, _params, _success, _error)
  }
}

// 单个视频
let VideoModel = {
  // 获取视频
  get:  (_id, _success, _error) => {
    _request('get',  `${API}videos/${_id}`, null, _success, _error)
  },
  // 删除视频
  delete: (_id, _success, _error) => {
    _request('delete',  `${API}videos/${_id}`, null, _success, _error)
  },
  // 更新视频
  post: (_id, _params, _success, _error) => {
    _request('post', `${API}videos/${_id}`, _params, _success, _error)
  },
  // 更新图片
  postImg: (_id, _file, _success, _error) => {
    _upload(`${API}videos/${_id}/image`, _file, _success, _error)
  }
}

// 媒体
let MediaModel = {
  // 请求 token
  newMediaToken: (_success, _error) => {
    _request('post', `${API}media/`, null, _success, _error)
  },
  // 根据 media_token 拿 uptoken
  getUpTokenByMediaToken: (_token, _success, _error) => {
    _request('post', `${API}media/${_token}`, {}, _success, _error)
  },
  // 上传到七牛
  uploadToQiniu: (_formdata, _success, _error) => {
    _upload_qiniu('http://upload.qiniu.com', _formdata, _success, _error)
  }
}

// 用户
let UserModel = {
  // 登陆
  // account: wsadmin
  // password: 66668888
  login: (_params, _success, _error) => {
    console.log(_params);
    _request('post', `${API}login/`, _params, _success, _error)
  },
  // 注册、创建
  signUp:  (_params, _success, _error) => {
    console.log(_params);
    _request('post', `${API}users/`, _params, _success, _error)
  },
  //store token
  storeToken: (token) => {
    localStorage.setItem(STORAGE_KEY, token);
  },
  //fetch token
  fetchToken: () => {
    return (localStorage.getItem(STORAGE_KEY) || '');
  },
  // get current user
  getMe:  (_success, _error) => {
    _request('get',  `${API}/users/me`, null, _success, _error)
  },
}
// /* ---------------------- TEST ------------------------- */


//DataCenter.BOModel.getData(BOTEST);
//DataCenter.SCModel.getData(SCTEST);
// DataCenter.MDBOModel.getData(MDBOTEST, function(res){
//     console.log(res);
// });
//DataCenter.MDSCModel.getData(MDSCTEST);

//NodesModel.post({},()=>{},()=>{})


module.exports = {
  FeedsModel,
  NodesModel,
  NodeModel,
  VideosModel,
  VideoModel,
  MediaModel,
  UserModel
};
