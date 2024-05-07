import { func_interpreter_new } from '../engine/engine'
import * as add from './json/hello world (20).json'
import * as sub from './json/hello world (21).json'
import * as mul from './json/hello world (22).json'
import * as div from './json/hello world (23).json'
import * as intst from './json/Interest.json'
import * as addSub from './json/hello world (25).json'
import * as subMul from './json/hello world (26).json'
import * as subMulDivTwoOut from './json/SubMulDivTwoOutput.json'
import * as seriesAdd from './json/hello world (3).json'
import * as seriesSub from './json/SerSub.json'
import * as seriesMul from './json/SerMul.json'
import * as seriesDiv from './json/SerDiv.json'
import * as seriesAddSubMulDiv from './json/SerAddSubMulDiv.json'
import * as intstNumberOut from './json/TestInterestNumberOutput.json'
import * as doubleSeriesAdd from './json/DSerAdd.json'
import * as doubleSeriesMerge from './json/DSerMerge.json'
import * as doubleSeriesMerge3In from './json/DSerMerge3Input.json'
import * as sumY from './json/sumy.json'
import * as callsSumY from './json/CallsSumY.json'
import { assert } from 'console'
import { resolve4 } from 'dns'

/**
 * JSON representations are generated using function builder
 */

function testAdd() { 
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 100
    const p2 =  Math.random() * 100
    const params = new Map()
    params.set(1, {
      name : "param1",
      value : p1
    })
    params.set(2, {
      name : "param2",
      value : p2
    })
    //quick and dirty way
    const res = func_interpreter_new(JSON.stringify(add), params, new Set(), new Map())
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 + p2, 'testAdd failed')
    run += 1
  }
}

function testSub() { 
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 100
    const p2 =  Math.random() * 100
    const params = new Map()
    params.set(1, {
      name : "param1",
      value : p1
    })
    params.set(2, {
      name : "param2",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(sub), params, new Set(), new Map())
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 - p2, 'testSub failed')
    run += 1
  }
}


function testMul() { 
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 100
    const p2 =  Math.random() * 100
    const params = new Map()
    params.set(1, {
      name : "param1",
      value : p1
    })
    params.set(2, {
      name : "param2",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(mul), params, new Set(), new Map())
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 * p2, 'testMul failed')
    run += 1
  }
}


function testDiv() { 
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 100
    const p2 =  Math.random() * 100
    const params = new Map()
    params.set(1, {
      name : "param1",
      value : p1
    })
    params.set(2, {
      name : "param2",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(div), params, new Set(), new Map())
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 / p2, 'testDiv failed')
    run += 1
  }
}

/**
 * Test interest rate calculation
 */
function testIntst() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 10
    const p2 =  Math.round(Math.random() * 10) + 1
    const p3 = Math.random()
    const params = new Map()
    params.set(1, {
      name : "initial",
      value : p1
    })
    params.set(2, {
      name : "len",
      value : p2
    })
    params.set(3, {
      name : "rate",
      value : p3
    })
    const res = func_interpreter_new(JSON.stringify(intst), params, new Set(), new Map())
    const arr = res.get(1).value
    //console.log(res.get(1).value, p1 + p2)
    //assert(res.get(1).value == p1 / p2)
    for (let i = 0; i < p2; i++) {
      if (i == 0) {
        assert (p1 == arr[i][1], 'testInterest failed')
      } else {
        //console.log(arr[1][1], (1 + p3), arr[i - 1])
        assert (arr[i][1] == (1 + p3) * arr[i - 1][1], 'testInterest failed')
      }
    }
    run += 1
  }
}

function testAddSub() { 
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 100
    const p2 =  Math.random() * 100
    const p3 =  Math.random() * 100
    const params = new Map()
    params.set(1, {
      name : "param1",
      value : p1
    })
    params.set(2, {
      name : "param2",
      value : p2
    })
    params.set(3, {
      name : "param3",
      value : p3
    })
    const res = func_interpreter_new(JSON.stringify(addSub), params, new Set(), new Map())
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 + p2 - p3, 'testAddSub failed')
    run += 1
  }
}

function testSubMul() { 
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 100
    const p2 =  Math.random() * 100
    const p3 =  Math.random() * 100
    const params = new Map()
    params.set(1, {
      name : "param1",
      value : p1
    })
    params.set(2, {
      name : "param2",
      value : p2
    })
    params.set(3, {
      name : "param3",
      value : p3
    })
    const res = func_interpreter_new(JSON.stringify(subMul), params, new Set(), new Map())
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == (p1 - p2) * p3, 'testSubMul failed')
    run += 1
  }
}

