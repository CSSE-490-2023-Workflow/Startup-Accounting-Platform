import { Button, FileInput, Modal, NativeSelect, Text} from "@mantine/core";
import { each } from "jquery";
import { useEffect, useState, useRef} from "react";
import { data_types } from "../../engine/datatype_def";

function CsvImportModal(props: any) {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  // true: parse by row; false: parse by column
  const editCB = props.editCB
  const type = props.inputType
  const parseBy = useRef<String>('row')
  const parsing = useRef<boolean>(false)
  const parseMethods = ['row', 'column']
  const badRowIdx = useRef<number>(-1)
  const badColIdx = useRef<number>(-1)
  const [errorState, setErrorState]  = useState<number>(-1)

  const errorDict = new Map()
  errorDict.set(1, "Not a number.")
  errorDict.set(2, "No data detected.")
  errorDict.set(3, "Expecting two rows for x values and y values. Found one.")
  errorDict.set(4, "Missing y value.")
  errorDict.set(5, "Missing y value.")
  const [inputIdxMap, inputEditCB] = [
    props.inputIdxMap,
    props.inputEditCB
  ]

  console.log(props)


  function parse() {
    badRowIdx.current = -1;
    badColIdx.current = -1;
    setErrorState(-1);
    (csvFile as File).text().then(res => {

      const rows = res.split('\n')
      const rows_delim = rows.map(row => row.split(','))
      const vals = []
      console.log(rows)
      if (rows.length == 0 || rows[0].length == 0) {
        setErrorState(2)
        parsing.current = false
        return
      }
      if (type == data_types.dt_series) {
        //only use the first row
        for (let i = 0; i < rows_delim[0].length; i++) {
          const tmp = Number(rows_delim[0][i])
          if (isNaN(tmp)) {
            setErrorState(1)
            badRowIdx.current = 1
            badColIdx.current = i + 1
            parsing.current = false
            return 
          } else {
            vals.push(tmp)
          }
        }
        editCB(vals)
        parsing.current = false;
      } else if (type == data_types.dt_double_series) {
        if (parseBy.current == 'row') {
          for (let i = 0; i < rows_delim[0].length; i++) {
            const tmp = Number(rows_delim[0][i])
            if (isNaN(tmp)) {
              setErrorState(1)
              badRowIdx.current = 1
              badColIdx.current = i + 1
              parsing.current = false
              return 
            } else {
              vals.push([tmp])
            } 
          }
          // has only one row
          if (rows.length == 1 || rows[1].length == 0) {
            setErrorState(3)
            parsing.current = false
            return 
          }
          if (rows_delim[1].length < rows_delim[0].length) {
            setErrorState(4)
            badColIdx.current = rows_delim[1].length + 1
            parsing.current = false
            return 
          }

          for (let i = 0; i < rows_delim[0].length; i++) {
            let tmp = undefined
            tmp = Number(rows_delim[1][i])
            if (isNaN(tmp)) {
              setErrorState(1)
              badRowIdx.current = 2
              badColIdx.current = i + 1
              parsing.current = false
              return 
            } else {
              vals[i].push(tmp)
            } 
          }
        } else if (parseBy.current = 'column') {
          for (let i = 0; i < rows.length; i++) {
            let tmp_x = undefined
            let tmp_y = undefined
            if (rows_delim[i].length < 2) {
              setErrorState(5)
              badRowIdx.current = i + 1
              parsing.current = false
              return
            }

            //read x
            tmp_x = Number(rows_delim[i][0])
            if (isNaN(tmp_x)) {
              setErrorState(1)
              badRowIdx.current = i + 1
              badColIdx.current = 1
              parsing.current = false
              return 
            } 

            // read y
            tmp_y = Number(rows_delim[i][1])
            if (isNaN(tmp_y)) {
              setErrorState(1)
              badRowIdx.current = i + 1
              badColIdx.current = 2
              parsing.current = false
              return 
            }

            vals.push([tmp_x, tmp_y])
          }
        }
        editCB(vals)
        parsing.current = false;
      }
      
    })
    
  }

  let errorMsg = ""
  if (errorDict.has(errorState)) {
    errorMsg = errorDict.get(errorState)
  } else if (errorState != -1) {
    errorMsg = "Unknown error."
  } 

  let errorLocation = ""
  if (badRowIdx.current != -1) {
    errorLocation += `row ${badRowIdx.current}  `
  } 
  if (badColIdx.current != -1) {
    errorLocation += `column ${badColIdx.current}`
  }
  if (errorLocation != "") {
    errorLocation += ": "
  }

  let instructions = []
  if (type == data_types.dt_series) {
    instructions.push("Values should be separated by ,")
  } else if (type == data_types.dt_double_series) {
    instructions.push("Values should be separated by ,")
  }

  const instDisplay = instructions.map((inst: any) => {
    return <Text style={{
      'marginBottom': "10px"
    }} size="sm">{inst}</Text>
  })

  let title = ""
  if (type == data_types.dt_series) {
    title = "Import a series from a csv file"
  } else if (type == data_types.dt_double_series) {
    title = "Import a double series from a csv file"
  }

  return (
    <Modal opened={props.isCsvImportModalOpen} onClose={() => {setCsvFile(null); props.closeCsvImportModal()}} title={title}>
      {instDisplay}
      <FileInput clearable={true} 
        accept=".csv" 
        label="Read inputs from a csv file" 
        placeholder=".csv" 
        onChange={setCsvFile}
      />
      <NativeSelect 
        label="X-axis direction"
        onChange={(e) => {
          parseBy.current = e.currentTarget.value
        }}
        data={parseMethods}
        disabled={type != data_types.dt_double_series}
      />
      {parsing.current ? <div>Parsing...</div> : <></>}
      <Text style={{
        'color': "red"
      }}>{errorLocation + errorMsg}</Text>
      <Button variant='default' style={{margin: '10px 0px'}} onClick=
      {() => {
        parsing.current = true
        parse()
      }}>Parse</Button>
    </Modal>
  )
}

export default CsvImportModal