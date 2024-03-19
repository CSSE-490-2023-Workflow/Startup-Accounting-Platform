import { Button, FileInput, Modal, NativeSelect } from "@mantine/core";
import { each } from "jquery";
import { useEffect, useState, useRef} from "react";

function CsvImportModal(props: any) {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  // true: parse by row; false: parse by column
  const editCB = props.editCB
  const parseBy = useRef<String>('row')
  const parsing = useRef<boolean>(false)
  const parseMethods = ['row', 'column']
  const [errorState, setErrorState]  = useState<number>(-1)

  const [inputIdxMap, inputEditCB] = [
    props.inputIdxMap,
    props.inputEditCB
  ]

  useEffect(() => {
    
  }, [csvFile]) 

  async function parse() {
    
    (csvFile as File).text().then(res => {
      
      const rows = res.split('\n')
      const rows_delim = rows.map(row => row.split(','))
      const vals = []
      //only use the first row
      for (let i = 0; i < rows_delim[0].length; i++) {
        const tmp = Number(rows_delim[0][i])
        if (isNaN(tmp)) {
          setErrorState(1)
          break
        } else {
          vals.push(tmp)
        }
      }
      editCB(vals)
    })
    
  }

  return (
    <Modal opened={props.isCsvImportModalOpen} onClose={() => {setCsvFile(null); props.closeCsvImportModal()}} title="Import from csv">
          
      <FileInput clearable={true} 
        accept=".csv" 
        label="Read inputs from a csv file" 
        placeholder=".csv" 
        onChange={setCsvFile}
      />
      <NativeSelect 
        label="Parse by"
        onChange={(e) => {
          parseBy.current = e.currentTarget.value
        }}
        data={parseMethods}
      />
      <Button variant='default' style={{margin: '10px 0px'}} onClick=
      {() => {
        parsing.current = true
        parse().then(() => {
          parsing.current = false
        })
      }}>Parse</Button>
    </Modal>
  )
}

export default CsvImportModal