// /**
//  * This test case contains nested custom function
//  */
// function testSubMulDiv() { 
//   const runs = 10
//   let run = 0
//   while (run < runs) {
//     const p1 =  Math.random() * 100
//     const p2 =  Math.random() * 100
//     const p3 =  Math.random() * 100
//     const p4 =  Math.random() * 100
//     const params = new Map()
//     params.set(1, {
//       name : "param1",
//       value : p1
//     })
//     params.set(2, {
//       name : "param2",
//       value : p2
//     })
//     params.set(3, {
//       name : "param3",
//       value : p3
//     })
//     params.set(4, {
//       name : "param4",
//       value : p4
//     })
//     const res = func_interpreter_new(JSON.stringify(subMulDiv), params)
//     //console.log(res.get(1).value, p1 + p2)
//     assert(res.get(1).value == (p1 - p2) * p3 / p4)
//     run += 1
//   }
// }

function testSubMulDivTwoOutputs() { 
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 100
    const p2 =  Math.random() * 100
    const p3 =  Math.random() * 100
    const p4 =  Math.random() * 100
    const params = new Map()
    params.set(1, {
      name : "param1",
      value : p1
    })
    params.set(2, {
      name : "param2",
      value : p2
    })
    params.set(3, {
      name : "param3",
      value : p3
    })
    params.set(4, {
      name : "param4",
      value : p4
    })
    const res = func_interpreter_new(JSON.stringify(subMulDivTwoOut), params, new Set(), new Map())
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == (p1 - p2) * p3, 'testSubMulDivTwoOutputs failed')
    assert(res.get(2).value == (p1 - p2) * p3 / p4, 'testSubMulDivTwoOutputs failed')
    run += 1
  }
}

function testSeriesAdd() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 = []
    const p2 = []
    const params = new Map()
    for (let i = 0; i < 10; i++) {
      p1.push(Math.random() * 100)
      p2.push(Math.random() * 100)
    }
    params.set(1, {
      name : "new input",
      value : p1
    })
    params.set(2, {
      name : "new input",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(seriesAdd), params, new Set(), new Map())
    for (let i = 0; i < 10; i++) {
      assert(res.get(1).value[i] == p1[i] + p2[i], 'testSeriesAdd failed')
    }
    run += 1
  }
}

function testSeriesSub() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 = []
    const p2 = []
    const params = new Map()
    for (let i = 0; i < 10; i++) {
      p1.push(Math.random() * 100)
      p2.push(Math.random() * 100)
    }
    params.set(1, {
      name : "new input",
      value : p1
    })
    params.set(2, {
      name : "new input",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(seriesSub), params, new Set(), new Map())
    for (let i = 0; i < 10; i++) {
      assert(res.get(1).value[i] == p1[i] - p2[i], 'testSeriesSub failed')
    }
    run += 1
  }
}

function testSeriesMul() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 = []
    const p2 = []
    const params = new Map()
    for (let i = 0; i < 10; i++) {
      p1.push(Math.random() * 100)
      p2.push(Math.random() * 100)
    }
    params.set(1, {
      name : "new input",
      value : p1
    })
    params.set(2, {
      name : "new input",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(seriesMul), params, new Set(), new Map())
    for (let i = 0; i < 10; i++) {
      assert(res.get(1).value[i] == p1[i] * p2[i], 'testSeriesMul failed')
    }
    run += 1
  }
}

function testSeriesDiv() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 = []
    const p2 = []
    const params = new Map()
    for (let i = 0; i < 10; i++) {
      p1.push(Math.random() * 100)
      p2.push(Math.random() * 100)
    }
    params.set(1, {
      name : "new input",
      value : p1
    })
    params.set(2, {
      name : "new input",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(seriesDiv), params, new Set(), new Map())
    for (let i = 0; i < 10; i++) {
      assert(res.get(1).value[i] == p1[i] / p2[i], 'testSeriesDiv failed')
    }
    run += 1
  }
}

function testSeriesAddSubMulDiv() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 = []
    const p2 = []
    const params = new Map()
    for (let i = 0; i < 10; i++) {
      p1.push(Math.random() * 100)
      p2.push(Math.random() * 100)
    }
    params.set(1, {
      name : "new input",
      value : p1
    })
    params.set(2, {
      name : "new input",
      value : p2
    })
    const res = func_interpreter_new(JSON.stringify(seriesAddSubMulDiv), params, new Set(), new Map())
    for (let i = 0; i < 10; i++) {
      assert(res.get(1).value[i] == (p1[i] + p2[i] - p2[i]) * p2[i] / p2[i] , 'testSeriesAddSubMulDiv failed')
    }
    run += 1
  }
}

