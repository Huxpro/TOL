
// Tower Model
let A = [
  // 测试关卡 0
  [
    ["G"],
    ["R"],
    ["B"]
  ],
  // 正式关卡 1-10
  [
    ["G", "B"],
    ["R"],
    []
  ],
  [
    ["G"],
    ["R", "B"],
    []
  ],
  [
    ["R", "G"],
    ["B"],
    []
  ],
  [
    ["B"],
    ["R", "G"],
    []
  ],
  [
    ["R", "B"],
    [],
    ["G"]
  ],
  [
    [],
    ["R", "B"],
    ["G"]
  ],
  [
    ["R", "G", "B"],
    [],
    []
  ],
  [
    ["R", "B", "G"],
    [],
    []
  ],
  [
    ["B", "G"],
    ["R"],
    []
  ],
  [
    ["B"],
    ["R"],
    ["G"]
  ],
]

// minimum numbers of each problem
let M = [
  2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5
]

// The order of post 10 problem.
let PostOrder = [
  6, 1, 7, 2, 8, 3, 9, 4, 10, 5
]

PostOrder.forEach((stage) => {
  A.push(A[stage])
  M.push(M[stage])
})

export default {
  A, M
}
