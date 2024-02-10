import { func_interpreter_new } from '../engine/engine'
import * as add from './json/hello world (20).json'
import * as sub from './json/hello world (21).json'
import * as mul from './json/hello world (22).json'
import * as div from './json/hello world (23).json'
import * as intst from './json/hello world (24).json'
import * as addSub from './json/hello world (25).json'
import * as subMul from './json/hello world (26).json'
import * as subMulDiv from './json/hello world (27).json'
import * as subMulDivTwoOut from './json/hello world (28).json'
import { assert } from 'console'

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
    const res = func_interpreter_new(JSON.stringify(add), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 + p2)
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
    const res = func_interpreter_new(JSON.stringify(sub), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 - p2)
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
    const res = func_interpreter_new(JSON.stringify(mul), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 * p2)
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
    const res = func_interpreter_new(JSON.stringify(div), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 / p2)
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
    const p2 =  Math.round(Math.random() * 10)
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
    const res = func_interpreter_new(JSON.stringify(intst), params)
    const arr = res.get(1).value
    //console.log(res.get(1).value, p1 + p2)
    //assert(res.get(1).value == p1 / p2)
    for (let i = 0; i < p2; i++) {
      if (i == 0) {
        assert (p1 == arr[i][1])
      } else {
        //console.log(arr[1][1], (1 + p3), arr[i - 1])
        assert (arr[i][1] == (1 + p3) * arr[i - 1][1])
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
    const res = func_interpreter_new(JSON.stringify(addSub), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == p1 + p2 - p3)
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
    const res = func_interpreter_new(JSON.stringify(subMul), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == (p1 - p2) * p3)
    run += 1
  }
}

/**
 * This test case contains nested custom function
 */
function testSubMulDiv() { 
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
    const res = func_interpreter_new(JSON.stringify(subMulDiv), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == (p1 - p2) * p3 / p4)
    run += 1
  }
}

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
    const res = func_interpreter_new(JSON.stringify(subMulDivTwoOut), params)
    //console.log(res.get(1).value, p1 + p2)
    assert(res.get(1).value == (p1 - p2) * p3 / p4)
    assert(res.get(2).value == (p1 - p2) * p3)
    run += 1
  }
}






function runAll() {
  testAdd()
  testSub()
  testMul()
  testDiv()
  testIntst()
  testAddSub()
  testSubMul()
  testSubMulDiv()
  testSubMulDivTwoOutputs()
}

runAll()