function testIntstNumberOut() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  Math.random() * 50
    const p2 =  Math.random() * 3.1415926
    const p3 = Math.floor(Math.random() * 10 + 1)
    const params = new Map()
    params.set(1, {
      name : "initial",
      value : p1
    })
    params.set(2, {
      name : "rate",
      value : p2
    })
    params.set(3, {
      name : "no. periods",
      value : p3
    })
    let res = func_interpreter_new(JSON.stringify(intstNumberOut), params, new Set(), new Map())
    res = res.get(1).value
    //console.log(res.get(1).value, p1 + p2)
    //assert(res.get(1).value == p1 / p2)
    let finalDeposit = p1
    for (let i = 0; i < p3; i++) {
      finalDeposit *= (1 + p2)
    }
    assert(res == finalDeposit, 'testIntstNumberOut failed')
    run += 1
  }
}

function testDSerAdd() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  [[0, Math.random() * 30], [1, Math.random() * 50], [2, Math.random() * 66]]
    const p2 =  [[0, Math.random() * 30], [1, Math.random() * 50], [2, Math.random() * 66]]
    const p1_copy = JSON.parse(JSON.stringify(p1))
    const p2_copy = JSON.parse(JSON.stringify(p2))
    //console.log(p1, p2)
    const params = new Map()
    params.set(1, {
      name : "d ser 1",
      value : p1
    })
    params.set(2, {
      name : "d ser 2",
      value : p2
    })
    
    let res = func_interpreter_new(JSON.stringify(doubleSeriesAdd), params, new Set(), new Map())
    res = res.get(1).value
    //console.log(res.get(1).value, p1 + p2)
    //assert(res.get(1).value == p1 / p2)


    const exp = [[0, 0], [1, 1], [2, 2]]
    for (let i = 0; i < p1.length; i++) {
      exp[i][1] = p1[i][1] + p2[i][1]
    }
    
    
    assert(JSON.stringify(res) == JSON.stringify(exp), 'testDoubleSeriesAdd failed')
    
    /* param object integrity */
    assert(JSON.stringify(p1) == JSON.stringify(p1_copy), 'testDoubleSeriesAdd failed. Param(s) changed.')
    assert(JSON.stringify(p2) == JSON.stringify(p2_copy), 'testDoubleSeriesAdd failed. Param(s) changed.')
    run += 1
  }
}

function testDSerMerge() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  [[0, Math.random() * 30], [1, Math.random() * 50], [2, Math.random() * 66]]
    const p2 =  [[0, Math.random() * 30], [1, Math.random() * 50], [2, Math.random() * 66]]
    const p1_copy = JSON.parse(JSON.stringify(p1))
    const p2_copy = JSON.parse(JSON.stringify(p2))
    //console.log(p1, p2)
    const params = new Map()
    params.set(1, {
      name : "d ser 1",
      value : p1
    })
    params.set(2, {
      name : "d ser 2",
      value : p2
    })
    
    let res = func_interpreter_new(JSON.stringify(doubleSeriesMerge), params, new Set(), new Map())
    res = res.get(1).value
    //console.log(res.get(1).value, p1 + p2)
    //assert(res.get(1).value == p1 / p2)
    /* param object integrity */
    assert(JSON.stringify(p1) == JSON.stringify(p1_copy), 'testDSerMerge failed. Param(s) changed.')
    assert(JSON.stringify(p2) == JSON.stringify(p2_copy), 'testDSerMerge failed. Param(s) changed.')

    const exp = [[0, p1[0][1], p2[0][1]], [1, p1[1][1], p2[1][1]], [2, p1[2][1], p2[2][1]]]
    
    assert(JSON.stringify(res) == JSON.stringify(exp), 'testDSerMerge failed')
    run += 1
  }
}

function testDSerMerge2() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  [[0, Math.random() * 30], [3, Math.random() * 50], [5, Math.random() * 66]]
    const p2 =  [[0, Math.random() * 30], [1, Math.random() * 50], [6, Math.random() * 66]]
    const p1_copy = JSON.parse(JSON.stringify(p1))
    const p2_copy = JSON.parse(JSON.stringify(p2))
    //console.log(p1, p2)
    const params = new Map()
    params.set(1, {
      name : "d ser 1",
      value : p1
    })
    params.set(2, {
      name : "d ser 2",
      value : p2
    })
    
    let res = func_interpreter_new(JSON.stringify(doubleSeriesMerge), params, new Set(), new Map())
    res = res.get(1).value
    //console.log(res.get(1).value, p1 + p2)
    //assert(res.get(1).value == p1 / p2)
    /* param object integrity */
    assert(JSON.stringify(p1) == JSON.stringify(p1_copy), 'testDSerMerge2 failed. Param(s) changed.')
    assert(JSON.stringify(p2) == JSON.stringify(p2_copy), 'testDSerMerge2 failed. Param(s) changed.')

    const exp = [[0, p1[0][1], p2[0][1]], [1, 0, p2[1][1]], [3, p1[1][1], 0], [5, p1[2][1], 0], [6, 0, p2[2][1]]]
    
    assert(JSON.stringify(res) == JSON.stringify(exp), 'testDSerMerge2 failed')
    run += 1
  }
}

function testDSerMerge3() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  [[0, Math.random() * 30], [1, Math.random() * 50], [6, Math.random() * 66]]
    const p2 =  [[0, Math.random() * 30], [1, Math.random() * 50], [6, Math.random() * 66]]
    const p3 =  [[0, Math.random() * 30], [1, Math.random() * 50], [6, Math.random() * 66]]
    const p1_copy = JSON.parse(JSON.stringify(p1))
    const p2_copy = JSON.parse(JSON.stringify(p2))
    const p3_copy = JSON.parse(JSON.stringify(p3))
    //console.log(p1, p2)
    const params = new Map()
    params.set(1, {
      name : "d ser 1",
      value : p1
    })
    params.set(2, {
      name : "d ser 2",
      value : p2
    })
    params.set(3, {
      name : "d ser 3",
      value : p3
    })
    
    let res = func_interpreter_new(JSON.stringify(doubleSeriesMerge3In), params, new Set(), new Map())
    res = res.get(1).value
    //console.log(res.get(1).value, p1 + p2)
    //assert(res.get(1).value == p1 / p2)
    /* param object integrity */
    assert(JSON.stringify(p1) == JSON.stringify(p1_copy), 'testDSerMerge3 failed. Param(s) changed.')
    assert(JSON.stringify(p2) == JSON.stringify(p2_copy), 'testDSerMerge3 failed. Param(s) changed.')
    assert(JSON.stringify(p3) == JSON.stringify(p3_copy), 'testDSerMerge3 failed. Param(s) changed.')

    const exp = [[0, p1[0][1], p2[0][1], p3[0][1]], [1, p1[1][1], p2[1][1], p3[1][1]], [6, p1[2][1], p2[2][1], p3[2][1]]]
  
    
    assert(JSON.stringify(res) == JSON.stringify(exp), 'testDSerMerge3 failed')
    run += 1
  }
}

function testDSerMerge4() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 =  [[0, Math.random() * 30], [1, Math.random() * 50], [6, Math.random() * 66]]
    const p2 =  [[0, Math.random() * 30], [2, Math.random() * 50], [3, Math.random() * 66]]
    const p3 =  [[0, Math.random() * 30], [1, Math.random() * 50], [4, Math.random() * 66]]
    const p1_copy = JSON.parse(JSON.stringify(p1))
    const p2_copy = JSON.parse(JSON.stringify(p2))
    const p3_copy = JSON.parse(JSON.stringify(p3))
    //console.log(p1, p2)
    const params = new Map()
    params.set(1, {
      name : "d ser 1",
      value : p1
    })
    params.set(2, {
      name : "d ser 2",
      value : p2
    })
    params.set(3, {
      name : "d ser 3",
      value : p3
    })
    
    let res = func_interpreter_new(JSON.stringify(doubleSeriesMerge3In), params, new Set(), new Map())
    res = res.get(1).value
    /* param object integrity */
    assert(JSON.stringify(p1) == JSON.stringify(p1_copy), 'testDSerMerge4 failed. Param(s) changed.')
    assert(JSON.stringify(p2) == JSON.stringify(p2_copy), 'testDSerMerge4 failed. Param(s) changed.')
    assert(JSON.stringify(p3) == JSON.stringify(p3_copy), 'testDSerMerge4 failed. Param(s) changed.')

    const exp = [
      [0, p1[0][1], p2[0][1], p3[0][1]], 
      [1, p1[1][1], 0, p3[1][1]], 
      [2, 0, p2[1][1], 0],
      [3, 0, p2[2][1], 0], 
      [4, 0, 0, p3[2][1]],
      [6, p1[2][1], 0, 0]
    ]
    
    assert(JSON.stringify(res) == JSON.stringify(exp), 'testDSerMerge4 failed')
    run += 1
  }
}

function testSumY() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 : any = []
    for (let i = 0; i < Math.random() * 55 + 10; i++) {
      p1.push([Math.random() * 50, Math.random() * 66])
    }
    const p1_copy = JSON.parse(JSON.stringify(p1))
    //console.log(p1, p2)
    const params = new Map()
    params.set(1, {
      name : "d ser 1",
      value : p1
    })
    
    let res = func_interpreter_new(JSON.stringify(sumY), params, new Set(), new Map())
    res = res.get(1).value
    /* param object integrity */
    assert(JSON.stringify(p1) == JSON.stringify(p1_copy), 'testSumY failed. Param(s) changed.')
    
    const val = 0
    const sum = p1.reduce(
      (acc: any, [x, y]: any) => acc += y,
      val
    )
    assert(res == sum, 'testSumY failed')
    run += 1
  }
}

function testCallsSumY() {
  const runs = 10
  let run = 0
  while (run < runs) {
    const p1 : any = []
    for (let i = 0; i < Math.random() * 55 + 10; i++) {
      p1.push([Math.random() * 50, Math.random() * 66])
    }
    const p2 =  Math.random() * 50
    
    const p1_copy = JSON.parse(JSON.stringify(p1))
    //console.log(p1, p2)
    const params = new Map()
    params.set(1, {
      name : "d ser 1",
      value : p1
    })
    params.set(2, {
      name : "number",
      value : p2
    })

    const customFuncMap = new Map()
    customFuncMap.set("iqyFnYQBWV9mhgOwJUfA", {"fromFunction":"","type":"Custom Function","fromTemplate":"","id":"iqyFnYQBWV9mhgOwJUfA","ownerUid":"GilPehzWH2WxMoMGXds6yhfnHYk2","allowAccess":"","rawJson":"{\"type\":\"custom_function\",\"useOutput\":\"all\",\"paramNames\":[\"new input\"],\"paramTypes\":[1],\"outputNames\":[\"new output\"],\"outputTypes\":[0],\"outputs\":[{\"type\":\"output\",\"outputName\":\"new output\",\"outputType\":0,\"outputIdx\":1,\"outputBlkLoc\":[1120.000015258789,378.00001525878906],\"blockId\":2002,\"params\":[{\"type\":\"builtin_function\",\"useOutput\":1,\"functionName\":\"Sum y-values\",\"functionId\":\"110\",\"paramNames\":[\"double series\"],\"paramTypes\":[[1]],\"outputNames\":[\"y sum\"],\"outputTypes\":[[0]],\"funcBlkLoc\":[730.9861450195312,290.9930725097656],\"blockId\":3002,\"varLenParam\":0,\"params\":[{\"type\":\"input\",\"inputName\":\"new input\",\"inputType\":1,\"inputIdx\":1,\"inputVal\":[[0,2],[1,4],[5,0],[6,0],[7,0]],\"inputBlkLoc\":[200,200],\"blockId\":1001}]}]}],\"arrows\":\"[{\\\"start\\\":\\\"3002o1\\\",\\\"end\\\":\\\"2002i1\\\"},{\\\"start\\\":\\\"1001o1\\\",\\\"end\\\":\\\"3002i1\\\"}]\"}","name":"TestSumY"})

    
    let res = func_interpreter_new(JSON.stringify(callsSumY), params, new Set(), customFuncMap)
    res = res.get(1).value
    /* param object integrity */
    assert(JSON.stringify(p1) == JSON.stringify(p1_copy), 'testCallsSumY failed. Param(s) changed.')

    const val = 0
    let sum = p1.reduce(
      (acc: any, [x, y]: any) => acc += y,
      val
    )
    sum += p2
    
    assert(res == sum, 'testCallsSumY failed')
    run += 1
  }
}





function runAll() {
  const testCases = [
    testAdd, 
    testSub, 
    testMul, 
    testDiv, 
    testIntst, 
    testAddSub, 
    testSubMul, 
    testSubMulDivTwoOutputs, 
    testSeriesAdd,
    testSeriesSub,
    testSeriesMul,
    testSeriesDiv,
    testSeriesAddSubMulDiv,
    testIntstNumberOut,
    testDSerAdd,
    testDSerMerge,
    testDSerMerge2,
    testDSerMerge3,
    testDSerMerge4,
    testSumY,
    testCallsSumY
  ]
  const log = console.log
  console.log = () => {}
  for (let i = 0; i < testCases.length; i++) {
    testCases[i]()

  }
  console.log = log
  console.log(`${testCases.length} test cases finished`)
}

runAll()


